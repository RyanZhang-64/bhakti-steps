/**
 * api/helpers.js
 * ──────────────────────────────────────────────────────────────
 * Shared utilities for the API layer.
 * ──────────────────────────────────────────────────────────────
 */

/** Convert snake_case DB row to camelCase JS object (deep — handles nested objects/arrays) */
export const toCamel = (row) => {
  if (!row || typeof row !== 'object') return row;
  if (Array.isArray(row)) return row.map(toCamel);
  const out = {};
  for (const [k, v] of Object.entries(row)) {
    const camel = k.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
    out[camel] = toCamel(v);
  }
  return out;
};

/** Convert camelCase JS object to snake_case for DB insert/update */
export const toSnake = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    const snake = k.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
    out[snake] = v;
  }
  return out;
};
