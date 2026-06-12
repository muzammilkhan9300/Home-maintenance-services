/**
 * bootstrap.js — Singleton fetch manager for public configuration.
 *
 * All components that need settings, plugins, or ads can call
 * getBootstrapData(). No matter how many components call it, the
 * browser fires exactly ONE network request per page load and all
 * callers share the same resolved Promise.
 *
 * The cache is invalidated automatically when the module is reloaded
 * (i.e. on every fresh page load / hard-refresh).
 */

const API_BASE = import.meta.env.PROD ? '' : 'http://localhost:5000';

let bootstrapPromise = null;

/**
 * Returns a Promise that resolves to:
 *  { settings: {...}, plugins: [...], ads: [...] }
 */
export const getBootstrapData = () => {
  if (!bootstrapPromise) {
    bootstrapPromise = fetch(`${API_BASE}/api/bootstrap`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load bootstrap configuration');
        return res.json();
      })
      .catch((err) => {
        // Allow retrying on next call if the request failed
        bootstrapPromise = null;
        throw err;
      });
  }
  return bootstrapPromise;
};
