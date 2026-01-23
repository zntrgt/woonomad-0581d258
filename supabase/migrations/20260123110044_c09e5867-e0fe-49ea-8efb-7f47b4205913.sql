-- Fix overly permissive INSERT policy on price_history
-- Drop the permissive policy
DROP POLICY IF EXISTS "System can insert price history" ON public.price_history;

-- Price history should only be inserted by service role (edge functions)
-- No public INSERT policy needed - edge functions use service role key