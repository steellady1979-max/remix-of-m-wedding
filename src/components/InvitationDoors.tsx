import { useCallback, useEffect, useRef, useState } from "react";

import doorPanel from "@/assets/door-panel.jpg";
import bow from "@/assets/chiffon-bow.png";
import venue from "@/assets/venue.jpg.asset.json";

/** Timings, matched to the CSS transitions below. */
const BOW_RELEASE = 520;
const DOORS_TRAVEL = 2200;
const UNMOUNT_AFTER = 2900;

type Phase = "closed" | "opening" | "gone";

export function InvitationDoors({ onOpened }: { onOpened?: () => void }) {
  const [phase, setPhase] = useState<Phase>("closed");
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const open = useCallback(() => {
    setPhase((p) => (p === "closed" ? "opening" : p));
  }, []);

  const skip = useCallback(() => {
    setPhase("gone");
    onOpened?.();
  }, [onOpened]);

  useEffect(() => {
    if (phase !== "opening") return;
    const t = window.setTimeout(() => {
      setPhase("gone");
      onOpened?.();
    }, UNMOUNT_AFTER);
    return () => clearTimeout(t);
  }, [phase, onOpened]);

  if (phase === "gone") return null;

  const opening = phase === "opening";

  return (
    <div
      className="fixed inset-0 z-50 select-none overflow-hidden bg-ink"
      role="button"
      tabIndex={0}
      aria-label="გახსენი მოსაწვევი"
      onClick={open}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open();
        }
      }}
      onTouchStart={(e) => {
        const t = e.touches[0];
        touchStart.current = { x: t.clientX, y: t.clientY };
      }}
      onTouchEnd={(e) => {
        const s = touchStart.current;
        if (!s) return;
        const t = e.changedTouches[0];
        if (Math.abs(t.clientX - s.x) > 30 || Math.abs(t.clientY - s.y) > 30) open();
        touchStart.current = null;
      }}
    >
      {/* The reveal: watercolour venue behind the doors, easing forward as they part */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={venue.url}
          alt="საქორწილო სივრცე — აკვარელის სტილში დახატული ხედი ტბასა და თეთრ შენობასთან"
          className={`h-full w-full object-cover transition-transform duration-[2600ms] ease-drape ${
            opening ? "scale-100" : "scale-110"
          }`}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-ink/25" />
      </div>

      {/* Left / right card halves */}
      {(["left", "right"] as const).map((side) => (
        <div
          key={side}
          className={`door-half absolute inset-y-0 ${
            side === "left" ? "left-0" : "right-0"
          } w-1/2 will-change-transform`}
          style={{
            backgroundImage: `url(${doorPanel})`,
            transform: opening
              ? `translateX(${side === "left" ? "-101%" : "101%"})`
              : "translateX(0)",
            transitionDuration: `${DOORS_TRAVEL}ms`,
            transitionDelay: opening ? `${BOW_RELEASE}ms` : "0ms",
          }}
        >
          <div
            className={`pointer-events-none absolute inset-y-0 w-16 ${
              side === "left"
                ? "right-0 bg-gradient-to-l from-ink/35 to-transparent"
                : "left-0 bg-gradient-to-r from-ink/35 to-transparent"
            }`}
          />
        </div>
      ))}

      {/* Chiffon bow at the seam */}
      <div
        className={`pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 transition-all duration-[900ms] ease-out ${
          opening ? "scale-90 opacity-0 blur-[2px]" : "bow-sway scale-100 opacity-100"
        }`}
      >
        <img
          src={bow}
          alt=""
          width={1024}
          height={1536}
          className="w-[62vw] max-w-[340px] drop-shadow-[0_18px_36px_rgba(40,35,20,0.35)]"
        />
      </div>

      {/* Prompt + skip */}
      <p
        className={`absolute inset-x-0 bottom-24 z-10 text-center text-[0.6rem] uppercase tracking-[0.45em] text-white/85 transition-opacity duration-500 ${
          opening ? "opacity-0" : "animate-pulse opacity-100"
        }`}
      >
        შეეხე გასახსნელად
      </p>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          skip();
        }}
        className="absolute bottom-6 right-6 z-20 rounded-full border border-white/40 bg-white/10 px-4 py-2 text-[0.6rem] uppercase tracking-[0.3em] text-white backdrop-blur-sm transition-colors hover:bg-white/20"
      >
        გამოტოვება
      </button>
    </div>
  );
}
