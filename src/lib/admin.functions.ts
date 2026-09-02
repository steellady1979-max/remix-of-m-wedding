import { createHash, timingSafeEqual } from "node:crypto";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import type { AdminRsvp, AdminWish } from "@/lib/admin.types";

const ADMIN_PASSWORD = "MARIAM2026";

function matchesPassword(input: string, expected: string) {
  const inputHash = createHash("sha256").update(input, "utf8").digest();
  const expectedHash = createHash("sha256").update(expected, "utf8").digest();
  return timingSafeEqual(inputHash, expectedHash);
}

export const getAdminDashboard = createServerFn({ method: "POST" })
  .inputValidator((input) => z.object({ password: z.string().min(1) }).parse(input))
  .handler(async ({ data }) => {
    if (!matchesPassword(data.password.trim(), ADMIN_PASSWORD)) {
      return { ok: false as const, reason: "invalid_password" as const };
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [rsvpResult, wishResult] = await Promise.all([
      supabaseAdmin.from("rsvps").select("*").order("created_at", { ascending: false }),
      supabaseAdmin.from("wishes").select("*").order("created_at", { ascending: false }),
    ]);

    if (rsvpResult.error || wishResult.error) {
      console.error("Admin dashboard data load failed", {
        rsvps: rsvpResult.error?.message,
        wishes: wishResult.error?.message,
      });
      throw new Error("Admin dashboard data could not be loaded");
    }

    return {
      ok: true as const,
      rsvps: (rsvpResult.data ?? []) as AdminRsvp[],
      wishes: (wishResult.data ?? []) as AdminWish[],
    };
  });