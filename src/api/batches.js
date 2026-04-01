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

export const removeBatchMember = async (batchId, userId) => {
  if (!isBackendConnected()) return;

  const { error } = await getClient()
    .from('batch_members')
    .delete()
    .match({ batch_id: batchId, user_id: userId });

  if (error) throw error;
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

export const updateBatch = async (batchId, { name, schedule, location, status, modules }) => {
  if (!isBackendConnected()) return;

  const updates = {};
  if (name !== undefined) updates.name = name;
  if (schedule !== undefined) updates.schedule = schedule;
  if (location !== undefined) updates.location = location;
  if (modules !== undefined) updates.modules = modules;
  // batches table uses is_active boolean, not a status string
  if (status !== undefined) updates.is_active = status === 'active';

  const { data, error } = await getClient()
    .from('batches')
    .update(updates)
    .eq('id', batchId)
    .select()
    .single();

  if (error) throw error;
  return toCamel(data);
};

export const createSession = async (batchId, { title, notes, sessionDate, attendance }) => {
  if (!isBackendConnected()) return { id: Date.now().toString(), batchId, title };

  const supabase = getClient();
  const { data: session, error } = await supabase
    .from('batch_sessions')
    .insert({
      batch_id: batchId,
      title,
      description: notes,
      session_date: sessionDate || new Date().toISOString().slice(0, 10),
    })
    .select()
    .single();

  if (error) throw error;

  // attendance: { [userId]: 'present' | 'late' | 'absent' }
  if (attendance) {
    const rows = Object.entries(attendance).map(([userId, status]) => ({
      session_id: session.id,
      user_id: userId,
      attended: status === 'present',
    }));
    if (rows.length) {
      await supabase.from('session_attendance').upsert(rows, { onConflict: 'session_id,user_id' });
    }
  }

  return toCamel(session);
};

export const updateBatchStatus = async (batchId, status) => {
  if (!isBackendConnected()) return;

  const { data, error } = await getClient()
    .from('batches')
    .update({ status })
    .eq('id', batchId)
    .select()
    .single();

  if (error) throw error;
  return toCamel(data);
};
