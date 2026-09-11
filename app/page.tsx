import Image from "next/image";
import { ActivityCalendars } from "./activity-calendars";
import { AnimatedTitle } from "./animated-title";

const navigation = [
  { label: "WORK", href: "#work" },
  { label: "ABOUT", href: "#about" },
  { label: "DETAILS", href: "#details" },
  { label: "GEAR", href: "#gear" },
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
      <h2 className="sr-only">{label}</h2>
      <div className="chapter-animation">
        <AnimatedTitle variant={variant} frame={null} />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <aside className="site-rail" aria-label="Site navigation">
        <a className="rail-icon" href="#top" aria-label="Back to top">
          <Image src="/sidebar-reference-icon.png" alt="" width={32} height={31} />
        </a>
        <nav className="rail-links" aria-label="Sections">
          {navigation.map(({ label, href }) => (
            <a href={href} key={href}>
              {label}
            </a>
          ))}
        </nav>
      </aside>

      <main className="portfolio-page" id="top">
        <header className="hero">
          <div className="hero-heading">
            <h1>
              hey, i&apos;m diane
              <br />
              nice to meet you!
            </h1>
            <p className="hero-subtitle">ml engineer</p>
          </div>

          <div className="hero-illustrations" aria-hidden="true">
            <Image src="/illustrations/diane-nerd.png" alt="" width={1340} height={1980} priority />
            <Image src="/illustrations/diane-full-body.png" alt="" width={1237} height={1998} priority />
            <Image src="/illustrations/diane-with-cat.png" alt="" width={1853} height={1998} priority />
          </div>

          <div className="intro-columns">
            <p>
              I like following an idea from the first messy sketch to the moment it
              finally feels right. This is where I collect what I&apos;ve been making.
            </p>
            <p>
              Some things are finished, some are still changing. There&apos;s room here
              for the work, the thinking behind it, and the details along the way.
            </p>
          </div>

          <ActivityCalendars />

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

        <section className="portfolio-section" id="about" aria-label="About">
          <ChapterTitle label="ABOUT" variant="intro" />

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
