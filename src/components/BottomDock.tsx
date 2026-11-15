import React from 'react';
import {
  Box,
  Camera,
  ChevronDown,
  ChevronUp,
  FolderUp,
  ImagePlus,
  LayoutGrid,
  Layers,
  RotateCw,
  RotateCcw,
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
import { MaterialPreview } from './MaterialPreview';
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
  onResetLight: (id: string) => void;
  onApplyLightingRig: (preset: LightingRigPreset) => void;

  // Materials
  materials: MaterialSpec[];
  selectedMaterialId: string;
  selectedPartName: string | null;
  onSelectMaterial: (id: string) => void;
  onUpdateMaterial: (id: string, patch: Partial<MaterialSpec>) => void;
  onResetMaterial: (id: string) => void;
  onApplyMaterialPreset: (id: string, preset: MaterialPreset) => void;
  onUploadTextureClick: (materialId: string, slot: TextureSlot) => void;
  getTexturePreview: (materialId: string, slot: TextureSlot) => string | null;

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
  onResetLight,
  onApplyLightingRig,
  materials,
  selectedMaterialId,
  selectedPartName,
  onSelectMaterial,
  onUpdateMaterial,
  onResetMaterial,
  onApplyMaterialPreset,
  onUploadTextureClick,
  getTexturePreview,
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
  const [materialPresetsOpen, setMaterialPresetsOpen] = React.useState(false);
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
          <div
            className="p-3.5 md:p-4 overflow-y-auto overscroll-contain touch-pan-y"
            style={{
              maxHeight:
                activeTab === 'materials' && materialPresetsOpen
                  ? 'min(60dvh, 440px)'
                  : '268px',
              WebkitOverflowScrolling: 'touch',
            }}
          >
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
                      onClick={() => onResetLight(activeLight.id)}
                      title={`Reset ${activeLight.name} to default`}
                      aria-label={`Reset ${activeLight.name} to default`}
                      className="min-w-11 min-h-11 rounded-xl border border-white/[0.08] bg-[#181B20] text-[#9BA1A6] hover:text-[#F59E0B] hover:border-[#F59E0B]/50 flex items-center justify-center cursor-pointer transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
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

                  <div className="flex items-center gap-2 shrink-0">
                    {selectedPartName && (
                      <span className="text-[11px] text-[#9BA1A6] truncate max-w-[200px]">
                        Picked: <strong className="text-[#F4F4F6] font-medium">{selectedPartName}</strong>
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => setMaterialPresetsOpen((open) => !open)}
                      aria-expanded={materialPresetsOpen}
                      aria-label={materialPresetsOpen ? 'Close material preset grid' : 'Open material preset grid'}
                      title="Browse material presets"
                      className={`min-w-11 min-h-11 rounded-xl border flex items-center justify-center cursor-pointer transition-colors ${
                        materialPresetsOpen
                          ? 'bg-[#F59E0B]/15 border-[#F59E0B] text-[#F59E0B]'
                          : 'border-white/[0.08] bg-[#181B20] text-[#9BA1A6] hover:text-[#F59E0B] hover:border-[#F59E0B]/50'
                      }`}
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onResetMaterial(activeMaterial.id)}
                      title={`Reset ${activeMaterial.name} properties to defaults`}
                      aria-label={`Reset ${activeMaterial.name} properties to defaults`}
                      className="min-w-11 min-h-11 rounded-xl border border-white/[0.08] bg-[#181B20] text-[#9BA1A6] hover:text-[#F59E0B] hover:border-[#F59E0B]/50 flex items-center justify-center cursor-pointer transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {materialPresetsOpen && (
                  <div className="space-y-2 rounded-xl border border-white/[0.08] bg-[#101216] p-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-medium text-[#C4C9D0]">Material presets</span>
                      <span className="text-[10px] text-[#858B94] truncate">Applied to {activeMaterial.name} in this render session</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 pr-1">
                      {MATERIAL_PRESETS.map((preset) => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => {
                            onApplyMaterialPreset(activeMaterial.id, preset);
                            setMaterialPresetsOpen(false);
                          }}
                          aria-label={`Apply ${preset.name} to ${activeMaterial.name}`}
                          className="min-h-[94px] p-2 rounded-xl border border-white/[0.08] bg-[#181B20] hover:bg-[#22262E] hover:border-[#F59E0B]/60 text-left flex items-center gap-2 transition-colors cursor-pointer"
                        >
                          <MaterialPreview preset={preset} size={54} />
                          <span className="min-w-0 text-[11px] font-medium leading-tight text-[#E4E7EB]">{preset.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

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
                  <SliderControl label="Emission" valueDisplay={activeMaterial.emissiveIntensity.toFixed(2)} min={0} max={6} step={0.05} value={activeMaterial.emissiveIntensity} onChange={(v) => onUpdateMaterial(activeMaterial.id, { emissiveIntensity: v })} />
                  {activeMaterial.emissiveIntensity > 0.01 && (
                    <SliderControl label="Emitter opacity" valueDisplay={`${Math.round((activeMaterial.emissiveOpacity ?? 1) * 100)}%`} min={0.05} max={1} step={0.01} value={activeMaterial.emissiveOpacity ?? 1} onChange={(v) => onUpdateMaterial(activeMaterial.id, { emissiveOpacity: v })} />
                  )}
                </div>

                {/* PBR maps, UV mapping and normal relief */}
                <div className="space-y-3 pt-2 border-t border-white/[0.06]">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="block text-[11px] font-medium text-[#C4C9D0]">Texture maps</span>
                      <span className="text-[10px] text-[#858B94]">
                        {PBR_TEXTURE_PRESETS.find((tex) => tex.id === activeMaterial.texturePreset)?.label ?? 'Custom'}
                        {activeMaterial.hasCustomAlbedo || activeMaterial.hasCustomNormal || activeMaterial.hasCustomRoughness
                          ? ' + uploaded maps'
                          : ' · UV mapped'}
                      </span>
                    </div>
                    <div className="flex gap-1.5">
                      {(activeMaterial.hasCustomAlbedo || activeMaterial.hasCustomNormal || activeMaterial.hasCustomRoughness) && (
                        <button
                          type="button"
                          onClick={() => onUpdateMaterial(activeMaterial.id, {
                            hasCustomAlbedo: false,
                            hasCustomNormal: false,
                            hasCustomRoughness: false,
                          })}
                          className="min-h-9 px-2.5 rounded-lg border border-white/[0.08] bg-[#181B20] text-[10px] text-[#C4C9D0] hover:text-white"
                        >
                          Restore preset maps
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => onUpdateMaterial(activeMaterial.id, {
                          uvScaleX: activeMaterial.uvScale,
                          uvScaleY: activeMaterial.uvScale,
                          uvOffsetX: 0,
                          uvOffsetY: 0,
                          uvRotation: 0,
                        })}
                        className="min-h-9 px-2.5 rounded-lg border border-white/[0.08] bg-[#181B20] text-[10px] text-[#C4C9D0] hover:text-white"
                      >
                        Reset mapping
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {([
                      { slot: 'albedo', label: 'Albedo / Color', custom: activeMaterial.hasCustomAlbedo },
                      { slot: 'normal', label: 'Normal', custom: activeMaterial.hasCustomNormal },
                      { slot: 'roughness', label: 'Roughness', custom: activeMaterial.hasCustomRoughness },
                    ] as { slot: TextureSlot; label: string; custom?: boolean }[]).map((item) => {
                      const preview = getTexturePreview(activeMaterial.id, item.slot);
                      return (
                        <div key={item.slot} className="min-w-0 rounded-xl border border-white/[0.08] bg-[#181B20] p-2 flex items-center gap-2">
                          <div className="w-14 h-14 rounded-lg overflow-hidden bg-[#0d0f12] border border-white/[0.08] shrink-0">
                            {preview && <img src={preview} alt={item.label + ' texture preview'} className="w-full h-full object-cover" />}
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="block text-[10px] text-[#C4C9D0] truncate">{item.label}</span>
                            <span className="block text-[9px] text-[#858B94]">{item.custom ? 'Uploaded map' : 'Preset map'}</span>
                            <button
                              type="button"
                              onClick={() => onUploadTextureClick(activeMaterial.id, item.slot)}
                              className="mt-1 min-h-7 px-2 rounded-md border border-white/[0.08] text-[9px] text-[#C4C9D0] hover:border-[#F59E0B]/50 hover:text-white flex items-center gap-1"
                            >
                              <ImagePlus className="w-3 h-3" />
                              Change
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-2 items-center">
                    <SliderControl label="Scale U" valueDisplay={`${(activeMaterial.uvScaleX ?? activeMaterial.uvScale).toFixed(2)}×`} min={0.1} max={12} step={0.05} value={activeMaterial.uvScaleX ?? activeMaterial.uvScale} onChange={(v) => onUpdateMaterial(activeMaterial.id, { uvScaleX: v })} />
                    <SliderControl label="Scale V" valueDisplay={`${(activeMaterial.uvScaleY ?? activeMaterial.uvScale).toFixed(2)}×`} min={0.1} max={12} step={0.05} value={activeMaterial.uvScaleY ?? activeMaterial.uvScale} onChange={(v) => onUpdateMaterial(activeMaterial.id, { uvScaleY: v })} />
                    <SliderControl label="Offset U" valueDisplay={(activeMaterial.uvOffsetX ?? 0).toFixed(2)} min={-1} max={1} step={0.01} value={activeMaterial.uvOffsetX ?? 0} onChange={(v) => onUpdateMaterial(activeMaterial.id, { uvOffsetX: v })} />
                    <SliderControl label="Offset V" valueDisplay={(activeMaterial.uvOffsetY ?? 0).toFixed(2)} min={-1} max={1} step={0.01} value={activeMaterial.uvOffsetY ?? 0} onChange={(v) => onUpdateMaterial(activeMaterial.id, { uvOffsetY: v })} />
                    <SliderControl label="Rotation" valueDisplay={`${Math.round(activeMaterial.uvRotation ?? 0)}°`} min={-180} max={180} step={1} value={activeMaterial.uvRotation ?? 0} onChange={(v) => onUpdateMaterial(activeMaterial.id, { uvRotation: v })} />
                    <SliderControl label="Normal / height relief" valueDisplay={activeMaterial.normalStrength.toFixed(2)} min={0} max={4} step={0.05} value={activeMaterial.normalStrength} onChange={(v) => onUpdateMaterial(activeMaterial.id, { normalStrength: v })} />
                  </div>
                  <p className="text-[10px] leading-relaxed text-[#858B94]">
                    Height detail is currently carried by the normal map; it affects shading, not the mesh silhouette.
                  </p>
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
                      <option value={512}>512 spp</option>
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
