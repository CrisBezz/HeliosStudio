import React from 'react';
import {
  Box,
  Camera,
  ChevronDown,
  ChevronUp,
  FolderUp,
  ImagePlus,
  Layers,
  RotateCw,
  Sliders,
  Sparkles,
  Sun,
} from 'lucide-react';
import {
  BUILTIN_PROJECTS,
  CAMERA_PRESETS,
  LIGHTING_RIG_PRESETS,
  MATERIAL_PRESETS,
} from '../data/presets';
import { PBR_TEXTURE_PRESETS } from '../engine/textures';
import {
  BuiltinProjectId,
  CameraPreset,
  DockTab,
  EnvironmentPreset,
  LightingRigPreset,
  MaterialPreset,
  MaterialSpec,
  ProjectId,
  RayTracerSettings,
  RenderStats,
  StudioLight,
  TextureSlot,
} from '../types/studio';
import { kelvinToHex } from '../utils/color';

interface BottomDockProps {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  activeTab: DockTab;
  onTabChange: (tab: DockTab) => void;
  zenMode: boolean;

  // Projects
  activeProjectId: ProjectId;
  customProjectName: string | null;
  onSelectProject: (id: BuiltinProjectId) => void;
  onImportClick: () => void;

  // Lights
  lights: StudioLight[];
  selectedLightId: string;
  onSelectLight: (id: string) => void;
  onUpdateLight: (id: string, patch: Partial<StudioLight>) => void;
  onApplyLightingRig: (preset: LightingRigPreset) => void;

  // Materials
  materials: MaterialSpec[];
  selectedMaterialId: string;
  selectedPartName: string | null;
  onSelectMaterial: (id: string) => void;
  onUpdateMaterial: (id: string, patch: Partial<MaterialSpec>) => void;
  onApplyMaterialPreset: (id: string, preset: MaterialPreset) => void;
  onUploadTextureClick: (materialId: string, slot: TextureSlot) => void;

  // Ray Tracer Settings
  settings: RayTracerSettings;
  onUpdateSettings: (patch: Partial<RayTracerSettings>) => void;
  onRestartTrace: () => void;
  stats: RenderStats;

  // Camera
  fov: number;
  turntable: boolean;
  onSelectCameraPreset: (preset: CameraPreset) => void;
  onChangeFov: (fov: number) => void;
  onToggleTurntable: () => void;
}

const TABS: { id: DockTab; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'projects', label: 'Projects', icon: Box },
  { id: 'lights', label: 'Lights', icon: Sun },
  { id: 'materials', label: 'Materials', icon: Layers },
  { id: 'raytracer', label: 'Ray Tracer', icon: Sliders },
  { id: 'camera', label: 'Camera', icon: Camera },
];

const ENV_OPTIONS: { id: EnvironmentPreset; label: string }[] = [
  { id: 'studio', label: 'Studio Cyclorama' },
  { id: 'golden', label: 'Golden Hour' },
  { id: 'loft', label: 'Daylight Loft' },
  { id: 'cornell', label: 'Cornell Bounce' },
  { id: 'obsidian', label: 'Obsidian Void' },
];

