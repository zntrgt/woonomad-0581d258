-- speed_test_vote_counts view'ı için RLS zaten aktif edilemez çünkü view
-- Ancak view security_invoker=on olarak yeniden oluşturulmalı

-- Önce mevcut view'ı drop edelim
DROP VIEW IF EXISTS public.speed_test_vote_counts;

-- View'ı security_invoker ile yeniden oluşturalım
CREATE VIEW public.speed_test_vote_counts
WITH (security_invoker = on) AS
SELECT 
  speed_test_id,
  SUM(CASE WHEN vote_type = 'up' THEN 1 ELSE 0 END)::integer AS upvotes,
  SUM(CASE WHEN vote_type = 'down' THEN 1 ELSE 0 END)::integer AS downvotes
FROM public.speed_test_votes
GROUP BY speed_test_id;

-- View için yorum ekle
COMMENT ON VIEW public.speed_test_vote_counts IS 'Public view for aggregated vote counts - uses security_invoker for RLS compliance';