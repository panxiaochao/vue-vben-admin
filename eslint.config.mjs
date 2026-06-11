import { defineConfig } from '@vben/eslint-config';

export default defineConfig([
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/*.md',
      '**/*.yaml',
      '**/*.yml',
      '**/package.json',
      '**/*.vue',
    ],
  },
]);
