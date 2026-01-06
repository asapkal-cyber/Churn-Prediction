import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    host: "::",
    port: 8080,
    proxy: {
      "/api/credit-card": {
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/credit-card/, ""),
      },
      "/api/isp": {
        target: "http://localhost:8090",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/isp/, ""),
      },
      "/api/insurance": {
        target: "http://localhost:8081",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/insurance/, ""),
      },
    },
  },
});
