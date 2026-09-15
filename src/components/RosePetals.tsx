import { useState, type CSSProperties } from "react";

// Deterministic positions keep server and client markup identical.
const petals = Array.from(
  { length: 24 },
  (_, index) =>
    ({
      left: `${(index * 43 + 7) % 100}%`,
      "--petal-size": `${12 + ((index * 7) % 13)}px`,
      "--fall-duration": `${14 + (index % 7)}s`,
      "--fall-delay": `${-((index * 3.7) % 20)}s`,
      "--sway-duration": `${3 + (index % 4)}s`,
      "--petal-turn": `${index * 47}deg`,
    }) as CSSProperties,
);

export function RosePetals() {
  const [paused, setPaused] = useState(false);

  return (
    <>
      <div className={`rose-petals ${paused ? "rose-petals-paused" : ""}`} aria-hidden="true">
        {petals.map((style, index) => (
          <span className="rose-petal-fall" style={style} key={index}>
            <span className="rose-petal-sway">
              <span className="rose-petal" />
            </span>
          </span>
        ))}
      </div>
      <button
        type="button"
        className="petal-toggle fixed bottom-4 right-4 z-40 rounded-full border border-olive/20 bg-champagne/95 px-3 py-2 text-xs text-olive shadow-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-olive"
        onClick={() => setPaused((value) => !value)}
        aria-pressed={paused}
      >
        {paused ? "ფურცლების გაგრძელება" : "ფურცლების შეჩერება"}
      </button>
    </>
  );
}
