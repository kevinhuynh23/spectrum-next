/**
 * Flat ESLint config that imports Next's `core-web-vitals` config directly.
 * This avoids using `extends` in the flat config (not supported) and prevents
 * the circular-config JSON error when resolving shareable configs.
 */

const nextCore = (() => {
  try {
    // Try CJS default export or named export
    const mod = require('eslint-config-next/core-web-vitals');
    return mod && mod.__esModule && mod.default ? mod.default : mod;
  } catch (err) {
    // Fall back to an explicit object so ESLint still runs and reports a clear error
    console.error('Could not load eslint-config-next/core-web-vitals:', err);
    return {};
  }
})();

module.exports = Array.isArray(nextCore) ? nextCore : [nextCore];
