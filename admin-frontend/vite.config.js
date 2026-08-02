import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/admin/",
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },

  // --- Untuk production build (npm run build) ---
  // Hasil build (HTML+JS+CSS sudah minified) akan ditaruh di folder "dist".
  // Nanti tinggal di-serve sebagai static file oleh server Express kamu yang sama
  // yang sudah jalan di Railway (lihat catatan di README.md).
  build: {
      outDir: "../public/admin-dist",
      emptyOutDir: true,
  },
});
