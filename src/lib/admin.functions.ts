import { createServerFn } from "@tanstack/react-start";

const ACCESS_CODE = "MARIAM2026";

export type AdminRsvp = {
  id: string;
  attending: boolean;
  guest_name: string | null;
  plus_one: boolean;
  plus_one_name: string | null;
  created_at: string;
};

export type AdminWish = { id: string; message: string; created_at: string };

export const getAdminData = createServerFn({ method: "POST" })
  .inputValidator((input: { code: string }) => ({ code: String(input?.code ?? "") }))
  .handler(async ({ data }): Promise<{ rsvps: AdminRsvp[]; wishes: AdminWish[] }> => {
    if (data.code.trim() !== ACCESS_CODE) {
      throw new Error("INVALID_CODE");
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [r, w] = await Promise.all([
      supabaseAdmin.from("rsvps").select("*").order("created_at", { ascending: false }),
      supabaseAdmin.from("wishes").select("*").order("created_at", { ascending: false }),
    ]);
    if (r.error || w.error) throw new Error("LOAD_FAILED");
    return {
      rsvps: (r.data ?? []) as AdminRsvp[],
      wishes: (w.data ?? []) as AdminWish[],
    };
  });
