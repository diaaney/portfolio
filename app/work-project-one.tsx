// Saved for a future project. This layout is intentionally not in the carousel yet.
const workCards = [
  { number: "01", title: "placeholder one", line: "M12 73 C 36 48 69 27 108 67" },
  { number: "02", title: "placeholder two", line: "M23 57 C 27 17 99 20 98 56 C 98 86 32 85 23 57 Z" },
  { number: "03", title: "placeholder three", line: "M17 29 H103 M17 73 H103 M60 35 V67 M53 42 L60 35 L67 42 M53 60 L60 67 L67 60" },
] as const;

export function ReservedWorkProjectOne() {
  return (
    <section className="work-example">
      <div className="work-example-heading">
        <h3><em>“project 01”</em> / visual concepts</h3>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
      </div>

      <div className="work-bento-grid">
        {workCards.map((card) => (
          <article className="work-bento-card" key={card.number}>
            <div className={`work-bento-visual work-bento-visual-${card.number}`} aria-hidden="true">
              <span className="work-bento-index">{card.number} / PLACEHOLDER</span>
              <span className="work-bento-shape" />
              <span className="work-bento-glass">
                <svg viewBox="0 0 120 100" fill="none" aria-hidden="true">
                  <path d={card.line} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>
            <h4>{card.title}</h4>
            <p>Lorem ipsum dolor sit amet.</p>
          </article>
        ))}
      </div>
    </section>
  );
}
