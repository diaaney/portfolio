"use client";

import { useEffect, useState } from "react";
import { AnimatedTitle } from "../animated-title";

export default function Home() {
  const [frame, setFrame] = useState<number | null>(null);

  useEffect(() => {
    const selected = new URLSearchParams(window.location.search).get("frame");
    if (selected === null || !/^[0-7]$/.test(selected)) return;
    const timeout = window.setTimeout(() => setFrame(Number(selected)), 0);
    return () => window.clearTimeout(timeout);
  }, []);
  const titles = [
    { text: "DEMOS", variant: "demos", sprite: "/demos-sprite.png" },
    { text: "INTRO", variant: "intro", sprite: "/intro-sprite.png" },
    { text: "DETAILS", variant: "details", sprite: "/details-sprite.png" },
    { text: "WRAP UP", variant: "wrap-up", sprite: "/wrap-up-sprite.png" },
  ] as const;

  return (
    <main className="comparison-page">
      <h1 className="sr-only">Comparación de títulos animados</h1>
      <div className="comparison-heading" aria-hidden="true">
        <span>Referencia</span>
        <span>Títulos del portafolio</span>
      </div>
      <nav className="frame-nav" aria-label="Ver fotograma">
        <button type="button" onClick={() => setFrame(null)} aria-pressed={frame === null}>Animar</button>
        {Array.from({ length: 8 }, (_, index) => (
          <button key={index} type="button" onClick={() => setFrame(index)} aria-pressed={frame === index}>
            {index + 1}
          </button>
        ))}
      </nav>
      {titles.map(({ text, variant, sprite }) => (
        <section className="comparison-section" key={variant} aria-label={`Animación ${text}`}>
          <div className="comparison-cell">
            <div className="title-window" role="img" aria-label={`Referencia ${text}`}>
              <div
                className="title-frames"
                style={{
                  backgroundImage: `url(${sprite})`,
                  ...(frame === null ? {} : { animation: "none", transform: `translateY(-${frame * 12.5}%)` }),
                }}
              />
            </div>
          </div>
          <div className="comparison-cell">
            <AnimatedTitle variant={variant} frame={frame} />
          </div>
        </section>
      ))}
    </main>
  );
}
