"use client";

import { useEffect, useRef } from "react";

export function GearSlide() {
  const sectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const section = sectionRef.current;
        const panel = panelRef.current;
        if (!section || !panel) return;

        const top = section.getBoundingClientRect().top;
        const progress = Math.min(1, Math.max(0, 1 - top / window.innerHeight));
        const visible = reducedMotion.matches ? Number(progress >= 1) : progress;
        panel.style.transform = `translate3d(${(1 - visible) * 100}%, 0, 0)`;
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    reducedMotion.addEventListener("change", update);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      reducedMotion.removeEventListener("change", update);
    };
  }, []);

  return (
    <section className="gear-stage" id="gear" aria-label="Gear" ref={sectionRef}>
      <div className="gear-panel" ref={panelRef} aria-hidden="true" />
    </section>
  );
}
