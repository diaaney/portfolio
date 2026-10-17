"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";

const workCards = [
  { number: "01", title: "placeholder one", line: "M12 73 C 36 48 69 27 108 67" },
  { number: "02", title: "placeholder two", line: "M23 57 C 27 17 99 20 98 56 C 98 86 32 85 23 57 Z" },
  { number: "03", title: "placeholder three", line: "M17 29 H103 M17 73 H103 M60 35 V67 M53 42 L60 35 L67 42 M53 60 L60 67 L67 60" },
] as const;

const projectCount = 2;

export function WorkCarousel() {
  const [active, setActive] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [height, setHeight] = useState<number>();
  const viewport = useRef<HTMLDivElement>(null);
  const slides = useRef<(HTMLElement | null)[]>([]);
  const drag = useRef<{ startX: number; startTime: number; offset: number } | null>(null);

  useEffect(() => {
    const slide = slides.current[active];
    if (!slide) return;

    const measure = () => setHeight(Math.ceil(slide.getBoundingClientRect().height));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(slide);
    return () => observer.disconnect();
  }, [active]);

  const goTo = (next: number) => {
    setActive(Math.max(0, Math.min(projectCount - 1, next)));
    setDragOffset(0);
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { startX: event.clientX, startTime: performance.now(), offset: 0 };
    setIsDragging(true);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    const raw = event.clientX - drag.current.startX;
    const atEdge = (active === 0 && raw > 0) || (active === projectCount - 1 && raw < 0);
    const offset = atEdge ? raw * 0.24 : raw;
    drag.current.offset = offset;
    setDragOffset(offset);
  };

  const finishDrag = () => {
    if (!drag.current) return;
    const { offset, startTime } = drag.current;
    const width = slides.current[active]?.clientWidth ?? viewport.current?.clientWidth ?? 700;
    const quickFlick = Math.abs(offset) > 24 && Math.abs(offset) / Math.max(performance.now() - startTime, 1) > 0.45;
    if (Math.abs(offset) > Math.min(90, width * 0.16) || quickFlick) {
      goTo(active + (offset < 0 ? 1 : -1));
    } else {
      setDragOffset(0);
    }
    drag.current = null;
    setIsDragging(false);
  };

  return (
    <div className="work-examples work-carousel">
      <div
        className={`work-carousel-viewport${isDragging ? " is-dragging" : ""}`}
        ref={viewport}
        style={height === undefined ? undefined : { height }}
        role="region"
        aria-roledescription="carousel"
        aria-label="Selected work projects"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            goTo(active + (event.key === "ArrowRight" ? 1 : -1));
          }
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={() => { drag.current = null; setDragOffset(0); setIsDragging(false); }}
      >
        <div
          className="work-carousel-track"
          style={{ transform: `translate3d(calc(${-active * 100}% - ${active ? "var(--work-slide-gap)" : "0px"} + ${dragOffset}px), 0, 0)`, transition: isDragging ? "none" : undefined }}
        >
          <section
            className={`work-example work-carousel-slide${active === 0 ? " is-active" : ""}`}
            aria-labelledby="work-example-one"
            aria-hidden={active !== 0}
            inert={active !== 0}
            ref={(node) => { slides.current[0] = node; }}
          >
            <div className="work-example-heading">
              <h3 id="work-example-one"><em>“project 01”</em> / visual concepts</h3>
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

          <section
            className={`work-example work-example-talk work-carousel-slide${active === 1 ? " is-active" : ""}`}
            aria-labelledby="work-example-two"
            aria-hidden={active !== 1}
            inert={active !== 1}
            ref={(node) => { slides.current[1] = node; }}
          >
            <div className="work-example-heading">
              <h3 id="work-example-two"><em>“project 02”</em> / another direction</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque tincidunt sapien vel mauris cursus, a placerat mi tempor.</p>
            </div>

            <div className="work-talk-art" aria-hidden="true">
              <span className="work-talk-bubble work-talk-bubble-one">...</span>
              <span className="work-talk-bubble work-talk-bubble-two">?</span>
              <span className="work-talk-bubble work-talk-bubble-three">!</span>
              <span className="work-talk-orbit" />
            </div>

            <div className="work-talk-list">
              <div className="work-talk-row">
                <span><i aria-hidden="true">◻</i> placeholder one</span>
                <span>Lorem ipsum dolor sit amet</span>
              </div>
              <div className="work-talk-row">
                <span><i aria-hidden="true">◉</i> placeholder two</span>
                <span>Consectetur adipiscing elit</span>
              </div>
            </div>
          </section>
        </div>
      </div>

      <span className="chapter-screen-reader-title" aria-live="polite">Project {active + 1} of {projectCount}</span>
      <button
        className={`work-carousel-arrow work-carousel-arrow-next${active === 0 ? " is-visible" : ""}`}
        type="button"
        onClick={() => goTo(1)}
        aria-label="Next project"
        disabled={active !== 0}
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m8 5 7 7-7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      <button
        className={`work-carousel-arrow work-carousel-arrow-previous${active === 1 ? " is-visible" : ""}`}
        type="button"
        onClick={() => goTo(0)}
        aria-label="Previous project"
        disabled={active !== 1}
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m16 5-7 7 7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
    </div>
  );
}
