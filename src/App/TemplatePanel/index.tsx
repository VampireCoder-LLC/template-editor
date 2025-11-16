import React from 'react';

import { MonitorOutlined, PhoneIphoneOutlined } from '@mui/icons-material';
import { Box, Stack, SxProps, ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material';
import { Reader } from '../../email-builder';

import EditorBlock from '../../documents/editor/EditorBlock';
import {
  setSelectedScreenSize,
  useDocument,
  useSelectedMainTab,
  useSelectedScreenSize,
} from '../../documents/editor/EditorContext';
import { TemplateFieldsProvider } from '../../documents/editor/TemplateFieldsContext';
import InspectorDrawer from '../InspectorDrawer';
import DownloadJson from './DownloadJson';
import HtmlPanel from './HtmlPanel';
import ImportJson from './ImportJson';
import JsonPanel from './JsonPanel';
import MainTabsGroup from './MainTabsGroup';
import SaveButton from './SaveButton';
import SettingsButton from './SettingsButton';
import SubjectInput from './SubjectInput';

/**
 * Output object passed to onSave callback
 */
export interface TemplateSaveOutput {
  /** Rendered HTML output of the template */
  htmlOutput: string;
  /** JSON representation of the template */
  jsonOutput: Record<string, unknown>;
  /** Email subject line */
  subjectOutput: string;
}

/**
 * Template field for Handlebars insertion
 */
export interface TemplateField {
  /** Field name/identifier */
  name: string;
  /** Optional display label for the field */
  label?: string;
  /** Optional description of what the field represents */
  description?: string;
}

/**
 * Props for the TemplatePanel component
 */
export interface TemplatePanelProps {
  /** Show JSON tab in the editor (default: false) */
  showJsonTab?: boolean;
  /** Show save button (default: true) */
  showSaveButton?: boolean;
  /** Show download button (default: true) */
  showDownloadButton?: boolean;
  /** Show import button (default: true) */
  showImportButton?: boolean;
  /** Show settings button (default: true) */
  showSettingsButton?: boolean;
  /** Template fields available for insertion (default: []) */
  templateFields?: (string | TemplateField)[];
  /** Callback fired when user saves the template */
  onSave?: () => void;
}

export default function TemplatePanel({
  showJsonTab = false,
  showSaveButton = true,
  showDownloadButton = true,
  showImportButton = true,
  showSettingsButton = true,
  templateFields = [],
  onSave,
}: TemplatePanelProps = {}) {
  const document = useDocument();
  const selectedMainTab = useSelectedMainTab();
  const selectedScreenSize = useSelectedScreenSize();

  let mainBoxSx: SxProps = {
    height: '100%',
      boxShadow:
        'rgba(33, 36, 67, 0.04) 0px 10px 20px, rgba(33, 36, 67, 0.04) 0px 2px 6px, rgba(33, 36, 67, 0.04) 0px 0px 1px',
  };

  if (selectedScreenSize === 'mobile') {
    mainBoxSx = {
      ...mainBoxSx,
      margin: '32px auto',
      width: 370,
      height: 800,
    };
  }

  const handleScreenSizeChange = (_: unknown, value: unknown) => {
    switch (value) {
      case 'mobile':
      case 'desktop':
        setSelectedScreenSize(value);
        return;
      default:
        setSelectedScreenSize('desktop');
    }
  };

  const renderMainPanel = () => {
    switch (selectedMainTab) {
      case 'editor':
        return (
          <Box sx={mainBoxSx}>
            <EditorBlock id="root" />
          </Box>
        );
      case 'preview':
        return (
          <Box sx={mainBoxSx}>
            <Reader document={document} rootBlockId="root" />
          </Box>
        );
      case 'html':
        return <HtmlPanel />;
      case 'json':
        return <JsonPanel />;
    }
  };

  return (
    <TemplateFieldsProvider fields={templateFields}>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
        <Stack
          sx={{
            height: 49,
            borderBottom: 1,
            borderColor: 'divider',
            backgroundColor: 'white',
            position: 'sticky',
            top: 0,
            zIndex: 'appBar',
            px: 1,
          }}
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack px={2} direction="row" gap={2} width="100%" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={2}>
              <MainTabsGroup showJsonTab={showJsonTab} />
              <SubjectInput />
            </Stack>
            <Stack direction="row" spacing={2}>
              {showSettingsButton && <SettingsButton />}
              {showSaveButton && <SaveButton onSave={onSave} />}
              {showDownloadButton && <DownloadJson />}
              {showImportButton && <ImportJson />}
              <ToggleButtonGroup value={selectedScreenSize} exclusive size="small" onChange={handleScreenSizeChange}>
                <ToggleButton value="desktop">
                  <Tooltip title="Desktop view">
                    <MonitorOutlined fontSize="small" />
                  </Tooltip>
                </ToggleButton>
                <ToggleButton value="mobile">
                  <Tooltip title="Mobile view">
                    <PhoneIphoneOutlined fontSize="small" />
                  </Tooltip>
                </ToggleButton>
              </ToggleButtonGroup>
            </Stack>
          </Stack>
        </Stack>
        <Box sx={{ height: 'calc(100vh - 49px)', overflow: 'auto', minWidth: 370 }}>{renderMainPanel()}</Box>
        <InspectorDrawer templateFields={templateFields} />
      </Box>
    </TemplateFieldsProvider>
  );
}
