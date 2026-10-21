"use client";

import { useEffect, useRef } from "react";

export function CimabotPreview() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.45 && !reducedMotion.matches) {
          void video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: [0, 0.45] },
    );

    observer.observe(video);
    return () => {
      observer.disconnect();
      video.pause();
    };
  }, []);

  return (
    <div className="cima-preview">
      <video
        ref={videoRef}
        src="/work/cimabot-verification.mp4"
        poster="/work/cimabot-verification-poster.jpg"
        width={1314}
        height={738}
        preload="none"
        muted
        loop
        playsInline
        aria-label="Cimabot email verification demo in Discord"
      >
        Your browser does not support video playback.
      </video>
    </div>
  );
}
