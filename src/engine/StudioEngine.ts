import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { buildSceneBVH, BVHBuildResult } from './bvh';
import { buildBuiltinProject, BuiltProject, importModelFromFile, disposeProjectMeshes, syncThreeMaterials } from './models';
import { GPUPathTracer } from './pathTracer';
import { CUSTOM_LAYER_OFFSET, PbrTextureManager, PRESET_TO_LAYER } from './textures';
import { analyzeGeometriesUV } from './uvCleanup';
import {
  BuiltinProjectId,
  CameraPreset,
  EnvironmentPreset,
  MaterialSpec,
  RayTracerSettings,
  RenderMode,
  RenderStats,
  StudioLight,
  TextureSlot,
} from '../types/studio';
import { CAMERA_PRESETS } from '../data/presets';
import { cartesianToSpherical, kelvinToRgb, sphericalToCartesian } from '../utils/color';

// Pre-allocated math helpers (zero GC inside animation loop)
const _vec3A = new THREE.Vector3();
const _vec3B = new THREE.Vector3();
const _ndc = new THREE.Vector2();

export interface StudioEngineCallbacks {
  onStats: (stats: RenderStats) => void;
  onSelectMaterial: (materialId: string, partName: string) => void;
  onSelectLight: (lightId: string) => void;
  onLightMoved: (lightId: string, azimuth: number, elevation: number, distance: number) => void;
  onContextLost: (lost: boolean) => void;
}

export class StudioEngine {
  private container: HTMLElement;
  private callbacks: StudioEngineCallbacks;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;
  private transformControls: TransformControls;
  private transformHelper: THREE.Object3D;
  private textureManager: PbrTextureManager;
  private readonly pendingTextureUploads = new Map<string, { layer: number }>();
  private importRequest?: object;
  private materialLayerMap = new Map<string, number>();
  private pathTracer: GPUPathTracer;
  private raycaster = new THREE.Raycaster();

  public readonly isSoftwareGl: boolean;

  private projectRoot = new THREE.Group();
  private currentProject: BuiltProject | null = null;
  private bvhResult: BVHBuildResult | null = null;

  // Stage & lighting rig in Three.js PBR scene
  private floorMesh: THREE.Mesh;
  private gridHelper: THREE.PolarGridHelper;
  private hemiLight: THREE.HemisphereLight;
  private threeLights = new Map<string, THREE.PointLight | THREE.DirectionalLight>();
  private lightOrbMap = new Map<string, THREE.Group>();
  private gizmosGroup = new THREE.Group();

  // State refs synced from React
  private renderMode: RenderMode = 'raytrace';
  private splitRatio = 0.5;
  private lights: StudioLight[] = [];
  private materials: MaterialSpec[] = [];
  private settings: RayTracerSettings;
  private selectedLightId: string | null = null;
  private turntable = false;

  // Camera transition targets
  private camTransitionActive = false;
  private targetCamPos = new THREE.Vector3();
  private targetLookAt = new THREE.Vector3();
  private targetFov = 38;

  // Interaction & loop state
  private isInteracting = false;
  private interactionCooldownTimer = 0;
  private frameId = 0;
  private renderBusy = false;
  private renderDirty = false;
  private lastStatsTime = 0;
  private lastFrameTime = performance.now();
  private disposed = false;
  private initialized = false;

  // Pointer tap discrimination
  private pointerDownPos = { x: 0, y: 0 };

  private envTexture: THREE.Texture | null = null;

