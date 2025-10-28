// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      "4whck9-5173.csb.app", // 添加允许的主机
      "localhost", // 保留本地主机
      "127.0.0.1", // 保留本地IP
    ],
  },
});
