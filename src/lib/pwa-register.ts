// Guarded service-worker registration for Monevo.
// This module is the ONLY registrar for the app service worker (/sw.js).
// It never registers in dev, in the Lovable preview, or inside iframes.

const APP_SW_URL = "/sw.js";

function isRefusedContext(): boolean {
  if (typeof window === "undefined") return true;
  if (!import.meta.env.PROD) return true;
  if (window.self !== window.top) return true; // iframe preview
  const host = window.location.hostname;
  if (host.startsWith("id-preview--") || host.startsWith("preview--"))
    return true;
  if (
    host === "lovableproject.com" ||
    host.endsWith(".lovableproject.com") ||
    host === "lovableproject-dev.com" ||
    host.endsWith(".lovableproject-dev.com") ||
    host === "beta.lovable.dev" ||
    host.endsWith(".beta.lovable.dev")
  )
    return true;
  if (new URLSearchParams(window.location.search).get("sw") === "off")
    return true;
  return false;
}

async function unregisterAppServiceWorkers(): Promise<void> {
  if (!("serviceWorker" in navigator)) return;
  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(
      registrations
        .filter((registration) => {
          const script =
            registration.active?.scriptURL ??
            registration.waiting?.scriptURL ??
            registration.installing?.scriptURL ??
            "";
          return script.endsWith(APP_SW_URL);
        })
        .map((registration) => registration.unregister()),
    );
  } catch {
    // Best-effort cleanup only.
  }
}

export async function registerAppServiceWorker(): Promise<void> {
  if (isRefusedContext()) {
    // In dev/preview contexts, evict any stale app SW so the preview
    // always reflects the latest code.
    void unregisterAppServiceWorkers();
    return;
  }
  if (!("serviceWorker" in navigator)) return;
  try {
    await navigator.serviceWorker.register(APP_SW_URL, { scope: "/" });
  } catch {
    // Registration failure must never break the app.
  }
}
