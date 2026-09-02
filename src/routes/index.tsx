import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { Countdown } from "@/components/Countdown";
import { InvitationDoors } from "@/components/InvitationDoors";
import { Reveal } from "@/components/Reveal";
import { Rsvp } from "@/components/Rsvp";
import { WishEnvelope } from "@/components/WishEnvelope";
const couple = { url: "/images/couple.jpg" };
const church = { url: "/images/church.jpg" };
const ceremony = { url: "/images/ceremony.jpg" };
const dinner = { url: "/images/dinner.jpg" };
const invitation = { url: "/images/wedding-invitation.jpg" };

const TITLE = "ალექსანდრე & მარიამი — 17 ოქტომბერი 2026";
const DESCRIPTION =
  "ალექსანდრე და მარიამი გვთხოვთ გაგვიზიაროთ ჩვენი ქორწილის დღე — 17 ოქტომბერი 2026, ჯვრისწერა 12:00."

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
    links: [
      {
        rel: "preload",
        as: "font",
        type: "font/ttf",
        href: "/fonts/galaktioni.ttf",
        crossOrigin: "anonymous",
      },
      { rel: "preload", as: "image", href: "/images/door-panel-white.jpg" },
      { rel: "preload", as: "image", href: "/images/chiffon-bow-olive.png" },
      { rel: "preload", as: "image", href: "/images/couple.jpg" },
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
        <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 text-center lg:grid lg:grid-cols-2 lg:items-stretch lg:gap-0 lg:px-0 lg:text-left">
          <img
            src={couple.url}
            alt="წყვილი საქორწილო სივრცის ხედის წინ"
            width={900}
            height={1993}
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-center lg:relative lg:col-start-2 lg:h-[100svh] lg:object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/45 via-white/25 to-white/70 lg:hidden" />

          <div className="relative animate-fade-in rounded-xl bg-white/70 px-8 py-10 backdrop-blur-[2px] lg:col-start-1 lg:row-start-1 lg:flex lg:h-full lg:flex-col lg:items-center lg:justify-center lg:rounded-none lg:bg-champagne lg:px-16 lg:text-center lg:backdrop-blur-none">
            <p className="text-[0.7rem] tracking-[0.45em] text-olive">ჩვენი ქორწილი</p>
            <h1 className="mt-6 flex flex-col items-center gap-2 font-display text-3xl font-light leading-tight text-olive sm:text-5xl lg:text-6xl">
              <span>ალექსანდრე</span>
              <span className="text-xl text-olive-soft sm:text-3xl">&</span>
              <span>მარიამი</span>
            </h1>
            <div className="hairline mx-auto mt-8 w-40 lg:w-56" />
            <p className="mt-6 text-sm tracking-[0.3em] text-ink/70 lg:text-base">17 · 10 · 2026</p>
          </div>
        </section>

        {/* Countdown */}
        <section className="flex flex-col items-center gap-8 bg-olive-mist px-6 py-24 text-center lg:py-32">
          <Reveal>
            <p className="text-[0.7rem] tracking-[0.45em] text-olive">დარჩენილია</p>
            <h2 className="mt-4 font-display text-2xl font-light text-olive sm:text-3xl lg:text-4xl">
              ჩვენს დღემდე
            </h2>
          </Reveal>
          <Reveal delay={120} className="w-full max-w-md lg:max-w-xl">
            <Countdown target="2026-10-17T12:00:00+04:00" />
          </Reveal>
        </section>

        {/* Invitation card */}
        <section className="flex flex-col items-center bg-white px-6 py-20 lg:py-28">
          <Reveal className="w-full max-w-md lg:max-w-lg">
            <img
              src={invitation.url}
              alt="საქორწილო მოსაწვევი კონვერტთან და თეთრ ლილიასთან ერთად"
              loading="lazy"
              decoding="async"
              width={1000}
              height={1410}
              className="mx-auto w-full object-contain"
            />
          </Reveal>
        </section>

        {/* Schedule */}
        <section className="flex flex-col items-center gap-10 bg-white px-6 py-24 lg:gap-16 lg:py-32">
          <Reveal>
            <p className="text-[0.7rem] tracking-[0.45em] text-olive">დღის განრიგი</p>
          </Reveal>

          <ul className="grid w-full max-w-md grid-cols-1 gap-12 lg:max-w-6xl lg:grid-cols-3 lg:items-start lg:gap-10">
            {SCHEDULE.map((item) => (
              <Reveal key={item.time} className="h-full">
                <li className="flex h-full flex-col items-center gap-5 text-center">
                  <span className="font-display text-2xl font-light tabular-nums text-olive lg:text-3xl">
                    {item.time}
                  </span>
                  <span className="text-sm leading-relaxed text-ink/80">{item.title}</span>

                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.alt ?? ""}
                      loading="lazy"
                      decoding="async"
                      className="w-full rounded-lg border border-olive/15 object-cover lg:aspect-[4/5]"
                    />
                  )}

                  {item.href && (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-auto rounded-md border border-olive/30 px-5 py-2 text-xs tracking-[0.25em] text-olive transition-colors hover:bg-olive hover:text-white"
                    >
                      რუკაზე გადასვლა
                    </a>
                  )}
                </li>
              </Reveal>
            ))}
          </ul>
        </section>

        {/* RSVP */}
        <section className="flex flex-col items-center gap-8 bg-olive-mist px-6 py-24 text-center lg:py-32">
          <Reveal className="flex w-full max-w-md justify-center lg:max-w-lg">
            <Rsvp />
          </Reveal>
        </section>

        {/* Wishes envelope */}
        <section className="flex flex-col items-center gap-8 bg-white px-6 py-24 text-center lg:py-32">
          <Reveal>
            <p className="text-[0.7rem] tracking-[0.45em] text-olive">სურვილები</p>
            <h2 className="mt-4 font-display text-2xl font-light text-olive sm:text-3xl lg:text-4xl">
              სურვილების კონვერტი
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <WishEnvelope />
          </Reveal>
        </section>



        <footer className="bg-olive px-6 py-12 text-center">
          <p className="font-display text-lg font-light text-white">ალექსანდრე & მარიამი</p>
          <p className="mt-2 text-[0.7rem] tracking-[0.35em] text-white/70">17 ოქტომბერი 2026</p>
        </footer>
      </div>
    </main>
  );
}
