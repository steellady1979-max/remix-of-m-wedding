import { useEffect, useState } from "react";

const UNITS = [
  { key: "days", label: "დღე" },
  { key: "hours", label: "საათი" },
  { key: "minutes", label: "წუთი" },
  { key: "seconds", label: "წამი" },
] as const;

function diff(target: number) {
  const ms = Math.max(target - Date.now(), 0);
  const s = Math.floor(ms / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}

export function Countdown({ target }: { target: string }) {
  const targetMs = new Date(target).getTime();
  const [left, setLeft] = useState<ReturnType<typeof diff> | null>(null);

  useEffect(() => {
    setLeft(diff(targetMs));
    const id = window.setInterval(() => setLeft(diff(targetMs)), 1000);
    return () => window.clearInterval(id);
  }, [targetMs]);

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-4">
      {UNITS.map((u) => (
        <div
          key={u.key}
          className="rounded-md border border-olive/20 bg-white/85 px-2 py-4 text-center backdrop-blur-sm"
        >
          <div className="font-display text-3xl font-light tabular-nums text-olive sm:text-4xl">
            {left ? String(left[u.key]).padStart(2, "0") : "--"}
          </div>
          <div className="mt-1 text-sm uppercase tracking-normal text-ink/55">
            {u.label}
          </div>
        </div>
      ))}
    </div>
  );
}
