import { useEffect, useState } from "react";

import paper from "@/assets/paper.jpg";
import seal from "@/assets/seal.png";
import venue from "@/assets/venue.jpg.asset.json";

/** Scene 1 timeline, matched to the CSS animations in styles.css. */
const FADE_AT = 5_000;
const UNMOUNT_AT = 6_200;

export function EnvelopeIntro({ onFinished }: { onFinished?: () => void }) {
  const [fading, setFading] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const timers = [
      window.setTimeout(() => setFading(true), FADE_AT),
      window.setTimeout(() => {
        setHidden(true);
        onFinished?.();
      }, UNMOUNT_AT),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onFinished]);

  if (hidden) return null;

  return (
    <div
      aria-hidden
      className={`fixed inset-0 z-50 overflow-hidden bg-champagne transition-opacity duration-[1400ms] ease-out ${
        fading ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Layer 1 — the scenery, on its own slower zoom track */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="intro-venue absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${venue.url})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-ink/25" />
      </div>

      {/* Layer 2 — the envelope, faster zoom track, painted above the scenery */}
      <div
        className="intro-zoom absolute inset-0"
        style={
          {
            perspective: "1600px",
            transformStyle: "preserve-3d",
            "--paper": `url(${paper})`,
          } as React.CSSProperties
        }
      >
        {/* Envelope body: bottom pocket + two side flaps, drop away together */}
        <div className="intro-env-body absolute inset-0 z-20 will-change-transform">
          <div
            className="env-paper absolute inset-y-0 left-0 w-[54%]"
            style={{ clipPath: "polygon(0 0, 100% 50%, 0 100%)" }}
          />
          <div
            className="env-paper absolute inset-y-0 right-0 w-[54%]"
            style={{ clipPath: "polygon(100% 0, 0 50%, 100% 100%)" }}
          />
          <div
            className="env-paper absolute inset-x-0 bottom-0 h-[58%]"
            style={{ clipPath: "polygon(0 100%, 100% 100%, 50% 0)" }}
          />
        </div>

        {/* Top flap with the blank olive wax seal at its tip */}
        <div
          className="absolute inset-x-0 top-0 z-30 h-[52%]"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div
            className="intro-flap-top absolute inset-0 origin-top will-change-transform"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div
              className="env-paper env-flap absolute inset-0"
              style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
            />
            <div className="intro-seal absolute left-1/2 top-[95%] z-30 -translate-x-1/2 -translate-y-1/2">
              <img
                src={seal}
                alt=""
                width={816}
                height={816}
                className="w-[30vw] max-w-[170px] drop-shadow-[0_10px_22px_rgba(60,50,25,0.3)]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
