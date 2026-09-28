import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

const DEFAULT_UPSTREAM = "https://pot-api.pot-play.com/api/v1/inquiry/landing";

function inquiryProxy(upstream: string) {
  const url = new URL(upstream);
  return {
    "/api/inquiry/landing": {
      target: url.origin,
      changeOrigin: true,
      rewrite: () => `${url.pathname}${url.search}`,
    },
  };
}

export default defineConfig(({ mode }) => {
  const fileEnv = loadEnv(mode, process.cwd(), "");
  const upstream =
    process.env.INQUIRY_UPSTREAM_URL ||
    fileEnv.INQUIRY_UPSTREAM_URL ||
    DEFAULT_UPSTREAM;

  return {
    plugins: [react()],
    server: {
      port: 3001,
      proxy: inquiryProxy(upstream),
    },
    preview: {
      port: 3001,
      proxy: inquiryProxy(upstream),
    },
  };
});
