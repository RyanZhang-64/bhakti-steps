/**
 * api/sadhana.js
 * ──────────────────────────────────────────────────────────────
 * Sadhana entry CRUD operations.
 * Falls back to MockData when Supabase is not configured.
 * ──────────────────────────────────────────────────────────────
 */

import { getClient, isBackendConnected } from './client';
import { toCamel, toSnake } from './helpers';
import { MockData } from '../mockData';

/**
 * Fetch sadhana entries for a user, optionally filtered by date range.
 */
export const listSadhanaEntries = async (userId, { limit = 30, offset = 0, dateFrom, dateTo } = {}) => {
  if (!isBackendConnected()) {
    const items = MockData.submissionHistory.map((entry, i) => ({
      id: String(i),
      userId,
      date: entry.date,
      japaRounds: 16,
      score: entry.score,
      mood: entry.mood,
      mangalaArati: entry.mp[0],
      morningProgram: entry.mp[1],
      guruPuja: entry.mp[2],
      sbClass: entry.mp[3],
      tulasiPuja: entry.mp[4],
    }));
    return { items: items.slice(offset, offset + limit), hasMore: offset + limit < items.length };
  }

  let query = getClient()
    .from('sadhana_entries')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .range(offset, offset + limit - 1);

  if (dateFrom) query = query.gte('date', dateFrom);
  if (dateTo) query = query.lte('date', dateTo);

  const { data, error } = await query;
  if (error) throw error;

  return { items: data.map(toCamel), hasMore: data.length === limit };
};

/**
 * Submit a new sadhana entry.
 */
export const createSadhanaEntry = async (entry) => {
  if (!isBackendConnected()) {
    return { id: Date.now().toString(), ...entry };
  }

  const { data, error } = await getClient()
    .from('sadhana_entries')
    .insert(toSnake(entry))
    .select()
    .single();

  if (error) throw error;
  return toCamel(data);
};
