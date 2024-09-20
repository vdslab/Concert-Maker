import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    include: ["@mui/icons-material", "@mui/material", "@mui/styled-engine-sc"],
  },
  plugins: [react()],
  resolve: {
    // ↓ 追記
    alias: {
      "@": "/src/",
    },
  },
});
