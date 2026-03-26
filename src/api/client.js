/**
 * api/client.js
 * ──────────────────────────────────────────────────────────────
 * Central Supabase client. All service files import from here.
 * When Supabase is not configured, falls back to mock data.
 * ──────────────────────────────────────────────────────────────
 */

import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../config';

let _supabase = null;
let _isConfigured = false;

/**
 * Initialize the Supabase client. Call once at app startup.
 */
export const initApiClient = () => {
  try {
    if (!SUPABASE_URL || SUPABASE_URL.includes('YOUR_PROJECT')) {
      _isConfigured = false;
      return;
    }
    _supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    });
    _isConfigured = true;
  } catch {
    _isConfigured = false;
  }
};

/**
 * Get the Supabase client. Returns null if not configured.
 */
export const getClient = () => _supabase;

/**
 * Check if we're using the live backend or mock data.
 */
export const isBackendConnected = () => _isConfigured;
