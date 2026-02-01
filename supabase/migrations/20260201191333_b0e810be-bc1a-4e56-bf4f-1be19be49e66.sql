-- Remove the overly permissive policies that expose user_id
DROP POLICY IF EXISTS "Anyone can read speed tests for public view" ON public.wifi_speed_tests;
DROP POLICY IF EXISTS "Anyone can read votes for aggregation" ON public.speed_test_votes;

-- The views need to work without giving direct access to base tables
-- Solution: Use security_definer function to fetch data for views
-- This way we can control exactly what data is exposed

-- Create a function that returns public speed test data without user_id
CREATE OR REPLACE FUNCTION public.get_public_speed_tests()
RETURNS TABLE (
  id uuid,
  download_speed numeric,
  upload_speed numeric,
  ping_ms numeric,
  is_stable boolean,
  tested_at timestamptz,
  created_at timestamptz,
  upvotes integer,
  downvotes integer,
  location_type text,
  location_slug text,
  location_name text,
  city_slug text,
  notes text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

-- Create a function that returns aggregated vote counts
CREATE OR REPLACE FUNCTION public.get_vote_counts()
RETURNS TABLE (
  speed_test_id uuid,
  upvotes bigint,
  downvotes bigint
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    speed_test_id,
    count(*) FILTER (WHERE vote_type = 'up') AS upvotes,
    count(*) FILTER (WHERE vote_type = 'down') AS downvotes
  FROM speed_test_votes
  GROUP BY speed_test_id;
$$;

-- Drop and recreate views using the functions
DROP VIEW IF EXISTS public.wifi_speed_tests_public CASCADE;
DROP VIEW IF EXISTS public.speed_test_vote_counts CASCADE;

-- Recreate views using the security definer functions
CREATE VIEW public.wifi_speed_tests_public AS
SELECT * FROM public.get_public_speed_tests();

CREATE VIEW public.speed_test_vote_counts AS
SELECT * FROM public.get_vote_counts();

-- Grant permissions
GRANT SELECT ON public.wifi_speed_tests_public TO anon, authenticated;
GRANT SELECT ON public.speed_test_vote_counts TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_public_speed_tests() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_vote_counts() TO anon, authenticated;

-- Remove redundant policy on user_roles
DROP POLICY IF EXISTS "Block anonymous access" ON public.user_roles;