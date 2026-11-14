import React from 'react';
import { MaterialPreset } from '../types/studio';
import { createMaterialPreviewSvg } from '../utils/materialPreviewSvg';

export const MaterialPreview: React.FC<{ preset: MaterialPreset; size?: number }> = ({
  preset,
  size = 68,
}) => (
  <div
    className="shrink-0"
    style={{ width: size, height: size }}
    aria-hidden="true"
    dangerouslySetInnerHTML={{ __html: createMaterialPreviewSvg(preset, 'helios-preview') }}
  />
);
