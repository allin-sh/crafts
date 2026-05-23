import { defineConfig } from 'tsup';

export default defineConfig(options => ({
  entry: ['src/index.ts'],
  dts: true,
  clean: true,
  minify: !options.watch,
  target: 'es2022',
  format: ['esm'],
  banner: { js: '"use client";' },
  loader: {
    '.css': 'copy',
  },
  external: ['react', 'react-dom'],
}));
