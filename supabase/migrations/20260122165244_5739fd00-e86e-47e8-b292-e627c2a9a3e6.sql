-- Drop the profiles table and update the trigger function

-- Drop the profiles table (this will also drop its RLS policies)
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Update handle_new_user function to only insert into user_roles (remove profiles insert)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only insert into user_roles, profiles table is removed
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;