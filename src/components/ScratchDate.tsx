import { useEffect, useRef, useState } from "react";

/**
 * Scratch-off card: guests rub the olive foil away to uncover the wedding date.
 * Pointer events only (works for mouse + touch), single canvas, no libraries.
 */
export function ScratchDate({
  children,
  hint = "გადაფხიკე",
}: {
  children: React.ReactNode;
  hint?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const ticks = useRef(0);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const paint = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const g = ctx.createLinearGradient(0, 0, rect.width, rect.height);
      g.addColorStop(0, "#6b7a4f");
      g.addColorStop(0.5, "#8b9a6f");
      g.addColorStop(1, "#5d6b45");
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, rect.width, rect.height);
    };

    paint();
    window.addEventListener("resize", paint);
    return () => window.removeEventListener("resize", paint);
  }, []);

  const scratch = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.globalCompositeOperation = "destination-out";
    ctx.lineWidth = Math.max(rect.width * 0.12, 34);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    const prev = last.current ?? { x, y };
    ctx.moveTo(prev.x, prev.y);
    ctx.lineTo(x, y);
    ctx.stroke();
    last.current = { x, y };

    // Progress check is throttled — getImageData is the expensive part.
    ticks.current += 1;
    if (ticks.current % 8 !== 0) return;
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let clear = 0;
    const step = 40 * 4;
    let total = 0;
    for (let i = 3; i < data.length; i += step) {
      total++;
      if (data[i]! < 24) clear++;
    }
    if (total && clear / total > 0.55) setRevealed(true);
  };

  return (
    <div className="relative w-full max-w-md overflow-hidden rounded-lg border border-olive/25 bg-white">
      <div className="px-6 py-10 text-center">{children}</div>
      <canvas
        ref={canvasRef}
        onPointerDown={(e) => {
          drawing.current = true;
          last.current = null;
          e.currentTarget.setPointerCapture(e.pointerId);
          scratch(e);
        }}
        onPointerMove={(e) => {
          if (drawing.current) scratch(e);
        }}
        onPointerUp={() => {
          drawing.current = false;
          last.current = null;
        }}
        onPointerLeave={() => {
          drawing.current = false;
          last.current = null;
        }}
        className={`absolute inset-0 h-full w-full touch-none transition-opacity duration-700 ${
          revealed ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      />
      {!revealed && (
        <span className="pointer-events-none absolute inset-x-0 bottom-4 text-center text-[0.7rem] uppercase tracking-[0.35em] text-white/85">
          {hint}
        </span>
      )}
    </div>
  );
}
