/**
 * api/batches.js — Batch management (mentor groups).
 */

import { getClient, isBackendConnected } from './client';
import { toCamel, toSnake } from './helpers';
import { MockData } from '../mockData';

export const listBatchesByMentor = async (mentorId) => {
  if (!isBackendConnected()) {
    return MockData.batches || [];
  }

  const { data, error } = await getClient()
    .from('batches')
    .select('*, batch_members(user_id, joined_at, users(first_name, last_name, email))')
    .eq('mentor_id', mentorId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data.map(toCamel);
};

export const getBatchWithMembers = async (batchId) => {
  if (!isBackendConnected()) {
    return MockData.batches?.[0] || null;
  }

  const { data, error } = await getClient()
    .from('batches')
    .select('*, batch_members(*, users(first_name, last_name, email, phone)), batch_sessions(*, session_attendance(*))')
    .eq('id', batchId)
    .single();

  if (error) throw error;
  return toCamel(data);
};

export const listBatchSessions = async (batchId) => {
  if (!isBackendConnected()) {
    return MockData.batches?.[0]?.sessions || [];
  }

  const { data, error } = await getClient()
    .from('batch_sessions')
    .select('*, session_attendance(user_id, attended)')
    .eq('batch_id', batchId)
    .order('session_date', { ascending: false });

  if (error) throw error;
  return data.map(toCamel);
};

export const markAttendance = async (sessionId, userId, attended) => {
  if (!isBackendConnected()) {
    return { sessionId, userId, attended };
  }

  const { data, error } = await getClient()
    .from('session_attendance')
    .upsert(
      { session_id: sessionId, user_id: userId, attended: !!attended },
      { onConflict: 'session_id,user_id' }
    )
    .select()
    .single();

  if (error) throw error;
  return toCamel(data);
};

export const listAllBatches = async () => {
  if (!isBackendConnected()) {
    return MockData.adminBatches || [];
  }

  const { data, error } = await getClient()
    .from('batches')
    .select('*, users!batches_mentor_id_fkey(first_name, last_name), batch_members(count)')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data.map(toCamel);
};

export const reassignMember = async (userId, fromBatchId, toBatchId) => {
  if (!isBackendConnected()) return;

  const supabase = getClient();
  // Remove old membership
  if (fromBatchId) {
    await supabase.from('batch_members').delete().match({ user_id: userId, batch_id: fromBatchId });
  }
  // Create new membership
  const { error } = await supabase.from('batch_members').insert({ batch_id: toBatchId, user_id: userId });
  if (error) throw error;
};
