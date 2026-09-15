import { useCallback, useImperativeHandle, useRef, useState, type Ref } from "react";

export type WeddingMusicHandle = { play: () => void };

export function WeddingMusic({ ref, visible }: { ref: Ref<WeddingMusicHandle>; visible: boolean }) {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [retry, setRetry] = useState(false);

  // Called synchronously from the opening gesture, before any animation or timer.
  const play = useCallback(() => {
    const element = audio.current;
    if (!element) return;
    setRetry(false);
    setLoading(true);
    if (element.error) element.load();
    element.muted = false;
    element.volume = 0.45;
    void element.play().catch((error: unknown) => {
      setLoading(false);
      if (error instanceof DOMException && error.name === "AbortError") return;
      setPlaying(false);
      setRetry(true);
    });
  }, []);

  useImperativeHandle(ref, () => ({ play }), [play]);

  return (
    <>
      <audio
        ref={audio}
        src="/audio/ordinary-a395fbb9.mp3"
        preload="none"
        loop
        playsInline
        onPlaying={() => {
          setPlaying(true);
          setLoading(false);
          setRetry(false);
        }}
        onPause={() => {
          setPlaying(false);
          setLoading(false);
        }}
        onWaiting={() => setLoading(true)}
        onError={() => {
          setPlaying(false);
          setLoading(false);
          setRetry(true);
        }}
      />
      {visible && (
        <button
          type="button"
          className="fixed bottom-4 right-4 z-40 flex min-h-11 items-center gap-2 rounded-full border border-olive/20 bg-champagne/95 px-4 py-2 text-xs text-olive shadow-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-olive"
          onClick={() => {
            if (playing || loading) audio.current?.pause();
            else play();
          }}
          aria-label={playing || loading ? "მუსიკის შეჩერება" : "მუსიკის ჩართვა"}
          aria-pressed={playing}
        >
          <span aria-hidden="true">{playing ? "♫" : "♪"}</span>
          <span aria-live="polite">
            {retry
              ? "შეეხე მუსიკის ჩასართავად"
              : loading
                ? "მუსიკა იტვირთება…"
                : playing
                  ? "მუსიკის შეჩერება"
                  : "მუსიკის ჩართვა"}
          </span>
        </button>
      )}
    </>
  );
}
