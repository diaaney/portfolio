"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const navigation = [
  { label: "INTRO", href: "#top" },
  { label: "ABOUT", href: "#about" },
  { label: "WORK", href: "#work" },
  { label: "DETAILS", href: "#details" },
  { label: "GEAR", href: "#gear" },
] as const;

export function SidebarNavigation() {
  const [active, setActive] = useState<string>("#top");
  const [pointerTransform, setPointerTransform] = useState<string | null>(null);
  const linksRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const marker = window.innerHeight * 0.35;
        const sections = navigation
          .map(({ href }) => ({ href, element: document.querySelector(href) }))
          .filter((section) => section.element !== null)
          .sort((a, b) =>
            a.element!.getBoundingClientRect().top - b.element!.getBoundingClientRect().top,
          );

        let current = "#top";
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
        const top = active === "#top" ? -30 : link.offsetTop - 10;
        const left = active === "#top" ? -32 : link.offsetLeft + link.offsetWidth / 2 - 50;
        setPointerTransform(`translate3d(${left}px, ${top}px, 0) rotate(55deg)`);
      } else {
        const top = active === "#top" ? -105 : link.offsetTop + link.offsetHeight / 2 - 50;
        const left = active === "#top" ? -84 : -126;
        const angle = active === "#top" ? 35 : -18;
        setPointerTransform(`translate3d(${left}px, ${top}px, 0) rotate(${angle}deg)`);
      }
    };

    placePointer();
    window.addEventListener("resize", placePointer);
    return () => window.removeEventListener("resize", placePointer);
  }, [active]);

  return (
    <aside className="site-rail" aria-label="Site navigation">
      <nav className="rail-links" aria-label="Sections" ref={linksRef}>
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
            className={href === "#top" ? "rail-intro" : undefined}
            href={href}
            key={href}
            aria-label={href === "#top" ? "Intro" : undefined}
            aria-current={active === href ? "location" : undefined}
          >
            {href === "#top" && (
              <Image
                src="/illustrations/laughing-cat.png"
                alt=""
                width={562}
                height={375}
                priority
              />
            )}
            {href !== "#top" && <span>{label}</span>}
          </a>
        ))}
      </nav>
    </aside>
  );
}
