
-- Drop permissive UPDATE policy
DROP POLICY "Anyone can update urls" ON public.urls;

-- Create a secure function to increment clicks (server-side only)
CREATE OR REPLACE FUNCTION public.increment_clicks(code TEXT)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.urls SET clicks = clicks + 1 WHERE short_code = code;
$$;
