import React, { useState } from 'react';

import { RoundedCornerOutlined } from '@mui/icons-material';
import { Grid } from '@mui/material';

import EmailLayoutPropsSchema, {
  EmailLayoutProps,
} from '../../documents/blocks/EmailLayout/EmailLayoutPropsSchema';

import BaseSidebarPanel from '../InspectorDrawer/ConfigurationPanel/input-panels/helpers/BaseSidebarPanel';
import ColorInput, { NullableColorInput } from '../InspectorDrawer/ConfigurationPanel/input-panels/helpers/inputs/ColorInput';
import { NullableFontFamily } from '../InspectorDrawer/ConfigurationPanel/input-panels/helpers/inputs/FontFamily';
import SliderInput from '../InspectorDrawer/ConfigurationPanel/input-panels/helpers/inputs/SliderInput';

type StylesPanelDialogProps = {
  document: Record<string, unknown>;
  setDocument: (doc: Record<string, unknown>) => void;
};

export default function StylesPanelDialog({ document, setDocument }: StylesPanelDialogProps) {
  const block = document.root as any;
  if (!block) {
    return <p>Block not found</p>;
  }

  const { data, type } = block;
  if (type !== 'EmailLayout') {
    throw new Error('Expected "root" element to be of type EmailLayout');
  }

  const [, setErrors] = useState<any>(null);

  const updateData = (d: unknown) => {
    const res = EmailLayoutPropsSchema.safeParse(d);
    if (res.success) {
      setDocument({ root: { type, data: res.data } });
      setErrors(null);
    } else {
      setErrors(res.error);
    }
  };

  return (
    <BaseSidebarPanel title="Global">
      {/* Backdrop color and Text Color side-by-side */}
      <Grid container spacing={2}>
        <Grid item xs={6} sx={{ width: '100%' }}>
          <ColorInput
            label="Backdrop color"
            defaultValue={data.backdropColor ?? '#F5F5F5'}
            onChange={(backdropColor) => updateData({ ...data, backdropColor })}
          />
        </Grid>
        <Grid item xs={6} sx={{ width: '100%' }}>
          <ColorInput
            label="Text color"
            defaultValue={data.textColor ?? '#262626'}
            onChange={(textColor) => updateData({ ...data, textColor })}
          />
        </Grid>
      </Grid>

      {/* Canvas Color and Canvas Border Color side-by-side */}
      <Grid container spacing={2}>
        <Grid item xs={6} sx={{ width: '100%' }}>
          <ColorInput
            label="Canvas color"
            defaultValue={data.canvasColor ?? '#FFFFFF'}
            onChange={(canvasColor) => updateData({ ...data, canvasColor })}
          />
        </Grid>
        <Grid item xs={6} sx={{ width: '100%' }}>
          <NullableColorInput
            label="Canvas border color"
            defaultValue={data.borderColor ?? null}
            onChange={(borderColor) => updateData({ ...data, borderColor })}
          />
        </Grid>
      </Grid>

      {/* Other controls */}
      <SliderInput
        iconLabel={<RoundedCornerOutlined />}
        units="px"
        step={4}
        marks
        min={0}
        max={48}
        label="Canvas border radius"
        defaultValue={data.borderRadius ?? 0}
        onChange={(borderRadius) => updateData({ ...data, borderRadius })}
      />
      <NullableFontFamily
        label="Font family"
        defaultValue="MODERN_SANS"
        onChange={(fontFamily) => updateData({ ...data, fontFamily })}
      />
    </BaseSidebarPanel>
  );
}

