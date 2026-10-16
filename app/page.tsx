import Image from "next/image";
import { ActivityCalendars } from "./activity-calendars";
import { AnimatedTitle } from "./animated-title";
import { FlyingCat } from "./flying-cat";
import { SidebarNavigation } from "./sidebar-navigation";

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
                i love shipping apps and new features. the fun part is designing the
                ui, picking the stack, and figuring out how the screen, backend, and
                database all work together. i just started leetcode too, still figuring
                it out.
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

          <div className="hero-feature" aria-label="Featured work preview">
            <span className="feature-corner">SELECTED WORK / 001</span>
            <div className="feature-art" aria-hidden="true">
              <div className="feature-orbit feature-orbit-one" />
              <div className="feature-orbit feature-orbit-two" />
              <span className="feature-star">✳</span>
            </div>
            <span className="feature-bottom">A PLACE FOR THE NEXT BIG IDEA ↗</span>
          </div>
          <p className="hero-after">More below ↓</p>
        </header>

        <section className="portfolio-section" id="work" aria-label="Work">
          <ChapterTitle label="WORK" variant="demos" />

          <div className="section-lead">
            <p className="eyebrow">01 / SELECTED WORK</p>
            <h3>Made to be seen, used, and felt.</h3>
            <p>
              A home for projects and experiments. Each story can grow here as the
              portfolio grows.
            </p>
          </div>

          <div className="work-stack">
            <article className="work-item">
              <div className="work-visual work-visual-primary">
                <span className="visual-index">01 / FEATURED PROJECT</span>
                <span className="visual-mark">d<span>✳</span></span>
                <span className="visual-foot">IDEA → EXPERIMENT → SOMETHING REAL</span>
              </div>
              <div className="work-caption">
                <div>
                  <span className="card-kicker">PROJECT 01</span>
                  <h4>The first story</h4>
                </div>
                <p>A space for the project, its process, and the final result.</p>
              </div>
            </article>

            <div className="work-pair">
              <article className="work-item">
                <div className="work-visual work-visual-second">
                  <span className="visual-index">02 / EXPERIMENT</span>
                  <span className="visual-squiggle" aria-hidden="true">~</span>
                </div>
                <div className="work-caption">
                  <div>
                    <span className="card-kicker">PROJECT 02</span>
                    <h4>A different direction</h4>
                  </div>
                </div>
              </article>
              <article className="work-item">
                <div className="work-visual work-visual-third">
                  <span className="visual-index">03 / IN PROGRESS</span>
                  <Image src="/iconlike.png" alt="" width={1000} height={1000} />
                </div>
                <div className="work-caption">
                  <div>
                    <span className="card-kicker">PROJECT 03</span>
                    <h4>Something new</h4>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="portfolio-section" aria-label="More about Diane">
          <h2 className="sr-only">More about Diane</h2>

          <div className="about-layout">
            <div className="about-copy">
              <p className="eyebrow">02 / ABOUT ME</p>
              <h3>Curious about how things look, move, and feel.</h3>
              <p>
                I&apos;m Diane. I like experimenting, making, adjusting, and then
                adjusting a little more. A good idea usually starts with paying
                attention to the small things.
              </p>
              <p>This section is for the person and the process behind the work.</p>
            </div>
            <div className="about-portrait">
              <Image src="/iconnerd.png" alt="A hand-drawn portrait of Diane" width={1000} height={1000} />
              <span>HI AGAIN :)</span>
            </div>
          </div>

          <div className="about-notes">
            <div><span>01</span><p>Notice the little things.</p></div>
            <div><span>02</span><p>Try the weird idea.</p></div>
            <div><span>03</span><p>Keep making it better.</p></div>
          </div>
        </section>

        <section className="portfolio-section" id="details" aria-label="Details">
          <ChapterTitle label="DETAILS" variant="details" />

          <div className="section-lead">
            <p className="eyebrow">03 / THE DETAILS</p>
            <h3>The parts that make the whole.</h3>
            <p>Little decisions, loose sketches, and everything in between.</p>
          </div>

          <div className="detail-grid">
            <article className="detail-card">
              <div className="detail-visual detail-visual-one"><span>✳</span></div>
              <span className="card-kicker">01 / START</span>
              <h4>The idea</h4>
              <p>The first thought, question, or sketch that starts the work.</p>
            </article>
            <article className="detail-card">
              <div className="detail-visual detail-visual-two"><span>↗</span></div>
              <span className="card-kicker">02 / EXPLORE</span>
              <h4>The process</h4>
              <p>Making versions, finding surprises, and following what works.</p>
            </article>
            <article className="detail-card">
              <div className="detail-visual detail-visual-three"><span>◎</span></div>
              <span className="card-kicker">03 / FINISH</span>
              <h4>The little things</h4>
              <p>The final touches that help an idea feel like itself.</p>
            </article>
          </div>

          <div className="closing-note">
            <span className="eyebrow">STILL MAKING THINGS</span>
            <p>More experiments, stories, and details will live here soon.</p>
          </div>
        </section>

        <footer className="site-footer" id="gear">
          <p>Thanks for looking.</p>
          <div>
            <span>DIANE © 2026</span>
            <a href="#top">BACK TO TOP ↑</a>
          </div>
        </footer>
      </main>
    </>
  );
}
