import { useCallback, useEffect, useRef, useState } from "react";

const doorPanel = "/images/door-panel-white.jpg";
const bow = "/images/chiffon-bow-olive.png";
const venue = { url: "/images/couple.jpg" };

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
      className="fixed inset-0 z-50 select-none overflow-hidden bg-white"
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
        if (t) touchStart.current = { x: t.clientX, y: t.clientY };
      }}
      onTouchEnd={(e) => {
        const s = touchStart.current;
        const t = e.changedTouches[0];
        if (!s || !t) return;
        if (Math.abs(t.clientX - s.x) > 30 || Math.abs(t.clientY - s.y) > 30) open();
        touchStart.current = null;
      }}
    >
      {/* The reveal: watercolour venue behind the doors, easing forward as they part */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={venue.url}
          alt="წყვილი საქორწილო სივრცის ხედის წინ"
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
            backgroundSize: "200% 100%",
            backgroundPosition: side === "left" ? "left center" : "right center",
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
                ? "right-0 bg-gradient-to-l from-olive/20 to-transparent"
                : "left-0 bg-gradient-to-r from-olive/20 to-transparent"
            }`}
          />
        </div>
      ))}

      {/* Chiffon bow at the seam */}
      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
        <div
          className={`transition-all duration-[900ms] ease-out ${
            opening ? "scale-90 opacity-0 blur-[2px]" : "bow-sway opacity-100"
          }`}
        >
          <img
            src={bow}
            alt=""
            width={1024}
            height={1536}
            className="w-[62vw] max-w-[340px] drop-shadow-[0_18px_36px_rgba(90,100,60,0.28)]"
          />
        </div>
      </div>

      {/* Prompt */}
      <p
        className={`absolute inset-x-0 bottom-24 z-10 text-center text-[0.7rem] tracking-[0.45em] text-olive transition-opacity duration-500 ${
          opening ? "opacity-0" : "animate-pulse opacity-100"
        }`}
      >
        შეეხე გასახსნელად
      </p>
    </div>
  );
}
