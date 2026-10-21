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
          each piece, from the header to the footer. They pick the direction we build from.
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
            <strong>First, tell us what you&apos;re imagining.</strong>
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
        </ul>
        <p>
          I built the main utility bot for one of UABC&apos;s biggest Discord
          communities. It helps 3,000+ members with verification, roles, voice
          rooms, and fun games.
        </p>
      </div>

      <CimabotPreview />

      <div className="work-project-outro cima-outro">
        <span>discord.js · community tools</span>
        <a href="https://github.com/diaaney/cima" target="_blank" rel="noopener noreferrer">view the repo ↗</a>
      </div>
    </>
  );
}

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
