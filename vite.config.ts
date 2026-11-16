import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "node:path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiHost = (env.VITE_API_BASE_URL || "").replace(/\/$/, "").replace(/\/v1$/i, "");
  const useProxy = env.VITE_API_USE_PROXY === "true" && /^https?:\/\//i.test(apiHost);

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    // Vite SPA mode already falls back unknown paths to index.html
    // so /accept-invite?token=… can load the app, then we rewrite to #invite-…
    server: {
      port: 4200,
      proxy: useProxy
        ? {
            // Paths in apiEndpoints already include /v1/...
            "/v1": {
              target: apiHost,
              changeOrigin: true,
              secure: true,
              headers: {
                "ngrok-skip-browser-warning": "true",
              },
            },
          }
        : undefined,
    },
    preview: {
      port: 4200,
    },


    build: {
      chunkSizeWarningLimit: 1500,
    },
  };
});
