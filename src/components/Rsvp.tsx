import { useState } from "react";

import cake from "@/assets/cake.png.asset.json";

type Answer = "yes" | "no" | null;

const inputClass =
  "w-full rounded-md border border-olive/25 bg-white px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-olive";

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-md overflow-hidden rounded-2xl border border-olive/20 bg-white shadow-[0_20px_50px_-30px_rgba(60,70,40,0.45)]">
      <div className="flex items-end justify-center bg-olive-mist/60 px-6 pt-8">
        <img
          src={cake.url}
          alt="თეთრი საქორწილო ტორტი"
          loading="lazy"
          className="h-44 w-auto object-contain mix-blend-multiply"
        />
      </div>
      <div className="px-6 pb-10 pt-8 text-center sm:px-8">{children}</div>
    </div>
  );
}

export function Rsvp() {
  const [answer, setAnswer] = useState<Answer>(null);
  const [name, setName] = useState("");
  const [plusOne, setPlusOne] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [sent, setSent] = useState(false);

  const canSend =
    answer === "no" ||
    (answer === "yes" && name.trim().length > 1 && (!plusOne || guestName.trim().length > 1));

  if (sent) {
    return (
      <Card>
        <p className="animate-fade-in font-display text-xl font-light text-olive">
          {answer === "yes" ? "გმადლობთ! ველოდებით." : "გმადლობთ პასუხისთვის."}
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <p className="text-[0.65rem] tracking-[0.45em] text-olive">დასწრება</p>
      <h2 className="mt-4 font-display text-2xl font-light text-olive sm:text-3xl">
        შეძლებთ მობრძანებას?
      </h2>
      <div className="hairline mx-auto mt-6 w-28" />

      <form
        className="mt-8 space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          if (canSend) setSent(true);
        }}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {(
            [
              { value: "yes", label: "სიამოვნებით" },
              { value: "no", label: "სამწუხაროდ ვერ" },
            ] as const
          ).map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => setAnswer(o.value)}
              className={`rounded-full border px-4 py-3 text-sm transition-all duration-300 ${
                answer === o.value
                  ? "border-olive bg-olive text-white shadow-[0_10px_24px_-14px_rgba(70,85,45,0.9)]"
                  : "border-olive/25 bg-white text-ink/80 hover:border-olive/60 hover:bg-olive-mist/50"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>

        {answer === "yes" && (
          <div className="animate-fade-in space-y-4 text-left">
            <label className="block">
              <span className="text-[0.65rem] tracking-[0.3em] text-olive">სახელი, გვარი</span>
              <input
                className={`mt-2 ${inputClass}`}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="სახელი გვარი"
              />
            </label>

            <label className="flex items-center gap-3 rounded-md bg-olive-mist/50 px-4 py-3 text-sm text-ink/80">
              <input
                type="checkbox"
                checked={plusOne}
                onChange={(e) => setPlusOne(e.target.checked)}
                className="h-4 w-4 accent-olive"
              />
              +1 თანმხლები პირით
            </label>

            {plusOne && (
              <label className="block animate-fade-in">
                <span className="text-[0.65rem] tracking-[0.3em] text-olive">
                  თანმხლების სახელი, გვარი
                </span>
                <input
                  className={`mt-2 ${inputClass}`}
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="სახელი გვარი"
                />
              </label>
            )}
          </div>
        )}

        {answer && (
          <button
            type="submit"
            disabled={!canSend}
            className="w-full animate-fade-in rounded-full bg-olive px-6 py-3 text-sm tracking-[0.25em] text-white transition-opacity disabled:opacity-40"
          >
            გაგზავნა
          </button>
        )}
      </form>
    </Card>
  );
}
