import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ["firebase/app", "firebase/auth"],
  },
  server: {
    port: 5173,
    open: true,
  },
  build: {
    commonjsOptions: {
      include: [/firebase/, /node_modules/],
    },
  },
});
