-- Fix Security Definer View warnings by using security_invoker
-- This ensures views respect the RLS policies of the querying user

DROP VIEW IF EXISTS public.wifi_speed_tests_public CASCADE;
DROP VIEW IF EXISTS public.speed_test_vote_counts CASCADE;

-- Recreate wifi_speed_tests_public view with security_invoker
CREATE VIEW public.wifi_speed_tests_public
WITH (security_invoker = on) AS
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

-- Recreate speed_test_vote_counts view with security_invoker
CREATE VIEW public.speed_test_vote_counts
WITH (security_invoker = on) AS
SELECT 
  speed_test_id,
  count(*) FILTER (WHERE vote_type = 'up') AS upvotes,
  count(*) FILTER (WHERE vote_type = 'down') AS downvotes
FROM speed_test_votes
GROUP BY speed_test_id;

-- Now we need to add SELECT policies to the base tables for the views to work
-- These policies only allow SELECT (read) access, not write access

-- For wifi_speed_tests: allow public read access (user_id not exposed via view)
CREATE POLICY "Anyone can read speed tests for public view"
ON public.wifi_speed_tests
FOR SELECT
USING (true);

-- For speed_test_votes: allow public read access for vote aggregation
CREATE POLICY "Anyone can read votes for aggregation"
ON public.speed_test_votes
FOR SELECT
USING (true);

-- Grant SELECT permissions on views
GRANT SELECT ON public.wifi_speed_tests_public TO anon, authenticated;
GRANT SELECT ON public.speed_test_vote_counts TO anon, authenticated;