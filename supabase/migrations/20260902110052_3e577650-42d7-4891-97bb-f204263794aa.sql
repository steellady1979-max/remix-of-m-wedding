ALTER TABLE public.admin_access ADD COLUMN IF NOT EXISTS access_code text NOT NULL DEFAULT 'MARIAM2026';

INSERT INTO public.admin_access (id, api_secret, access_code)
VALUES (true, encode(gen_random_bytes(24), 'hex'), 'MARIAM2026')
ON CONFLICT (id) DO NOTHING;

CREATE OR REPLACE FUNCTION public.admin_login(_code text)
RETURNS json
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  expected text;
  result json;
BEGIN
  SELECT access_code INTO expected FROM public.admin_access WHERE id;
  IF expected IS NULL OR _code IS NULL OR btrim(_code) <> btrim(expected) THEN
    RETURN json_build_object('ok', false);
  END IF;

  SELECT json_build_object(
    'ok', true,
    'rsvps', COALESCE((SELECT json_agg(r ORDER BY r.created_at DESC) FROM public.rsvps r), '[]'::json),
    'wishes', COALESCE((SELECT json_agg(w ORDER BY w.created_at DESC) FROM public.wishes w), '[]'::json)
  ) INTO result;

  RETURN result;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_login(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_login(text) TO anon, authenticated, service_role;