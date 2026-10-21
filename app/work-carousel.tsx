"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import { CimabotProject, LumioseProject, RapierProject } from "./work-projects";

const projects = [
  { number: "02", name: "Lumiose Studio", Content: LumioseProject },
  { number: "03", name: "Cimabot", Content: CimabotProject },
  { number: "04", name: "Rapier", Content: RapierProject },
] as const;

const projectCount = projects.length;

export function WorkCarousel() {
  const [active, setActive] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [height, setHeight] = useState<number>();
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const slides = useRef<(HTMLElement | null)[]>([]);
  const drag = useRef<{ startX: number; startTime: number; offset: number } | null>(null);
  const dragFrame = useRef(0);

  useEffect(() => () => cancelAnimationFrame(dragFrame.current), []);

  useEffect(() => {
    const slide = slides.current[active];
    if (!slide) return;

    const measure = () => setHeight(Math.ceil(slide.getBoundingClientRect().height));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(slide);
    return () => observer.disconnect();
  }, [active]);

  const resetDragOffset = () => {
    cancelAnimationFrame(dragFrame.current);
    dragFrame.current = 0;
    track.current?.style.setProperty("--work-drag-offset", "0px");
  };

  const goTo = (next: number) => {
    resetDragOffset();
    setActive(Math.max(0, Math.min(projectCount - 1, next)));
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    if ((event.target as HTMLElement).closest("a, button")) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { startX: event.clientX, startTime: performance.now(), offset: 0 };
    setIsDragging(true);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    const raw = event.clientX - drag.current.startX;
    const atEdge = (active === 0 && raw > 0) || (active === projectCount - 1 && raw < 0);
    drag.current.offset = atEdge ? raw * 0.24 : raw;
    if (!dragFrame.current) {
      dragFrame.current = requestAnimationFrame(() => {
        dragFrame.current = 0;
        track.current?.style.setProperty("--work-drag-offset", `${drag.current?.offset ?? 0}px`);
      });
    }
  };

  const finishDrag = () => {
    if (!drag.current) return;
    const { offset, startTime } = drag.current;
    const width = slides.current[active]?.clientWidth ?? viewport.current?.clientWidth ?? 700;
    const quickFlick = Math.abs(offset) > 24 && Math.abs(offset) / Math.max(performance.now() - startTime, 1) > 0.45;
    if (Math.abs(offset) > Math.min(90, width * 0.16) || quickFlick) {
      goTo(active + (offset < 0 ? 1 : -1));
    } else {
      resetDragOffset();
    }
    drag.current = null;
    setIsDragging(false);
  };

  const gapOffset = " - var(--work-slide-gap)".repeat(active);

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
        onPointerCancel={() => { drag.current = null; resetDragOffset(); setIsDragging(false); }}
      >
        <div
          className="work-carousel-track"
          ref={track}
          style={{ transform: `translate3d(calc(${-active * 100}%${gapOffset} + var(--work-drag-offset, 0px)), 0, 0)`, transition: isDragging ? "none" : undefined }}
        >
          {projects.map(({ number, Content }, index) => (
            <section
              className={`work-example work-carousel-slide work-project-${number}${active === index ? " is-active" : ""}`}
              aria-labelledby={`work-${number}-title`}
              aria-hidden={active !== index}
              inert={active !== index}
              key={number}
              ref={(node) => { slides.current[index] = node; }}
            >
              <Content />
            </section>
          ))}
        </div>
      </div>

      <span className="chapter-screen-reader-title" aria-live="polite">
        {projects[active].name}, project {active + 1} of {projectCount}
      </span>
      <button
        className={`work-carousel-arrow work-carousel-arrow-next${active < projectCount - 1 ? " is-visible" : ""}`}
        type="button"
        onClick={() => goTo(active + 1)}
        aria-label="Next project"
        disabled={active === projectCount - 1}
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m8 5 7 7-7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      <button
        className={`work-carousel-arrow work-carousel-arrow-previous${active > 0 ? " is-visible" : ""}`}
        type="button"
        onClick={() => goTo(active - 1)}
        aria-label="Previous project"
        disabled={active === 0}
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m16 5-7 7 7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      <div className="work-carousel-dots" role="group" aria-label="Choose a project">
        {projects.map((project, index) => (
          <button
            className={`work-carousel-dot${active === index ? " is-active" : ""}`}
            type="button"
            key={project.number}
            onClick={() => goTo(index)}
            aria-label={`Go to ${project.name}`}
            aria-current={active === index ? "true" : undefined}
          ><span /></button>
        ))}
      </div>
    </div>
  );
}
