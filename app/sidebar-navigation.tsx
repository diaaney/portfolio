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
  const [pointerPosition, setPointerPosition] = useState<{
    top: number;
    left: number;
    transform: string;
  } | null>(null);
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
        setPointerPosition(
          active === "#top"
            ? { top: -25, left: -24, transform: "rotate(55deg)" }
            : {
                top: link.offsetTop - 10,
                left: link.offsetLeft + link.offsetWidth / 2 - 44,
                transform: "rotate(55deg)",
              },
        );
      } else {
        setPointerPosition({
          top: active === "#top" ? -72 : link.offsetTop + link.offsetHeight / 2 - 50,
          left: active === "#top" ? -90 : -116,
          transform: active === "#top" ? "rotate(35deg)" : "rotate(-18deg)",
        });
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
          style={pointerPosition ?? undefined}
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
