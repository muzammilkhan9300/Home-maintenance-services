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
      // ── Aggressive compression for all raster formats ──────────────────────
      png:  { quality: 60, compressionLevel: 9 },
      jpeg: { quality: 60 },
      jpg:  { quality: 60 },
      webp: { quality: 60, lossless: false },
      avif: { quality: 50 },
      // ── Generate WebP for every PNG/JPEG served (massive size win) ─────────
      // NOTE: actual WebP generation is handled via the img optimizer pass;
      // the browser <picture> + WebP fallback is the recommended pattern.
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "es2020",
    // Inline small assets under 4KB to save HTTP requests
    assetsInlineLimit: 4096,
    // ── Use Terser for ~15-20% smaller bundles vs default esbuild ─────────────
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ["console.log", "console.warn", "console.info"],
        passes: 3,
        unsafe: true,
        unsafe_arrows: true,
        unsafe_methods: true,
        unsafe_math: true,
      },
      mangle: {
        // Mangle property names in private/internal code
        properties: false,
      },
      format: {
        // Remove comments from output
        comments: false,
      },
    },
    chunkSizeWarningLimit: 600,
    // Enable CSS code splitting so each chunk only loads its needed CSS
    cssCodeSplit: true,
    // Generate source maps only in dev
    sourcemap: false,
    rollupOptions: {
      output: {
        // Use content hash for long-term caching
        entryFileNames: "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]",
        manualChunks(id) {
          // ── React core — smallest possible, loaded first ─────────────────────
          if (
            id.includes("node_modules/react/") ||
            id.includes("node_modules/react-dom/") ||
            id.includes("node_modules/scheduler/")
          ) return "react-core";

          // ── React Router ────────────────────────────────────────────────────
          if (id.includes("react-router") || id.includes("@remix-run")) return "router";

          // ── Radix UI — grouped, only loads when UI appears ──────────────────
          if (id.includes("@radix-ui")) return "radix";

          // ── Lucide icons (aggressively tree-shaken by swc) ─────────────────
          if (id.includes("lucide-react")) return "icons";

          // ── TanStack Query — data-fetching, only admin + service pages ──────
          if (id.includes("@tanstack")) return "tanstack";

          // ── React Helmet — SEO utilities ────────────────────────────────────
          if (id.includes("react-helmet")) return "seo";

          // ── Recharts — ADMIN ONLY, never loaded on public pages ─────────────
          if (id.includes("recharts") || id.includes("d3-")) return "recharts";

          // ── Supabase — only when auth/db calls happen ───────────────────────
          if (id.includes("@supabase") || id.includes("supabase")) return "supabase";

          // ── Embla Carousel — only on pages with sliders ─────────────────────
          if (id.includes("embla-carousel")) return "carousel";

          // ── Date utilities — admin date formatting ───────────────────────────
          if (id.includes("date-fns")) return "date-fns";

          // ── Admin-only UI components ─────────────────────────────────────────
          if (id.includes("cmdk")) return "cmdk";
          if (id.includes("vaul")) return "vaul";

          // ── Form & validation utils — small, split out of vendor ─────────────
          if (id.includes("zod") || id.includes("react-hook-form") || id.includes("@hookform")) return "forms";

          // ── Theming & UI utilities — split out of vendor ─────────────────────
          if (id.includes("next-themes") || id.includes("sonner") || id.includes("input-otp")) return "ui-utils";

          // ── Style utilities — tiny, inline-able but kept separate ────────────
          if (id.includes("class-variance-authority") || id.includes("clsx") || id.includes("tailwind-merge")) return "style-utils";

          // ── Remaining framer-motion (should now be empty — CareerModal removed) ──
          if (id.includes("framer-motion")) return "framer";

          // ── react-day-picker, react-resizable-panels — admin only ────────────
          if (id.includes("react-day-picker") || id.includes("react-resizable-panels")) return "admin-widgets";

          // ── Everything else from node_modules ───────────────────────────────
          if (id.includes("node_modules")) return "vendor";
        },
      },
    },
  },
}));
