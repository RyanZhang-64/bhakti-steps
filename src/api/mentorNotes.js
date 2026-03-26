/**
 * api/mentorNotes.js — Mentor private notes on mentees.
 */

import { getClient, isBackendConnected } from './client';
import { toCamel } from './helpers';

export const listNotesByMentee = async (menteeId) => {
  if (!isBackendConnected()) {
    return [];
  }

  const { data, error } = await getClient()
    .from('mentor_notes')
    .select('*')
    .eq('mentee_id', menteeId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data.map(toCamel);
};

export const createNote = async (mentorId, menteeId, content) => {
  if (!isBackendConnected()) {
    return { id: Date.now().toString(), mentorId, menteeId, content, createdAt: new Date().toISOString() };
  }

  const { data, error } = await getClient()
    .from('mentor_notes')
    .insert({ mentor_id: mentorId, mentee_id: menteeId, content })
    .select()
    .single();

  if (error) throw error;
  return toCamel(data);
};
