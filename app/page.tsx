import Image from "next/image";
import { ActivityCalendars } from "./activity-calendars";
import { AnimatedTitle } from "./animated-title";
import { FlyingCat } from "./flying-cat";
import { SidebarNavigation } from "./sidebar-navigation";

const workCards = [
  { number: "01", title: "placeholder one", line: "M12 73 C 36 48 69 27 108 67" },
  { number: "02", title: "placeholder two", line: "M23 57 C 27 17 99 20 98 56 C 98 86 32 85 23 57 Z" },
  { number: "03", title: "placeholder three", line: "M17 29 H103 M17 73 H103 M60 35 V67 M53 42 L60 35 L67 42 M53 60 L60 67 L67 60" },
] as const;

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
                  we are building a web design agency for local businesses and some
                  discord tools.
                </p>
              </div>
              <p>
                love shipping apps and new features. i can spend forever designing the
                ui and working out how the app will work in my head. i started leetcode
                too, still figuring it out.
              </p>
            </div>

            <p className="intro-personal">
              outside of coding, i love shooters. i played a lot of valorant and even
              made it to radiant o.o. these days i mostly play cs and league (i suck
              at both). i also love decorating discord communities and making bots
              for them. and I LOVE CROISSANTS and coffee. i would love to be
              french, but i am chinese. you met me at a very chinese time in my life.
            </p>
          </div>
        </header>

        <section className="portfolio-section" id="work" aria-label="Work">
          <ChapterTitle label="WORK" variant="demos" />

          <div className="work-examples">
            <section className="work-example" aria-labelledby="work-example-one">
              <div className="work-example-heading">
                <h3 id="work-example-one"><em>“project 01”</em> / visual concepts</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
              </div>

              <div className="work-bento-grid">
                {workCards.map((card) => (
                  <article className="work-bento-card" key={card.number}>
                    <div className={`work-bento-visual work-bento-visual-${card.number}`} aria-hidden="true">
                      <span className="work-bento-index">{card.number} / PLACEHOLDER</span>
                      <span className="work-bento-shape" />
                      <span className="work-bento-glass">
                        <svg viewBox="0 0 120 100" fill="none" aria-hidden="true">
                          <path d={card.line} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </div>
                    <h4>{card.title}</h4>
                    <p>Lorem ipsum dolor sit amet.</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="work-example work-example-talk" aria-labelledby="work-example-two">
              <div className="work-example-heading">
                <h3 id="work-example-two"><em>“project 02”</em> / another direction</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque tincidunt sapien vel mauris cursus, a placerat mi tempor.</p>
              </div>

              <div className="work-talk-art" aria-hidden="true">
                <span className="work-talk-bubble work-talk-bubble-one">...</span>
                <span className="work-talk-bubble work-talk-bubble-two">?</span>
                <span className="work-talk-bubble work-talk-bubble-three">!</span>
                <span className="work-talk-orbit" />
              </div>

              <div className="work-talk-list">
                <div className="work-talk-row">
                  <span><i aria-hidden="true">◻</i> placeholder one</span>
                  <span>Lorem ipsum dolor sit amet</span>
                </div>
                <div className="work-talk-row">
                  <span><i aria-hidden="true">◉</i> placeholder two</span>
                  <span>Consectetur adipiscing elit</span>
                </div>
              </div>
            </section>
          </div>
        </section>

        <section className="portfolio-section" id="details" aria-label="Details">
          <ChapterTitle label="DETAILS" variant="details" />
        </section>

        <div id="gear" aria-label="Gear" />
      </main>
    </>
  );
}
