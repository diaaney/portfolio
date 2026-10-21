"use client";

import { useEffect, useRef } from "react";

type CimabotPreviewProps = {
  src?: string;
  poster?: string;
  width?: number;
  height?: number;
  label?: string;
};

export function CimabotPreview({
  src = "/work/cimabot-verification.mp4",
  poster = "/work/cimabot-verification-poster.jpg",
  width = 1314,
  height = 738,
  label = "Cimabot email verification demo in Discord",
}: CimabotPreviewProps = {}) {
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
        src={src}
        poster={poster}
        width={width}
        height={height}
        style={{ aspectRatio: `${width} / ${height}` }}
        preload="none"
        muted
        loop
        playsInline
        aria-label={label}
      >
        Your browser does not support video playback.
      </video>
    </div>
  );
}
