/**
 * api/invites.js
 * ──────────────────────────────────────────────────────────────
 * Invite token management for invite-only registration.
 * ──────────────────────────────────────────────────────────────
 */

import { getClient, isBackendConnected } from './client';
import { toCamel } from './helpers';

/**
 * Validate an invite token. Returns the invite record (role, invitedBy, batchId)
 * or throws if expired/used/invalid.
 */
export const validateInvite = async (token) => {
  if (!isBackendConnected()) {
    // Mock: return a fake mentee invite
    return { role: 'mentee', invitedBy: 'mock-admin', batchId: null };
  }

  const { data, error } = await getClient()
    .from('invites')
    .select('*')
    .eq('token', token)
    .is('used_by', null)
    .gt('expires_at', new Date().toISOString())
    .single();

  if (error || !data) throw new Error('Invalid or expired invite link');
  return toCamel(data);
};

/**
 * Create an invite link. Used by admins and mentors.
 * @param {{ role: string, batchId?: string, email?: string }} opts
 * @returns {{ token: string, shareUrl: string }}
 */
export const createInvite = async ({ role, batchId, email }) => {
  if (!isBackendConnected()) {
    const mockToken = 'mock-' + Date.now();
    return { token: mockToken, shareUrl: `bhaktisteps://register?token=${mockToken}` };
  }

  const supabase = getClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('invites')
    .insert({
      role: role.toUpperCase(),
      invited_by: user.id,
      batch_id: batchId || null,
      email: email || null,
    })
    .select('token')
    .single();

  if (error) throw error;
  return {
    token: data.token,
    shareUrl: getInviteShareUrl(data.token),
  };
};

/**
 * Build a shareable deep link URL for an invite token.
 */
export const getInviteShareUrl = (token) => {
  return `bhaktisteps://register?token=${token}`;
};
