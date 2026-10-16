"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const navigation = [
  { label: "WORK", href: "#work" },
  { label: "ABOUT", href: "#about" },
  { label: "DETAILS", href: "#details" },
  { label: "GEAR", href: "#gear" },
] as const;

export function SidebarNavigation() {
  const [active, setActive] = useState<string>("#about");

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

        let current = "#about";
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

  return (
    <aside className="site-rail" aria-label="Site navigation">
      <a className="rail-icon" href="#top" aria-label="Back to top">
        <Image src="/illustrations/laughing-cat.png" alt="" width={562} height={375} priority />
      </a>
      <nav className="rail-links" aria-label="Sections">
        {navigation.map(({ label, href }) => (
          <a href={href} key={href} aria-current={active === href ? "location" : undefined}>
            {active === href && (
              <Image
                className="rail-pointer"
                src="/illustrations/sidebar-pointer.png"
                alt=""
                width={518}
                height={454}
                aria-hidden="true"
              />
            )}
            {label}
          </a>
        ))}
      </nav>
    </aside>
  );
}
