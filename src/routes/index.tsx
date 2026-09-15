import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { Countdown } from "@/components/Countdown";
import { InvitationDoors } from "@/components/InvitationDoors";
import { Reveal } from "@/components/Reveal";
import { Rsvp } from "@/components/Rsvp";
import { WishEnvelope } from "@/components/WishEnvelope";
const couple = { url: "/images/goga-lika-venue.webp" };
const church = { url: "/images/sajvaros-church.webp" };
const dinner = { url: "/images/bagrationi.webp" };
const invitation = { url: "/images/wedding-invitation.jpg" };

const TITLE = "გოგა & ლიკა — 22 სექტემბერი 2026";
const DESCRIPTION =
  "გოგა და ლიკა გეპატიჟებით ჩვენს ქორწილში — 22 სექტემბერი 2026, ჯვრისწერა 13:00.";

const CHURCH_MAP =
  "https://www.google.com/maps/place/%E1%83%A1%E1%83%90%E1%83%AF%E1%83%95%E1%83%90%E1%83%A0%E1%83%9D%E1%83%A1+%E1%83%94%E1%83%99%E1%83%9A%E1%83%94%E1%83%A1%E1%83%98%E1%83%90/@42.5216089,41.8693199,3a,75y,90t/data=!3m8!1e2!3m6!1sCIHM0ogKEICAgICmifr0Xg!2e10!3e12!6shttps:%2F%2Flh3.googleusercontent.com%2Fgps-cs-s%2FAHRPTWlxbxJ9IvE5LozqEvo7-NWzi6eOJLSOKh9dlgrFzuGDA-h5FJC4oxGkrWMifn5lPxls28zKN8Uwkm12JoZZmM-d-cuWNqsfn1RlS7sWeRnc3ew-GBf_9_-CVnKW5xIAYfs9HnM%3Dw203-h135-k-no!7i7360!8i4912!4m7!3m6!1s0x405c250466751cc3:0x90519e48123f5683!8m2!3d42.5216089!4d41.8693199!10e5!16s%2Fg%2F11h6nq15s3!18m1!1e1?entry=ttu&g_ep=EgoyMDI2MDkwOS4wIKXMDSoASAFQAw%3D%3D";
const KAKHATI_MAP =
  "https://www.google.com/maps?q=42.493621826171875,41.76512145996094&z=17&hl=en";
const HOME_MAP =
  "https://www.google.com/maps/place/%E1%83%96%E1%83%A3%E1%83%92%E1%83%93%E1%83%98%E1%83%93%E1%83%98+%E1%83%93%E1%83%90%E1%83%95%E1%83%98%E1%83%97+%E1%83%AF%E1%83%98%E1%83%A5%E1%83%98%E1%83%90%E1%83%A1+25/@42.5216499,41.8374005,17z/data=!3m1!4b1!4m6!3m5!1s0x405c250020ac5877:0xd1aec535c6b23445!8m2!3d42.5216499!4d41.8374005!16s%2Fg%2F11z27ns96y!18m1!1e1?entry=ttu&g_ep=EgoyMDI2MDkwOS4wIKXMDSoASAFQAw%3D%3D";
const DINNER_MAP =
  "https://www.google.com/maps/place/%E1%83%A0%E1%83%94%E1%83%A1%E1%83%A2%E1%83%9D%E1%83%A0%E1%83%90%E1%83%9C%E1%83%98+%E1%83%91%E1%83%90%E1%83%92%E1%83%A0%E1%83%90%E1%83%A2%E1%83%98%E1%83%9D%E1%83%9C%E1%83%98+-+Restaurant+Bagrationi/@42.4957212,41.2499464,10z/data=!4m10!1m2!2m1!1z4YOg4YOU4YOh4YOi4YOd4YOg4YOQ4YOc4YOYIOGDkeGDkOGDkuGDoOGDkOGDouGDmOGDneGDnOGDmA!3m6!1s0x405c25004230b22d:0x9e8320eb32783fed!8m2!3d42.4957212!4d41.8596876!15sCjrhg6Dhg5Thg6Hhg6Lhg53hg6Dhg5Dhg5zhg5gg4YOR4YOQ4YOS4YOg4YOQ4YOi4YOY4YOd4YOc4YOYWjwiOuGDoOGDlOGDoeGDouGDneGDoOGDkOGDnOGDmCDhg5Hhg5Dhg5Lhg6Dhg5Dhg6Lhg5jhg53hg5zhg5iSARNnZW9yZ2lhbl9yZXN0YXVyYW504AEA!16s%2Fg%2F11vy1f9nfz?entry=ttu&g_ep=EgoyMDI2MDkwOS4wIKXMDSoASAFQAw%3D%3D";

const SCHEDULE = [
  {
    time: "13:00",
    title: "ჯვრისწერა",
    href: CHURCH_MAP,
    image: church.url,
    alt: "საჯვაროს ეკლესიის აკვარელის ნახატი",
  },
  {
    time: "15:00",
    title: "ხელის მოწერის ცერემონია სოფ. კახათში",
    href: KAKHATI_MAP,
  },
  {
    time: "18:00",
    title: "სტუმრების მიღება",
    href: HOME_MAP,
  },
  {
    time: "19:00",
    title: "ვახშამი",
    image: dinner.url,
    href: DINNER_MAP,
    alt: "რესტორან ბაგრატიონის აკვარელის ნახატი",
  },
  {
    time: "21:00",
    title: "ტორტის გაჭრა",
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
      { rel: "preload", as: "image", href: "/images/goga-lika-venue.webp" },
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
            alt="დადიანების სასახლის აკვარელის ხედი"
            width={1024}
            height={610}
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-center lg:relative lg:col-start-2 lg:h-[100svh] lg:object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/45 via-white/25 to-white/70 lg:hidden" />

          <div className="relative animate-fade-in rounded-xl bg-white/70 px-8 py-10 backdrop-blur-[2px] lg:col-start-1 lg:row-start-1 lg:flex lg:h-full lg:flex-col lg:items-center lg:justify-center lg:rounded-none lg:bg-champagne lg:px-16 lg:text-center lg:backdrop-blur-none">
            <p className="text-[0.7rem] tracking-[0.28em] text-olive sm:tracking-[0.4em]">
              გეპატიჟებით ჩვენს ქორწილში
            </p>
            <h1 className="mt-6 flex flex-col items-center gap-2 font-display text-3xl font-light leading-tight text-olive sm:text-5xl lg:text-6xl">
              <span>გოგა</span>
              <span className="text-xl text-olive-soft sm:text-3xl">&</span>
              <span>ლიკა</span>
            </h1>
            <div className="hairline mx-auto mt-8 w-40 lg:w-56" />
            <p className="mt-6 text-sm tracking-[0.3em] text-ink/70 lg:text-base">22 · 09 · 2026</p>
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
            <Countdown target="2026-09-22T13:00:00+04:00" />
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

          <ul className="grid w-full max-w-md grid-cols-1 gap-12 md:max-w-3xl md:grid-cols-2 lg:max-w-7xl lg:grid-cols-5 lg:items-stretch lg:gap-6">
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
                      width={item.image === church.url ? 1024 : 896}
                      height={item.image === church.url ? 576 : 1195}
                      className="aspect-[4/3] w-full rounded-lg border border-olive/15 object-cover lg:aspect-[4/5]"
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
          <p className="font-display text-lg font-light text-white">გოგა & ლიკა</p>
          <p className="mt-2 text-[0.7rem] tracking-[0.35em] text-white/70">22 სექტემბერი 2026</p>
        </footer>
      </div>
    </main>
  );
}
