import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";
import { FEDERATION_SHARED } from "@gaqno-development/frontcore/config/federation-shared";
import path from "path";

export default defineConfig(async () => {
  const tailwindcss = (await import("@tailwindcss/vite")).default;

  return {
    base: "/",
    server: {
      port: 3002,
      origin: "http://localhost:3002",
      fs: {
        allow: [".", "../shared"],
      },
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
      dedupe: ["motion"],
    },
    plugins: [
      react(),
      tailwindcss(),
      federation({
        name: "ai",
        filename: "remoteEntry.js",
        exposes: {
          "./App": "./src/App.tsx",
          "./AIRouteLayout": "./src/layouts/AIRouteLayout.tsx",
          "./BookPage": "./src/pages/BookPage.tsx",
          "./AudioSection": "./src/pages/AudioSection.tsx",
          "./ImagesSection": "./src/pages/ImagesSection.tsx",
          "./VideoSection": "./src/pages/VideoSection.tsx",
          "./ProductDataDiscoveryPage": "./src/pages/ProductDataDiscoveryPage.tsx",
          "./RetailSection": "./src/pages/RetailSection.tsx",
          "./StudioDashboard": "./src/pages/studio/StudioDashboard.tsx",
          "./NewProjectPage": "./src/pages/studio/NewProjectPage.tsx",
          "./ProjectDetailPage": "./src/pages/studio/ProjectDetailPage.tsx",
          "./SocialAccountsPage": "./src/pages/social/SocialAccountsPage.tsx",
        },
        shared: FEDERATION_SHARED as any,
      }),
    ],
    build: {
      modulePreload: false,
      target: "esnext",
      minify: false,
      cssCodeSplit: false,
      commonjsOptions: {
        transformMixedEsModules: true,
        requireReturnsDefault: "preferred",
      },
      rollupOptions: {
        external: [],
        output: {
          format: "es",
        },
      },
    },
    optimizeDeps: {
      include: [
        "@gaqno-development/frontcore/styles/globals.css",
        "motion",
        "use-sync-external-store",
      ],
    },
  };
});
