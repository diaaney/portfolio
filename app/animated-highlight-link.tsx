"use client";

import { useEffect, useRef, useState } from "react";

type Stroke = {
  left: number;
  top: number;
  width: number;
  height: number;
  delay: number;
  duration: number;
};

export function AnimatedHighlightLink({
  href,
  children,
}: {
  href: string;
  children: string;
}) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const [strokes, setStrokes] = useState<Stroke[]>([]);

  useEffect(() => {
    const link = linkRef.current;
    const paragraph = link?.closest(".intro-personal");
    if (!link || !paragraph) return;

    const measure = () => {
      const range = document.createRange();
      range.selectNodeContents(link);
      const paragraphRect = paragraph.getBoundingClientRect();
      let delay = 0;
      const next = Array.from(range.getClientRects())
        .filter((rect) => rect.width > 0)
        .map((rect) => {
          const duration = Math.max(180, rect.width * 1.6);
          const stroke = {
            left: rect.left - paragraphRect.left,
            top: rect.top - paragraphRect.top + 2,
            width: rect.width,
            height: rect.height,
            delay,
            duration,
          };
          delay += duration;
          return stroke;
        });
      setStrokes(next);
    };

    const observer = new ResizeObserver(measure);
    observer.observe(paragraph);
    document.fonts.ready.then(measure);
    measure();

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <a
        ref={linkRef}
        className="intro-easter-egg"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
      <span className="intro-easter-egg-strokes" aria-hidden="true">
        {strokes.map((stroke, index) => (
          <span
            className="intro-easter-egg-stroke"
            key={index}
            style={{
              left: stroke.left,
              top: stroke.top,
              width: stroke.width,
              height: stroke.height,
              "--stroke-delay": `${stroke.delay}ms`,
              "--stroke-duration": `${stroke.duration}ms`,
            } as React.CSSProperties}
          />
        ))}
      </span>
    </>
  );
}
