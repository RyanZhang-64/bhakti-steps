/**
 * api/courses.js — Course catalog and completions.
 */

import { getClient, isBackendConnected } from './client';
import { toCamel, toSnake } from './helpers';
import { MockData } from '../mockData';

export const listCourses = async () => {
  if (!isBackendConnected()) {
    return MockData.courses;
  }

  const { data, error } = await getClient()
    .from('courses')
    .select('*')
    .eq('is_active', true)
    .order('title');

  if (error) throw error;
  return data.map(toCamel);
};

export const listCourseCompletions = async (userId) => {
  if (!isBackendConnected()) {
    return [];
  }

  const { data, error } = await getClient()
    .from('course_completions')
    .select('*, courses(title, level)')
    .eq('user_id', userId)
    .order('submitted_at', { ascending: false });

  if (error) throw error;
  return data.map(toCamel);
};

export const submitCourseCompletion = async ({ userId, courseId, notes }) => {
  if (!isBackendConnected()) {
    return { id: Date.now().toString(), userId, courseId, status: 'pending' };
  }

  const { data, error } = await getClient()
    .from('course_completions')
    .insert({ user_id: userId, course_id: courseId })
    .select()
    .single();

  if (error) throw error;
  return toCamel(data);
};

export const reviewCourseCompletion = async (id, { status, reviewNotes, reviewedBy }) => {
  if (!isBackendConnected()) {
    return { id, status };
  }

  const { data, error } = await getClient()
    .from('course_completions')
    .update({
      status: status.toUpperCase(),
      review_notes: reviewNotes,
      reviewed_by: reviewedBy,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return toCamel(data);
};

/** List pending completions for mentor approval */
export const listPendingApprovals = async () => {
  if (!isBackendConnected()) {
    return MockData.pendingApprovals || [];
  }

  const { data, error } = await getClient()
    .from('course_completions')
    .select('*, users!course_completions_user_id_fkey(first_name, last_name, email), courses(title)')
    .eq('status', 'PENDING')
    .order('submitted_at', { ascending: false });

  if (error) throw error;
  return data.map(toCamel);
};
