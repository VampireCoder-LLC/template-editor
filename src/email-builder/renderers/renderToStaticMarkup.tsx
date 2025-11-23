import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import * as ReactDOM from 'react-dom';

import Reader, { TReaderDocument } from '../Reader/core';

type TOptions = {
  rootBlockId: string;
};

export default function renderToStaticMarkup(
  document: TReaderDocument,
  { rootBlockId }: TOptions
): string {
  // Create a temporary container in the DOM
  const container = globalThis.document?.createElement('div');

  if (!container) {
    throw new Error('renderToStaticMarkup must be called in a browser environment');
  }

  // Create root and render
  const root = ReactDOMClient.createRoot(container);

  // Render synchronously using flushSync to ensure immediate rendering
  ReactDOM.flushSync(() => {
    root.render(
      <html>
        <body>
          <Reader document={document} rootBlockId={rootBlockId} />
        </body>
      </html>
    );
  });

  // Extract HTML content
  const htmlContent = container.innerHTML;

  // Cleanup
  root.unmount();

  return '<!DOCTYPE html>' + htmlContent;
}
