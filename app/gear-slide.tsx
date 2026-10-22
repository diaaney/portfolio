"use client";

import { useEffect, useRef } from "react";

export function GearSlide() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reveal = document.querySelector<HTMLElement>(".gear-nav-reveal");
    const inverseRail = reveal?.querySelector<HTMLElement>(".site-rail-inverse");
    let sectionTop = 0;
    let lastOffset = -1;
    let firstMeasure = true;

    const update = () => {
      if (!reveal || !inverseRail) return;

      const progress = Math.min(1, Math.max(0, (window.scrollY - sectionTop) / window.innerHeight));
      const visible = reducedMotion.matches ? Number(progress >= 1) : progress;
      const offset = (1 - visible) * window.innerWidth;
      if (offset === lastOffset) return;

      reveal.style.transform = `translate3d(${offset}px, 0, 0)`;
      inverseRail.style.transform = `translate3d(${-offset}px, 0, 0)`;
      lastOffset = offset;
    };

    const measure = () => {
      const section = sectionRef.current;
      if (!section) return;
      sectionTop = section.getBoundingClientRect().top + window.scrollY;
      if (firstMeasure && window.location.hash === "#gear") {
        window.scrollTo({ top: sectionTop + window.innerHeight, behavior: "instant" });
      }
      firstMeasure = false;
      lastOffset = -1;
      update();
    };

    const page = document.querySelector(".portfolio-page");
    const observer = page ? new ResizeObserver(measure) : null;
    if (page) observer?.observe(page);
    measure();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", measure);
    reducedMotion.addEventListener("change", update);

    return () => {
      observer?.disconnect();
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", measure);
      reducedMotion.removeEventListener("change", update);
    };
  }, []);

  return (
    <section className="gear-stage" id="gear" aria-label="Gear" ref={sectionRef}>
      <h2 className="chapter-screen-reader-title">
        also working on this... i just wanna launch the page 😭
      </h2>
    </section>
  );
}
