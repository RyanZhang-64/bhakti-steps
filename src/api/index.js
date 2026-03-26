/**
 * api/index.js
 * ──────────────────────────────────────────────────────────────
 * Barrel export for all API services.
 * ──────────────────────────────────────────────────────────────
 */

export { initApiClient, isBackendConnected } from './client';
export * as AuthService from './auth';
export * as InviteService from './invites';
export * as SadhanaService from './sadhana';
export * as SevaService from './seva';
export * as BookService from './books';
export * as CourseService from './courses';
export * as BatchService from './batches';
export * as MentorNoteService from './mentorNotes';
export * as UserService from './users';
export * as AdminService from './admin';
