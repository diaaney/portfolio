"use client";

import { useEffect, useState } from "react";
import { AnimatedTitle } from "../animated-title";

const titles = [
  { slug: "work", label: "WORK", reference: "DEMOS", variant: "demos", sprite: "/demos-sprite.png" },
  { slug: "about", label: "ABOUT", reference: "INTRO", variant: "intro", sprite: "/intro-sprite.png" },
  { slug: "details", label: "DETAILS", reference: "DETAILS", variant: "details", sprite: "/details-sprite.png" },
  { slug: "gear", label: "GEAR", reference: "WRAP UP", variant: "wrap-up", sprite: "/wrap-up-sprite.png" },
] as const;

type Word = "all" | (typeof titles)[number]["slug"];

export default function Home() {
  const [frame, setFrame] = useState<number | null>(null);
  const [word, setWord] = useState<Word>("all");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const selectedFrame = params.get("frame");
    const selectedWord = titles.find((title) => title.slug === params.get("word"));
    const timeout = window.setTimeout(() => {
      if (selectedFrame !== null && /^[0-7]$/.test(selectedFrame)) {
        setFrame(Number(selectedFrame));
      }
      if (selectedWord) setWord(selectedWord.slug);
    }, 0);
    return () => window.clearTimeout(timeout);
  }, []);

  function selectWord(nextWord: Word) {
    setWord(nextWord);
    const url = new URL(window.location.href);
    if (nextWord === "all") url.searchParams.delete("word");
    else url.searchParams.set("word", nextWord);
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  }

  return (
    <main className="comparison-page">
      <h1 className="sr-only">Comparación de títulos animados</h1>
      <nav className="word-nav" aria-label="Elegir palabra">
        <button type="button" onClick={() => selectWord("all")} aria-pressed={word === "all"}>Todas</button>
        {titles.map(({ slug, label }) => (
          <button key={slug} type="button" onClick={() => selectWord(slug)} aria-pressed={word === slug}>
            {label}
          </button>
        ))}
      </nav>
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
      {titles.filter(({ slug }) => word === "all" || word === slug).map(({ slug, label, reference, variant, sprite }) => (
        <section className="comparison-section" id={slug} key={variant} aria-label={`Animación ${label}`}>
          <div className="comparison-cell">
            <div className="title-window" role="img" aria-label={`Referencia ${reference}`}>
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
