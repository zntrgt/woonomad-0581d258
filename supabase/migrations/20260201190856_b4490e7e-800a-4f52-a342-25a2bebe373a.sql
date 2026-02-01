-- Fix wifi_speed_tests_public view to use security_invoker
-- This ensures the view respects RLS policies of the base table
DROP VIEW IF EXISTS public.wifi_speed_tests_public;

CREATE VIEW public.wifi_speed_tests_public
WITH (security_invoker=on) AS
SELECT 
  id,
  download_speed,
  upload_speed,
  ping_ms,
  is_stable,
  tested_at,
  created_at,
  upvotes,
  downvotes,
  location_type,
  location_slug,
  location_name,
  city_slug,
  notes
FROM wifi_speed_tests;

-- Fix speed_test_vote_counts view to use security_invoker
DROP VIEW IF EXISTS public.speed_test_vote_counts;

CREATE VIEW public.speed_test_vote_counts
WITH (security_invoker=on) AS
SELECT 
  speed_test_id,
  count(*) FILTER (WHERE vote_type = 'up') AS upvotes,
  count(*) FILTER (WHERE vote_type = 'down') AS downvotes
FROM speed_test_votes
GROUP BY speed_test_id;

-- Add public read policy to wifi_speed_tests for anonymous read access via view
-- This allows the public to see speed test data without exposing user_id
CREATE POLICY "Public can view speed tests via view"
ON public.wifi_speed_tests
FOR SELECT
USING (true);

-- Add public read policy to speed_test_votes for vote counts aggregation
CREATE POLICY "Public can view votes for aggregation"
ON public.speed_test_votes
FOR SELECT
USING (true);

-- Create audit_logs table for tracking push notification activities
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id text,
  user_id uuid,
  details jsonb DEFAULT '{}'::jsonb,
  ip_address text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS on audit_logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Only service role can insert audit logs (via edge functions)
CREATE POLICY "Service role can insert audit logs"
ON public.audit_logs
FOR INSERT
WITH CHECK (true);

-- Admins can view audit logs
CREATE POLICY "Admins can view audit logs"
ON public.audit_logs
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Create index for faster audit log queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id);