  constructor(
    container: HTMLElement,
    initialLights: StudioLight[],
    initialSettings: RayTracerSettings,
    callbacks: StudioEngineCallbacks,
  ) {
    this.container = container;
    this.callbacks = callbacks;
    this.lights = initialLights;
    this.settings = initialSettings;

    this.isSoftwareGl = (() => {
      try {
        const probe = document.createElement('canvas').getContext('webgl2');
        if (!probe) return true;
        const ext = probe.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : probe.RENDERER;
        const gpu = String(probe.getParameter(param));
        probe.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    const width = Math.max(1, container.clientWidth);
    const height = Math.max(1, container.clientHeight);

    this.renderer = new THREE.WebGLRenderer({
      antialias: !this.isSoftwareGl,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: false,
    });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = initialSettings.exposure;
    this.renderer.setPixelRatio(this.isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setSize(width, height, false);
    this.renderer.shadowMap.enabled = !this.isSoftwareGl;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const canvas = this.renderer.domElement;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    canvas.style.touchAction = 'none';
    container.appendChild(canvas);

    canvas.addEventListener('webglcontextlost', this.handleContextLost);
    canvas.addEventListener('webglcontextrestored', this.handleContextRestored);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#0c0e12');
    this.scene.fog = new THREE.FogExp2('#0c0e12', 0.045);

    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    this.scene.environment = this.envTexture;
    pmrem.dispose();

    const hero = CAMERA_PRESETS.hero;
    this.camera = new THREE.PerspectiveCamera(hero.fov, width / height, 0.08, 60);
    this.camera.position.set(...hero.position);
    this.targetCamPos.copy(this.camera.position);
    this.targetLookAt.set(...hero.target);
    this.targetFov = hero.fov;

    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.target.set(...hero.target);
    this.controls.enableDamping = !this.isSoftwareGl;
    this.controls.dampingFactor = 0.07;
    this.controls.minDistance = 0.9;
    this.controls.maxDistance = 9.5;
    this.controls.maxPolarAngle = Math.PI * 0.492;
    this.controls.rotateSpeed = 0.85;
    this.controls.zoomSpeed = 0.9;
    this.controls.panSpeed = 0.75;
    this.controls.touches = {
      ONE: THREE.TOUCH.ROTATE,
      TWO: THREE.TOUCH.DOLLY_PAN,
    };

    this.controls.addEventListener('start', () => {
      this.camTransitionActive = false;
      this.setInteracting(true);
    });
    this.controls.addEventListener('change', () => {
      if (this.isInteracting || this.camTransitionActive) {
        this.pathTracer.resetAccumulation();
      }
      this.requestDraw();
    });
    this.controls.addEventListener('end', () => {
      this.scheduleInteractionSettle();
    });

    // Studio floor + subtle polar calibration ring
    const floorGeom = new THREE.CircleGeometry(14, 64);
    floorGeom.rotateX(-Math.PI / 2);
    const floorMat = new THREE.MeshStandardMaterial({
      color: '#17191e',
      roughness: 0.55,
      metalness: 0.08,
    });
    this.floorMesh = new THREE.Mesh(floorGeom, floorMat);
    this.floorMesh.receiveShadow = true;
    this.floorMesh.userData.excludeFromRaytracer = true;
    this.scene.add(this.floorMesh);

    this.gridHelper = new THREE.PolarGridHelper(2.2, 12, 4, 64, 0x2f3540, 0x232730);
    this.gridHelper.position.y = 0.002;
    const gridMat = this.gridHelper.material as THREE.Material;
    gridMat.transparent = true;
    gridMat.opacity = 0.4;
    this.gridHelper.userData.excludeFromRaytracer = true;
    this.scene.add(this.gridHelper);

    this.hemiLight = new THREE.HemisphereLight('#bfd4f2', '#26211c', 0.55);
    this.scene.add(this.hemiLight);

    this.scene.add(this.projectRoot);
    this.scene.add(this.gizmosGroup);

    // TransformControls for dragging studio lights directly in 3D space
    this.transformControls = new TransformControls(this.camera, canvas);
    this.transformControls.setSize(0.85);
    this.transformControls.setMode('translate');
    this.transformHelper = this.transformControls.getHelper();
    this.transformHelper.userData.excludeFromRaytracer = true;
    this.scene.add(this.transformHelper);

    this.transformControls.addEventListener('dragging-changed', (ev) => {
      const dragging = Boolean(ev.value);
      this.controls.enabled = !dragging;
      if (dragging) {
        this.setInteracting(true);
      } else {
        this.scheduleInteractionSettle();
      }
    });

    this.transformControls.addEventListener('objectChange', () => {
      if (!this.selectedLightId) return;
      const orbGroup = this.lightOrbMap.get(this.selectedLightId);
      if (!orbGroup) return;
      // Keep light above floor
      if (orbGroup.position.y < 0.25) orbGroup.position.y = 0.25;
      const { azimuth, elevation, distance } = cartesianToSpherical(
        orbGroup.position.x,
        orbGroup.position.y,
        orbGroup.position.z,
      );
      this.callbacks.onLightMoved(this.selectedLightId, azimuth, elevation, distance);
      this.pathTracer.resetAccumulation();
      this.requestDraw();
    });

    this.textureManager = new PbrTextureManager(this.renderer.capabilities.getMaxAnisotropy());
    this.pathTracer = new GPUPathTracer(this.renderer);
    this.pathTracer.setTextureArrays(this.textureManager);
    this.applyEnvironment(initialSettings.environment, initialSettings.envIntensity);
    this.setupLights(initialLights);

    canvas.addEventListener('pointerdown', this.handlePointerDown);
    canvas.addEventListener('pointerup', this.handlePointerUp);
    window.addEventListener('resize', this.handleResize);

    // Load default project
    this.loadBuiltinProject('chronograph');
    this.initialized = true;
    this.handleResize();
    this.requestDraw();
  }

  private handleContextLost = (e: Event) => {
    e.preventDefault();
    this.callbacks.onContextLost(true);
  };

  private handleContextRestored = () => {
    this.callbacks.onContextLost(false);
    this.pathTracer.resetAccumulation();
    this.requestDraw();
  };

  private setupLights(lights: StudioLight[]) {
    for (const l of this.threeLights.values()) {
      this.scene.remove(l);
    }
    this.threeLights.clear();
    this.gizmosGroup.clear();
    this.lightOrbMap.clear();

    const orbGeom = new THREE.SphereGeometry(0.11, 20, 16);
    const ringGeom = new THREE.RingGeometry(0.145, 0.175, 28);

    lights.forEach((light, index) => {
      const isKey = index === 0;
      const threeLight = isKey
        ? new THREE.DirectionalLight('#ffffff', 2.4)
        : new THREE.PointLight('#ffffff', 12, 16, 1.8);

      if (threeLight instanceof THREE.DirectionalLight) {
        threeLight.castShadow = !this.isSoftwareGl;
        threeLight.shadow.mapSize.set(1024, 1024);
        threeLight.shadow.camera.near = 0.5;
        threeLight.shadow.camera.far = 16;
        const d = 2.4;
        threeLight.shadow.camera.left = -d;
        threeLight.shadow.camera.right = d;
        threeLight.shadow.camera.top = d;
        threeLight.shadow.camera.bottom = -d;
        threeLight.shadow.bias = -0.0004;
        threeLight.shadow.normalBias = 0.02;
        this.scene.add(threeLight.target);
      }

      this.scene.add(threeLight);
      this.threeLights.set(light.id, threeLight);

      // Interactive orb handle for tap-to-select & drag
      const orbGroup = new THREE.Group();
      orbGroup.name = `light_handle_${light.id}`;
      const orbMat = new THREE.MeshBasicMaterial({ color: '#ffdf9e' });
      const orbMesh = new THREE.Mesh(orbGeom, orbMat);
      orbMesh.userData.lightId = light.id;
      orbMesh.userData.excludeFromRaytracer = true;

      const ringMat = new THREE.MeshBasicMaterial({
        color: '#f59e0b',
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.75,
      });
      const ringMesh = new THREE.Mesh(ringGeom, ringMat);
      ringMesh.userData.lightId = light.id;
      ringMesh.userData.excludeFromRaytracer = true;

      // Subtle ray line toward origin
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, -0.35, 0),
      ]);
      const lineMat = new THREE.LineBasicMaterial({
        color: '#f59e0b',
        transparent: true,
        opacity: 0.35,
      });
      const pointerLine = new THREE.Line(lineGeo, lineMat);
      pointerLine.userData.excludeFromRaytracer = true;

      orbGroup.add(orbMesh);
      orbGroup.add(ringMesh);
      orbGroup.add(pointerLine);
      orbGroup.userData.orbMat = orbMat;
      orbGroup.userData.ringMesh = ringMesh;
      orbGroup.userData.pointerLine = pointerLine;

      this.gizmosGroup.add(orbGroup);
      this.lightOrbMap.set(light.id, orbGroup);
    });

    this.syncLights(lights);
  }

  public syncLights(lights: StudioLight[]) {
    this.lights = lights;
    for (const l of lights) {
      const [x, y, z] = sphericalToCartesian(l.azimuth, l.elevation, l.distance);
      let r = 1,
        g = 1,
        b = 1;
      if (l.useKelvin) {
        [r, g, b] = kelvinToRgb(l.kelvin);
      } else {
        const c = new THREE.Color(l.color);
        r = c.r;
        g = c.g;
        b = c.b;
      }

      const tl = this.threeLights.get(l.id);
      if (tl) {
        tl.position.set(x, y, z);
        tl.color.setRGB(r, g, b);
        tl.visible = l.enabled;
        if (tl instanceof THREE.DirectionalLight) {
          tl.intensity = l.intensity * 0.13;
        } else {
          tl.intensity = l.intensity * 1.15;
        }
      }

      const orbGroup = this.lightOrbMap.get(l.id);
      if (orbGroup) {
        orbGroup.position.set(x, y, z);
        orbGroup.visible = l.enabled;
        const orbMat = orbGroup.userData.orbMat as THREE.MeshBasicMaterial;
        orbMat.color.setRGB(r, g, b);

        const ringMesh = orbGroup.userData.ringMesh as THREE.Mesh;
        ringMesh.lookAt(this.camera.position);
        const isSel = l.id === this.selectedLightId;
        ringMesh.scale.setScalar(isSel ? 1.35 : 0.9);
        (ringMesh.material as THREE.MeshBasicMaterial).opacity = isSel ? 0.95 : 0.35;

        const pointerLine = orbGroup.userData.pointerLine as THREE.Line;
        const posAttr = pointerLine.geometry.getAttribute('position') as THREE.BufferAttribute;
        _vec3A.set(-x, -y + 0.5, -z).normalize().multiplyScalar(0.55);
        posAttr.setXYZ(1, _vec3A.x, _vec3A.y, _vec3A.z);
        posAttr.needsUpdate = true;
      }
    }

    this.pathTracer.resetAccumulation();
    this.requestDraw();
  }

  public setSelectedLight(lightId: string | null) {
    this.selectedLightId = lightId;
    if (lightId && this.settings.showLightGizmos && this.renderMode !== 'raytrace') {
      const orb = this.lightOrbMap.get(lightId);
      if (orb && orb.visible) {
        this.transformControls.attach(orb);
        this.transformHelper.visible = true;
      } else {
        this.transformControls.detach();
        this.transformHelper.visible = false;
      }
    } else {
      this.transformControls.detach();
      this.transformHelper.visible = false;
    }
    this.syncLights(this.lights);
  }

  public setRenderMode(mode: RenderMode) {
    this.renderMode = mode;
    this.gizmosGroup.visible = this.settings.showLightGizmos && mode !== 'raytrace';
    this.setSelectedLight(this.selectedLightId);
    if (mode !== 'pbr') {
      this.pathTracer.resetAccumulation();
    }
    this.requestDraw();
  }

  public setSplitRatio(ratio: number) {
    this.splitRatio = Math.max(0.08, Math.min(0.92, ratio));
    this.requestDraw();
  }

  public setTurntable(enabled: boolean) {
    this.turntable = enabled;
    if (enabled) {
      this.requestDraw();
    }
  }

  public updateSettings(next: RayTracerSettings) {
    const needsReset =
      next.maxBounces !== this.settings.maxBounces ||
      next.clayMode !== this.settings.clayMode ||
      next.environment !== this.settings.environment ||
      next.envIntensity !== this.settings.envIntensity ||
      next.interactiveScale !== this.settings.interactiveScale;

    this.settings = next;
    this.renderer.toneMappingExposure = next.exposure;
    this.applyEnvironment(next.environment, next.envIntensity);

    if (this.currentProject) {
      syncThreeMaterials(
        this.currentProject.meshMap,
        this.materials,
        next.clayMode,
        this.isSoftwareGl,
        this.textureManager,
        this.materialLayerMap,
      );
    }

    this.gizmosGroup.visible = next.showLightGizmos && this.renderMode !== 'raytrace';
    this.setSelectedLight(this.selectedLightId);

    if (needsReset) {
      this.updatePathTracerResolution();
      this.pathTracer.resetAccumulation();
    }
    this.requestDraw();
  }

  private applyEnvironment(env: EnvironmentPreset, intensity: number) {
    const floorMat = this.floorMesh.material as THREE.MeshStandardMaterial;
    switch (env) {
      case 'golden':
        this.scene.background = new THREE.Color('#1c1410');
        (this.scene.fog as THREE.FogExp2).color.set('#1c1410');
        this.hemiLight.color.set('#ffd09b');
        this.hemiLight.groundColor.set('#281c16');
        floorMat.color.set('#241d18');
        break;
      case 'loft':
        this.scene.background = new THREE.Color('#181d24');
        (this.scene.fog as THREE.FogExp2).color.set('#181d24');
        this.hemiLight.color.set('#dbeafe');
        this.hemiLight.groundColor.set('#22262e');
        floorMat.color.set('#1e222a');
        break;
      case 'cornell':
        this.scene.background = new THREE.Color('#1a1816');
        (this.scene.fog as THREE.FogExp2).color.set('#1a1816');
        this.hemiLight.color.set('#f5efe6');
        this.hemiLight.groundColor.set('#382b24');
        floorMat.color.set('#4c4944');
        break;
      case 'obsidian':
        this.scene.background = new THREE.Color('#07080a');
        (this.scene.fog as THREE.FogExp2).color.set('#07080a');
        this.hemiLight.color.set('#4c5563');
        this.hemiLight.groundColor.set('#090a0d');
        floorMat.color.set('#0b0c10');
        break;
      case 'studio':
      default:
        this.scene.background = new THREE.Color('#0c0e12');
        (this.scene.fog as THREE.FogExp2).color.set('#0c0e12');
        this.hemiLight.color.set('#bfd4f2');
        this.hemiLight.groundColor.set('#1c1917');
        floorMat.color.set('#17191e');
        break;
    }
    this.hemiLight.intensity = 0.55 * intensity;
    this.scene.environmentIntensity = intensity;
  }

  public getProjectIdentity() {
    return this.currentProject;
  }

  public getMaterials(): MaterialSpec[] {
    return this.materials;
  }

  public getMaterialMapPreview(materialId: string, slot: TextureSlot): string | null {
    const material = this.materials.find((item) => item.id === materialId);
    const layer = this.materialLayerMap.get(materialId)
      ?? PRESET_TO_LAYER[material?.texturePreset ?? 'none']
      ?? 0;
    return this.textureManager.getMapPreviewDataUrl(layer, slot);
  }

  public loadBuiltinProject(id: BuiltinProjectId): MaterialSpec[] {
    this.importRequest = undefined;
    this.pendingTextureUploads.clear();
    this.textureManager.resetCustomCounter();
    this.materialLayerMap.clear();
    const built = buildBuiltinProject(id, this.isSoftwareGl);
    for (const mat of built.materials) {
      this.materialLayerMap.set(mat.id, PRESET_TO_LAYER[mat.texturePreset] ?? 0);
    }
    this.installBuiltProject(built);
    return built.materials;
  }

  public async loadCustomFile(file: File): Promise<MaterialSpec[]> {
    if (this.disposed) throw new Error('Import cancelled: studio closed.');
    const request = {};
    this.importRequest = request;
    const isCurrent = () => !this.disposed && this.importRequest === request;
    const layerMap = new Map<string, number>();
    let textureManager: PbrTextureManager | undefined;
    let built: BuiltProject;
    try {
      built = await importModelFromFile(file, this.isSoftwareGl, undefined, layerMap, {
        isCurrent,
        getTextureManager: () => textureManager = new PbrTextureManager(this.renderer.capabilities.getMaxAnisotropy()),
      });
      if (!isCurrent() || !textureManager) {
        disposeProjectMeshes(built.group);
        throw new DOMException('Import cancelled: project selection changed.', 'AbortError');
      }
    } catch (error) {
      textureManager?.dispose();
      if (!isCurrent()) throw new DOMException('Import cancelled: project selection changed.', 'AbortError');
      throw error;
    } finally {
      if (this.importRequest === request) this.importRequest = undefined;
    }
    const previousManager = this.textureManager;
    this.textureManager = textureManager;
    this.materialLayerMap = layerMap;
    this.pendingTextureUploads.clear();
    this.installBuiltProject(built);
    previousManager.dispose();
    return built.materials;
  }

  private installBuiltProject(built: BuiltProject) {
    disposeProjectMeshes(this.projectRoot);
    this.projectRoot.clear();

    this.currentProject = built;
    this.materials = built.materials;
    this.projectRoot.add(built.group);

    syncThreeMaterials(
      built.meshMap,
      this.materials,
      this.settings.clayMode,
      this.isSoftwareGl,
      this.textureManager,
      this.materialLayerMap,
    );

    if (!this.isSoftwareGl) {
      this.renderer.compile(this.scene, this.camera);
    }

    this.bvhResult = buildSceneBVH(this.projectRoot);
    this.pathTracer.setBVH(this.bvhResult);
    this.pathTracer.setTextureArrays(this.textureManager);
    this.pathTracer.syncMaterials(this.materials, this.materialLayerMap, this.textureManager);
    this.pathTracer.resetAccumulation();
    this.requestDraw();
  }

  public cancelMaterialTextureUpload(id: string) {
    const pending = this.pendingTextureUploads.get(id);
    if (!pending) return;
    this.pendingTextureUploads.delete(id);
    if (this.materialLayerMap.get(id) !== pending.layer) {
      this.textureManager.releaseCustomLayer(pending.layer);
    }
  }

  public updateMaterials(materials: MaterialSpec[]) {
    const retainedIds = new Set(materials.map((material) => material.id));
    for (const [id, layer] of this.materialLayerMap) {
      if (!retainedIds.has(id)) {
        this.textureManager.releaseCustomLayer(layer);
        this.materialLayerMap.delete(id);
      }
    }
    for (const id of this.pendingTextureUploads.keys()) {
      if (!retainedIds.has(id)) this.cancelMaterialTextureUpload(id);
    }
    let threeMapsChanged = false;
    for (const spec of materials) {
      const prev = this.materials.find((m) => m.id === spec.id);
      if (!prev
        || prev.texturePreset !== spec.texturePreset
        || prev.uvScale !== spec.uvScale
        || prev.uvScaleX !== spec.uvScaleX
        || prev.uvScaleY !== spec.uvScaleY
        || prev.uvOffsetX !== spec.uvOffsetX
        || prev.uvOffsetY !== spec.uvOffsetY
        || prev.uvRotation !== spec.uvRotation) {
        threeMapsChanged = true;
      }
      const hasCustom = Boolean(spec.hasCustomAlbedo || spec.hasCustomNormal || spec.hasCustomRoughness);
      if (!hasCustom || (prev && prev.texturePreset !== spec.texturePreset)) {
        const layer = this.materialLayerMap.get(spec.id);
        if (layer !== undefined) this.textureManager.releaseCustomLayer(layer);
        if (prev?.texturePreset !== spec.texturePreset || prev?.hasCustomAlbedo || prev?.hasCustomNormal || prev?.hasCustomRoughness) {
          this.cancelMaterialTextureUpload(spec.id);
        }
        this.materialLayerMap.set(spec.id, PRESET_TO_LAYER[spec.texturePreset] ?? 0);
      }
    }
    if (threeMapsChanged) this.textureManager.clearThreeMapsCache();
    this.materials = materials;
    if (this.currentProject) {
      syncThreeMaterials(
        this.currentProject.meshMap,
        materials,
        this.settings.clayMode,
        this.isSoftwareGl,
        this.textureManager,
        this.materialLayerMap,
      );
    }
    this.pathTracer.resetAccumulation();
    this.requestDraw();
  }

  public async uploadMaterialTexture(
    materialId: string,
    slot: TextureSlot,
    file: File,
  ): Promise<Partial<MaterialSpec>> {
    const spec = this.materials.find((m) => m.id === materialId);
    const geoms =
      this.currentProject?.meshMap.get(materialId)?.map((m) => m.geometry as THREE.BufferGeometry) ?? [];
    const uvInfo = geoms.length > 0 ? analyzeGeometriesUV(geoms) : undefined;

    if (!spec || this.disposed) throw new Error('Material is no longer available.');
    if (this.pendingTextureUploads.has(materialId)) throw new Error('Wait for this material texture upload to finish.');
    const manager = this.textureManager;
    let layer = this.materialLayerMap.get(materialId) ?? 0;
    const newlyAllocated = layer < CUSTOM_LAYER_OFFSET;
    if (newlyAllocated) layer = manager.allocateCustomLayer(spec.texturePreset, Boolean(uvInfo?.isAtlas));
    const request = { layer };
    this.pendingTextureUploads.set(materialId, request);
    const isCurrent = () => !this.disposed && this.textureManager === manager
      && this.pendingTextureUploads.get(materialId) === request;
    try {
      await manager.writeFileToLayer(layer, slot, file, uvInfo, isCurrent);
      if (!isCurrent()) {
        throw new DOMException('Texture upload cancelled.', 'AbortError');
      }
      this.materialLayerMap.set(materialId, layer);
    } catch (error) {
      if (!isCurrent()) throw new DOMException('Texture upload cancelled.', 'AbortError');
      if (newlyAllocated) manager.releaseCustomLayer(layer);
      throw error;
    } finally {
      if (isCurrent()) this.pendingTextureUploads.delete(materialId);
    }
    this.pathTracer.setTextureArrays(this.textureManager);

    const patch: Partial<MaterialSpec> = {};
    if (slot === 'albedo') patch.hasCustomAlbedo = true;
    if (slot === 'normal') {
      patch.hasCustomNormal = true;
      if ((this.materials.find((material) => material.id === materialId)?.normalStrength ?? 1) < 0.05) {
        patch.normalStrength = 1.0;
      }
    }
    if (slot === 'roughness') patch.hasCustomRoughness = true;

    this.materials = this.materials.map((m) => (m.id === materialId ? { ...m, ...patch } : m));
    if (this.currentProject) {
      syncThreeMaterials(
        this.currentProject.meshMap,
        this.materials,
        this.settings.clayMode,
        this.isSoftwareGl,
        this.textureManager,
        this.materialLayerMap,
      );
    }
    this.pathTracer.resetAccumulation();
    this.requestDraw();
    return patch;
  }

  public setCameraPreset(preset: CameraPreset) {
    const cfg = CAMERA_PRESETS[preset];
    this.targetCamPos.set(...cfg.position);
    this.targetLookAt.set(...cfg.target);
    this.targetFov = cfg.fov;
    this.camTransitionActive = true;
    this.setInteracting(true);
    this.requestDraw();
  }

  public setFov(fov: number) {
    this.targetFov = fov;
    this.camera.fov = fov;
    this.camera.updateProjectionMatrix();
    this.pathTracer.resetAccumulation();
    this.requestDraw();
  }

  public restartAccumulation() {
    this.pathTracer.resetAccumulation();
    this.requestDraw();
  }

  public captureSnapshot(): string {
    // Render synchronously into current frame right before toDataURL()
    if (this.renderMode === 'pbr') {
      this.renderer.render(this.scene, this.camera);
    } else if (this.renderMode === 'raytrace') {
      this.pathTracer.displayToScreen(this.settings);
    } else {
      this.renderSplitFrame();
    }
    return this.renderer.domElement.toDataURL('image/png');
  }

  private setInteracting(active: boolean) {
    window.clearTimeout(this.interactionCooldownTimer);
    if (active && !this.isInteracting) {
      this.isInteracting = true;
      this.updatePathTracerResolution();
    }
  }

  private scheduleInteractionSettle() {
    window.clearTimeout(this.interactionCooldownTimer);
    this.interactionCooldownTimer = window.setTimeout(() => {
      if (this.disposed) return;
      this.isInteracting = false;
      this.updatePathTracerResolution();
      this.pathTracer.resetAccumulation();
      this.requestDraw();
    }, 160);
  }

  private updatePathTracerResolution() {
    const w = Math.max(1, this.container.clientWidth);
    const h = Math.max(1, this.container.clientHeight);
    const dpr = this.isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);
    const scale = this.isInteracting
      ? this.isSoftwareGl
        ? 0.35
        : this.settings.interactiveScale
      : this.isSoftwareGl
        ? 0.55
        : 1.0;

    this.pathTracer.resize(Math.floor(w * dpr * scale), Math.floor(h * dpr * scale));
  }

