import React from 'react';

import { SettingsOutlined } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';

import { setSelectedBlockId } from '../../documents/editor/EditorContext';

export default function SettingsButton() {
  const handleOpen = () => {
    // Select the root EmailLayout block to open the Inspector Drawer with global settings
    setSelectedBlockId('root');
  };

  return (
    <Tooltip title="Global Settings">
      <IconButton onClick={handleOpen}>
        <SettingsOutlined fontSize="small" />
      </IconButton>
    </Tooltip>
  );
}

