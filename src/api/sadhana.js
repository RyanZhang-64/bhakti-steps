/**
 * api/sadhana.js
 * ──────────────────────────────────────────────────────────────
 * Sadhana entry CRUD operations.
 * Falls back to MockData when Amplify is not configured.
 * ──────────────────────────────────────────────────────────────
 */

import { getClient, isBackendConnected } from './client';
import { MockData } from '../mockData';

const LIST_SADHANA = /* GraphQL */ `
  query SadhanaByUserDate($userId: ID!, $date: ModelStringKeyConditionInput, $limit: Int, $nextToken: String) {
    sadhanaByUserDate(userId: $userId, date: $date, limit: $limit, nextToken: $nextToken, sortDirection: DESC) {
      items {
        id userId date japaRounds score mood
        mangalaArati japaMeditation guruPuja bhagavatamClass tulasiPuja eveningKirtana
        bookReadingMinutes createdAt
      }
      nextToken
    }
  }
`;

const CREATE_SADHANA = /* GraphQL */ `
  mutation CreateSadhanaEntry($input: CreateSadhanaEntryInput!) {
    createSadhanaEntry(input: $input) {
      id userId date japaRounds score mood
    }
  }
`;

/**
 * Fetch sadhana entries for a user, optionally filtered by date range.
 * @param {string} userId
 * @param {object} opts - { limit, nextToken, dateFrom, dateTo }
 * @returns {{ items: Array, nextToken: string|null }}
 */
export const listSadhanaEntries = async (userId, { limit = 30, nextToken = null, dateFrom, dateTo } = {}) => {
  if (!isBackendConnected()) {
    const items = MockData.submissionHistory.map((entry, i) => ({
      id: String(i),
      userId,
      date: entry.date,
      japaRounds: 16,
      score: entry.score,
      mood: entry.mood,
      mangalaArati: entry.mp[0],
      japaMeditation: entry.mp[1],
      guruPuja: entry.mp[2],
      bhagavatamClass: entry.mp[3],
      tulasiPuja: entry.mp[4],
      eveningKirtana: entry.mp[5],
    }));
    return { items: items.slice(0, limit), nextToken: null };
  }

  const dateCondition = {};
  if (dateFrom && dateTo) {
    dateCondition.between = [dateFrom, dateTo];
  } else if (dateFrom) {
    dateCondition.ge = dateFrom;
  }

  const result = await getClient().graphql({
    query: LIST_SADHANA,
    variables: {
      userId,
      date: Object.keys(dateCondition).length ? dateCondition : undefined,
      limit,
      nextToken,
    },
  });

  return result.data.sadhanaByUserDate;
};

/**
 * Submit a new sadhana entry.
 */
export const createSadhanaEntry = async (entry) => {
  if (!isBackendConnected()) {
    return { id: Date.now().toString(), ...entry };
  }

  const result = await getClient().graphql({
    query: CREATE_SADHANA,
    variables: { input: entry },
  });

  return result.data.createSadhanaEntry;
};
