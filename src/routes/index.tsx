import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { Countdown } from "@/components/Countdown";
import { EnvelopeIntro } from "@/components/EnvelopeIntro";
import { ScratchDate } from "@/components/ScratchDate";
import venue from "@/assets/venue.jpg.asset.json";

const TITLE = "მარიამი & ალექსანდრე — 17 ოქტომბერი 2026";
const DESCRIPTION =
  "მარიამი და ალექსანდრე გვთხოვთ გაგვიზიაროთ ჩვენი ქორწილის დღე — 17 ოქტომბერი 2026, ჯვრისწერა 12:00.";

const SCHEDULE = [
  {
    time: "12:00",
    title: "ჯვრისწერა",
    href: "https://maps.app.goo.gl/BMZYm7LTAfFjGm7FA?g_st=ic",
  },
  { time: "17:00", title: "ხელის მოწერის ცერემონია შუაგულში" },
  { time: "19:00", title: "ვახშამი" },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [revealed, setRevealed] = useState(false);

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-champagne font-sans text-ink">
      <EnvelopeIntro onFinished={() => setRevealed(true)} />

      <div
        className={`transition-opacity duration-1000 ease-out ${
          revealed ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Hero — the couple's names over the watercolour venue */}
        <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 text-center">
          <img
            src={venue.url}
            alt="საქორწილო სივრცე — აკვარელის სტილში დახატული ხედი ტბასა და თეთრ შენობასთან"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/45 to-white/80" />

          <div className="relative animate-fade-in">
            <p className="text-[0.65rem] uppercase tracking-[0.45em] text-olive">
              ჩვენი ქორწილი
            </p>
            <h1 className="mt-6 flex flex-col items-center gap-2 font-display text-3xl font-light leading-tight text-olive sm:text-5xl">
              <span>მარიამი</span>
              <span className="text-xl text-olive-soft sm:text-3xl">&</span>
              <span>ალექსანდრე</span>
            </h1>
            <div className="hairline mx-auto mt-8 w-40" />
            <p className="mt-6 text-sm tracking-[0.3em] text-ink/70">17 · 10 · 2026</p>
          </div>
        </section>

        {/* Scratch to reveal the date */}
        <section className="flex flex-col items-center gap-8 bg-white px-6 py-24 text-center">
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.45em] text-olive">თამაში</p>
            <h2 className="mt-4 font-display text-2xl font-light text-olive sm:text-3xl">
              გადაფხიკე და გაიგე თარიღი
            </h2>
          </div>

          <ScratchDate>
            <p className="text-[0.65rem] uppercase tracking-[0.4em] text-olive-soft">
              ქორწილის თარიღი
            </p>
            <p className="mt-4 font-display text-3xl font-light text-olive sm:text-4xl">
              17 ოქტომბერი
            </p>
            <p className="mt-1 font-display text-xl font-light text-ink/70">2026 წელი</p>
          </ScratchDate>
        </section>

        {/* Countdown */}
        <section className="flex flex-col items-center gap-8 bg-olive-mist px-6 py-24 text-center">
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.45em] text-olive">დარჩენილია</p>
            <h2 className="mt-4 font-display text-2xl font-light text-olive sm:text-3xl">
              ჩვენს დღემდე
            </h2>
          </div>
          <div className="w-full max-w-md">
            <Countdown target="2026-10-17T12:00:00+04:00" />
          </div>
        </section>

        {/* Schedule */}
        <section className="flex flex-col items-center gap-10 bg-white px-6 py-24">
          <div className="text-center">
            <p className="text-[0.65rem] uppercase tracking-[0.45em] text-olive">დღის განრიგი</p>
            <h2 className="mt-4 font-display text-2xl font-light text-olive sm:text-3xl">
              17 ოქტომბერი 2026
            </h2>
          </div>

          <ul className="w-full max-w-md divide-y divide-olive/15 border-y border-olive/15">
            {SCHEDULE.map((item) => (
              <li key={item.time} className="flex items-baseline gap-6 py-6">
                <span className="font-display text-xl font-light tabular-nums text-olive">
                  {item.time}
                </span>
                <span className="flex-1 text-sm leading-relaxed text-ink/80">
                  {item.title}
                  {item.href && (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="story-link ml-2 whitespace-nowrap text-xs uppercase tracking-[0.2em] text-olive"
                    >
                      რუკაზე
                    </a>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <footer className="bg-olive px-6 py-12 text-center">
          <p className="font-display text-lg font-light text-white">მარიამი & ალექსანდრე</p>
          <p className="mt-2 text-[0.65rem] uppercase tracking-[0.35em] text-white/70">
            17 ოქტომბერი 2026
          </p>
        </footer>
      </div>
    </main>
  );
}
