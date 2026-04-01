-- get_admin_kpis() RPC
-- Run this in the Supabase SQL Editor (or via a migration) once.
-- It computes live KPIs from the database so the Admin Dashboard
-- shows real numbers instead of MockData fallbacks.

CREATE OR REPLACE FUNCTION get_admin_kpis()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER   -- runs as function owner, not the calling user
AS $$
DECLARE
  active_users         int;
  active_users_prev    int;
  pending_approvals    int;
  avg_score            numeric;
  avg_score_prev       numeric;
  seva_hours           numeric;
  course_completions   int;
  pending_courses      int;
BEGIN
  -- Active users (status = 'ACTIVE')
  SELECT COUNT(*) INTO active_users
    FROM public.users WHERE status = 'ACTIVE';

  SELECT COUNT(*) INTO active_users_prev
    FROM public.users
    WHERE status = 'ACTIVE'
      AND created_at < now() - interval '30 days';

  -- Pending mentor applications (users with MENTOR role + status PENDING)
  SELECT COUNT(*) INTO pending_approvals
    FROM public.user_roles ur
    JOIN public.users u ON u.id = ur.user_id
    WHERE ur.role = 'MENTOR' AND u.status = 'PENDING';

  -- Average sadhana score over last 30 days
  SELECT ROUND(AVG(total_score), 0) INTO avg_score
    FROM public.sadhana_entries
    WHERE date >= (now() - interval '30 days')::date;

  SELECT ROUND(AVG(total_score), 0) INTO avg_score_prev
    FROM public.sadhana_entries
    WHERE date >= (now() - interval '60 days')::date
      AND date <  (now() - interval '30 days')::date;

  -- Seva hours logged this calendar month
  SELECT COALESCE(SUM(hours), 0) INTO seva_hours
    FROM public.seva_logs
    WHERE date >= date_trunc('month', now())::date;

  -- Course completions this month
  SELECT COUNT(*) INTO course_completions
    FROM public.course_completions
    WHERE status = 'APPROVED'
      AND reviewed_at >= date_trunc('month', now());

  -- Pending course approvals
  SELECT COUNT(*) INTO pending_courses
    FROM public.course_completions
    WHERE status = 'PENDING';

  RETURN jsonb_build_array(
    jsonb_build_object(
      'label', 'Active Users',
      'value', active_users::text,
      'trend', CASE
        WHEN active_users > active_users_prev THEN 'up'
        WHEN active_users < active_users_prev THEN 'down'
        ELSE 'flat'
      END
    ),
    jsonb_build_object(
      'label', 'Pending Approvals',
      'value', pending_approvals::text,
      'trend', 'flat'
    ),
    jsonb_build_object(
      'label', 'Avg Score',
      'value', COALESCE(avg_score, 0)::text,
      'trend', CASE
        WHEN avg_score > avg_score_prev THEN 'up'
        WHEN avg_score < avg_score_prev THEN 'down'
        ELSE 'flat'
      END
    ),
    jsonb_build_object(
      'label', 'Seva Hours',
      'value', TRUNC(seva_hours)::text,
      'subtitle', 'This month'
    ),
    jsonb_build_object(
      'label', 'Course Completions',
      'value', course_completions::text,
      'pending', pending_courses
    )
  );
END;
$$;

-- Grant execute to the authenticated role so the JS client can call it
GRANT EXECUTE ON FUNCTION get_admin_kpis() TO authenticated;
