import Image from "next/image";
import { ActivityCalendars } from "./activity-calendars";
import { AnimatedHighlightLink } from "./animated-highlight-link";
import { AnimatedTitle } from "./animated-title";
import { FlyingCat } from "./flying-cat";
import { GearSlide } from "./gear-slide";
import { SidebarNavigation } from "./sidebar-navigation";
import { WorkCarousel } from "./work-carousel";

function ChapterTitle({
  label,
  variant,
}: {
  label: string;
  variant: "demos" | "intro" | "details";
}) {
  return (
    <div className="chapter-break">
      <h2 className="chapter-screen-reader-title">{label}</h2>
      <div className="chapter-animation">
        <AnimatedTitle variant={variant} frame={null} />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <SidebarNavigation />

      <main className="portfolio-page" id="top">
        <FlyingCat />
        <header className="hero">
          <div className="hero-heading">
            <h1>
              hey, i&apos;m diane
              <br />
              nice to meet you!
            </h1>
            <p className="hero-subtitle">
              ml engineering student @ <a href="https://www.uabc.mx/" target="_blank" rel="noopener noreferrer">UABC</a>
            </p>
          </div>

          <ActivityCalendars />

          <div className="hero-about" id="about">
            <ChapterTitle label="ABOUT" variant="intro" />

            <div className="intro-columns">
              <div className="intro-first">
                <div className="about-camera-cat" aria-hidden="true">
                  <Image src="/illustrations/diane-with-cat.png" alt="" width={1853} height={1998} />
                </div>
                <p>
                  20, based in baja california, and in my second year of uni. i started
                  lumiose labs because i wanted to learn by making real things. right now
                  i&apos;m building a web design agency for local businesses and some
                  discord tools.
                </p>
              </div>
              <p>
                love shipping apps and new features. i&apos;m a native speaker of spanish
                and english, and i started learning french a few months ago. once i&apos;m
                comfortable with it, i&apos;d love to learn russian or chinese. i started
                leetcode too, still figuring it out.
              </p>
            </div>

            <p className="intro-personal">
              outside of coding, i love shooters. i played a lot of valorant and even
              made it to radiant o.o. these days i mostly play cs and league (i suck
              at both). i also love decorating discord communities and making bots
              for them. and I LOVE CROISSANTS and coffee.{" "}
              <AnimatedHighlightLink href="https://www.tiktok.com/@santeluca/video/7691252880585526550">
                i would love to be french, but i am chinese. you met me at a very
                chinese time in my life.
              </AnimatedHighlightLink>
            </p>
          </div>
        </header>

        <section className="portfolio-section" id="work" aria-label="Work">
          <ChapterTitle label="WORK" variant="demos" />

          <WorkCarousel />
        </section>

        <section className="portfolio-section" id="details" aria-label="Details">
          <ChapterTitle label="DETAILS" variant="details" />
        </section>

      </main>
      <GearSlide />
    </>
  );
}
