import React from 'react';

import { AppRegistrationOutlined, LastPageOutlined } from '@mui/icons-material';
import { IconButton } from '@mui/material';

import { toggleConfigurationDrawerOpen, useConfigurationDrawerOpen } from '../../documents/editor/EditorContext';

export default function ToggleConfigurationPanelButton() {
  const configurationDrawerOpen = useConfigurationDrawerOpen();

  const handleClick = () => {
    toggleConfigurationDrawerOpen();
  };
  if (configurationDrawerOpen) {
    return (
      <IconButton onClick={handleClick}>
        <LastPageOutlined fontSize="small" />
      </IconButton>
    );
  }
  return (
    <IconButton onClick={handleClick}>
      <AppRegistrationOutlined fontSize="small" />
    </IconButton>
  );
}
