-- Drop existing restrictive policies and recreate as permissive
DROP POLICY IF EXISTS "Admins can view all posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Anyone can view published posts" ON public.blog_posts;

-- Create permissive policies (OR logic - any matching policy grants access)
CREATE POLICY "Admins can view all posts" 
ON public.blog_posts 
FOR SELECT 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view published posts" 
ON public.blog_posts 
FOR SELECT 
TO public
USING (published = true);