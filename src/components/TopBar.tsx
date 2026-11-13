import React from 'react';
import { Camera, Eye, EyeOff, FolderUp } from 'lucide-react';
import { RenderMode, RenderStats } from '../types/studio';

interface TopBarProps {
  projectName: string;
  renderMode: RenderMode;
  onRenderModeChange: (mode: RenderMode) => void;
  stats: RenderStats;
  maxSamples: number;
  zenMode: boolean;
  onToggleZen: () => void;
  onCapture: () => void;
  onImportClick: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  projectName,
  renderMode,
  onRenderModeChange,
  stats,
  maxSamples,
  zenMode,
  onToggleZen,
  onCapture,
  onImportClick,
}) => {
  if (zenMode) {
    return (
      <div className="fixed top-4 right-4 z-30 pointer-events-auto">
        <button
          type="button"
          onClick={onToggleZen}
          aria-label="Exit Zen mode and show studio controls"
          className="min-h-[44px] px-4 rounded-xl bg-[#14161A]/95 border border-white/10 text-[#F4F4F6] text-xs font-medium flex items-center gap-2 hover:bg-[#1C1F26] active:scale-[0.98] transition-transform whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Eye className="w-4 h-4 text-[#F59E0B]" />
          <span>Show Studio</span>
        </button>
      </div>
    );
  }

  return (
    <header
      className="fixed top-0 left-0 right-0 z-30 h-[56px] px-4 md:px-6 bg-[#111317]/95 border-b border-white/[0.08] flex items-center justify-between gap-4 pointer-events-auto"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      {/* Zone 1: Brand Wordmark + Quiet Project Context */}
      <div className="flex items-center gap-3 min-w-0">
        <span
          className="text-base md:text-lg font-semibold tracking-tight text-[#F4F4F6] whitespace-nowrap shrink-0"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Helios Studio
        </span>
        <span className="hidden sm:inline text-white/20" aria-hidden="true">
          /
        </span>
        <span className="hidden sm:inline text-xs font-medium text-[#9BA1A6] truncate max-w-[180px] lg:max-w-[240px]">
          {projectName}
        </span>
      </div>

      {/* Zone 2: Primary Render Engine Switcher + Real Tabular Stats */}
      <div className="flex items-center gap-5 shrink-0">
        <div
          role="group"
          aria-label="Render engine mode"
          className="flex items-center p-1 rounded-xl bg-[#0B0C0E] border border-white/[0.08]"
        >
          {(
            [
              { id: 'pbr', label: 'Live PBR' },
              { id: 'split', label: 'Split' },
              { id: 'raytrace', label: 'Ray Trace' },
            ] as const
          ).map((item) => {
            const active = renderMode === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onRenderModeChange(item.id)}
                className={`min-h-[36px] px-3 md:px-3.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-[#F59E0B] text-[#0B0C0E] font-semibold'
                    : 'text-[#9BA1A6] hover:text-[#F4F4F6]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <div
          className="hidden lg:flex items-center gap-2 text-xs text-[#9BA1A6] tabular-nums whitespace-nowrap shrink-0"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          <span>
            {renderMode === 'pbr'
              ? 'PBR'
              : `${stats.samples}/${maxSamples} spp`}
          </span>
          <span className="text-white/20" aria-hidden="true">
            ·
          </span>
          <span>{stats.frameTimeMs} ms</span>
          <span className="text-white/20" aria-hidden="true">
            ·
          </span>
          <span>{(stats.triangles / 1000).toFixed(1)}k tris</span>
        </div>
      </div>

      {/* Zone 3: Import 3D, Capture & Zen */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onImportClick}
          className="min-h-[44px] px-3 rounded-xl bg-[#1A1D23] hover:bg-[#232730] border border-white/[0.08] text-xs font-medium text-[#F4F4F6] flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <FolderUp className="w-4 h-4 text-[#F59E0B]" />
          <span className="hidden md:inline">Import 3D</span>
        </button>

        <button
          type="button"
          onClick={onCapture}
          className="min-h-[44px] px-3.5 rounded-xl bg-[#F59E0B] hover:bg-[#FBBF24] text-xs font-semibold text-[#0B0C0E] flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Camera className="w-4 h-4" />
          <span className="hidden sm:inline">Capture</span>
        </button>

        <button
          type="button"
          onClick={onToggleZen}
          aria-label="Hide studio controls"
          title="Hide UI"
          className="min-h-[44px] min-w-[44px] rounded-xl bg-[#1A1D23] hover:bg-[#232730] border border-white/[0.08] text-[#9BA1A6] hover:text-[#F4F4F6] flex items-center justify-center transition-colors shrink-0 cursor-pointer"
        >
          <EyeOff className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
