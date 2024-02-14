import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync } from 'fs';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Versionsnummer aus der package.json auslesen
  const packageJson = JSON.parse(readFileSync(path.resolve(__dirname, './package.json'), 'utf-8'));

  return {
    plugins: [react()],
    define: {
      'process.env.APP_VERSION': JSON.stringify(packageJson.version),
    },
  };
});