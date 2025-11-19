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
  Stack,
  ToggleButton,
} from '@mui/material';

import EmailLayoutPropsSchema, {
  EmailLayoutProps,
} from '../../../../documents/blocks/EmailLayout/EmailLayoutPropsSchema';
import { useUndoRedoControls } from '../../UndoRedoContext';

import BaseSidebarPanel from './helpers/BaseSidebarPanel';
import ColorInputWithUndo from './helpers/inputs/ColorInput/ColorInputWithUndo';
import { NullableFontFamily } from './helpers/inputs/FontFamily';
import RadioGroupInput from './helpers/inputs/RadioGroupInput';
import SliderInputWithUndo from './helpers/inputs/SliderInputWithUndo';

type EmailLayoutSidebarFieldsProps = {
  data: EmailLayoutProps;
  setData: (v: EmailLayoutProps) => void;
};

export default function EmailLayoutSidebarFields({ data, setData }: EmailLayoutSidebarFieldsProps) {
  const [, setErrors] = useState<Zod.ZodError | null>(null);
  const [showWidthWarning, setShowWidthWarning] = useState(false);
  const [pendingWidth, setPendingWidth] = useState<string | null>(null);

  // Get undo/redo controls from context (provided by InspectorDrawer)
  const undoRedoControls = useUndoRedoControls();

  // Update data immediately (live-sync) without pushing to undo stack
  const updateDataLive = (d: unknown) => {
    const res = EmailLayoutPropsSchema.safeParse(d);
    if (res.success) {
      setData(res.data);
      setErrors(null);
    } else {
      setErrors(res.error);
    }
  };

  // Update data and push to undo stack immediately (for discrete changes like dropdowns)
  const updateDataWithUndo = (d: unknown) => {
    const res = EmailLayoutPropsSchema.safeParse(d);
    if (res.success) {
      // Push current state to undo stack before updating
      if (undoRedoControls) {
        undoRedoControls.pushToUndoStack({ ...data });
      }
      setData(res.data);
      setErrors(null);
    } else {
      setErrors(res.error);
    }
  };

  // Called when user starts editing a control
  const handleStartEditing = () => {
    if (undoRedoControls) {
      undoRedoControls.startEditing({ ...data });
    }
  };

  // Called when user finishes editing a control
  const handleFinishEditing = () => {
    if (undoRedoControls) {
      undoRedoControls.finishEditing();
    }
  };

  const handleWidthChange = (contentWidth: string) => {
    if (contentWidth === '640' || contentWidth === '700') {
      setPendingWidth(contentWidth);
      setShowWidthWarning(true);
    } else {
      updateDataWithUndo({ ...data, contentWidth });
    }
  };

  const handleConfirmWidth = () => {
    if (pendingWidth) {
      updateDataWithUndo({ ...data, contentWidth: pendingWidth });
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
      {/* Color pickers grouped together with reduced spacing */}
      <Stack spacing={2}>
        {/* Backdrop color and Text Color side-by-side */}
        <Grid container spacing={2} sx={{ ml: 0 }}>
          <Grid item xs={6} sx={{ width: '100%', pl: '0 !important' }}>
            <ColorInputWithUndo
              nullable={false}
              label="Backdrop color"
              defaultValue={data.backdropColor ?? '#F5F5F5'}
              onChange={(backdropColor) => updateDataLive({ ...data, backdropColor })}
              onStartEditing={handleStartEditing}
              onFinishEditing={handleFinishEditing}
            />
          </Grid>
          <Grid item xs={6} sx={{ width: '100%' }}>
            <ColorInputWithUndo
              nullable={false}
              label="Text color"
              defaultValue={data.textColor ?? '#262626'}
              onChange={(textColor) => updateDataLive({ ...data, textColor })}
              onStartEditing={handleStartEditing}
              onFinishEditing={handleFinishEditing}
            />
          </Grid>
        </Grid>

        {/* Canvas Color and Canvas Border Color side-by-side */}
        <Grid container spacing={2} sx={{ ml: 0 }}>
          <Grid item xs={6} sx={{ width: '100%', pl: '0 !important' }}>
            <ColorInputWithUndo
              nullable={false}
              label="Canvas color"
              defaultValue={data.canvasColor ?? '#FFFFFF'}
              onChange={(canvasColor) => updateDataLive({ ...data, canvasColor })}
              onStartEditing={handleStartEditing}
              onFinishEditing={handleFinishEditing}
            />
          </Grid>
          <Grid item xs={6} sx={{ width: '100%' }}>
            <ColorInputWithUndo
              nullable={true}
              label="Canvas border color"
              defaultValue={data.borderColor ?? null}
              onChange={(borderColor) => updateDataLive({ ...data, borderColor })}
              onStartEditing={handleStartEditing}
              onFinishEditing={handleFinishEditing}
            />
          </Grid>
        </Grid>
      </Stack>

      {/* Other controls */}
      <SliderInputWithUndo
        iconLabel={<RoundedCornerOutlined />}
        units="px"
        step={4}
        marks
        min={0}
        max={48}
        label="Canvas border radius"
        defaultValue={data.borderRadius ?? 0}
        onChange={(borderRadius) => updateDataLive({ ...data, borderRadius })}
        onStartEditing={handleStartEditing}
        onFinishEditing={handleFinishEditing}
      />
      <ColorInputWithUndo
        nullable={true}
        label="Canvas shadow color"
        defaultValue={data.shadowColor ?? null}
        onChange={(shadowColor) => updateDataLive({ ...data, shadowColor })}
        onStartEditing={handleStartEditing}
        onFinishEditing={handleFinishEditing}
      />
      <SliderInputWithUndo
        iconLabel={<BlurOnOutlined />}
        units="px"
        step={2}
        marks
        min={0}
        max={32}
        label="Canvas shadow size"
        defaultValue={data.shadowSize ?? 16}
        onChange={(shadowSize) => updateDataLive({ ...data, shadowSize })}
        onStartEditing={handleStartEditing}
        onFinishEditing={handleFinishEditing}
      />
      <SliderInputWithUndo
        iconLabel={<OpacityOutlined />}
        units=""
        step={0.1}
        marks
        min={0}
        max={1}
        label="Canvas shadow opacity"
        defaultValue={data.shadowOpacity ?? 0.15}
        onChange={(shadowOpacity) => updateDataLive({ ...data, shadowOpacity })}
        onStartEditing={handleStartEditing}
        onFinishEditing={handleFinishEditing}
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
        defaultValue={data.fontFamily ?? 'MODERN_SANS'}
        onChange={(fontFamily) => updateDataWithUndo({ ...data, fontFamily })}
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
