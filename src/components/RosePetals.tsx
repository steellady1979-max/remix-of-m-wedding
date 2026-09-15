import type { CSSProperties } from "react";

// Deterministic positions keep server and client markup identical.
const petals = Array.from(
  { length: 18 },
  (_, index) =>
    ({
      left: `${(index * 43 + 7) % 100}%`,
      "--petal-size": `${14 + ((index * 7) % 11)}px`,
      "--fall-duration": `${20 + (index % 7)}s`,
      "--fall-delay": `${-((index * 3.7) % 26)}s`,
      "--sway-duration": `${4 + (index % 4)}s`,
      "--petal-turn": `${index * 47}deg`,
    }) as CSSProperties,
);

export function RosePetals() {
  return (
    <div className="rose-petals" aria-hidden="true">
      {petals.map((style, index) => (
        <span className="rose-petal-fall" style={style} key={index}>
          <span className="rose-petal-sway">
            <svg className="rose-petal" viewBox="0 0 40 44" focusable="false">
              <path
                d={
                  index % 2 === 0
                    ? "M20 42C16 35 3 30 2 18C1 8 9 2 17 5C21 7 23 3 29 4C40 6 41 17 35 26C31 32 24 36 20 42Z"
                    : "M17 42C15 34 4 29 3 19C1 8 9 3 16 5C22 7 25 1 32 5C40 10 38 22 31 30C26 35 20 37 17 42Z"
                }
                fill="currentColor"
              />
              <path
                d="M20 39C22 29 29 19 31 11C30 24 25 34 20 39Z"
                fill="oklch(0.88 0.008 95)"
                fillOpacity="0.25"
              />
            </svg>
          </span>
        </span>
      ))}
    </div>
  );
}
