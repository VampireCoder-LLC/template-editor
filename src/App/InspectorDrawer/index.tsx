import React from 'react';

import { Box, Drawer, Tab, Tabs } from '@mui/material';

import { setSidebarTab, useInspectorDrawerOpen, useSelectedSidebarTab } from '../../documents/editor/EditorContext';

import StylesPanel from './StylesPanel';
import TemplateFieldsSection, { TemplateField } from './TemplateFieldsSection';

export const INSPECTOR_DRAWER_WIDTH = 320;

interface InspectorDrawerProps {
  templateFields?: (string | TemplateField)[];
}

export default function InspectorDrawer({ templateFields = [] }: InspectorDrawerProps) {
  const selectedSidebarTab = useSelectedSidebarTab();
  const inspectorDrawerOpen = useInspectorDrawerOpen();

  const renderCurrentSidebarPanel = () => {
    switch (selectedSidebarTab) {
      case 'styles':
        return <StylesPanel />;
    }
  };

  return (
    <Drawer
      variant="persistent"
      anchor="right"
      open={inspectorDrawerOpen}
      sx={{
        width: inspectorDrawerOpen ? INSPECTOR_DRAWER_WIDTH : 0,
      }}
    >
      <Box sx={{ width: INSPECTOR_DRAWER_WIDTH, height: 49, borderBottom: 1, borderColor: 'divider' }}>
        <Box px={2}>
          <Tabs value={selectedSidebarTab} onChange={(_, v) => setSidebarTab(v)}>
            <Tab value="styles" label="Styles" />
          </Tabs>
        </Box>
      </Box>
      <Box sx={{ width: INSPECTOR_DRAWER_WIDTH, height: 'calc(100% - 49px)', overflow: 'auto' }}>
        {/* Template Fields Section - Always at the top */}
        {templateFields.length > 0 && <TemplateFieldsSection fields={templateFields} />}

        {/* Main Panel Content */}
        {renderCurrentSidebarPanel()}
      </Box>
    </Drawer>
  );
}
