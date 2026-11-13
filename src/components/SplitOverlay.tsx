import React, { useRef } from 'react';
import { MoveHorizontal } from 'lucide-react';

interface SplitOverlayProps {
  splitRatio: number;
  onChange: (ratio: number) => void;
}

export const SplitOverlay: React.FC<SplitOverlayProps> = ({ splitRatio, onChange }) => {
  const draggingRef = useRef(false);

  const updateFromClientX = (clientX: number) => {
    const w = window.innerWidth || 1;
    const ratio = Math.max(0.08, Math.min(0.92, clientX / w));
    onChange(ratio);
  };

  return (
    <div className="fixed inset-0 z-20 pointer-events-none select-none">
      {/* Subtle labels in upper viewport corners */}
      <div className="fixed top-[68px] left-4 px-2.5 py-1 rounded-md bg-[#111317]/90 border border-white/10 text-[11px] font-medium text-[#9BA1A6] tracking-wide">
        Live PBR Preview
      </div>
      <div className="fixed top-[68px] right-4 px-2.5 py-1 rounded-md bg-[#111317]/90 border border-white/10 text-[11px] font-medium text-[#F59E0B] tracking-wide">
        GPU Ray Traced
      </div>

      {/* Vertical Divider Line + Touch Handle */}
      <div
        className="fixed top-[56px] bottom-0 w-px bg-white/30"
        style={{ left: `${splitRatio * 100}%` }}
      >
        <button
          type="button"
          aria-label="Drag to compare Live PBR and GPU Ray Traced views"
          onPointerDown={(e) => {
            draggingRef.current = true;
            e.currentTarget.setPointerCapture(e.pointerId);
            updateFromClientX(e.clientX);
          }}
          onPointerMove={(e) => {
            if (!draggingRef.current) return;
            updateFromClientX(e.clientX);
          }}
          onPointerUp={(e) => {
            draggingRef.current = false;
            e.currentTarget.releasePointerCapture(e.pointerId);
          }}
          onPointerCancel={() => {
            draggingRef.current = false;
          }}
          className="pointer-events-auto absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#14161A] border border-white/25 text-[#F59E0B] shadow-lg flex items-center justify-center touch-none cursor-ew-resize active:scale-95 transition-transform"
        >
          <MoveHorizontal className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
