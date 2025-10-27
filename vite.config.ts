import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
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
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
    emptyOutDir: true,
  },
});
