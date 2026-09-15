import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

/**
 * Public wedding database connection.
 *
 * These are publishable browser credentials (not secrets). Keeping the
 * canonical project connection here prevents hosting-provider environment
 * variables from silently pointing RSVP requests at a different project.
 */
const DATABASE_URL = "https://ydngzyifrabegebiwrpc.supabase.co";
const DATABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlkbmd6eWlmcmFiZWdlYml3cnBjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk0NzA3ODUsImV4cCI6MjEwNTA0Njc4NX0.lwGeZNXfOQcVi_fZQuhNaOm5c1-3E-5EU8lfBnhlAfo";

function publicDatabaseFetch(input: RequestInfo | URL, init?: RequestInit) {
  const headers = new Headers(
    typeof Request !== "undefined" && input instanceof Request ? input.headers : undefined,
  );

  if (init?.headers) {
    new Headers(init.headers).forEach((value, key) => headers.set(key, value));
  }

  if (headers.get("Authorization") === `Bearer ${DATABASE_PUBLISHABLE_KEY}`) {
    headers.delete("Authorization");
  }
  headers.set("apikey", DATABASE_PUBLISHABLE_KEY);

  return fetch(input, { ...init, headers });
}

export const weddingDatabase = createClient<Database>(
  DATABASE_URL,
  DATABASE_PUBLISHABLE_KEY,
  {
    global: { fetch: publicDatabaseFetch },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  },
);
