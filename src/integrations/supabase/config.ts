/** One build-time connection for the browser, SSR and auth middleware. */
export function validateSupabaseConfig(rawUrl?: string, rawKey?: string) {
  const url = rawUrl?.trim();
  const key = rawKey?.trim();
  if (!url || !key) {
    throw new Error('Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY before building the app.');
  }
  const parsed = new URL(url);
  if (!['https:', 'http:'].includes(parsed.protocol) || parsed.username || parsed.password || parsed.search || parsed.hash || parsed.pathname !== '/') {
    throw new Error('VITE_SUPABASE_URL must be the Supabase project base URL.');
  }
  if (!key.startsWith('sb_publishable_')) {
    let payload;
    try {
      const encoded = key.split('.')[1];
      if (!encoded) throw new Error('Missing JWT payload');
      payload = JSON.parse(atob(encoded.replace(/-/g, '+').replace(/_/g, '/')));
    } catch {
      throw new Error('VITE_SUPABASE_ANON_KEY must be a public anon JWT or publishable key.');
    }
    if (payload.role !== 'anon') {
      throw new Error('Only a public anon or publishable key may be used in the browser.');
    }
    if (payload.ref && parsed.hostname.endsWith('.supabase.co') && parsed.hostname !== `${payload.ref}.supabase.co`) {
      throw new Error('The Supabase URL and anon key belong to different projects.');
    }
  }
  return { url: parsed.origin, key };
}

export function getSupabaseConfig() {
  return validateSupabaseConfig(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY,
  );
}
