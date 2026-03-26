/**
 * api/client.js
 * ──────────────────────────────────────────────────────────────
 * Central API client. All service files import from here.
 * When Amplify is not yet configured, falls back to mock data.
 * ──────────────────────────────────────────────────────────────
 */

let _client = null;
let _isConfigured = false;

/**
 * Initialize the API client. Call once after Amplify.configure().
 */
export const initApiClient = () => {
  try {
    const { generateClient } = require('aws-amplify/api');
    _client = generateClient();
    _isConfigured = true;
  } catch {
    _isConfigured = false;
  }
};

/**
 * Get the GraphQL client. Returns null if Amplify is not configured.
 */
export const getClient = () => _client;

/**
 * Check if we're using the live backend or mock data.
 */
export const isBackendConnected = () => _isConfigured;
