import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { Countdown } from "@/components/Countdown";
import { InvitationDoors } from "@/components/InvitationDoors";
import { Reveal } from "@/components/Reveal";
import { Rsvp } from "@/components/Rsvp";
import { WishEnvelope } from "@/components/WishEnvelope";
import couple from "@/assets/couple.jpg.asset.json";
import church from "@/assets/church.jpg.asset.json";
import ceremony from "@/assets/ceremony.jpg.asset.json";
import dinner from "@/assets/dinner.jpg.asset.json";

const TITLE = "მარიამი & ალექსანდრე — 17 ოქტომბერი 2026";
const DESCRIPTION =
  "მარიამი და ალექსანდრე გვთხოვთ გაგვიზიაროთ ჩვენი ქორწილის დღე — 17 ოქტომბერი 2026, ჯვრისწერა 12:00.";

const SHUAGULI_MAP =
  "https://www.google.com/maps/place/Shuaguli+-+Event+Venue/@41.9179964,44.6600594,17z/data=!3m1!4b1!4m6!3m5!1s0x4044618efa8ffee9:0xcf2a926a77e5e201!8m2!3d41.9179964!4d44.6626343!16s%2Fg%2F11hdynb1k3?hl=is&entry=ttu";

const SCHEDULE = [
  {
    time: "12:00",
    title: "ჯვრისწერა",
    href: "https://maps.app.goo.gl/BMZYm7LTAfFjGm7FA?g_st=ic",
    image: church.url,
    alt: "ჯვრისწერის ეკლესია — აკვარელის ნახატი",
  },
  {
    time: "17:00",
    title: "ხელის მოწერის ცერემონია შუაგულში",
    image: ceremony.url,
    href: SHUAGULI_MAP,
    alt: "ცერემონიის სივრცე თეთრი სკამებითა და ყვავილებით",
  },
  {
    time: "19:00",
    title: "ვახშამი",
    image: dinner.url,
    href: SHUAGULI_MAP,
    alt: "სადღესასწაულო სუფრა სანთლებითა და კალებით ფანჯარასთან",
  },
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
      <InvitationDoors onOpened={() => setRevealed(true)} />

      <div
        className={`transition-opacity duration-1000 ease-out ${
          revealed ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Hero — the couple's names over the couple photo */}
        <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 text-center">
          <img
            src={couple.url}
            alt="წყვილი საქორწილო სივრცის ხედის წინ"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/45 via-white/25 to-white/70" />

          <div className="relative animate-fade-in rounded-xl bg-white/70 px-8 py-10 backdrop-blur-[2px]">
            <p className="text-[0.7rem] tracking-[0.45em] text-olive">ჩვენი ქორწილი</p>
            <h1 className="mt-6 flex flex-col items-center gap-2 font-display text-3xl font-light leading-tight text-olive sm:text-5xl">
              <span>მარიამი</span>
              <span className="text-xl text-olive-soft sm:text-3xl">&</span>
              <span>ალექსანდრე</span>
            </h1>
            <div className="hairline mx-auto mt-8 w-40" />
            <p className="mt-6 text-sm tracking-[0.3em] text-ink/70">17 · 10 · 2026</p>
          </div>
        </section>

        {/* Countdown */}
        <section className="flex flex-col items-center gap-8 bg-olive-mist px-6 py-24 text-center">
          <div>
            <p className="text-[0.7rem] tracking-[0.45em] text-olive">დარჩენილია</p>
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
          <p className="text-[0.7rem] tracking-[0.45em] text-olive">დღის განრიგი</p>

          <ul className="w-full max-w-md space-y-12">
            {SCHEDULE.map((item) => (
              <li key={item.time} className="flex flex-col items-center gap-5 text-center">
                <span className="font-display text-2xl font-light tabular-nums text-olive">
                  {item.time}
                </span>
                <span className="text-sm leading-relaxed text-ink/80">{item.title}</span>

                {item.image && (
                  <img
                    src={item.image}
                    alt={item.alt ?? ""}
                    loading="lazy"
                    className="w-full rounded-lg border border-olive/15 object-cover"
                  />
                )}

                {item.href && (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-md border border-olive/30 px-5 py-2 text-xs tracking-[0.25em] text-olive transition-colors hover:bg-olive hover:text-white"
                  >
                    რუკაზე გადასვლა
                  </a>
                )}
              </li>
            ))}
          </ul>
        </section>

        {/* RSVP */}
        <section className="flex flex-col items-center gap-8 bg-olive-mist px-6 py-24 text-center">
          <div>
            <p className="text-[0.7rem] tracking-[0.45em] text-olive">დასწრება</p>
            <h2 className="mt-4 font-display text-2xl font-light text-olive sm:text-3xl">
              შეძლებთ მობრძანებას?
            </h2>
          </div>
          <Rsvp />
        </section>

        {/* Wishes envelope */}
        <section className="flex flex-col items-center gap-8 bg-white px-6 py-24 text-center">
          <div>
            <p className="text-[0.7rem] tracking-[0.45em] text-olive">სურვილები</p>
            <h2 className="mt-4 font-display text-2xl font-light text-olive sm:text-3xl">
              სურვილების კონვერტი
            </h2>
          </div>
          <WishEnvelope />
        </section>

        <footer className="bg-olive px-6 py-12 text-center">
          <p className="font-display text-lg font-light text-white">მარიამი & ალექსანდრე</p>
          <p className="mt-2 text-[0.7rem] tracking-[0.35em] text-white/70">17 ოქტომბერი 2026</p>
        </footer>
      </div>
    </main>
  );
}
