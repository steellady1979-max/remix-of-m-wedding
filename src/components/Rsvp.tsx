import { useState } from "react";

type Answer = "yes" | "no" | null;

const inputClass =
  "w-full rounded-md border border-olive/25 bg-white px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-olive";

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
      <div className="w-full max-w-md rounded-lg border border-olive/25 bg-white px-6 py-10 text-center">
        <p className="font-display text-xl font-light text-olive">
          {answer === "yes" ? "გმადლობთ! ველოდებით." : "გმადლობთ პასუხისთვის."}
        </p>
      </div>
    );
  }

  return (
    <form
      className="w-full max-w-md space-y-5"
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
            className={`rounded-md border px-4 py-3 text-sm transition-colors ${
              answer === o.value
                ? "border-olive bg-olive text-white"
                : "border-olive/25 bg-white text-ink/80 hover:border-olive/50"
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

          <label className="flex items-center gap-3 text-sm text-ink/80">
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
          className="w-full rounded-md bg-olive px-6 py-3 text-sm tracking-[0.25em] text-white transition-opacity disabled:opacity-40"
        >
          გაგზავნა
        </button>
      )}
    </form>
  );
}
