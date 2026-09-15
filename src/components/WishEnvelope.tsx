import { useState } from "react";

import { weddingDatabase } from "@/lib/wedding-database";
const envelope = { url: "/images/wish-envelope.png" };

export function WishEnvelope() {
  const [open, setOpen] = useState(false);
  const [wish, setWish] = useState("");
  const [sent, setSent] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-6 lg:max-w-lg">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="group relative w-[70vw] max-w-[320px] cursor-pointer transition-transform duration-500 hover:scale-[1.03] lg:w-[340px] lg:max-w-none"

        aria-expanded={open}
      >
        <img
          src={envelope.url}
          alt="სურვილების კონვერტი — თეთრი კონვერტი მაქმანის ბაფთით"
          loading="lazy"
          decoding="async"
          width={900}
          height={1269}
          className={`w-full transition-transform duration-700 ease-drape ${
            open ? "-translate-y-2 rotate-[-1deg]" : ""
          }`}
        />
        <span className="pointer-events-none absolute inset-x-0 top-[34%] px-5 text-center font-display text-base leading-relaxed tracking-normal text-olive sm:text-lg">
          დაგვიტოვე შენი სურვილი
        </span>
      </button>

      {open && (
        <div className="w-full animate-fade-in space-y-4 text-center">
          {sent ? (
            <p className="font-display text-xl font-light text-olive">
              გმადლობთ თბილი სიტყვებისთვის
            </p>
          ) : (
            <>
              <textarea
                value={wish}
                onChange={(e) => setWish(e.target.value)}
                rows={4}
                placeholder="დაწერე სურვილი ახალდაქორწინებულებს..."
                className="w-full rounded-md border border-olive/25 bg-white px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-olive"
              />
              <button
                type="button"
                disabled={wish.trim().length < 3 || saving}
                onClick={async () => {
                  setSaving(true);
                  setError(null);
                  const { error: dbError } = await weddingDatabase
                    .from("wishes")
                    .insert({ message: wish.trim() });
                  setSaving(false);
                  if (dbError) {
                    setError("ვერ გაიგზავნა, სცადეთ ხელახლა");
                    return;
                  }
                  setSent(true);
                }}
                className="w-full rounded-md bg-olive px-6 py-3 text-sm tracking-normal text-white transition-opacity disabled:opacity-40"
              >
                {saving ? "იგზავნება..." : "სურვილის დატოვება"}
              </button>
              {error && <p className="text-xs text-destructive">{error}</p>}
            </>
          )}
        </div>
      )}
    </div>
  );
}
