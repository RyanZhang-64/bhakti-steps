-- add_missing_columns.sql
-- Run this in the Supabase SQL Editor.
-- Adds columns that the app writes to but were not in the original schema.

-- ── users table ───────────────────────────────────────────────
-- Profile fields stored directly on the user row.

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS phone              TEXT,
  ADD COLUMN IF NOT EXISTS japa_target        INT  DEFAULT 16,
  ADD COLUMN IF NOT EXISTS initiated_name     TEXT,
  ADD COLUMN IF NOT EXISTS initiation_year    INT,
  ADD COLUMN IF NOT EXISTS spiritual_master   TEXT,
  ADD COLUMN IF NOT EXISTS dob                TEXT,
  ADD COLUMN IF NOT EXISTS address            TEXT;

-- ── seva_logs table ───────────────────────────────────────────
-- department_id links to reference_items; description is the log text.

ALTER TABLE public.seva_logs
  ADD COLUMN IF NOT EXISTS department_id UUID REFERENCES public.reference_items(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS description   TEXT;
