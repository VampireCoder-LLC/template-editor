import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import { renderToStaticMarkup } from './email-builder';
import { setDocument, useDocument } from './documents/editor/EditorContext';
import TemplatePanel from './App/TemplatePanel';
import TemplateEditorProvider from './TemplateEditorProvider';
import { TEditorConfiguration } from './documents/editor/core';

/**
 * Output object passed to onSave callback
 */
export interface TemplateSaveOutput {
  /** Rendered HTML output of the template */
  htmlOutput: string;
  /** JSON representation of the template */
  jsonOutput: Record<string, any>;
  /** Email subject line */
  subjectOutput: string;
}

/**
 * Props for the TemplateEditor component
 */
export interface TemplateEditorProps {
  /** Initial JSON template data to load */
  initialJson?: TEditorConfiguration;
  /** Initial HTML content (optional) */
  initialHtmlContent?: string;
  /** Callback fired when user saves the template */
  onSave?: (output: TemplateSaveOutput) => void;
  /** Show JSON tab in the editor (default: false) */
  showJsonTab?: boolean;
  /** Show download button (default: true) */
  showDownloadButton?: boolean;
  /** Show import button (default: true) */
  showImportButton?: boolean;
  /** Show settings button (default: true) */
  showSettingsButton?: boolean;
  /** Container height (default: 100vh) */
  height?: string;
}

/**
 * Internal component that uses the editor context
 */
function TemplateEditorContent({
  initialJson,
  onSave,
  showJsonTab = false,
  showDownloadButton = true,
  showImportButton = true,
  showSettingsButton = true,
  height = '100vh',
}: TemplateEditorProps) {
  const document = useDocument();

  // Initialize with provided JSON
  useEffect(() => {
    if (initialJson) {
      setDocument(initialJson);
    }
  }, [initialJson]);

  // Create save handler
  const handleSave = () => {
    if (onSave) {
      const htmlOutput = renderToStaticMarkup(document, { rootBlockId: 'root' });
      const jsonOutput = document;
      const subjectOutput = document.subject || '';

      onSave({
        htmlOutput,
        jsonOutput,
        subjectOutput,
      });
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height,
        width: '100%',
        backgroundColor: '#fafafa',
      }}
    >
      <TemplatePanel
        onSave={handleSave}
        showJsonTab={showJsonTab}
        showDownloadButton={showDownloadButton}
        showImportButton={showImportButton}
        showSettingsButton={showSettingsButton}
      />
    </Box>
  );
}

/**
 * TemplateEditor Component
 * 
 * A complete email template editor component that can be embedded in any React application.
 * 
 * @example
 * ```typescript
 * import { TemplateEditor } from '@vampirecoder/template-editor';
 * 
 * export default function MyApp() {
 *   return (
 *     <TemplateEditor
 *       initialJson={myTemplate}
 *       onSave={({ htmlOutput, jsonOutput, subjectOutput }) => {
 *         console.log('Saved!', { htmlOutput, jsonOutput, subjectOutput });
 *       }}
 *       showJsonTab={false}
 *     />
 *   );
 * }
 * ```
 */
export default function TemplateEditor(props: TemplateEditorProps) {
  return (
    <TemplateEditorProvider>
      <TemplateEditorContent {...props} />
    </TemplateEditorProvider>
  );
}

