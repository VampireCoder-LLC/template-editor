import React from 'react';

import { SaveOutlined } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';

interface SaveButtonProps {
  onSave?: () => void;
}

export default function SaveButton({ onSave }: SaveButtonProps) {
  const handleClick = () => {
    if (onSave) {
      onSave();
    }
  };

  return (
    <Tooltip title="Save template">
      <IconButton onClick={handleClick}>
        <SaveOutlined fontSize="small" />
      </IconButton>
    </Tooltip>
  );
}

