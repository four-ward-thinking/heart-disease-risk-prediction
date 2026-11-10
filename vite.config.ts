import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE || '/heart-disease-risk-prediction/',
  server: {
    port: 3000,
    open: false,
  },
});
