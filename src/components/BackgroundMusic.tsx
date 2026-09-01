import { useEffect, useRef } from "react";

/**
 * Persistent background music.
 * Lives in the root layout so it never unmounts during navigation.
 * Autoplays where allowed; otherwise starts on the user's first natural
 * interaction (e.g. tapping the envelope) — no "play music" button needed.
 */
// Target track: "Venus and Flower" — Austin Farwell.
// Replace this URL with the uploaded mp3 asset once available
// (YouTube links cannot be streamed directly in a browser).
const MUSIC_URL = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

export function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.45;

    let unlocked = false;
    const events = ["pointerdown", "touchstart", "keydown", "click", "scroll"] as const;

    const cleanup = () => {
      events.forEach((e) => window.removeEventListener(e, tryPlay));
      document.removeEventListener("visibilitychange", onVisible);
    };

    function tryPlay() {
      if (unlocked || !audio) return;
      audio
        .play()
        .then(() => {
          unlocked = true;
          cleanup();
        })
        .catch(() => {
          /* still blocked — wait for the next gesture */
        });
    }

    function onVisible() {
      if (document.visibilityState === "visible") tryPlay();
    }

    tryPlay();
    events.forEach((e) =>
      window.addEventListener(e, tryPlay, { passive: true } as AddEventListenerOptions),
    );
    document.addEventListener("visibilitychange", onVisible);

    return cleanup;
  }, []);

  return (
    <audio
      ref={audioRef}
      src={MUSIC_URL}
      autoPlay
      loop
      preload="auto"
      playsInline
      aria-hidden="true"
      className="hidden"
    />
  );
}
