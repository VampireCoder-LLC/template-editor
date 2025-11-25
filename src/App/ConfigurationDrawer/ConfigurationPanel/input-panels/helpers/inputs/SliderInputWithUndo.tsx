import React, { useEffect, useState } from 'react';

import { Box, InputLabel, Slider, Stack, Typography } from '@mui/material';

type SliderInputProps = {
  label: string;
  iconLabel: React.ReactElement;

  step?: number;
  marks?: boolean;
  units: string;
  min?: number;
  max?: number;

  defaultValue: number;
  onChange: (v: number) => void;
  onStartEditing?: () => void;
  onFinishEditing?: () => void;
};

export default function SliderInputWithUndo({
  label,
  defaultValue,
  onChange,
  onStartEditing,
  onFinishEditing,
  iconLabel,
  units,
  ...props
}: SliderInputProps) {
  const [value, setValue] = useState(defaultValue);

  // Sync internal state when defaultValue changes (e.g., from undo/redo)
  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  return (
    <Stack spacing={1} alignItems="flex-start">
      <InputLabel shrink>{label}</InputLabel>
      <Stack direction="row" alignItems="center" spacing={2} justifyContent="space-between" width="100%">
        <Box sx={{ minWidth: 24, lineHeight: 1, flexShrink: 0 }}>{iconLabel}</Box>
        <Slider
          {...props}
          value={value}
          onChange={(_, newValue: unknown) => {
            if (typeof newValue !== 'number') {
              throw new Error('SliderInputWithUndo values can only receive numeric values');
            }
            setValue(newValue);
            onChange(newValue);
          }}
          onMouseDown={() => {
            // Call onStartEditing when user starts dragging the slider
            if (onStartEditing) {
              onStartEditing();
            }
          }}
          onChangeCommitted={() => {
            // Call onFinishEditing when user releases the slider
            if (onFinishEditing) {
              onFinishEditing();
            }
          }}
        />
        <Box sx={{ minWidth: 32, textAlign: 'right', flexShrink: 0 }}>
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1 }}>
            {value}
            {units}
          </Typography>
        </Box>
      </Stack>
    </Stack>
  );
}

