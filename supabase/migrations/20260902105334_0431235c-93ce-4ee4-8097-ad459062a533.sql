CREATE TABLE IF NOT EXISTS public.admin_access (
  id boolean PRIMARY KEY DEFAULT true CHECK (id),
  api_secret text NOT NULL
);
GRANT ALL ON public.admin_access TO service_role;
ALTER TABLE public.admin_access ENABLE ROW LEVEL SECURITY;

INSERT INTO public.admin_access (id, api_secret)
VALUES (true, '1a911c423bb4703de95f69492aef2daab3575306574586a9')
ON CONFLICT (id) DO UPDATE SET api_secret = EXCLUDED.api_secret;

CREATE OR REPLACE FUNCTION public.admin_dashboard(_secret text)
RETURNS json
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  expected text;
  result json;
BEGIN
  SELECT api_secret INTO expected FROM public.admin_access WHERE id;
  IF expected IS NULL OR _secret IS NULL OR _secret <> expected THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  SELECT json_build_object(
    'rsvps', COALESCE((SELECT json_agg(r ORDER BY r.created_at DESC) FROM public.rsvps r), '[]'::json),
    'wishes', COALESCE((SELECT json_agg(w ORDER BY w.created_at DESC) FROM public.wishes w), '[]'::json)
  ) INTO result;

  RETURN result;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_dashboard(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_dashboard(text) TO anon, authenticated, service_role;