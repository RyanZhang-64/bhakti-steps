/**
 * api/auth.js
 * ──────────────────────────────────────────────────────────────
 * Authentication service — wraps Supabase Auth calls.
 * Falls back to mock auth when Supabase is not configured.
 * ──────────────────────────────────────────────────────────────
 */

import { getClient, isBackendConnected } from './client';
import { MockData } from '../mockData';

/**
 * Sign in with email and password.
 * Returns: { id, email, firstName, roles, defaultRole, status }
 */
export const signIn = async (email, password) => {
  if (!isBackendConnected()) {
    const account = MockData.accounts.find(a => a.email === email);
    if (!account) throw new Error('Account not found');
    if (password !== 'bhakti123') throw new Error('Incorrect password');
    return account;
  }

  const supabase = getClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;

  const { data: profile } = await supabase
    .from('users')
    .select('*, user_roles(role)')
    .eq('id', data.user.id)
    .single();

  const roles = (profile.user_roles || []).map(r => r.role.toLowerCase());
  return {
    id: profile.id,
    email: profile.email,
    firstName: profile.first_name,
    lastName: profile.last_name,
    roles,
    defaultRole: roles[0] || 'mentee',
    status: profile.status.toLowerCase(),
  };
};

/**
 * Register a new account via invite token.
 * The invite determines the user's role and optional batch assignment.
 */
export const signUp = async ({ token, email, password, firstName, lastName, phone, dob, address }) => {
  if (!isBackendConnected()) {
    return {
      email,
      firstName,
      roles: ['mentee'],
      defaultRole: 'mentee',
      status: 'active',
    };
  }

  const supabase = getClient();

  // Validate invite token
  const { data: invite, error: inviteErr } = await supabase
    .from('invites')
    .select('*')
    .eq('token', token)
    .is('used_by', null)
    .gt('expires_at', new Date().toISOString())
    .single();

  if (inviteErr || !invite) throw new Error('Invalid or expired invite link');

  // Create auth user — trigger auto-creates users + user_roles rows
  const { data: authData, error: authErr } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName || '',
        phone: phone || '',
        role: invite.role,
      },
    },
  });
  if (authErr) throw authErr;

  const userId = authData.user.id;

  // Update user profile with extra fields
  await supabase.from('users').update({
    date_of_birth: dob || null,
    phone: phone || null,
  }).eq('id', userId);

  // Auto-assign to batch if invite includes one
  if (invite.batch_id) {
    await supabase.from('batch_members').insert({
      batch_id: invite.batch_id,
      user_id: userId,
    });
  }

  // Mark invite as used
  await supabase.from('invites').update({
    used_by: userId,
    used_at: new Date().toISOString(),
  }).eq('id', invite.id);

  const role = invite.role.toLowerCase();
  return {
    id: userId,
    email,
    firstName,
    roles: [role],
    defaultRole: role,
    status: 'active',
  };
};

/**
 * Sign out the current user.
 */
export const signOut = async () => {
  if (!isBackendConnected()) return;
  await getClient().auth.signOut();
};

/**
 * Get the current authenticated user, or null.
 */
export const getCurrentUser = async () => {
  if (!isBackendConnected()) return null;
  try {
    const { data: { user } } = await getClient().auth.getUser();
    return user;
  } catch {
    return null;
  }
};
