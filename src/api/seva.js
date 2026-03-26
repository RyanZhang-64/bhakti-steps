/**
 * api/seva.js — Seva log CRUD operations.
 */

import { getClient, isBackendConnected } from './client';
import { toCamel, toSnake } from './helpers';
import { MockData } from '../mockData';

export const listSevaLogs = async (userId, { limit = 30, offset = 0 } = {}) => {
  if (!isBackendConnected()) {
    return { items: MockData.sevaLogs.slice(offset, offset + limit), hasMore: false };
  }

  const { data, error } = await getClient()
    .from('seva_logs')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return { items: data.map(toCamel), hasMore: data.length === limit };
};

export const createSevaLog = async (entry) => {
  if (!isBackendConnected()) {
    return { id: Date.now().toString(), ...entry };
  }

  const { data, error } = await getClient()
    .from('seva_logs')
    .insert(toSnake(entry))
    .select()
    .single();

  if (error) throw error;
  return toCamel(data);
};