export const BottomDock: React.FC<BottomDockProps> = ({
  collapsed,
  onToggleCollapsed,
  activeTab,
  onTabChange,
  zenMode,
  activeProjectId,
  customProjectName,
  onSelectProject,
  onImportClick,
  lights,
  selectedLightId,
  onSelectLight,
  onUpdateLight,
  onApplyLightingRig,
  materials,
  selectedMaterialId,
  selectedPartName,
  onSelectMaterial,
  onUpdateMaterial,
  onApplyMaterialPreset,
  onUploadTextureClick,
  settings,
  onUpdateSettings,
  onRestartTrace,
  stats,
  fov,
  turntable,
  onSelectCameraPreset,
  onChangeFov,
  onToggleTurntable,
}) => {
  if (zenMode) return null;

  const activeLight = lights.find((l) => l.id === selectedLightId) ?? lights[0];
  const activeMaterial =
    materials.find((m) => m.id === selectedMaterialId) ?? materials[0];

  return (
    <div
      className="fixed bottom-0 left-1/2 -translate-x-1/2 z-30 w-[calc(100vw-20px)] max-w-[940px] flex flex-col items-center pointer-events-none"
      style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
    >
      {/* Collapse / Expand Toggle Handle */}
      <button
        type="button"
        onClick={onToggleCollapsed}
        className="pointer-events-auto min-h-[36px] px-4 mb-1.5 rounded-xl bg-[#14161A]/95 border border-white/10 text-xs font-medium text-[#C4C9D0] hover:text-[#F4F4F6] flex items-center gap-1.5 shadow-lg active:scale-[0.98] transition-transform cursor-pointer"
      >
        {collapsed ? (
          <>
            <ChevronUp className="w-4 h-4 text-[#F59E0B]" />
            <span>Studio Controls</span>
          </>
        ) : (
          <>
            <ChevronDown className="w-4 h-4 text-[#9BA1A6]" />
            <span>Hide Controls</span>
          </>
        )}
      </button>

      {!collapsed && (
        <section
          aria-label="Studio control dock"
          className="pointer-events-auto w-full rounded-2xl bg-[#131519]/96 border border-white/[0.1] shadow-2xl overflow-hidden"
        >
          {/* Tab Bar + Quick Progress Readout */}
          <div className="flex items-center justify-between gap-2 px-3 pt-2 pb-2 border-b border-white/[0.07] overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => onTabChange(tab.id)}
                    className={`min-h-[44px] px-3.5 rounded-xl text-xs font-medium flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      active
                        ? 'bg-[#F59E0B] text-[#0B0C0E] font-semibold'
                        : 'text-[#9BA1A6] hover:text-[#F4F4F6] hover:bg-white/[0.04]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <div
              className="hidden sm:flex items-center gap-2 pr-2 text-[11px] text-[#9BA1A6] tabular-nums whitespace-nowrap shrink-0"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              <span>{stats.resolutionLabel}</span>
              <span className="text-white/20" aria-hidden="true">
                ·
              </span>
              <span>
                {stats.isConverged ? 'Converged' : `${stats.samples}/${settings.maxSamples} spp`}
              </span>
            </div>
          </div>

          {/* Active Tab Panel */}
          <div className="p-3.5 md:p-4 max-h-[268px] overflow-y-auto">
            {activeTab === 'projects' && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  {BUILTIN_PROJECTS.map((proj) => {
                    const active = activeProjectId === proj.id;
                    return (
                      <button
                        key={proj.id}
                        type="button"
                        onClick={() => onSelectProject(proj.id as BuiltinProjectId)}
                        className={`min-h-[64px] p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                          active
                            ? 'bg-[#1D2027] border-[#F59E0B]/70'
                            : 'bg-[#181B20] border-white/[0.06] hover:border-white/15'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-semibold text-[#F4F4F6] truncate">
                            {proj.name}
                          </span>
                          <span
                            className="text-[11px] text-[#9BA1A6] tabular-nums shrink-0"
                            style={{ fontFamily: 'var(--font-mono)' }}
                          >
                            {proj.partCount} parts
                          </span>
                        </div>
                        <p className="mt-1 text-[11px] text-[#9BA1A6] line-clamp-1">
                          {proj.subtitle}
                        </p>
                      </button>
                    );
                  })}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1 border-t border-white/[0.06]">
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={onImportClick}
                      className="min-h-[44px] px-4 rounded-xl bg-[#1D2027] hover:bg-[#262A33] border border-white/10 text-xs font-medium text-[#F4F4F6] flex items-center gap-2 cursor-pointer"
                    >
                      <FolderUp className="w-4 h-4 text-[#F59E0B]" />
                      <span>Import 3D File (GLB, GLTF, OBJ, STL)</span>
                    </button>
                    {activeProjectId === 'custom' && customProjectName && (
                      <span className="text-xs text-[#F59E0B] font-medium truncate max-w-[180px]">
                        Active: {customProjectName}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => onUpdateSettings({ clayMode: !settings.clayMode })}
                    className={`min-h-[44px] px-4 rounded-xl border text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer ${
                      settings.clayMode
                        ? 'bg-[#F59E0B]/15 border-[#F59E0B] text-[#F59E0B]'
                        : 'bg-[#181B20] border-white/[0.08] text-[#C4C9D0] hover:text-[#F4F4F6]'
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Clay Lighting Check</span>
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'lights' && activeLight && (
              <div className="space-y-3">
                {/* Light Selector + Rig Presets */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                    {lights.map((l) => {
                      const active = l.id === activeLight.id;
                      const swatch = l.useKelvin ? kelvinToHex(l.kelvin) : l.color;
                      return (
                        <button
                          key={l.id}
                          type="button"
                          onClick={() => onSelectLight(l.id)}
                          className={`min-h-[44px] px-3 rounded-xl border text-xs font-medium flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer ${
                            active
                              ? 'bg-[#1E222A] border-[#F59E0B] text-[#F4F4F6]'
                              : 'bg-[#181B20] border-white/[0.06] text-[#9BA1A6] hover:text-[#F4F4F6]'
                          }`}
                        >
                          <span
                            className="w-3 h-3 rounded-full border border-white/20 shrink-0"
                            style={{
                              backgroundColor: l.enabled ? swatch : '#333842',
                              opacity: l.enabled ? 1 : 0.45,
                            }}
                          />
                          <span>{l.name}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateLight(activeLight.id, { enabled: !activeLight.enabled })
                      }
                      className={`min-h-[44px] px-3.5 rounded-xl border text-xs font-medium cursor-pointer ${
                        activeLight.enabled
                          ? 'bg-[#F59E0B]/15 border-[#F59E0B]/70 text-[#F59E0B]'
                          : 'bg-[#181B20] border-white/10 text-[#9BA1A6]'
                      }`}
                    >
                      {activeLight.enabled ? 'Enabled' : 'Muted'}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        onUpdateSettings({ showLightGizmos: !settings.showLightGizmos })
                      }
                      className={`min-h-[44px] px-3.5 rounded-xl border text-xs font-medium cursor-pointer ${
                        settings.showLightGizmos
                          ? 'bg-[#1E222A] border-white/25 text-[#F4F4F6]'
                          : 'bg-[#181B20] border-white/[0.06] text-[#9BA1A6]'
                      }`}
                    >
                      3D Handles
                    </button>
                  </div>
                </div>

                {/* Sliders for Selected Light */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-2">
                  <SliderControl
                    label="Intensity"
                    valueDisplay={`${activeLight.intensity.toFixed(0)} lm`}
                    min={0}
                    max={60}
                    step={1}
                    value={activeLight.intensity}
                    onChange={(v) => onUpdateLight(activeLight.id, { intensity: v })}
                  />
                  <SliderControl
                    label="Kelvin Temp"
                    valueDisplay={`${activeLight.kelvin} K`}
                    min={2000}
                    max={9500}
                    step={100}
                    value={activeLight.kelvin}
                    onChange={(v) =>
                      onUpdateLight(activeLight.id, { kelvin: v, useKelvin: true })
                    }
                  />
                  <SliderControl
                    label="Azimuth"
                    valueDisplay={`${Math.round(activeLight.azimuth)}°`}
                    min={-180}
                    max={180}
                    step={1}
                    value={activeLight.azimuth}
                    onChange={(v) => onUpdateLight(activeLight.id, { azimuth: v })}
                  />
                  <SliderControl
                    label="Elevation & Softness"
                    valueDisplay={`${Math.round(activeLight.elevation)}° / ${activeLight.radius.toFixed(2)}m`}
                    min={6}
                    max={85}
                    step={1}
                    value={activeLight.elevation}
                    onChange={(v) => onUpdateLight(activeLight.id, { elevation: v })}
                  />
                </div>

                {/* Softness + Rig Presets */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1.5 border-t border-white/[0.06]">
                  <div className="w-full sm:w-56">
                    <SliderControl
                      label="Softbox Radius"
                      valueDisplay={`${activeLight.radius.toFixed(2)} m`}
                      min={0.05}
                      max={1.6}
                      step={0.05}
                      value={activeLight.radius}
                      onChange={(v) => onUpdateLight(activeLight.id, { radius: v })}
                    />
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                    <span className="text-[11px] text-[#9BA1A6] mr-1 shrink-0">Rig Presets:</span>
                    {LIGHTING_RIG_PRESETS.map((rig) => (
                      <button
                        key={rig.id}
                        type="button"
                        onClick={() => onApplyLightingRig(rig)}
                        className="min-h-[38px] px-3 rounded-lg bg-[#181B20] hover:bg-[#22262E] border border-white/[0.08] text-[11px] font-medium text-[#C4C9D0] hover:text-[#F4F4F6] whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        {rig.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'materials' && activeMaterial && (
              <div className="space-y-3">
                {/* Part / Material Selector */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                    {materials.map((mat) => {
                      const active = mat.id === activeMaterial.id;
                      return (
                        <button
                          key={mat.id}
                          type="button"
                          onClick={() => onSelectMaterial(mat.id)}
                          className={`min-h-[44px] px-3 rounded-xl border text-xs font-medium flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer ${
                            active
                              ? 'bg-[#1E222A] border-[#F59E0B] text-[#F4F4F6]'
                              : 'bg-[#181B20] border-white/[0.06] text-[#9BA1A6] hover:text-[#F4F4F6]'
                          }`}
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-md border border-white/20 shrink-0"
                            style={{ backgroundColor: mat.color }}
                          />
                          <span>{mat.name}</span>
                        </button>
                      );
                    })}
                  </div>

                  {selectedPartName && (
                    <span className="text-[11px] text-[#9BA1A6] truncate max-w-[200px]">
                      Picked: <strong className="text-[#F4F4F6] font-medium">{selectedPartName}</strong>
                    </span>
                  )}
                </div>

                {/* Material Sliders */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-x-4 gap-y-2 items-end">
                  <div className="flex items-center justify-between gap-3 min-h-[44px] px-3 rounded-xl bg-[#181B20] border border-white/[0.06]">
                    <span className="text-xs text-[#9BA1A6]">Albedo</span>
                    <input
                      type="color"
                      aria-label="Material albedo color"
                      value={activeMaterial.color}
                      onChange={(e) =>
                        onUpdateMaterial(activeMaterial.id, { color: e.target.value })
                      }
                      className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
                    />
                  </div>
                  <SliderControl
                    label="Roughness"
                    valueDisplay={activeMaterial.roughness.toFixed(2)}
                    min={0.02}
                    max={1}
                    step={0.01}
                    value={activeMaterial.roughness}
                    onChange={(v) => onUpdateMaterial(activeMaterial.id, { roughness: v })}
                  />
                  <SliderControl
                    label="Metalness"
                    valueDisplay={activeMaterial.metalness.toFixed(2)}
                    min={0}
                    max={1}
                    step={0.01}
                    value={activeMaterial.metalness}
                    onChange={(v) => onUpdateMaterial(activeMaterial.id, { metalness: v })}
                  />
                  <SliderControl
                    label="Transmission"
                    valueDisplay={activeMaterial.transmission.toFixed(2)}
                    min={0}
                    max={1}
                    step={0.01}
                    value={activeMaterial.transmission}
                    onChange={(v) => onUpdateMaterial(activeMaterial.id, { transmission: v })}
                  />
                  <SliderControl
                    label="IOR"
                    valueDisplay={activeMaterial.ior.toFixed(2)}
                    min={1.1}
                    max={2.2}
                    step={0.01}
                    value={activeMaterial.ior}
                    onChange={(v) => onUpdateMaterial(activeMaterial.id, { ior: v })}
                  />
                </div>

                {/* PBR Texture Maps, Tiling & Normal Depth */}
                <div className="space-y-2.5 pt-2 border-t border-white/[0.06]">
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                    <span className="text-[11px] text-[#9BA1A6] mr-1 shrink-0">PBR Texture:</span>
                    {PBR_TEXTURE_PRESETS.map((tex) => {
                      const hasCustom = Boolean(
                        activeMaterial.hasCustomAlbedo ||
                          activeMaterial.hasCustomNormal ||
                          activeMaterial.hasCustomRoughness,
                      );
                      const active = !hasCustom && activeMaterial.texturePreset === tex.id;
                      return (
                        <button
                          key={tex.id}
                          type="button"
                          onClick={() =>
                            onUpdateMaterial(activeMaterial.id, {
                              texturePreset: tex.id,
                              hasCustomAlbedo: false,
                              hasCustomNormal: false,
                              hasCustomRoughness: false,
                              normalStrength:
                                tex.id !== 'none' && activeMaterial.normalStrength < 0.05
                                  ? 1.0
                                  : activeMaterial.normalStrength,
                            })
                          }
                          className={`min-h-[38px] px-3 rounded-lg border text-[11px] font-medium whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                            active
                              ? 'bg-[#1E222A] border-[#F59E0B] text-[#F4F4F6]'
                              : 'bg-[#181B20] border-white/[0.08] text-[#9BA1A6] hover:text-[#F4F4F6]'
                          }`}
                        >
                          {tex.label}
                        </button>
                      );
                    })}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-2 items-center">
                    <SliderControl
                      label="UV Tile Scale"
                      valueDisplay={`${activeMaterial.uvScale.toFixed(1)}×`}
                      min={0.5}
                      max={6.0}
                      step={0.1}
                      value={activeMaterial.uvScale}
                      onChange={(v) => onUpdateMaterial(activeMaterial.id, { uvScale: v })}
                    />
                    <SliderControl
                      label="Normal Depth"
                      valueDisplay={activeMaterial.normalStrength.toFixed(2)}
                      min={0.0}
                      max={2.0}
                      step={0.05}
                      value={activeMaterial.normalStrength}
                      onChange={(v) => onUpdateMaterial(activeMaterial.id, { normalStrength: v })}
                    />
                    <div className="sm:col-span-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                      <span className="text-[11px] text-[#9BA1A6] mr-1 shrink-0">Custom Maps:</span>
                      {(
                        [
                          { slot: 'albedo', label: 'Albedo', active: activeMaterial.hasCustomAlbedo },
                          { slot: 'normal', label: 'Normal', active: activeMaterial.hasCustomNormal },
                          { slot: 'roughness', label: 'Roughness', active: activeMaterial.hasCustomRoughness },
                        ] as { slot: TextureSlot; label: string; active?: boolean }[]
                      ).map((item) => (
                        <button
                          key={item.slot}
                          type="button"
                          onClick={() => onUploadTextureClick(activeMaterial.id, item.slot)}
                          className={`min-h-[40px] px-3 rounded-lg border text-[11px] font-medium flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                            item.active
                              ? 'bg-[#F59E0B]/15 border-[#F59E0B]/70 text-[#F59E0B]'
                              : 'bg-[#181B20] hover:bg-[#22262E] border-white/[0.08] text-[#C4C9D0] hover:text-[#F4F4F6]'
                          }`}
                        >
                          <ImagePlus className="w-3.5 h-3.5" />
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quick Physical Material Swatches */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1.5 border-t border-white/[0.06]">
                  <span className="text-[11px] text-[#9BA1A6] mr-1 shrink-0">Presets:</span>
                  {MATERIAL_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => onApplyMaterialPreset(activeMaterial.id, preset)}
                      className="min-h-[38px] px-3 rounded-lg bg-[#181B20] hover:bg-[#22262E] border border-white/[0.08] text-[11px] font-medium text-[#C4C9D0] hover:text-[#F4F4F6] flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-white/25"
                        style={{ backgroundColor: preset.color }}
                      />
                      <span>{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'raytracer' && (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                    {ENV_OPTIONS.map((env) => {
                      const active = settings.environment === env.id;
                      return (
                        <button
                          key={env.id}
                          type="button"
                          onClick={() => onUpdateSettings({ environment: env.id })}
                          className={`min-h-[44px] px-3.5 rounded-xl border text-xs font-medium whitespace-nowrap shrink-0 cursor-pointer ${
                            active
                              ? 'bg-[#1E222A] border-[#F59E0B] text-[#F4F4F6]'
                              : 'bg-[#181B20] border-white/[0.06] text-[#9BA1A6] hover:text-[#F4F4F6]'
                          }`}
                        >
                          {env.label}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={onRestartTrace}
                    className="min-h-[44px] px-3.5 rounded-xl bg-[#1D2027] hover:bg-[#262A33] border border-white/10 text-xs font-medium text-[#F4F4F6] flex items-center gap-2 cursor-pointer"
                  >
                    <RotateCw className="w-3.5 h-3.5 text-[#F59E0B]" />
                    <span>Restart Trace</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-2 items-center">
                  <SliderControl
                    label="Exposure (EV)"
                    valueDisplay={settings.exposure.toFixed(2)}
                    min={0.4}
                    max={2.4}
                    step={0.04}
                    value={settings.exposure}
                    onChange={(v) => onUpdateSettings({ exposure: v })}
                  />
                  <SliderControl
                    label="GI Light Bounces"
                    valueDisplay={`${settings.maxBounces}`}
                    min={1}
                    max={6}
                    step={1}
                    value={settings.maxBounces}
                    onChange={(v) => onUpdateSettings({ maxBounces: v })}
                  />
                  <SliderControl
                    label="Environment Fill"
                    valueDisplay={`${Math.round(settings.envIntensity * 100)}%`}
                    min={0}
                    max={2}
                    step={0.05}
                    value={settings.envIntensity}
                    onChange={(v) => onUpdateSettings({ envIntensity: v })}
                  />

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onUpdateSettings({ denoiser: !settings.denoiser })}
                      className={`flex-1 min-h-[44px] px-3 rounded-xl border text-xs font-medium cursor-pointer ${
                        settings.denoiser
                          ? 'bg-[#F59E0B]/15 border-[#F59E0B]/70 text-[#F59E0B]'
                          : 'bg-[#181B20] border-white/[0.08] text-[#9BA1A6]'
                      }`}
                    >
                      Denoiser: {settings.denoiser ? 'On' : 'Off'}
                    </button>
                    <select
                      aria-label="Sample target"
                      value={settings.maxSamples}
                      onChange={(e) =>
                        onUpdateSettings({ maxSamples: Number(e.target.value) })
                      }
                      className="min-h-[44px] px-2.5 rounded-xl bg-[#181B20] border border-white/[0.08] text-xs text-[#F4F4F6] cursor-pointer"
                    >
                      <option value={32}>32 spp</option>
                      <option value={64}>64 spp</option>
                      <option value={128}>128 spp</option>
                      <option value={256}>256 spp</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'camera' && (
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                  {(Object.keys(CAMERA_PRESETS) as CameraPreset[]).map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => onSelectCameraPreset(key)}
                      className="min-h-[44px] px-4 rounded-xl bg-[#181B20] hover:bg-[#22262E] border border-white/[0.08] text-xs font-medium text-[#F4F4F6] whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      {CAMERA_PRESETS[key].label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-4 flex-1 min-w-[240px] max-w-[420px]">
                  <div className="flex-1">
                    <SliderControl
                      label="Lens FOV"
                      valueDisplay={`${Math.round(fov)}°`}
                      min={20}
                      max={65}
                      step={1}
                      value={fov}
                      onChange={onChangeFov}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={onToggleTurntable}
                    className={`min-h-[44px] px-4 rounded-xl border text-xs font-medium whitespace-nowrap shrink-0 cursor-pointer ${
                      turntable
                        ? 'bg-[#F59E0B] text-[#0B0C0E] border-[#F59E0B] font-semibold'
                        : 'bg-[#181B20] border-white/[0.08] text-[#C4C9D0]'
                    }`}
                  >
                    {turntable ? 'Turntable On' : 'Turntable'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

interface SliderControlProps {
  label: string;
  valueDisplay: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
}

const SliderControl: React.FC<SliderControlProps> = ({
  label,
  valueDisplay,
  min,
  max,
  step,
  value,
  onChange,
}) => (
  <label className="block space-y-0.5 select-none">
    <div className="flex items-center justify-between gap-2 text-[11px]">
      <span className="text-[#9BA1A6] truncate">{label}</span>
      <span
        className="text-[#F4F4F6] tabular-nums shrink-0"
        style={{ fontFamily: 'var(--font-mono)' }}
      >
        {valueDisplay}
      </span>
    </div>
    <input
      type="range"
      className="studio-slider"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
    />
  </label>
);
