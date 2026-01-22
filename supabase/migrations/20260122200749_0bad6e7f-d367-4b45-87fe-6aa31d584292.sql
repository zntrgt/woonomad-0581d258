-- Create a public view that excludes user_id for anonymous access
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
FROM public.wifi_speed_tests;

-- Drop the old permissive SELECT policy
DROP POLICY IF EXISTS "Anyone can view speed tests" ON public.wifi_speed_tests;

-- Create restrictive policy - only authenticated users can see their own tests directly
CREATE POLICY "Users can view own speed tests"
ON public.wifi_speed_tests
FOR SELECT
USING (auth.uid() = user_id);

-- Grant SELECT on the public view to anon and authenticated
GRANT SELECT ON public.wifi_speed_tests_public TO anon, authenticated;