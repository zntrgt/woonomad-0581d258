-- Fix Security Definer View warnings
-- Recreate views with security_invoker option

DROP VIEW IF EXISTS public.wifi_speed_tests_public CASCADE;
DROP VIEW IF EXISTS public.speed_test_vote_counts CASCADE;

-- Recreate views with security_invoker = on
-- These views call SECURITY DEFINER functions which control the data access
CREATE VIEW public.wifi_speed_tests_public
WITH (security_invoker = on) AS
SELECT * FROM public.get_public_speed_tests();

CREATE VIEW public.speed_test_vote_counts
WITH (security_invoker = on) AS
SELECT * FROM public.get_vote_counts();

-- Grant permissions
GRANT SELECT ON public.wifi_speed_tests_public TO anon, authenticated;
GRANT SELECT ON public.speed_test_vote_counts TO anon, authenticated;