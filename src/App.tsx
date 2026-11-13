import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BottomDock } from './components/BottomDock';
import { SplitOverlay } from './components/SplitOverlay';
import { TopBar } from './components/TopBar';
import {
  BUILTIN_PROJECTS,
  CAMERA_PRESETS,
  DEFAULT_LIGHTS,
  DEFAULT_RAYTRACER_SETTINGS,
} from './data/presets';
import { StudioEngine } from './engine/StudioEngine';
import {
  BuiltinProjectId,
  CameraPreset,
  DockTab,
  LightingRigPreset,
  MaterialPreset,
  MaterialSpec,
  ProjectId,
  RayTracerSettings,
  RenderMode,
  RenderStats,
  StudioLight,
  TextureSlot,
} from './types/studio';

export default function App() {
  const canvasHostRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef<StudioEngine | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const textureInputRef = useRef<HTMLInputElement | null>(null);
  const pendingTexUploadRef = useRef<{ materialId: string; slot: TextureSlot } | null>(null);

  const [renderMode, setRenderMode] = useState<RenderMode>('raytrace');
  const [splitRatio, setSplitRatio] = useState<number>(0.5);
  const [activeProjectId, setActiveProjectId] = useState<ProjectId>('chronograph');
  const [customProjectName, setCustomProjectName] = useState<string | null>(null);

  const [lights, setLights] = useState<StudioLight[]>(DEFAULT_LIGHTS);
  const [selectedLightId, setSelectedLightId] = useState<string>(DEFAULT_LIGHTS[0].id);

  const [materials, setMaterials] = useState<MaterialSpec[]>([]);
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>('');
  const [selectedPartName, setSelectedPartName] = useState<string | null>(null);

  const [settings, setSettings] = useState<RayTracerSettings>(DEFAULT_RAYTRACER_SETTINGS);
  const [fov, setFov] = useState<number>(CAMERA_PRESETS.hero.fov);
  const [turntable, setTurntable] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<DockTab>('lights');
  const [dockCollapsed, setDockCollapsed] = useState<boolean>(false);
  const [zenMode, setZenMode] = useState<boolean>(false);
  const [contextLost, setContextLost] = useState<boolean>(false);
  const [notice, setNotice] = useState<string | null>(null);

  const [stats, setStats] = useState<RenderStats>({
    samples: 0,
    frameTimeMs: 16,
    triangles: 0,
    bvhNodes: 0,
    resolutionLabel: '—',
    isConverged: false,
  });

  const showNotice = useCallback((msg: string) => {
    setNotice(msg);
    window.setTimeout(() => {
      setNotice((curr) => (curr === msg ? null : curr));
    }, 3200);
  }, []);

  // Initialize Three.js + GPU Path Tracer Engine once
  useEffect(() => {
    const host = canvasHostRef.current;
    if (!host) return;

    const engine = new StudioEngine(host, DEFAULT_LIGHTS, DEFAULT_RAYTRACER_SETTINGS, {
      onStats: (nextStats) => setStats(nextStats),
      onSelectMaterial: (matId, partName) => {
        setSelectedMaterialId(matId);
        setSelectedPartName(partName);
        setActiveTab('materials');
        setDockCollapsed(false);
      },
      onSelectLight: (lightId) => {
        setSelectedLightId(lightId);
        setActiveTab('lights');
        setDockCollapsed(false);
      },
      onLightMoved: (lightId, azimuth, elevation, distance) => {
        setLights((prev) =>
          prev.map((l) => (l.id === lightId ? { ...l, azimuth, elevation, distance } : l)),
        );
      },
      onContextLost: (lost) => setContextLost(lost),
    });

    engineRef.current = engine;
    const initialMats = engine.getMaterials();
    setMaterials(initialMats);
    if (initialMats.length > 0) {
      setSelectedMaterialId(initialMats[0].id);
    }
    engine.setRenderMode('raytrace');

    return () => {
      engine.dispose();
      engineRef.current = null;
    };
  }, []);

  // Keyboard shortcuts for desktop convenience
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) return;
      if (e.key === 'h' || e.key === 'H') {
        setZenMode((v) => !v);
      } else if (e.key === '1') {
        handleRenderModeChange('pbr');
      } else if (e.key === '2') {
        handleRenderModeChange('split');
      } else if (e.key === '3') {
        handleRenderModeChange('raytrace');
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const handleRenderModeChange = (mode: RenderMode) => {
    setRenderMode(mode);
    engineRef.current?.setRenderMode(mode);
  };

  const handleSplitChange = (ratio: number) => {
    setSplitRatio(ratio);
    engineRef.current?.setSplitRatio(ratio);
  };

  const handleSelectProject = (id: BuiltinProjectId) => {
    if (!engineRef.current) return;
    const mats = engineRef.current.loadBuiltinProject(id);
    setActiveProjectId(id);
    setCustomProjectName(null);
    setMaterials(mats);
    setSelectedMaterialId(mats[0]?.id ?? '');
    setSelectedPartName(null);
  };

  const handleImportFile = async (file: File) => {
    if (!engineRef.current) return;
    try {
      const mats = await engineRef.current.loadCustomFile(file);
      setActiveProjectId('custom');
      setCustomProjectName(file.name);
      setMaterials(mats);
      setSelectedMaterialId(mats[0]?.id ?? '');
      setSelectedPartName(null);
      showNotice(`Loaded ${file.name}`);
    } catch (err) {
      showNotice(err instanceof Error ? err.message : 'Unable to load 3D model file.');
    }
  };

  const handleSelectLight = (id: string) => {
    setSelectedLightId(id);
    engineRef.current?.setSelectedLight(id);
  };

  const handleUpdateLight = (id: string, patch: Partial<StudioLight>) => {
    setLights((prev) => {
      const next = prev.map((l) => (l.id === id ? { ...l, ...patch } : l));
      engineRef.current?.syncLights(next);
      return next;
    });
  };

  const handleApplyLightingRig = (rig: LightingRigPreset) => {
    const cloned = rig.lights.map((l) => ({ ...l }));
    setLights(cloned);
    engineRef.current?.syncLights(cloned);

    setSettings((prev) => {
      const next = {
        ...prev,
        environment: rig.environment,
        envIntensity: rig.envIntensity,
      };
      engineRef.current?.updateSettings(next);
      return next;
    });
  };

  const handleUpdateMaterial = (id: string, patch: Partial<MaterialSpec>) => {
    setMaterials((prev) => {
      const next = prev.map((m) => (m.id === id ? { ...m, ...patch } : m));
      engineRef.current?.updateMaterials(next);
      return next;
    });
  };

  const handleApplyMaterialPreset = (id: string, preset: MaterialPreset) => {
    handleUpdateMaterial(id, {
      color: preset.color,
      roughness: preset.roughness,
      metalness: preset.metalness,
      ior: preset.ior,
      transmission: preset.transmission,
      clearcoat: preset.clearcoat,
      emissiveIntensity: preset.emissiveIntensity,
      texturePreset: preset.texturePreset,
      uvScale: preset.uvScale,
      normalStrength: preset.normalStrength,
      hasCustomAlbedo: false,
      hasCustomNormal: false,
      hasCustomRoughness: false,
    });
  };

  const handleUploadTextureClick = (materialId: string, slot: TextureSlot) => {
    pendingTexUploadRef.current = { materialId, slot };
    textureInputRef.current?.click();
  };

  const handleTextureFileSelected = async (file: File) => {
    const target = pendingTexUploadRef.current;
    pendingTexUploadRef.current = null;
    if (!target || !engineRef.current) return;
    try {
      const patch = await engineRef.current.uploadMaterialTexture(
        target.materialId,
        target.slot,
        file,
      );
      setMaterials((prev) =>
        prev.map((m) => (m.id === target.materialId ? { ...m, ...patch } : m)),
      );
      const slotLabel =
        target.slot === 'albedo' ? 'Albedo' : target.slot === 'normal' ? 'Normal' : 'Roughness';
      showNotice(`Loaded ${slotLabel} map (${file.name})`);
    } catch (err) {
      showNotice(err instanceof Error ? err.message : 'Unable to load texture image.');
    }
  };

  const handleUpdateSettings = (patch: Partial<RayTracerSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      engineRef.current?.updateSettings(next);
      return next;
    });
  };

  const handleSelectCameraPreset = (preset: CameraPreset) => {
    setFov(CAMERA_PRESETS[preset].fov);
    engineRef.current?.setCameraPreset(preset);
  };

  const handleChangeFov = (nextFov: number) => {
    setFov(nextFov);
    engineRef.current?.setFov(nextFov);
  };

  const handleToggleTurntable = () => {
    setTurntable((prev) => {
      const next = !prev;
      engineRef.current?.setTurntable(next);
      return next;
    });
  };

  const handleCapture = () => {
    if (!engineRef.current) return;
    const dataUrl = engineRef.current.captureSnapshot();
    const link = document.createElement('a');
    link.download = `helios-render-${activeProjectId}-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
    showNotice('Snapshot exported as PNG');
  };

  const activeProjectTitle =
    activeProjectId === 'custom'
      ? customProjectName ?? 'Imported Model'
      : BUILTIN_PROJECTS.find((p) => p.id === activeProjectId)?.name ?? 'Studio Scene';

  return (
    <main
      className="relative w-full h-[100dvh] overflow-hidden bg-[#0B0C0E]"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file) void handleImportFile(file);
      }}
    >
      {/* Dedicated WebGL2 Canvas Mount (Isolated from React HUD re-renders) */}
      <div ref={canvasHostRef} className="studio-canvas-host fixed inset-0 w-full h-full z-0" />

      {/* Hidden File Input for GLB / GLTF / OBJ / STL on iPad Files & Desktop */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".glb,.gltf,.obj,.stl"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            void handleImportFile(file);
          }
          e.currentTarget.value = '';
        }}
      />

      {/* Hidden Image Input for Custom PBR Texture Maps */}
      <input
        ref={textureInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            void handleTextureFileSelected(file);
          }
          e.currentTarget.value = '';
        }}
      />

      {/* Split Compare Overlay */}
      {renderMode === 'split' && !zenMode && (
        <SplitOverlay splitRatio={splitRatio} onChange={handleSplitChange} />
      )}

      {/* Top Studio Header */}
      <TopBar
        projectName={activeProjectTitle}
        renderMode={renderMode}
        onRenderModeChange={handleRenderModeChange}
        stats={stats}
        maxSamples={settings.maxSamples}
        zenMode={zenMode}
        onToggleZen={() => setZenMode((v) => !v)}
        onCapture={handleCapture}
        onImportClick={() => fileInputRef.current?.click()}
      />

      {/* Collapsible Bottom Control Dock */}
      <BottomDock
        collapsed={dockCollapsed}
        onToggleCollapsed={() => setDockCollapsed((v) => !v)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        zenMode={zenMode}
        activeProjectId={activeProjectId}
        customProjectName={customProjectName}
        onSelectProject={handleSelectProject}
        onImportClick={() => fileInputRef.current?.click()}
        lights={lights}
        selectedLightId={selectedLightId}
        onSelectLight={handleSelectLight}
        onUpdateLight={handleUpdateLight}
        onApplyLightingRig={handleApplyLightingRig}
        materials={materials}
        selectedMaterialId={selectedMaterialId}
        selectedPartName={selectedPartName}
        onSelectMaterial={(id) => {
          setSelectedMaterialId(id);
          setSelectedPartName(null);
        }}
        onUpdateMaterial={handleUpdateMaterial}
        onApplyMaterialPreset={handleApplyMaterialPreset}
        onUploadTextureClick={handleUploadTextureClick}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onRestartTrace={() => engineRef.current?.restartAccumulation()}
        stats={stats}
        fov={fov}
        turntable={turntable}
        onSelectCameraPreset={handleSelectCameraPreset}
        onChangeFov={handleChangeFov}
        onToggleTurntable={handleToggleTurntable}
      />

      {/* Transient Non-Intrusive Toast Notice */}
      {notice && (
        <div
          role="status"
          className="fixed top-[68px] left-1/2 -translate-x-1/2 z-40 px-4 py-2 rounded-xl bg-[#181B22] border border-white/15 text-xs font-medium text-[#F4F4F6] shadow-xl pointer-events-none"
        >
          {notice}
        </div>
      )}

      {/* WebGL Context Lost Recovery Banner */}
      {contextLost && (
        <div className="fixed inset-0 z-50 bg-[#0B0C0E]/90 flex items-center justify-center p-6">
          <div className="max-w-sm p-6 rounded-2xl bg-[#14161A] border border-white/10 text-center space-y-2">
            <h2 className="text-base font-semibold text-[#F4F4F6]">
              Graphics Context Paused
            </h2>
            <p className="text-xs text-[#9BA1A6]">
              WebGL2 resources were reclaimed by the browser. Restoring the studio viewport automatically.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
