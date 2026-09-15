import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { weddingDatabase } from "@/lib/wedding-database";
import {
  normalizeRsvp,
  normalizeWish,
  type AdminRsvp,
  type AdminWish,
} from "@/lib/admin.types";

const ADMIN_PASSWORD = "GOGALIKA22";


const TITLE = "ადმინ პანელი — გოგა & ლიკა";
const DESCRIPTION = "სტუმრების დასწრების პასუხები და სურვილები.";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/admin" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/admin" }],
  }),
  component: AdminPage,
});

const inputClass =
  "w-full rounded-md border border-olive/25 bg-white px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-olive";

function toCsv(rows: string[][]) {
  return rows
    .map((r) => r.map((c) => `"${(c ?? "").replace(/"/g, '""')}"`).join(","))
    .join("\r\n");
}

function download(name: string, csv: string) {
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

function fmt(iso: string) {
  return new Date(iso).toLocaleString("ka-GE");
}

function AdminPage() {
  const [code, setCode] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rsvps, setRsvps] = useState<AdminRsvp[]>([]);
  const [wishes, setWishes] = useState<AdminWish[]>([]);

  async function load(pass: string) {
    // Password check is 100% local — no database, RPC, or network call involved.
    if (pass.trim() !== ADMIN_PASSWORD) {
      localStorage.removeItem("isAdmin");
      setUnlocked(false);
      setError("პაროლი არასწორია");
      return;
    }

    localStorage.setItem("isAdmin", "true");
    setUnlocked(true);
    setBusy(true);
    setError(null);
    try {
      const { data, error: rpcError } = await weddingDatabase.rpc("admin_login", {
        _code: pass.trim(),
      });
      const payload = data as { ok?: boolean; rsvps?: unknown; wishes?: unknown } | null;
      if (rpcError || !payload?.ok) {
        setError("მონაცემები ვერ ჩაიტვირთა. გთხოვთ, განაახლოთ გვერდი.");
        return;
      }
      const rsvpRows: AdminRsvp[] = (Array.isArray(payload.rsvps) ? payload.rsvps : [])
        .map(normalizeRsvp)
        .filter((r): r is AdminRsvp => r !== null);
      const wishRows: AdminWish[] = (Array.isArray(payload.wishes) ? payload.wishes : [])
        .map(normalizeWish)
        .filter((w): w is AdminWish => w !== null);
      setRsvps(rsvpRows);
      setWishes(wishRows);
    } catch {
      setError("მონაცემები ვერ ჩაიტვირთა. გთხოვთ, განაახლოთ გვერდი.");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    if (localStorage.getItem("isAdmin") === "true") void load(ADMIN_PASSWORD);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  if (!unlocked) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-champagne px-6 font-sans text-ink">
        <div className="w-full max-w-sm rounded-2xl border border-olive/20 bg-white p-8 text-center shadow-[0_20px_50px_-30px_rgba(60,70,40,0.45)]">
          <p className="text-[0.65rem] tracking-[0.45em] text-olive">ადმინი</p>
          <h1 className="mt-4 font-display text-2xl font-light text-olive">პაროლი</h1>
          <div className="hairline mx-auto mt-6 w-24" />
          <form
            className="mt-8 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              void load(code);
            }}
          >
            <input
              className={`${inputClass} text-center tracking-[0.3em]`}
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="პაროლი"
              autoComplete="current-password"
            />
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-full bg-olive px-6 py-3 text-sm tracking-[0.25em] text-white transition-opacity disabled:opacity-40"
            >
              {busy ? "იტვირთება..." : "შესვლა"}
            </button>
            {error && <p className="text-xs text-olive">{error}</p>}
          </form>
        </div>
      </main>
    );
  }

  const yes = rsvps.filter((r) => r.attending);
  const no = rsvps.filter((r) => !r.attending);
  const guests = yes.reduce((n, r) => n + 1 + (r.plus_one ? 1 : 0), 0);
  const loadError: string | null = error;

  return (
    <main className="min-h-screen bg-champagne px-5 py-14 font-sans text-ink sm:px-8">
      <div className="mx-auto w-full max-w-3xl space-y-10">
        <header className="text-center">
          <p className="text-[0.65rem] tracking-[0.45em] text-olive">ადმინ პანელი</p>
          <h1 className="mt-4 font-display text-3xl font-light text-olive">
            გოგა & ლიკა
          </h1>
          <div className="hairline mx-auto mt-6 w-32" />
          <button
            type="button"
            onClick={() => {
              localStorage.removeItem("isAdmin");
              setUnlocked(false);
              setCode("");
            }}
            className="mt-6 text-[0.7rem] tracking-[0.3em] text-ink/50 underline-offset-4 hover:underline"
          >
            გამოსვლა
          </button>
        </header>

        {loadError && <p className="text-center text-sm text-destructive">{loadError}</p>}

        <section className="grid grid-cols-3 gap-3">
          {[
            { label: "მოდის", value: yes.length },
            { label: "სტუმარი სულ", value: guests },
            { label: "ვერ მოდის", value: no.length },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-olive/20 bg-white px-4 py-6 text-center"
            >
              <p className="font-display text-3xl font-light tabular-nums text-olive">{s.value}</p>
              <p className="mt-2 text-[0.6rem] tracking-[0.25em] text-ink/60">{s.label}</p>
            </div>
          ))}
        </section>

        <section className="overflow-hidden rounded-2xl border border-olive/20 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-olive/15 px-5 py-4">
            <h2 className="font-display text-lg font-light text-olive">დასწრების პასუხები</h2>
            <button
              type="button"
              onClick={() =>
                download(
                  "rsvps.csv",
                  toCsv([
                    ["სახელი", "პასუხი", "+1", "თანმხლები", "თარიღი"],
                    ...rsvps.map((r) => [
                      r.guest_name ?? "",
                      r.attending ? "მოდის" : "ვერ მოდის",
                      r.plus_one ? "კი" : "არა",
                      r.plus_one_name ?? "",
                      fmt(r.created_at),
                    ]),
                  ]),
                )
              }
              className="rounded-full bg-olive px-5 py-2 text-[0.7rem] tracking-[0.2em] text-white"
            >
              ექსელში გადმოწერა
            </button>
          </div>
          <ul className="divide-y divide-olive/10">
            {rsvps.length === 0 && (
              <li className="px-5 py-6 text-center text-sm text-ink/50">ჯერ პასუხები არ არის</li>
            )}
            {rsvps.map((r) => (
              <li key={r.id} className="flex items-start justify-between gap-4 px-5 py-4">
                <div>
                  <p className="text-sm text-ink">{r.guest_name || "—"}</p>
                  {r.plus_one && (
                    <p className="mt-1 text-xs text-ink/60">+1: {r.plus_one_name || "—"}</p>
                  )}
                  <p className="mt-1 text-[0.65rem] text-ink/40">{fmt(r.created_at)}</p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-[0.65rem] tracking-[0.15em] ${
                    r.attending ? "bg-olive text-white" : "bg-olive-mist text-olive"
                  }`}
                >
                  {r.attending ? "მოდის" : "ვერ მოდის"}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="overflow-hidden rounded-2xl border border-olive/20 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-olive/15 px-5 py-4">
            <h2 className="font-display text-lg font-light text-olive">სურვილები</h2>
            <button
              type="button"
              onClick={() =>
                download(
                  "wishes.csv",
                  toCsv([
                    ["სურვილი", "თარიღი"],
                    ...wishes.map((w) => [w.message, fmt(w.created_at)]),
                  ]),
                )
              }
              className="rounded-full bg-olive px-5 py-2 text-[0.7rem] tracking-[0.2em] text-white"
            >
              ექსელში გადმოწერა
            </button>
          </div>
          <ul className="divide-y divide-olive/10">
            {wishes.length === 0 && (
              <li className="px-5 py-6 text-center text-sm text-ink/50">ჯერ სურვილები არ არის</li>
            )}
            {wishes.map((w) => (
              <li key={w.id} className="px-5 py-4">
                <p className="text-sm leading-relaxed text-ink/85">{w.message}</p>
                <p className="mt-2 text-[0.65rem] text-ink/40">{fmt(w.created_at)}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
