-- Fix profiles RLS policies
-- Issue: All policies are RESTRICTIVE, which means ALL must pass (AND logic)
-- Having "Block anonymous access" with (false) blocks EVERYONE including authenticated users

-- Drop the problematic restrictive policies
DROP POLICY IF EXISTS "Block anonymous access to profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Create PERMISSIVE policy for authenticated users to view their own profile
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Create PERMISSIVE policy for users to insert their own profile
CREATE POLICY "Users can insert own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Create PERMISSIVE policy for users to update their own profile
CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Add RESTRICTIVE policy to explicitly block anonymous access as extra security layer
CREATE POLICY "Block anonymous access to profiles"
ON public.profiles
AS RESTRICTIVE
FOR ALL
TO anon
USING (false);