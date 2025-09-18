import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  server: {
    host: "localhost",
    port: 5173,
    open: false,
    strictPort: false,
    proxy: {
      "/api/auth": {
        target: "http://localhost:8081",
        changeOrigin: true,
        secure: false,
      },
      "/oauth2": {
        target: "http://localhost:8081",
        changeOrigin: true,
        secure: false,
      },
      "/api/users": {
        target: "http://localhost:8082",
        changeOrigin: true,
        secure: false,
      },
      "/api/teams": {
        target: "http://localhost:8083",
        changeOrigin: true,
        secure: false,
      },
      "/api/recruit": {
        target: "http://localhost:8084",
        changeOrigin: true,
        secure: false,
      },
      "/api/notifications": {
        target: "http://localhost:8085",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
