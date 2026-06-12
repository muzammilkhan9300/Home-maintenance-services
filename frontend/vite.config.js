import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
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
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Raise the warning threshold — vendor.js is intentionally large
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Separate framer-motion (animation library) — only needed on public pages
          if (id.includes("framer-motion")) return "framer";
          // Separate react-router — small, shared across all pages
          if (id.includes("react-router") || id.includes("@remix-run")) return "router";
          // Separate Radix UI — used primarily in admin/UI components
          if (id.includes("@radix-ui")) return "radix";
          // Separate Lucide icons — tree-shaken but still notable
          if (id.includes("lucide-react")) return "icons";
          // Everything else from node_modules
          if (id.includes("node_modules")) return "vendor";
        },
      },
    },
  },
}));
