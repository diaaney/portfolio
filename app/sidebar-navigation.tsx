"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type MouseEvent } from "react";

const navigation = [
  { label: "INTRO", href: "#hero" },
  { label: "ABOUT", href: "#about" },
  { label: "WORK", href: "#work" },
  { label: "DETAILS", href: "#details" },
  { label: "GEAR", href: "#gear" },
] as const;

export function SidebarNavigation() {
  const [active, setActive] = useState<string>("#hero");
  const [pointerTransform, setPointerTransform] = useState<string | null>(null);
  const linksRef = useRef<HTMLElement>(null);
  const scrollFrame = useRef(0);
  const navigationTarget = useRef<string | null>(null);

  useEffect(() => {
    const cancelScroll = () => {
      cancelAnimationFrame(scrollFrame.current);
      navigationTarget.current = null;
    };

    window.addEventListener("wheel", cancelScroll, { passive: true });
    window.addEventListener("touchstart", cancelScroll, { passive: true });
    return () => {
      cancelScroll();
      window.removeEventListener("wheel", cancelScroll);
      window.removeEventListener("touchstart", cancelScroll);
    };
  }, []);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (navigationTarget.current) return;
        const marker = window.innerHeight * 0.35;
        const sections = navigation
          .map(({ href }) => ({ href, element: document.querySelector(href) }))
          .filter((section) => section.element !== null)
          .sort((a, b) =>
            a.element!.getBoundingClientRect().top - b.element!.getBoundingClientRect().top,
          );

        let current = "#hero";
        for (const { href, element } of sections) {
          if (element!.getBoundingClientRect().top <= marker) current = href;
        }
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
          current = "#gear";
        }
        setActive(current);
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    const placePointer = () => {
      const link = linksRef.current?.querySelector<HTMLAnchorElement>(`a[href="${active}"]`);
      if (!link) return;

      if (window.matchMedia("(max-width: 980px)").matches) {
        const center = link.offsetLeft + link.offsetWidth / 2;
        const top = active === "#hero" ? -30 : active === "#gear"
          ? link.offsetTop + link.offsetHeight / 2 + 18 : active === "#details"
            ? link.offsetTop + link.offsetHeight / 2 - 11 : link.offsetTop - 10;
        const left = active === "#hero" ? -32 : center - (active === "#gear" ? 20 : active === "#details" ? 40 : 50);
        const angle = active === "#gear" ? -88 : active === "#details" ? -45 : 55;
        setPointerTransform(`translate3d(${left}px, ${top}px, 0) rotate(${angle}deg)`);
      } else {
        const center = link.offsetTop + link.offsetHeight / 2;
        const top = active === "#hero" ? -87 : active === "#details" ? center - 22
          : active === "#gear" ? center + 24 : center - 45;
        const left = active === "#hero" ? -67 : active === "#gear" ? -84
          : active === "#details" ? -112 : -114;
        const angle = active === "#hero" ? 28 : active === "#gear" ? -88 : active === "#details" ? -50 : -18;
        setPointerTransform(`translate3d(${left}px, ${top}px, 0) rotate(${angle}deg)`);
      }
    };

    placePointer();
    window.addEventListener("resize", placePointer);
    return () => window.removeEventListener("resize", placePointer);
  }, [active]);

  const navigate = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const target = document.querySelector(href);
    if (!target) return;
    event.preventDefault();
    cancelAnimationFrame(scrollFrame.current);

    const maximum = document.documentElement.scrollHeight - window.innerHeight;
    const destination = Math.min(maximum, Math.max(0,
      window.scrollY + target.getBoundingClientRect().top + (href === "#gear" ? window.innerHeight : 0),
    ));
    const start = window.scrollY;

    history.pushState(null, "", href);
    setActive(href);
    navigationTarget.current = href;

    const distance = destination - start;
    const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches || Math.abs(distance) < 1
      ? 0
      : Math.min(2100, Math.max(href === "#gear" ? 900 : 650, Math.abs(distance) * 0.5));
    let started: number | null = null;

    const step = (now: number) => {
      started ??= now;
      const progress = duration === 0 ? 1 : Math.min(1, (now - started) / duration);
      const eased = progress * progress * (3 - 2 * progress);
      window.scrollTo({ top: start + distance * eased, behavior: "instant" });

      if (progress < 1) {
        scrollFrame.current = requestAnimationFrame(step);
      } else {
        navigationTarget.current = null;
      }
    };

    scrollFrame.current = requestAnimationFrame(step);
  };

  const renderRail = (inverse: boolean) => (
    <aside
      className={inverse ? "site-rail site-rail-inverse" : "site-rail"}
      aria-label={inverse ? undefined : "Site navigation"}
      aria-hidden={inverse || undefined}
    >
      <nav className="rail-links" aria-label={inverse ? undefined : "Sections"} ref={inverse ? undefined : linksRef}>
        <Image
          className="rail-pointer"
          src="/illustrations/sidebar-pointer.png"
          alt=""
          width={518}
          height={454}
          aria-hidden="true"
          style={pointerTransform ? { transform: pointerTransform } : undefined}
        />
        {navigation.map(({ label, href }) => (
          <a
            className={href === "#hero" ? "rail-intro" : undefined}
            href={href}
            key={href}
            onClick={(event) => navigate(event, href)}
            aria-label={href === "#hero" ? "Intro" : undefined}
            aria-current={active === href ? "location" : undefined}
            tabIndex={inverse ? -1 : undefined}
          >
            {href === "#hero" && (
              <Image
                src="/illustrations/laughing-cat.png"
                alt=""
                width={562}
                height={375}
                priority={!inverse}
              />
            )}
            {href !== "#hero" && <span>{label}</span>}
          </a>
        ))}
      </nav>
    </aside>
  );

  return (
    <>
      {renderRail(false)}
      <div className="gear-nav-reveal" aria-hidden="true">
        {renderRail(true)}
        <p className="gear-placeholder">
          also working on this...<br />i just wanna launch the page 😭
        </p>
      </div>
    </>
  );
}
