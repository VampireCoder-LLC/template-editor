import React, { useState } from 'react';

import { BlurOnOutlined, OpacityOutlined, RoundedCornerOutlined } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  ToggleButton,
} from '@mui/material';

import EmailLayoutPropsSchema, {
  EmailLayoutProps,
} from '../../documents/blocks/EmailLayout/EmailLayoutPropsSchema';

import BaseSidebarPanel from '../InspectorDrawer/ConfigurationPanel/input-panels/helpers/BaseSidebarPanel';
import ColorInput, { NullableColorInput } from '../InspectorDrawer/ConfigurationPanel/input-panels/helpers/inputs/ColorInput';
import { NullableFontFamily } from '../InspectorDrawer/ConfigurationPanel/input-panels/helpers/inputs/FontFamily';
import RadioGroupInput from '../InspectorDrawer/ConfigurationPanel/input-panels/helpers/inputs/RadioGroupInput';
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
  const [showWidthWarning, setShowWidthWarning] = useState(false);
  const [pendingWidth, setPendingWidth] = useState<string | null>(null);

  const updateData = (d: unknown) => {
    const res = EmailLayoutPropsSchema.safeParse(d);
    if (res.success) {
      setDocument({ root: { type, data: res.data } });
      setErrors(null);
    } else {
      setErrors(res.error);
    }
  };

  const handleWidthChange = (contentWidth: string) => {
    if (contentWidth === '640' || contentWidth === '700') {
      setPendingWidth(contentWidth);
      setShowWidthWarning(true);
    } else {
      updateData({ ...data, contentWidth });
    }
  };

  const handleConfirmWidth = () => {
    if (pendingWidth) {
      updateData({ ...data, contentWidth: pendingWidth });
    }
    setShowWidthWarning(false);
    setPendingWidth(null);
  };

  const handleCancelWidth = () => {
    setShowWidthWarning(false);
    setPendingWidth(null);
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
      <NullableColorInput
        label="Canvas shadow color"
        defaultValue={data.shadowColor ?? null}
        onChange={(shadowColor) => updateData({ ...data, shadowColor })}
      />
      <SliderInput
        iconLabel={<BlurOnOutlined />}
        units="px"
        step={2}
        marks
        min={0}
        max={32}
        label="Canvas shadow size"
        defaultValue={data.shadowSize ?? 16}
        onChange={(shadowSize) => updateData({ ...data, shadowSize })}
      />
      <SliderInput
        iconLabel={<OpacityOutlined />}
        units=""
        step={0.1}
        marks
        min={0}
        max={1}
        label="Canvas shadow opacity"
        defaultValue={data.shadowOpacity ?? 0.15}
        onChange={(shadowOpacity) => updateData({ ...data, shadowOpacity })}
      />
      <RadioGroupInput
        label="Content Width"
        defaultValue={data.contentWidth ?? '600'}
        onChange={handleWidthChange}
      >
        <ToggleButton value="600">600px</ToggleButton>
        <ToggleButton value="640">640px</ToggleButton>
        <ToggleButton value="700">700px</ToggleButton>
      </RadioGroupInput>
      <NullableFontFamily
        label="Font family"
        defaultValue="MODERN_SANS"
        onChange={(fontFamily) => updateData({ ...data, fontFamily })}
      />

      <Dialog
        open={showWidthWarning}
        onClose={handleCancelWidth}
        PaperProps={{
          sx: {
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle>Content Width Warning</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Choosing a width larger than 600px may cause layout issues in some email clients. Are you sure you want
            to proceed?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelWidth}>Cancel</Button>
          <Button onClick={handleConfirmWidth} variant="contained" color="primary">
            Proceed
          </Button>
        </DialogActions>
      </Dialog>
    </BaseSidebarPanel>
  );
}

