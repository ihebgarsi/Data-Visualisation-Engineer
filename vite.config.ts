import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  esbuild: {
    legalComments: "none",
  },
  build: {
    sourcemap: false,
    target: "es2020",
    rollupOptions: {
      output: {
        entryFileNames: "assets/app-[hash].js",
        chunkFileNames: "assets/app-[hash].js",
        assetFileNames: "assets/app-[hash][extname]",
      },
    },
  },
});
