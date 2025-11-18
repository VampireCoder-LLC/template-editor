import { Box, Tab, Tabs } from '@mui/material';

import { setSidebarTab, useInspectorDrawerOpen, useSelectedBlockId, useSelectedSidebarTab, useDocument } from '../../documents/editor/EditorContext';

import ConfigurationPanel from './ConfigurationPanel';
import TemplateFieldsSection, { TemplateField } from './TemplateFieldsSection';

export const INSPECTOR_DRAWER_WIDTH = 400;

interface InspectorDrawerProps {
  templateFields?: (string | TemplateField)[];
}

export default function InspectorDrawer({ templateFields = [] }: InspectorDrawerProps) {
  const selectedSidebarTab = useSelectedSidebarTab();
  const inspectorDrawerOpen = useInspectorDrawerOpen();
  const selectedBlockId = useSelectedBlockId();
  const document = useDocument();

  // Get the selected block's type
  const selectedBlock = selectedBlockId ? document[selectedBlockId] : null;
  const selectedBlockType = selectedBlock?.type;

  // Only show Template Fields tab for Html, Text, and Heading blocks
  const showTemplateFieldsTab =
    selectedBlockId &&
    templateFields.length > 0 &&
    (selectedBlockType === 'Html' || selectedBlockType === 'Text' || selectedBlockType === 'Heading');

  const renderCurrentSidebarPanel = () => {
    switch (selectedSidebarTab) {
      case 'block-configuration':
        return <ConfigurationPanel />;
      case 'template-fields':
        return templateFields.length > 0 ? <TemplateFieldsSection fields={templateFields} /> : null;
    }
  };

  // Use absolute positioning to overlay the drawer without affecting canvas width
  // This prevents the editor canvas from shifting when the drawer toggles
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        right: inspectorDrawerOpen ? 0 : -INSPECTOR_DRAWER_WIDTH,
        width: INSPECTOR_DRAWER_WIDTH,
        height: '100%',
        borderLeft: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        transition: 'right 0.3s ease-in-out',
        zIndex: 10,
        boxShadow: inspectorDrawerOpen ? '-2px 0 8px rgba(0, 0, 0, 0.1)' : 'none',
      }}
    >
      <Box sx={{ height: 49, borderBottom: 1, borderColor: 'divider' }}>
        <Box px={2}>
          <Tabs value={selectedSidebarTab} onChange={(_, v) => setSidebarTab(v)}>
            {selectedBlockId && <Tab value="block-configuration" label="Configuration" />}
            {showTemplateFieldsTab && <Tab value="template-fields" label="Template Fields" />}
          </Tabs>
        </Box>
      </Box>
      <Box
        sx={{
          height: 'calc(100% - 49px)',
          overflowX: 'hidden',
          overflowY: 'auto',
          // Custom scrollbar styling - thin, auto-hide, fade-out
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '3px',
            transition: 'background 0.3s ease',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: 'rgba(0, 0, 0, 0.4)',
          },
          // Firefox scrollbar styling
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(0, 0, 0, 0.2) transparent',
        }}
      >
        {/* Main Panel Content */}
        {renderCurrentSidebarPanel()}
      </Box>
    </Box>
  );
}
