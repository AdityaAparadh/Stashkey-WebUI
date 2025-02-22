import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
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
});
