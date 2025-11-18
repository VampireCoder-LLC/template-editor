import React, { useState } from 'react';

import { RoundedCornerOutlined } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  ToggleButton,
} from '@mui/material';

import EmailLayoutPropsSchema, {
  EmailLayoutProps,
} from '../../../../documents/blocks/EmailLayout/EmailLayoutPropsSchema';

import BaseSidebarPanel from './helpers/BaseSidebarPanel';
import ColorInput, { NullableColorInput } from './helpers/inputs/ColorInput';
import { NullableFontFamily } from './helpers/inputs/FontFamily';
import RadioGroupInput from './helpers/inputs/RadioGroupInput';
import SliderInput from './helpers/inputs/SliderInput';

type EmailLayoutSidebarFieldsProps = {
  data: EmailLayoutProps;
  setData: (v: EmailLayoutProps) => void;
};
export default function EmailLayoutSidebarFields({ data, setData }: EmailLayoutSidebarFieldsProps) {
  const [, setErrors] = useState<Zod.ZodError | null>(null);
  const [showWidthWarning, setShowWidthWarning] = useState(false);
  const [pendingWidth, setPendingWidth] = useState<string | null>(null);

  const updateData = (d: unknown) => {
    const res = EmailLayoutPropsSchema.safeParse(d);
    if (res.success) {
      setData(res.data);
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
      <ColorInput
        label="Backdrop color"
        defaultValue={data.backdropColor ?? '#F5F5F5'}
        onChange={(backdropColor) => updateData({ ...data, backdropColor })}
      />
      <ColorInput
        label="Canvas color"
        defaultValue={data.canvasColor ?? '#FFFFFF'}
        onChange={(canvasColor) => updateData({ ...data, canvasColor })}
      />
      <NullableColorInput
        label="Canvas border color"
        defaultValue={data.borderColor ?? null}
        onChange={(borderColor) => updateData({ ...data, borderColor })}
      />
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
      <ColorInput
        label="Text color"
        defaultValue={data.textColor ?? '#262626'}
        onChange={(textColor) => updateData({ ...data, textColor })}
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
