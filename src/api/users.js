/**
 * api/users.js — User profile and management.
 */

import { getClient, isBackendConnected } from './client';
import { toCamel, toSnake } from './helpers';
import { MockData } from '../mockData';

export const getUserProfile = async (userId) => {
  if (!isBackendConnected()) {
    return MockData.menteeProfile;
  }

  const { data, error } = await getClient()
    .from('users')
    .select('*, user_roles(role)')
    .eq('id', userId)
    .single();

  if (error) throw error;
  const profile = toCamel(data);
  profile.roles = (data.user_roles || []).map(r => r.role.toLowerCase());
  profile.name = [profile.firstName, profile.lastName].filter(Boolean).join(' ') || profile.email;
  return profile;
};

export const updateUserProfile = async (userId, updates) => {
  if (!isBackendConnected()) {
    return { id: userId, ...updates };
  }

  const { data, error } = await getClient()
    .from('users')
    .update(toSnake(updates))
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return toCamel(data);
};

export const listAllUsers = async ({ limit = 30, offset = 0 } = {}) => {
  if (!isBackendConnected()) {
    return { items: MockData.adminUsers, hasMore: false };
  }

  const { data, error } = await getClient()
    .from('users')
    .select('*, user_roles(role)')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  const items = data.map(row => {
    const u = toCamel(row);
    u.roles = (row.user_roles || []).map(r => r.role.toLowerCase());
    u.name = [u.firstName, u.lastName].filter(Boolean).join(' ') || u.email;
    return u;
  });
  return { items, hasMore: data.length === limit };
};

export const updateUserRoles = async (userId, roles) => {
  if (!isBackendConnected()) return;

  const supabase = getClient();
  // Delete existing roles, re-insert
  await supabase.from('user_roles').delete().eq('user_id', userId);
  const inserts = roles.map(r => ({ user_id: userId, role: r.toUpperCase() }));
  const { error } = await supabase.from('user_roles').insert(inserts);
  if (error) throw error;
};

export const updateUserStatus = async (userId, status) => {
  if (!isBackendConnected()) return;

  const { error } = await getClient()
    .from('users')
    .update({ status: status.toUpperCase() })
    .eq('id', userId);

  if (error) throw error;
};

export const listMenteesByMentor = async (mentorId) => {
  if (!isBackendConnected()) {
    return MockData.mentorDashboard?.mentees || [];
  }

  const supabase = getClient();

  // Users table has no mentor_id — mentees are linked via batches
  const { data: batches } = await supabase
    .from('batches')
    .select('id')
    .eq('mentor_id', mentorId);

  if (!batches || batches.length === 0) return [];

  const batchIds = batches.map(b => b.id);
  const { data: batchMembers, error } = await supabase
    .from('batch_members')
    .select('user_id, users(*, user_roles(role))')
    .in('batch_id', batchIds);

  if (error) throw error;

  // Deduplicate by user id
  const seen = new Set();
  const mentees = [];
  for (const bm of batchMembers) {
    if (bm.users && !seen.has(bm.users.id)) {
      seen.add(bm.users.id);
      const u = toCamel(bm.users);
      u.roles = (bm.users.user_roles || []).map(r => r.role.toLowerCase());
      u.name = [u.firstName, u.lastName].filter(Boolean).join(' ') || u.email;
      mentees.push(u);
    }
  }
  return mentees;
};

export const listPendingUsers = async () => {
  if (!isBackendConnected()) {
    return MockData.pendingMentorApplications || [];
  }

  const { data, error } = await getClient()
    .from('users')
    .select('*, user_roles(role)')
    .eq('status', 'PENDING')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data.map(row => {
    const u = toCamel(row);
    u.roles = (row.user_roles || []).map(r => r.role.toLowerCase());
    u.name = [u.firstName, u.lastName].filter(Boolean).join(' ') || u.email;
    return u;
  });
};
