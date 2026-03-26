/**
 * api/auth.js
 * ──────────────────────────────────────────────────────────────
 * Authentication service — wraps Cognito Auth calls.
 * Falls back to mock auth when Amplify is not configured.
 * ──────────────────────────────────────────────────────────────
 */

import { isBackendConnected } from './client';
import { MockData } from '../mockData';

/**
 * Sign in with email and password.
 * Returns: { user, roles, firstName, defaultRole, status }
 */
export const signIn = async (email, password) => {
  if (!isBackendConnected()) {
    // Mock fallback — same logic as current LoginScreen
    const account = MockData.accounts.find(a => a.email === email);
    if (!account) throw new Error('Account not found');
    if (password !== 'bhakti123') throw new Error('Incorrect password');
    return account;
  }

  const { signIn: amplifySignIn } = require('aws-amplify/auth');
  const result = await amplifySignIn({ username: email, password });

  if (!result.isSignedIn) {
    throw new Error('Sign-in failed');
  }

  // Fetch user attributes and groups
  const { fetchUserAttributes, fetchAuthSession } = require('aws-amplify/auth');
  const attributes = await fetchUserAttributes();
  const session = await fetchAuthSession();
  const groups = session.tokens?.accessToken?.payload?.['cognito:groups'] || [];

  return {
    email,
    firstName: attributes.given_name || attributes.email.split('@')[0],
    lastName: attributes.family_name || '',
    roles: groups.map(g => g.toLowerCase()),
    defaultRole: groups[0]?.toLowerCase() || 'mentee',
    status: 'active',
  };
};

/**
 * Register a new account.
 */
export const signUp = async ({ email, password, firstName, lastName, phone, role }) => {
  if (!isBackendConnected()) {
    // Mock fallback
    return {
      email,
      firstName,
      roles: [role],
      defaultRole: role,
      status: role === 'mentor' ? 'pending' : 'active',
    };
  }

  const { signUp: amplifySignUp } = require('aws-amplify/auth');
  await amplifySignUp({
    username: email,
    password,
    options: {
      userAttributes: {
        email,
        given_name: firstName,
        family_name: lastName || '',
        phone_number: phone || '',
      },
    },
  });

  return {
    email,
    firstName,
    roles: [role],
    defaultRole: role,
    status: role === 'mentor' ? 'pending' : 'active',
  };
};

/**
 * Sign out the current user.
 */
export const signOut = async () => {
  if (!isBackendConnected()) return;

  const { signOut: amplifySignOut } = require('aws-amplify/auth');
  await amplifySignOut();
};

/**
 * Get the current authenticated user, or null.
 */
export const getCurrentUser = async () => {
  if (!isBackendConnected()) return null;

  try {
    const { getCurrentUser: amplifyGetCurrentUser } = require('aws-amplify/auth');
    return await amplifyGetCurrentUser();
  } catch {
    return null;
  }
};
