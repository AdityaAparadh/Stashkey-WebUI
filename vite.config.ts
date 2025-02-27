/// <reference types="vitest" />

import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  build: {
    target: "esnext",
    rollupOptions: {
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      target: "esnext",
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    allowedHosts: [
      "d9d0-2401-4900-1c8e-4954-b070-a7f2-7e8f-faaa.ngrok-free.app",
    ],
  },
  test: {
    environment: "happy-dom",
    globals: true,
  },
});


