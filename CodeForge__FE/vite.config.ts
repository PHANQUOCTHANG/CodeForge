import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // cho phép truy cập từ ngoài container
    port: 3000, // đổi port thành 3000
  },
});
