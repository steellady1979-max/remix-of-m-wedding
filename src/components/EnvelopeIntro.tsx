import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

import paper from "@/assets/paper.jpg";
import seal from "@/assets/seal.png";
import drape from "@/assets/drape.png";
import bow from "@/assets/bow.png";
import venue from "@/assets/venue.jpg.asset.json";

/** Milestones of the intro choreography (ms from mount). */
const T = {
  seal: 700,
  flaps: 1200,
  untie: 3000,
  part: 3600,
  done: 6200,
};

type Stage = "closed" | "opening" | "parting" | "done";

export function EnvelopeIntro({ onFinished }: { onFinished?: () => void }) {
  const [stage, setStage] = useState<Stage>("closed");
  const [hidden, setHidden] = useState(false);
  const [muted, setMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Choreography timeline — fully automatic, no tap required.
  useEffect(() => {
    const timers = [
      window.setTimeout(() => setStage("opening"), T.seal),
      window.setTimeout(() => setStage("parting"), T.part),
      window.setTimeout(() => setStage("done"), T.done),
      window.setTimeout(() => {
        setHidden(true);
        onFinished?.();
      }, T.done + 1200),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onFinished]);

  // Autoplay music. Mobile browsers only allow muted autoplay, so we start
  // muted and unmute the moment any gesture (or a permissive browser) allows it.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const tryUnmuted = async () => {
      try {
        audio.muted = false;
        audio.volume = 0.55;
        await audio.play();
        setMuted(false);
        return true;
      } catch {
        return false;
      }
    };

    const start = async () => {
      if (await tryUnmuted()) return;
      audio.muted = true;
      try {
        await audio.play();
      } catch {
        /* ignore */
      }
      const onGesture = async () => {
        if (await tryUnmuted()) remove();
      };
      const remove = () => {
        ["pointerdown", "touchstart", "keydown", "scroll"].forEach((e) =>
          window.removeEventListener(e, onGesture),
        );
      };
      ["pointerdown", "touchstart", "keydown", "scroll"].forEach((e) =>
        window.addEventListener(e, onGesture, { passive: true }),
      );
      return remove;
    };

    void start();
  }, []);

  const toggleSound = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const next = !muted;
    audio.muted = next;
    if (!next) void audio.play();
    setMuted(next);
  };

  const opened = stage !== "closed";
  const parted = stage === "parting" || stage === "done";

  return (
    <>
      <audio ref={audioRef} src="/audio/ambience.mp3" loop playsInline preload="auto" />

      {!hidden && (
        <div
          aria-hidden
          className={`fixed inset-0 z-50 overflow-hidden bg-ink transition-opacity duration-[1200ms] ease-out ${
            stage === "done" ? "opacity-0" : "opacity-100"
          }`}
          style={{ perspective: "1400px" }}
        >
          {/* Revealed venue backdrop */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${venue.url})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/10 via-transparent to-ink/25" />

          {/* Silk drapes that part after the envelope opens */}
          <div
            className={`absolute inset-y-0 left-0 w-[62%] bg-cover bg-left-top transition-transform duration-[1600ms] ease-drape ${
              parted ? "-translate-x-[105%]" : "translate-x-0"
            }`}
            style={{ backgroundImage: `url(${drape})`, backgroundSize: "cover" }}
          />
          <div
            className={`absolute inset-y-0 right-0 w-[62%] bg-cover bg-right-top transition-transform duration-[1600ms] ease-drape ${
              parted ? "translate-x-[105%]" : "translate-x-0"
            }`}
            style={{ backgroundImage: `url(${drape})`, backgroundSize: "cover" }}
          />

          {/* Satin bow holding the drapes closed */}
          <img
            src={bow}
            alt=""
            width={1280}
            height={768}
            className={`absolute left-1/2 top-1/2 w-[78%] max-w-md -translate-x-1/2 -translate-y-1/2 transition-all duration-[900ms] ease-out ${
              parted ? "scale-125 opacity-0" : "scale-100 opacity-100"
            }`}
            style={{ transitionDelay: parted ? "0ms" : `${T.untie}ms` }}
          />

          {/* Envelope flaps */}
          <div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
            <div
              className={`env-flap absolute inset-x-0 bottom-0 h-[58%] origin-bottom ${
                opened ? "flap-bottom-open" : ""
              }`}
              style={{
                backgroundImage: `url(${paper})`,
                clipPath: "polygon(0 100%, 100% 100%, 50% 0)",
              }}
            />
            <div
              className={`env-flap absolute inset-y-0 left-0 w-[58%] origin-left ${
                opened ? "flap-left-open" : ""
              }`}
              style={{
                backgroundImage: `url(${paper})`,
                clipPath: "polygon(0 0, 100% 50%, 0 100%)",
              }}
            />
            <div
              className={`env-flap absolute inset-y-0 right-0 w-[58%] origin-right ${
                opened ? "flap-right-open" : ""
              }`}
              style={{
                backgroundImage: `url(${paper})`,
                clipPath: "polygon(100% 0, 0 50%, 100% 100%)",
              }}
            />
            <div
              className={`env-flap absolute inset-x-0 top-0 z-10 h-[52%] origin-top ${
                opened ? "flap-top-open" : ""
              }`}
              style={{
                backgroundImage: `url(${paper})`,
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              }}
            />

            {/* Blank olive wax seal */}
            <img
              src={seal}
              alt=""
              width={816}
              height={816}
              className={`absolute left-1/2 top-1/2 z-20 w-[24vw] max-w-[130px] -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_10px_20px_rgba(60,50,25,0.28)] transition-all duration-700 ease-out ${
                opened ? "scale-90 opacity-0" : "seal-breathe opacity-100"
              }`}
            />
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={toggleSound}
        aria-label={muted ? "Play music" : "Mute music"}
        className="fixed bottom-5 right-5 z-[60] grid h-11 w-11 place-items-center rounded-full border border-foreground/15 bg-background/70 text-foreground/70 backdrop-blur transition-colors hover:text-foreground"
      >
        {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </button>
    </>
  );
}
