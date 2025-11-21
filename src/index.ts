/**
 * @vampirecoder/template-editor
 * 
 * A reusable React component library for building and editing email templates.
 * 
 * @example
 * ```typescript
 * import { TemplateEditor } from '@vampirecoder/template-editor';
 * 
 * <TemplateEditor
 *   initialJson={templateJson}
 *   onSave={({ htmlOutput, jsonOutput, subjectOutput }) => {
 *     // Handle save
 *   }}
 * />
 * ```
 */

// Main component
export { default as TemplateEditor } from './TemplateEditor';
export type { TemplateEditorProps, TemplateSaveOutput, TemplateField } from './TemplateEditor';

// Email builder utilities
export { Reader, renderToStaticMarkup } from './email-builder';
export type { TReaderBlock, TReaderDocument } from './email-builder/Reader/core';

// Editor types (for advanced users)
export type { TEditorConfiguration, TEditorBlock } from './documents/editor/core';

// Version information
export { VERSION, BUILD_NUMBER, BUILD_TIME } from './version';

