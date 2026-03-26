/**
 * api/books.js — Books catalog and reading progress.
 */

import { getClient, isBackendConnected } from './client';
import { toCamel, toSnake } from './helpers';
import { MockData } from '../mockData';

export const listBooks = async () => {
  if (!isBackendConnected()) {
    return MockData.books;
  }

  const { data, error } = await getClient()
    .from('books')
    .select('*')
    .order('title');

  if (error) throw error;
  return data.map(toCamel);
};

export const listBookProgress = async (userId) => {
  if (!isBackendConnected()) {
    return [];
  }

  const { data, error } = await getClient()
    .from('book_progress')
    .select('*, books(title, author, category, total_pages)')
    .eq('user_id', userId);

  if (error) throw error;
  return data.map(toCamel);
};

export const upsertBookProgress = async ({ userId, bookId, pagesRead, completed }) => {
  if (!isBackendConnected()) {
    return { userId, bookId, pagesRead, completed };
  }

  const record = { user_id: userId, book_id: bookId, pages_read: pagesRead || 0, completed: !!completed };
  if (completed) record.completed_at = new Date().toISOString();

  const { data, error } = await getClient()
    .from('book_progress')
    .upsert(record, { onConflict: 'user_id,book_id' })
    .select()
    .single();

  if (error) throw error;
  return toCamel(data);
};
