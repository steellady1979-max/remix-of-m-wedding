import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

import paper from "@/assets/paper.jpg";
import seal from "@/assets/seal.png";
import drape from "@/assets/drape.png";
import bow from "@/assets/bow.png";
import venue from "@/assets/venue.jpg.asset.json";

/** Overlay lifetime, matched to the CSS timeline in styles.css. */
const FADE_AT = 12_500;
const UNMOUNT_AT = 13_900;

export function EnvelopeIntro({ onFinished }: { onFinished?: () => void }) {
  const [fading, setFading] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [muted, setMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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

  // Autoplay: start muted (the only thing mobile browsers allow), then unmute
  // as soon as the browser or the first gesture permits it.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const tryUnmuted = async () => {
      try {
        audio.muted = false;
        audio.volume = 0.5;
        await audio.play();
        setMuted(false);
        return true;
      } catch {
        return false;
      }
    };

    const events = ["pointerdown", "touchstart", "keydown", "scroll"] as const;
    const onGesture = async () => {
      if (await tryUnmuted()) {
        events.forEach((e) => window.removeEventListener(e, onGesture));
      }
    };

    void (async () => {
      if (await tryUnmuted()) return;
      audio.muted = true;
      try {
        await audio.play();
      } catch {
        /* ignore */
      }
      events.forEach((e) => window.addEventListener(e, onGesture, { passive: true }));
    })();

    return () => events.forEach((e) => window.removeEventListener(e, onGesture));
  }, []);

  const toggleSound = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const next = !muted;
    audio.muted = next;
    if (!next) void audio.play();
    setMuted(next);
  };

  return (
    <>
      <audio ref={audioRef} src="/audio/ambience.mp3" loop playsInline preload="auto" />

      {!hidden && (
        <div
          aria-hidden
          className={`fixed inset-0 z-50 overflow-hidden bg-champagne transition-opacity duration-[1400ms] ease-out ${
            fading ? "opacity-0" : "opacity-100"
          }`}
        >
          {/* Everything lives inside one slowly zooming-out stage, exactly as in
              the reference: a tight close-up of the sealed envelope that pulls
              back until the venue fills the screen. */}
          <div
            className="intro-zoom absolute inset-0"
            style={
              {
                perspective: "1500px",
                transformStyle: "preserve-3d",
                "--paper": `url(${paper})`,
              } as React.CSSProperties
            }
          >
            {/* Revealed backdrop: the venue watercolour */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${venue.url})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-ink/20" />

            {/* Silk drapes hanging from the sash, holding the reveal closed */}
            <div
              className="intro-drape-l absolute left-0 top-[38%] h-[74%] w-[58%] origin-top bg-cover bg-top will-change-transform"
              style={{ backgroundImage: `url(${drape})` }}
            />
            <div
              className="intro-drape-r absolute right-0 top-[38%] h-[74%] w-[58%] origin-top bg-cover bg-top will-change-transform"
              style={{ backgroundImage: `url(${drape})`, transform: "scaleX(-1)" }}
            />

            {/* Satin sash + bow across the middle */}
            <img
              src={bow}
              alt=""
              width={1280}
              height={768}
              className="intro-bow absolute left-1/2 top-[44%] w-[135%] max-w-none -translate-x-1/2 -translate-y-1/2 will-change-transform"
            />

            {/* Envelope body: bottom pocket + side flaps, drops away together */}
            <div className="intro-env-body absolute inset-0 will-change-transform">
              <div
                className="env-paper absolute inset-y-0 left-0 w-[56%]"
                style={{ clipPath: "polygon(0 0, 100% 50%, 0 100%)" }}
              />
              <div
                className="env-paper absolute inset-y-0 right-0 w-[56%]"
                style={{ clipPath: "polygon(100% 0, 0 50%, 100% 100%)" }}
              />
              <div
                className="env-paper absolute inset-x-0 bottom-0 h-[62%]"
                style={{ clipPath: "polygon(0 100%, 100% 100%, 50% 0)" }}
              />
            </div>

            {/* Top flap: folds up and over */}
            <div
              className="absolute inset-x-0 top-0 z-10 h-[54%] origin-top"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div
                className="intro-flap-top absolute inset-0 origin-top will-change-transform"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div
                  className="env-paper absolute inset-0"
                  style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
                />
                {/* Blank olive wax seal on the flap tip */}
                <div className="intro-seal absolute left-1/2 top-[92%] z-20 -translate-x-1/2 -translate-y-1/2">
                  <img
                    src={seal}
                    alt=""
                    width={816}
                    height={816}
                    className="w-[26vw] max-w-[160px] drop-shadow-[0_10px_20px_rgba(60,50,25,0.28)]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={toggleSound}
        aria-label={muted ? "Play music" : "Mute music"}
        className="fixed bottom-5 right-5 z-[60] grid h-11 w-11 place-items-center rounded-full border border-white/40 bg-white/70 text-ink/80 backdrop-blur transition-colors hover:text-ink"
      >
        {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </button>
    </>
  );
}
