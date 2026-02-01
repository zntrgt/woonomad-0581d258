-- View'lar RLS'den etkilenmez, ancak erişim izinleri gerekir
-- Postgres'te view'lar base table'ın RLS'ini bypass edebilir eğer doğru yapılandırılırsa

-- Drop existing views and recreate with proper permissions
DROP VIEW IF EXISTS public.wifi_speed_tests_public CASCADE;
DROP VIEW IF EXISTS public.speed_test_vote_counts CASCADE;

-- Recreate wifi_speed_tests_public view
-- This view intentionally excludes user_id for privacy
CREATE OR REPLACE VIEW public.wifi_speed_tests_public AS
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

-- Recreate speed_test_vote_counts view
-- This view shows aggregated vote counts without exposing individual user votes
CREATE OR REPLACE VIEW public.speed_test_vote_counts AS
SELECT 
  speed_test_id,
  count(*) FILTER (WHERE vote_type = 'up') AS upvotes,
  count(*) FILTER (WHERE vote_type = 'down') AS downvotes
FROM speed_test_votes
GROUP BY speed_test_id;

-- Grant SELECT permissions to make views publicly accessible
GRANT SELECT ON public.wifi_speed_tests_public TO anon;
GRANT SELECT ON public.wifi_speed_tests_public TO authenticated;
GRANT SELECT ON public.speed_test_vote_counts TO anon;
GRANT SELECT ON public.speed_test_vote_counts TO authenticated;

-- These views don't have RLS since they're views (not tables)
-- The security comes from:
-- 1. Views only expose non-sensitive columns (no user_id)
-- 2. Views are read-only by nature
-- 3. GRANT controls who can SELECT from them