import { AnimatedTitle } from "./animated-title";

export default function Home() {
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
        <span>Hecho aquí: DIANE</span>
      </div>
      {titles.map(({ text, variant, sprite }) => (
        <section className="comparison-section" key={variant} aria-label={`Animación ${text}`}>
          <div className="comparison-cell">
            <div className="title-window" role="img" aria-label={`Referencia ${text}`}>
              <div className="title-frames" style={{ backgroundImage: `url(${sprite})` }} />
            </div>
          </div>
          <div className="comparison-cell">
            <AnimatedTitle variant={variant} word="DIANE" />
          </div>
        </section>
      ))}
    </main>
  );
}
