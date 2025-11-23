import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { visualizer } from 'rollup-plugin-visualizer';
import dts from 'vite-plugin-dts';
import { versionPlugin } from './vite-plugin-version';

export default defineConfig({
  plugins: [
    react(),
    versionPlugin(),
    dts({
      include: ['src/**/*'],
      exclude: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
      rollupTypes: true,
    }),
    visualizer({
      filename: './dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
  ],

  base: '/',
  server: {
    port: 8141,
  },

  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'TemplateEditor',
      formats: ['es', 'umd'],
      fileName: (format) =>
        `template-editor.${format === 'es' ? 'mjs' : 'ujs'}`,
    },

    rollupOptions: {
      external: [
        // React must always be external
        'react',
        'react-dom',
        'react-dom/client',
        'react/jsx-runtime',

        // React 19 SSR API
        'react-dom/server.edge',

        // UI deps must not be bundled
        '@mui/material',
        '@mui/icons-material',
        '@emotion/react',
        '@emotion/styled',
        'react-colorful',
        'zustand',

        // required fix for React 19 + MUI deepmerge
        'react-is',
      ],

      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react-dom/client': 'ReactDOMClient',
          'react/jsx-runtime': 'jsxRuntime',
          'react-dom/server.edge': 'ReactDOMServer',

          '@mui/material': 'MaterialUI',
          '@mui/icons-material': 'MaterialUIIcons',
          '@emotion/react': 'emotionReact',
          '@emotion/styled': 'emotionStyled',
          'react-colorful': 'ReactColorful',
          zustand: 'Zustand',
          'react-is': 'ReactIs',
        },
      },
    },

    emptyOutDir: true,

    // Prevent Vite from optimizing or prebundling React
    commonjsOptions: {
      exclude: [/react/, /react-dom/],
    },
  },
});
