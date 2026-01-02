-- Fix user_roles RLS policies: Remove conflicting RESTRICTIVE policies
-- Drop the conflicting "Block anonymous access" policy that prevents legitimate access
DROP POLICY IF EXISTS "Block anonymous access" ON public.user_roles;

-- Recreate user_roles policies as PERMISSIVE to allow proper access
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;

CREATE POLICY "Users can view own roles" 
ON public.user_roles 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Add explicit anonymous block (PERMISSIVE with false still blocks)
CREATE POLICY "Block anonymous access" 
ON public.user_roles 
FOR SELECT 
TO anon
USING (false);

-- Fix profiles table: Add explicit anonymous denial
DROP POLICY IF EXISTS "Block anonymous access to profiles" ON public.profiles;

CREATE POLICY "Block anonymous access to profiles" 
ON public.profiles 
FOR SELECT 
TO anon
USING (false);

-- Ensure profiles only allows authenticated users to see their own data
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (auth.uid() = id);