/**
 * api/admin.js — Admin-only operations: audit log, reference items, scoring, KPIs.
 */

import { getClient, isBackendConnected } from './client';
import { toCamel, toSnake } from './helpers';
import { MockData } from '../mockData';

// ─── Audit Log ────────────────────────────────────────

export const getAuditLog = async ({ type, limit = 30, offset = 0 } = {}) => {
  if (!isBackendConnected()) {
    let items = MockData.auditLog;
    if (type && type !== 'All') items = items.filter(e => e.type === type.toLowerCase());
    return { items: items.slice(offset, offset + limit), hasMore: offset + limit < items.length };
  }

  let query = getClient()
    .from('audit_log')
    .select('*, actor:users!audit_log_actor_id_fkey(first_name, last_name)')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (type && type !== 'All') query = query.eq('target_type', type.toUpperCase());

  const { data, error } = await query;
  if (error) throw error;
  return { items: data.map(toCamel), hasMore: data.length === limit };
};

export const createAuditEntry = async ({ actorId, action, targetType, targetId, details }) => {
  if (!isBackendConnected()) return;

  const { error } = await getClient()
    .from('audit_log')
    .insert({ actor_id: actorId, action, target_type: targetType, target_id: targetId, details });

  if (error) throw error;
};

// ─── Reference Items ──────────────────────────────────

export const listReferenceItems = async (category) => {
  if (!isBackendConnected()) {
    return MockData.adminSettingsLists?.[category] || [];
  }

  const { data, error } = await getClient()
    .from('reference_items')
    .select('*')
    .eq('category', category)
    .order('sort_order', { ascending: true, nullsFirst: false });

  if (error) throw error;
  return data.map(toCamel);
};

export const upsertReferenceItem = async ({ id, category, label, isActive, sortOrder }) => {
  if (!isBackendConnected()) {
    return { id: id || Date.now().toString(), category, label, isActive };
  }

  const record = { category, label, is_active: isActive, sort_order: sortOrder };
  if (id) record.id = id;

  const { data, error } = await getClient()
    .from('reference_items')
    .upsert(record)
    .select()
    .single();

  if (error) throw error;
  return toCamel(data);
};

// ─── Scoring Config ───────────────────────────────────

/**
 * Get scoring config as a flat object { roundsWeight: 40, ... }.
 * DB stores as key-value rows: { key: 'rounds_weight', value: 40 }
 */
export const getScoringConfig = async () => {
  if (!isBackendConnected()) {
    return MockData.sadhanaScoring;
  }

  const { data, error } = await getClient()
    .from('scoring_config')
    .select('key, value');

  if (error) throw error;

  // Convert rows into a single object: { roundsWeight: 40, ... }
  const config = {};
  for (const row of data) {
    const camelKey = row.key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
    config[camelKey] = Number(row.value);
  }
  return config;
};

/**
 * Update scoring config. Accepts a flat camelCase object { roundsWeight: 40, ... }.
 * Upserts each key-value pair.
 */
export const updateScoringConfig = async (config) => {
  if (!isBackendConnected()) {
    return config;
  }

  const supabase = getClient();
  const rows = Object.entries(config).map(([k, v]) => ({
    key: k.replace(/[A-Z]/g, c => `_${c.toLowerCase()}`),
    value: v,
  }));

  for (const row of rows) {
    const { error } = await supabase
      .from('scoring_config')
      .update({ value: row.value })
      .eq('key', row.key);
    if (error) throw error;
  }

  return config;
};

// ─── Admin KPIs ───────────────────────────────────────

export const getAdminKPIs = async () => {
  if (!isBackendConnected()) {
    return MockData.adminKPIs;
  }

  const { data, error } = await getClient().rpc('get_admin_kpis');
  if (error) throw error;
  return data;
};
