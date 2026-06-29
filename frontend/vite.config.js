import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
      "/uploads": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    ViteImageOptimizer({
      // More aggressive compression for faster page loads
      png: { quality: 70, compressionLevel: 9 },
      jpeg: { quality: 75 },
      jpg: { quality: 75 },
      webp: { quality: 75 },
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    // Enable CSS code splitting so each chunk only loads its needed CSS
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // React core — loaded first, kept tiny
          if (id.includes("node_modules/react/") || id.includes("node_modules/react-dom/") || id.includes("node_modules/scheduler/")) return "react-core";
          // Framer motion — animation lib, only on public pages
          if (id.includes("framer-motion")) return "framer";
          // React-router
          if (id.includes("react-router") || id.includes("@remix-run")) return "router";
          // Radix UI components
          if (id.includes("@radix-ui")) return "radix";
          // Lucide icons (tree-shaken)
          if (id.includes("lucide-react")) return "icons";
          // TanStack query
          if (id.includes("@tanstack")) return "tanstack";
          // React-helmet and SEO utilities
          if (id.includes("react-helmet")) return "seo";
          // Everything else from node_modules
          if (id.includes("node_modules")) return "vendor";
        },
      },
    },
  },
}));
