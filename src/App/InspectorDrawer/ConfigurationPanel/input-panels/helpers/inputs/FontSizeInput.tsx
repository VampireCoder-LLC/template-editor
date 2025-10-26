import React, { useState } from 'react';

import { MenuItem, TextField } from '@mui/material';

const FONT_SIZES = [10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 64];

type Props = {
  label: string;
  defaultValue: number | null | undefined;
  onChange: (v: number) => void;
};
export default function FontSizeInput({ label, defaultValue, onChange }: Props) {
  const [value, setValue] = useState(defaultValue ?? 16);
  const handleChange = (newValue: string) => {
    const numValue = parseInt(newValue);
    setValue(numValue);
    onChange(numValue);
  };
  return (
    <TextField
      select
      size="small"
      label={label}
      value={value.toString()}
      onChange={(e) => handleChange(e.target.value)}
      variant="outlined"
      fullWidth
      sx={{
        '& .MuiOutlinedInput-root': {
          fontSize: '0.875rem',
        },
      }}
    >
      {FONT_SIZES.map((size) => (
        <MenuItem key={size} value={size}>
          {size}px
        </MenuItem>
      ))}
    </TextField>
  );
}
