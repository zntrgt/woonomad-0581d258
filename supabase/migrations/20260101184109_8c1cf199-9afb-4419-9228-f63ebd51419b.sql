-- Add explicit policies to prevent anonymous access and direct modifications to user_roles

-- Prevent anonymous SELECT (only authenticated users can view their own roles - already exists)
-- But let's add explicit deny for anon role
CREATE POLICY "Block anonymous access"
  ON public.user_roles FOR SELECT
  TO anon
  USING (false);

-- Prevent all direct INSERT by users (only system triggers can insert)
CREATE POLICY "Only system can assign roles"
  ON public.user_roles FOR INSERT
  TO authenticated
  WITH CHECK (false);

-- Prevent all UPDATE by users
CREATE POLICY "Roles cannot be changed"
  ON public.user_roles FOR UPDATE
  TO authenticated
  USING (false);

-- Prevent all DELETE by users
CREATE POLICY "Roles cannot be deleted"
  ON public.user_roles FOR DELETE
  TO authenticated
  USING (false);