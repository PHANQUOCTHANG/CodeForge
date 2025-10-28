import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
        @use "@/styles/variables" as vars;
        @use "@/styles/mixins" as *;
      `,
      },
    },
  },

  server: {
    host: true, // cho phép truy cập từ ngoài container
    port: 3000, // đổi port thành 3000
  },
});
