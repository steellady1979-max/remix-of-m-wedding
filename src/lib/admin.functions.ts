import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

export type AdminRsvp = {
  id: string;
  attending: boolean;
  guest_name: string | null;
  plus_one: boolean;
  plus_one_name: string | null;
  created_at: string;
};

const DEFAULT_DB_SECRET = "1a911c423bb4703de95f69492aef2daab3575306574586a9";

export type AdminWish = { id: string; message: string; created_at: string };

export const getAdminData = createServerFn({ method: "POST" })
  .inputValidator((input: { code: string }) => ({ code: String(input?.code ?? "") }))
  .handler(async ({ data }): Promise<{ rsvps: AdminRsvp[]; wishes: AdminWish[] }> => {
    const expectedCode = process.env["ADMIN_ACCESS_CODE"] ?? "MARIAM2026";
    if (data.code.trim() !== expectedCode.trim()) {
      throw new Error("INVALID_CODE");
    }

    const url = process.env["SUPABASE_URL"] ?? process.env["VITE_SUPABASE_URL"];
    const key =
      process.env["SUPABASE_PUBLISHABLE_KEY"] ?? process.env["VITE_SUPABASE_PUBLISHABLE_KEY"];
    const dbSecret = process.env["ADMIN_DB_SECRET"] ?? DEFAULT_DB_SECRET;
    if (!url || !key) throw new Error("MISCONFIGURED");

    const supabase = createClient(url, key, {
      auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) => {
          const h = new Headers(init?.headers);
          if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
            h.delete("Authorization");
          }
          h.set("apikey", key);
          return fetch(input, { ...init, headers: h });
        },
      },
    });

    const { data: result, error } = await supabase.rpc("admin_dashboard", {
      _secret: dbSecret,
    });
    if (error) throw new Error(`LOAD_FAILED:${error.message}`);

    const payload = (result ?? {}) as { rsvps?: AdminRsvp[]; wishes?: AdminWish[] };
    return { rsvps: payload.rsvps ?? [], wishes: payload.wishes ?? [] };
  });