  private handleResize = () => {
    const w = Math.max(1, this.container.clientWidth);
    const h = Math.max(1, this.container.clientHeight);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h, false);
    this.updatePathTracerResolution();
    this.pathTracer.resetAccumulation();
    this.requestDraw();
  };

  private handlePointerDown = (e: PointerEvent) => {
    this.pointerDownPos = { x: e.clientX, y: e.clientY };
  };

  private handlePointerUp = (e: PointerEvent) => {
    const dx = e.clientX - this.pointerDownPos.x;
    const dy = e.clientY - this.pointerDownPos.y;
    if (dx * dx + dy * dy > 42) return; // Dragged orbit/pan, not a tap

    const rect = this.renderer.domElement.getBoundingClientRect();
    _ndc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    _ndc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(_ndc, this.camera);

    // First check light orb handles if gizmos are visible
    if (this.gizmosGroup.visible) {
      const lightHits = this.raycaster.intersectObjects(this.gizmosGroup.children, true);
      if (lightHits.length > 0) {
        const lid = lightHits[0].object.userData.lightId as string | undefined;
        if (lid) {
          this.setSelectedLight(lid);
          this.callbacks.onSelectLight(lid);
          return;
        }
      }
    }

    // Check model parts
    const modelHits = this.raycaster.intersectObjects(this.projectRoot.children, true);
    if (modelHits.length > 0) {
      const hitObj = modelHits[0].object;
      const matId = hitObj.userData.materialId as string | undefined;
      const partName = (hitObj.userData.partName as string) || hitObj.name || 'Selected Part';
      if (matId) {
        this.callbacks.onSelectMaterial(matId, partName);
      }
    }
  };

  private renderSplitFrame() {
    const size = this.renderer.getDrawingBufferSize(new THREE.Vector2());
    const splitX = Math.floor(size.x * this.splitRatio);

    // Left: PBR Viewport
    this.renderer.setScissorTest(true);
    this.renderer.setScissor(0, 0, splitX, size.y);
    this.renderer.render(this.scene, this.camera);
    this.renderer.setScissorTest(false);

    // Right: GPU Path Tracer
    this.pathTracer.displayToScreen(this.settings, {
      x: splitX,
      y: 0,
      w: Math.max(1, size.x - splitX),
      h: size.y,
    });
  }

  private afterDraw(cb: () => void) {
    const gl = this.renderer.getContext() as WebGL2RenderingContext;
    const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
    gl.flush();
    const poll = () => {
      if (this.disposed) return;
      const state = sync ? gl.getSyncParameter(sync, gl.SYNC_STATUS) : gl.SIGNALED;
      if (state === gl.UNSIGNALED) {
        this.frameId = window.setTimeout(poll, 5);
      } else {
        if (sync) gl.deleteSync(sync);
        this.frameId = window.setTimeout(cb, 80);
      }
    };
    this.frameId = window.setTimeout(poll, 5);
  }

  private requestDraw() {
    if (this.disposed || !this.initialized) return;
    if (this.renderBusy) {
      this.renderDirty = true;
      return;
    }
    this.renderBusy = true;

    this.frameId = requestAnimationFrame(() => {
      if (this.disposed) return;
      this.renderDirty = false;
      const now = performance.now();
      const dt = Math.min(0.1, (now - this.lastFrameTime) / 1000);
      this.lastFrameTime = now;

      // Damped camera preset transitions
      if (this.camTransitionActive) {
        const lambda = 9.0;
        this.camera.position.x = THREE.MathUtils.damp(this.camera.position.x, this.targetCamPos.x, lambda, dt);
        this.camera.position.y = THREE.MathUtils.damp(this.camera.position.y, this.targetCamPos.y, lambda, dt);
        this.camera.position.z = THREE.MathUtils.damp(this.camera.position.z, this.targetCamPos.z, lambda, dt);

        this.controls.target.x = THREE.MathUtils.damp(this.controls.target.x, this.targetLookAt.x, lambda, dt);
        this.controls.target.y = THREE.MathUtils.damp(this.controls.target.y, this.targetLookAt.y, lambda, dt);
        this.controls.target.z = THREE.MathUtils.damp(this.controls.target.z, this.targetLookAt.z, lambda, dt);

        this.camera.fov = THREE.MathUtils.damp(this.camera.fov, this.targetFov, lambda, dt);
        this.camera.updateProjectionMatrix();

        const posDist = _vec3A.copy(this.camera.position).distanceTo(this.targetCamPos);
        const tgtDist = _vec3B.copy(this.controls.target).distanceTo(this.targetLookAt);
        if (posDist < 0.008 && tgtDist < 0.008 && Math.abs(this.camera.fov - this.targetFov) < 0.05) {
          this.camera.position.copy(this.targetCamPos);
          this.controls.target.copy(this.targetLookAt);
          this.camera.fov = this.targetFov;
          this.camera.updateProjectionMatrix();
          this.camTransitionActive = false;
          this.scheduleInteractionSettle();
        }
        this.pathTracer.resetAccumulation();
      }

      if (this.turntable && !this.isInteracting && !this.camTransitionActive) {
        const offset = _vec3A.copy(this.camera.position).sub(this.controls.target);
        const angle = dt * 0.35;
        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle);
        const nx = offset.x * cosA - offset.z * sinA;
        const nz = offset.x * sinA + offset.z * cosA;
        offset.x = nx;
        offset.z = nz;
        this.camera.position.copy(this.controls.target).add(offset);
        this.pathTracer.resetAccumulation();
      }

      const controlsChanged = this.controls.update();

      // Keep light ring billboards facing camera
      if (this.gizmosGroup.visible) {
        for (const orbGroup of this.lightOrbMap.values()) {
          const ring = orbGroup.userData.ringMesh as THREE.Mesh;
          ring.lookAt(this.camera.position);
        }
      }

      const tStart = performance.now();
      let continueLoop = this.camTransitionActive || this.turntable || controlsChanged;

      if (this.renderMode === 'pbr') {
        this.renderer.render(this.scene, this.camera);
      } else {
        const samples = this.pathTracer.getSamples();
        const cap = this.isInteracting ? 1 : this.settings.maxSamples;
        if (samples < cap) {
          this.pathTracer.traceSample(
            this.camera,
            this.lights,
            this.materials,
            this.settings,
            this.isInteracting,
            this.materialLayerMap,
            this.textureManager,
          );
          if (this.pathTracer.getSamples() < cap && !this.isInteracting) {
            continueLoop = true;
          }
        }
        if (this.renderMode === 'split') {
          this.renderSplitFrame();
        } else {
          this.pathTracer.displayToScreen(this.settings);
        }
      }

      const frameMs = Math.max(1, Math.round(performance.now() - tStart));

      if (now - this.lastStatsTime > 120 || this.pathTracer.getSamples() <= 2) {
        this.lastStatsTime = now;
        const [rw, rh] = this.pathTracer.getResolution();
        this.callbacks.onStats({
          samples: this.renderMode === 'pbr' ? 1 : this.pathTracer.getSamples(),
          frameTimeMs: frameMs,
          triangles: this.bvhResult?.triangleCount ?? 0,
          bvhNodes: this.bvhResult?.nodeCount ?? 0,
          resolutionLabel: `${rw}×${rh}`,
          isConverged:
            this.renderMode === 'pbr' ||
            (!this.isInteracting && this.pathTracer.getSamples() >= this.settings.maxSamples),
        });
      }

      const done = () => {
        this.renderBusy = false;
        if (this.renderDirty || continueLoop) {
          this.requestDraw();
        }
      };

      if (this.isSoftwareGl) {
        this.afterDraw(done);
      } else {
        done();
      }
    });
  }

  public dispose() {
    this.disposed = true;
    this.importRequest = undefined;
    this.pendingTextureUploads.clear();
    cancelAnimationFrame(this.frameId);
    window.clearTimeout(this.frameId);
    window.clearTimeout(this.interactionCooldownTimer);
    window.removeEventListener('resize', this.handleResize);

    const canvas = this.renderer.domElement;
    canvas.removeEventListener('pointerdown', this.handlePointerDown);
    canvas.removeEventListener('pointerup', this.handlePointerUp);
    canvas.removeEventListener('webglcontextlost', this.handleContextLost);
    canvas.removeEventListener('webglcontextrestored', this.handleContextRestored);

    this.controls.dispose();
    this.transformControls.dispose();
    this.pathTracer.dispose();
    this.textureManager.dispose();
    this.envTexture?.dispose();
    this.floorMesh.geometry.dispose();
    (this.floorMesh.material as THREE.Material).dispose();
    this.renderer.dispose();

    if (canvas.parentElement === this.container) {
      this.container.removeChild(canvas);
    }
  }
}
