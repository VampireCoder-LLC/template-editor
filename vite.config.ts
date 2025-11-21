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
      fileName: (format) => `template-editor.${format === 'es' ? 'mjs' : 'ujs'}`,
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        '@mui/material',
        '@mui/icons-material',
        '@emotion/react',
        '@emotion/styled',
        'react-colorful',
        'zustand',
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime',
          '@mui/material': 'MaterialUI',
          '@mui/icons-material': 'MaterialUIIcons',
          '@emotion/react': 'emotionReact',
          '@emotion/styled': 'emotionStyled',
          'react-colorful': 'ReactColorful',
          'zustand': 'Zustand',
        },
      },
    },
    emptyOutDir: true,
  },
});
