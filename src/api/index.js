/**
 * api/index.js
 * ──────────────────────────────────────────────────────────────
 * Barrel export for all API services.
 * ──────────────────────────────────────────────────────────────
 */

export { initApiClient, isBackendConnected } from './client';
export * as AuthService from './auth';
export * as SadhanaService from './sadhana';
