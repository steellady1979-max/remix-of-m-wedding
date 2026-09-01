import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { EnvelopeIntro } from "@/components/EnvelopeIntro";
import venue from "@/assets/venue.jpg.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Wedding Invitation | Lakeside Celebration" },
      {
        name: "description",
        content:
          "An immersive wedding invitation: a wax-sealed envelope opens onto a lakeside garden venue.",
      },
      { property: "og:title", content: "Wedding Invitation | Lakeside Celebration" },
      {
        property: "og:description",
        content:
          "An immersive wedding invitation: a wax-sealed envelope opens onto a lakeside garden venue.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [revealed, setRevealed] = useState(false);

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-ink">
      <EnvelopeIntro onFinished={() => setRevealed(true)} />

      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${venue.url})` }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-background/10 via-background/5 to-ink/40" />

      <div
        className={`relative z-10 transition-all duration-1000 ease-out ${
          revealed ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
      >
        {/* Intentionally blank content slots — custom text blocks go here later. */}
        <section className="flex min-h-screen flex-col items-center justify-center gap-8 px-6 py-24" />
        <section className="flex min-h-[70vh] flex-col items-center justify-center gap-8 px-6 py-24" />
        <section className="flex min-h-[70vh] flex-col items-center justify-center gap-8 px-6 py-24" />
      </div>
    </main>
  );
}
