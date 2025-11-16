import React from 'react';

import { Box, Drawer, Tab, Tabs } from '@mui/material';

import { setSidebarTab, useInspectorDrawerOpen, useSelectedBlockId, useSelectedSidebarTab } from '../../documents/editor/EditorContext';

import ConfigurationPanel from './ConfigurationPanel';
import TemplateFieldsSection, { TemplateField } from './TemplateFieldsSection';

export const INSPECTOR_DRAWER_WIDTH = 320;

interface InspectorDrawerProps {
  templateFields?: (string | TemplateField)[];
}

export default function InspectorDrawer({ templateFields = [] }: InspectorDrawerProps) {
  const selectedSidebarTab = useSelectedSidebarTab();
  const inspectorDrawerOpen = useInspectorDrawerOpen();
  const selectedBlockId = useSelectedBlockId();

  const renderCurrentSidebarPanel = () => {
    switch (selectedSidebarTab) {
      case 'block-configuration':
        return <ConfigurationPanel />;
      case 'template-fields':
        return templateFields.length > 0 ? <TemplateFieldsSection fields={templateFields} /> : null;
    }
  };

  return (
    <Drawer
      variant="persistent"
      anchor="right"
      open={inspectorDrawerOpen}
      sx={{
        width: inspectorDrawerOpen ? INSPECTOR_DRAWER_WIDTH : 0,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: INSPECTOR_DRAWER_WIDTH,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
          position: 'absolute',
          height: '100%',
        },
      }}
    >
      <Box sx={{ width: INSPECTOR_DRAWER_WIDTH, height: 49, borderBottom: 1, borderColor: 'divider' }}>
        <Box px={2}>
          <Tabs value={selectedSidebarTab} onChange={(_, v) => setSidebarTab(v)}>
            {selectedBlockId && <Tab value="block-configuration" label="Configuration" />}
            {selectedBlockId && templateFields.length > 0 && <Tab value="template-fields" label="Template Fields" />}
          </Tabs>
        </Box>
      </Box>
      <Box sx={{ width: INSPECTOR_DRAWER_WIDTH, height: 'calc(100% - 49px)', overflow: 'auto' }}>
        {/* Main Panel Content */}
        {renderCurrentSidebarPanel()}
      </Box>
    </Drawer>
  );
}
