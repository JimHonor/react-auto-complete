import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig(({ mode }) => {
  return {
    base: mode === "development" ? "/" : "/react-auto-complete/",
    build: {
      sourcemap: mode === "development",
    },
    plugins: [react()],
    resolve: {
      alias: {
        "@src": resolve(__dirname, "src"),
      },
    },
  };
});
