import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/factory",
  server: { port: 3002 },
  preview: { port: 3002 },
});
