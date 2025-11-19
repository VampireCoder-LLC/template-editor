import React, { useState } from 'react';

import { Box, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { FormatBold } from '@mui/icons-material';

type Props = {
  label: string;
  defaultValue: string;
  onChange: (value: string) => void;
};
export default function FontWeightInput({ label, defaultValue, onChange }: Props) {
  const [isBold, setIsBold] = useState(defaultValue === 'bold' || defaultValue === '700');

  const handleToggle = () => {
    const newIsBold = !isBold;
    setIsBold(newIsBold);
    onChange(newIsBold ? 'bold' : 'normal');
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography variant="body2" sx={{ minWidth: '80px' }}>
        {label}
      </Typography>
      <ToggleButtonGroup value={isBold ? 'bold' : 'normal'} exclusive>
        <ToggleButton
          value="bold"
          onClick={handleToggle}
          sx={{
            textTransform: 'none',
            fontSize: '0.875rem',
            padding: '6px 12px',
          }}
        >
          <FormatBold sx={{ fontSize: '1.25rem' }} />
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}
