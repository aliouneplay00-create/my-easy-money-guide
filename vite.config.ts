// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    plugins: [
      VitePWA({
        registerType: "autoUpdate",
        // The guarded wrapper in src/lib/pwa-register.ts is the only registrar.
        injectRegister: null,
        // Never emit a service worker in dev / Lovable preview builds.
        devOptions: { enabled: false },
        filename: "sw.js",
        manifest: {
          name: "Monevo — Gérez votre argent simplement",
          short_name: "Monevo",
          description:
            "Monevo : solde, dépenses, abonnements et objectifs d'épargne, simplement.",
          lang: "fr",
          start_url: "/",
          scope: "/",
          display: "standalone",
          orientation: "portrait",
          theme_color: "#C4572E",
          background_color: "#FBF3E4",
          icons: [
            {
              src: "/icons/icon-192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "/icons/icon-512.png",
              sizes: "512x512",
              type: "image/png",
            },
            {
              src: "/icons/maskable-512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable",
            },
          ],
        },
        workbox: {
          // HTML navigations: always network-first, never cache-first.
          navigateFallback: "/index.html",
          navigateFallbackDenylist: [/^\/~oauth/],
          runtimeCaching: [
            {
              urlPattern: ({ request }: { request: Request }) =>
                request.mode === "navigate",
              handler: "NetworkFirst",
              options: {
                cacheName: "monevo-pages",
                networkTimeoutSeconds: 5,
              },
            },
            {
              // Same-origin hashed build assets only.
              urlPattern: ({ url, request }: { url: URL; request: Request }) =>
                url.origin === self.location.origin &&
                ["script", "style", "font", "image"].includes(
                  request.destination,
                ),
              handler: "CacheFirst",
              options: {
                cacheName: "monevo-assets",
                expiration: {
                  maxEntries: 128,
                  maxAgeSeconds: 60 * 60 * 24 * 30,
                },
              },
            },
          ],
        },
      }),
    ],
  },
});
