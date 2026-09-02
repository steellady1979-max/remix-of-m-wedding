/**
 * Shapes returned by the `admin_login` security-definer function.
 * These mirror the real database columns of `rsvps` / `wishes`.
 */
export type AdminRsvp = {
  id: string;
  attending: boolean;
  guest_name: string | null;
  plus_one: boolean;
  plus_one_name: string | null;
  created_at: string;
};

export type AdminWish = { id: string; message: string; created_at: string };

/** Tolerant row normalizer — never throws on partial / legacy payloads. */
export function normalizeRsvp(row: unknown): AdminRsvp | null {
  if (!row || typeof row !== "object") return null;
  const r = row as Record<string, unknown>;
  if (typeof r.id !== "string") return null;
  return {
    id: r.id,
    attending: Boolean(r.attending),
    guest_name:
      typeof r.guest_name === "string"
        ? r.guest_name
        : typeof r.full_name === "string"
          ? r.full_name
          : null,
    plus_one:
      typeof r.plus_one === "boolean"
        ? r.plus_one
        : typeof r.guests === "number"
          ? r.guests > 1
          : false,
    plus_one_name: typeof r.plus_one_name === "string" ? r.plus_one_name : null,
    created_at: typeof r.created_at === "string" ? r.created_at : new Date().toISOString(),
  };
}

export function normalizeWish(row: unknown): AdminWish | null {
  if (!row || typeof row !== "object") return null;
  const w = row as Record<string, unknown>;
  if (typeof w.id !== "string" || typeof w.message !== "string") return null;
  return {
    id: w.id,
    message: w.message,
    created_at: typeof w.created_at === "string" ? w.created_at : new Date().toISOString(),
  };
}
