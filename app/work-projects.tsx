import Image from "next/image";
import { CimabotPreview } from "./cimabot-preview";

const directions = [
  { name: "01 / editorial", tone: "editorial" },
  { name: "02 / playful", tone: "playful" },
  { name: "03 / minimal", tone: "minimal" },
  { name: "04 / vivid", tone: "vivid" },
] as const;

const cimaTechnologies = [
  { name: "JavaScript", icon: "javascript" },
  { name: "SQL", icon: "sql" },
  { name: "discord.js", icon: "discorddotjs" },
  { name: "Sapphire", icon: "sapphire" },
  { name: "Supabase", icon: "supabase" },
  { name: "GitHub Actions CI/CD", icon: "githubactions" },
] as const;

export function LumioseProject() {
  return (
    <>
      <div className="work-project-heading work-project-heading-lumiose">
        <span className="work-project-eyebrow">02 / LUMIOSE STUDIO · PRODUCT + CREATIVE TOOLS</span>
        <h3 id="work-02-title">a studio for finding<br /><em>the right direction.</em></h3>
        <p>
          I built the multi-tenant panel behind Lumiose. Now I&apos;m working on a studio
          that takes a client&apos;s brief and makes four previews of the page and
          each piece, from the header to the footer. They pick the direction I build from.
        </p>
      </div>

      <div className="lumiose-stage" aria-label="Concept view of the Lumiose Studio workflow">
        <div className="lumiose-stage-bar">
          <span className="lumiose-wordmark">lumiose<span> / studio</span></span>
          <span className="lumiose-stage-status"><i /> sample project</span>
        </div>

        <div className="lumiose-stage-body">
          <div className="lumiose-brief">
            <span className="lumiose-mini-label">THE BRIEF</span>
            <strong>First, tell me what you&apos;re imagining.</strong>
            <p>A place for the client&apos;s story, references, needs and the feeling they want their site to have.</p>
            <div className="lumiose-brief-lines" aria-hidden="true"><i /><i /><i /></div>
            <span className="lumiose-brief-bottom">client space / 001</span>
          </div>

          <div className="lumiose-direction-area">
            <div className="lumiose-direction-title">
              <span className="lumiose-mini-label">EXPLORE</span>
              <span>four ways this could feel <b>↗</b></span>
            </div>
            <div className="lumiose-direction-grid">
              {directions.map((direction) => (
                <div className={`lumiose-direction lumiose-direction-${direction.tone}`} key={direction.name}>
                  <span className="lumiose-direction-name">{direction.name}</span>
                  <span className="lumiose-direction-visual" aria-hidden="true">
                    <i /><i /><i />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lumiose-stage-footer">
          <span>page · header · sections · footer</span>
          <span>brief <b>→</b> previews <b>→</b> client picks <b>→</b> build</span>
        </div>
      </div>

      <div className="work-project-outro lumiose-outro">
        <span>built / multi-tenant panel</span>
        <span>in progress / creative agent</span>
      </div>
    </>
  );
}

export function CimabotProject() {
  return (
    <>
      <div className="work-project-heading work-project-heading-cimabot">
        <h3 id="work-03-title">
          <Image className="cima-wordmark" src="/work/cimabot-wordmark.svg" alt="cimabot" width={231} height={58} />
        </h3>
        <ul className="cima-tech-list" aria-label="Technologies used">
          {cimaTechnologies.map(({ name, icon }) => (
            <li className="cima-tech-pill" key={icon}>
              <span className={`cima-tech-icon cima-tech-icon-${icon}`} aria-hidden="true" />
              {name}
            </li>
          ))}
          <li className="cima-tech-pill cima-tech-pill-linked">
            <a href="https://resend.com/" target="_blank" rel="noopener noreferrer">
              <span className="cima-tech-icon cima-tech-icon-resend" aria-hidden="true" />
              Resend
            </a>
          </li>
        </ul>
      </div>

      <div className="cima-story">
        <h4>first, i fixed verification.</h4>
        <p>
          Cimabot is the main utility bot for one of UABC&apos;s biggest Discord
          communities, with over 3,000 members. It handles verification, roles,
          voice rooms, and a few games too.
        </p>
        <p>
          As the Discord community grew, spam and duplicate accounts became a
          problem. Verification was just a reaction role back then, so I had no
          way to tell if someone was affiliated with UABC or already had another
          account in the server.
        </p>
        <p>
          So I built Cimabot around a one-time password (OTP) sent through
          Resend to an email ending in @uabc.edu.mx. That lets me check university
          affiliation and keep each email tied to one Discord account.
        </p>
      </div>

      <CimabotPreview />

      <div className="cima-fun">
        <div className="cima-fun-copy">
          <h4>and then i made it fun.</h4>
          <p>
            I also built games and little commands to give people more reasons
            to hang out and interact in the server.
          </p>
          <p>
            The counting game and leaderboard add a bit of friendly competition
            to the chat, so there&apos;s more to do than just pick a role and leave.
          </p>
        </div>
        <CimabotPreview
          src="/work/cimabot-games.mp4"
          poster="/work/cimabot-games-poster.jpg"
          width={692}
          height={774}
          label="Cimabot counting game and leaderboard in Discord"
        />
      </div>

      <p className="cima-update">
        I keep updating Cimabot as the server&apos;s needs change. If I add
        something new that deserves a spot here, you&apos;ll see it soon. ouo
      </p>

      <div className="work-project-outro cima-outro">
        <a href="https://github.com/diaaney/cima" target="_blank" rel="noopener noreferrer">
          <svg className="cima-github-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
          </svg>
          view on github
        </a>
      </div>
    </>
  );
}

export function MoreProjectsNote() {
  return (
    <div className="work-more-projects">
      <h3 id="work-04-title">
        i&apos;ve got more projects, i&apos;m just making their pages look real cute
        before i show them here.
      </h3>
    </div>
  );
}

// Kept for when Rapier is ready to return to the carousel.
export function RapierProject() {
  return (
    <>
      <div className="work-project-heading work-project-heading-rapier">
        <span className="work-project-eyebrow">04 / OPEN SOURCE · MINECRAFT SERVER</span>
        <h3 id="work-04-title">old-school combat.<br /><em>new world.</em></h3>
        <p>
          Rapier is my Paper fork that brings the feel of 1.8.9 PvP into modern
          Minecraft. Classic combat, current blocks and clients, all in one server jar.
        </p>
      </div>

      <div className="rapier-stage" aria-label="Graphic concept for Rapier's classic combat on modern Minecraft">
        <div className="rapier-stage-grid" aria-hidden="true" />
        <div className="rapier-stage-top"><span>R / 01</span><span>1.8.9 FEEL · 1.21.11 WORLD</span></div>
        <div className="rapier-stage-center">
          <div className="rapier-target" aria-hidden="true"><i /><i /></div>
          <span className="rapier-stage-kicker">BUILT FOR THE HIT THAT FEELS RIGHT</span>
          <strong>RAPIER<span>.</span></strong>
          <span className="rapier-stage-subtitle">THE OLD FIGHT. THE NEW GAME.</span>
        </div>
        <div className="rapier-stage-bottom">
          <span><b>01</b> no attack cooldown</span>
          <span><b>02</b> classic knockback</span>
          <span><b>03</b> sword blocking</span>
        </div>
      </div>

      <div className="work-project-outro rapier-outro">
        <span>paper fork · java · open source</span>
        <a href="https://github.com/diaaney/rapier" target="_blank" rel="noopener noreferrer">view the repo ↗</a>
      </div>
    </>
  );
}
