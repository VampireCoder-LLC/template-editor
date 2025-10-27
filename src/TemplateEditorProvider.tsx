import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';

interface TemplateEditorProviderProps {
  children: React.ReactNode;
}

/**
 * Provider component that wraps the TemplateEditor with necessary theme and styling
 * 
 * This component provides:
 * - Material-UI theme
 * - CSS baseline for consistent styling
 * 
 * @internal
 */
export default function TemplateEditorProvider({ children }: TemplateEditorProviderProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

