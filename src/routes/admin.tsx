import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

const ACCESS_CODE = "MARIAM2026";
const TITLE = "ადმინ პანელი — მარიამი & ალექსანდრე";

const DESCRIPTION = "სტუმრების დასწრების პასუხები და სურვილები.";

type Rsvp = {
  id: string;
  attending: boolean;
  guest_name: string | null;
  plus_one: boolean;
  plus_one_name: string | null;
  created_at: string;
};

type Wish = { id: string; message: string; created_at: string };

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
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
  const [session, setSession] = useState<unknown>(null);
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [code, setCode] = useState("");
  const [codeOk, setCodeOk] = useState(false);
  const [codeError, setCodeError] = useState<string | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem("admin-code") === "ok") setCodeOk(true);
  }, []);


  const [rsvps, setRsvps] = useState<Rsvp[]>([]);
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const load = useCallback(async () => {
    setLoadError(null);
    await supabase.rpc("claim_admin");
    const [r, w] = await Promise.all([
      supabase.from("rsvps").select("*").order("created_at", { ascending: false }),
      supabase.from("wishes").select("*").order("created_at", { ascending: false }),
    ]);
    if (r.error || w.error) {
      setLoadError("მონაცემები ვერ ჩაიტვირთა");
      return;
    }
    setRsvps((r.data ?? []) as Rsvp[]);
    setWishes((w.data ?? []) as Wish[]);
  }, []);

  useEffect(() => {
    if (session) void load();
  }, [session, load]);

  if (!ready) {
    return <div className="min-h-screen bg-champagne" />;
  }

  if (!codeOk) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-champagne px-6 font-sans text-ink">
        <div className="w-full max-w-sm rounded-2xl border border-olive/20 bg-white p-8 text-center shadow-[0_20px_50px_-30px_rgba(60,70,40,0.45)]">
          <p className="text-[0.65rem] tracking-[0.45em] text-olive">წვდომა</p>
          <h1 className="mt-4 font-display text-2xl font-light text-olive">წვდომის კოდი</h1>
          <div className="hairline mx-auto mt-6 w-24" />
          <form
            className="mt-8 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (code.trim() === ACCESS_CODE) {
                sessionStorage.setItem("admin-code", "ok");
                setCodeOk(true);
                setCodeError(null);
              } else {
                setCodeError("კოდი არასწორია");
              }
            }}
          >
            <input
              className={`${inputClass} text-center tracking-[0.3em]`}
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="კოდი"
              autoComplete="off"
            />
            <button
              type="submit"
              className="w-full rounded-full bg-olive px-6 py-3 text-sm tracking-[0.25em] text-white"
            >
              შესვლა
            </button>
            {codeError && <p className="text-xs text-olive">{codeError}</p>}
          </form>
        </div>
      </main>
    );
  }


  if (!session) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-champagne px-6 font-sans text-ink">
        <div className="w-full max-w-sm rounded-2xl border border-olive/20 bg-white p-8 text-center shadow-[0_20px_50px_-30px_rgba(60,70,40,0.45)]">
          <p className="text-[0.65rem] tracking-[0.45em] text-olive">ადმინი</p>
          <h1 className="mt-4 font-display text-2xl font-light text-olive">შესვლა</h1>
          <div className="hairline mx-auto mt-6 w-24" />

          <form
            className="mt-8 space-y-4 text-left"
            onSubmit={async (e) => {
              e.preventDefault();
              setBusy(true);
              setAuthError(null);
              const { error } = await supabase.auth.signInWithPassword({ email, password });
              setBusy(false);
              if (error) setAuthError("ელფოსტა ან პაროლი არასწორია");
            }}
          >
            <input
              className={inputClass}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ელფოსტა"
              autoComplete="email"
            />
            <input
              className={inputClass}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="პაროლი"
              autoComplete="current-password"
            />
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-full bg-olive px-6 py-3 text-sm tracking-[0.25em] text-white transition-opacity disabled:opacity-40"
            >
              შესვლა
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                setAuthError(null);
                const { error } = await supabase.auth.signUp({
                  email,
                  password,
                  options: { emailRedirectTo: `${window.location.origin}/admin` },
                });
                setBusy(false);
                if (error) setAuthError("რეგისტრაცია ვერ შესრულდა");
                else setAuthError("შეამოწმეთ ელფოსტა დასადასტურებლად");
              }}
              className="w-full rounded-full border border-olive/30 px-6 py-3 text-sm tracking-[0.2em] text-olive transition-colors hover:bg-olive-mist/60"
            >
              რეგისტრაცია
            </button>
            <button
              type="button"
              onClick={async () => {
                const result = await lovable.auth.signInWithOAuth("google", {
                  redirect_uri: window.location.origin,
                });
                if (result.error) setAuthError("Google-ით შესვლა ვერ მოხერხდა");
              }}
              className="w-full rounded-full border border-olive/20 px-6 py-3 text-sm tracking-[0.2em] text-ink/70 transition-colors hover:bg-olive-mist/40"
            >
              Google-ით შესვლა
            </button>
            {authError && <p className="text-center text-xs text-olive">{authError}</p>}
          </form>
        </div>
      </main>
    );
  }

  const yes = rsvps.filter((r) => r.attending);
  const no = rsvps.filter((r) => !r.attending);
  const guests = yes.reduce((n, r) => n + 1 + (r.plus_one ? 1 : 0), 0);

  return (
    <main className="min-h-screen bg-champagne px-5 py-14 font-sans text-ink sm:px-8">
      <div className="mx-auto w-full max-w-3xl space-y-10">
        <header className="text-center">
          <p className="text-[0.65rem] tracking-[0.45em] text-olive">ადმინ პანელი</p>
          <h1 className="mt-4 font-display text-3xl font-light text-olive">
            მარიამი & ალექსანდრე
          </h1>
          <div className="hairline mx-auto mt-6 w-32" />
          <button
            type="button"
            onClick={() => supabase.auth.signOut()}
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
