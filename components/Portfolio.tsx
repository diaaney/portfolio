'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './Portfolio.module.css'
import GitHubGraph from './GitHubGraph'

function DraggableSticker({ src, alt, initialX, initialY, fromRight, width, rotate = 0, containerRef }: {
  src: string; alt: string; initialX?: number; initialY: number; fromRight?: number; width: number; rotate?: number
  containerRef: React.RefObject<HTMLDivElement | null>
}) {
  const [pos, setPos] = useState(() => ({
    x: fromRight != null ? (typeof window !== 'undefined' ? window.innerWidth - width - fromRight : 800) : (initialX ?? 0),
    y: initialY,
  }))
  const dragging = useRef(false)
  const offset   = useRef({ x: 0, y: 0 })

  const onMouseDown = (e: React.MouseEvent) => {
    dragging.current = true
    const el = containerRef.current
    const rect = el?.getBoundingClientRect()
    offset.current = {
      x: e.clientX - (rect?.left ?? 0) - pos.x,
      y: e.clientY - (rect?.top  ?? 0) + (el?.scrollTop ?? 0) - pos.y,
    }
    e.preventDefault()
  }

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging.current) return
      const el = containerRef.current
      const rect = el?.getBoundingClientRect()
      setPos({
        x: e.clientX - (rect?.left ?? 0) - offset.current.x,
        y: e.clientY - (rect?.top  ?? 0) + (el?.scrollTop ?? 0) - offset.current.y,
      })
    }
    const onUp = () => { dragging.current = false }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp) }
  }, [containerRef])

  return (
    <img
      src={src} alt={alt}
      className={styles.sticker}
      style={{ left: pos.x, top: pos.y, width, transform: `rotate(${rotate}deg)` }}
      onMouseDown={onMouseDown}
      draggable={false}
    />
  )
}

const PROJECTS = [
  { id: '01', title: 'project name', desc: 'Short punchy description of what this does and why it matters.', tags: ['TypeScript','React','LLM'] },
  { id: '02', title: 'project name', desc: 'Another project. What makes it interesting?', tags: ['Python','FastAPI'] },
  { id: '03', title: 'project name', desc: 'Third project. You have work — put it here.', tags: ['Node.js','Postgres'] },
]

const SECTIONS = ['about','work']

export default function Portfolio({ active }: { active: boolean }) {
  const [scrolled, setScrolled]       = useState(false)
  const [activeSection, setActive]    = useState('about')
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!active) return
    const el = wrapRef.current
    if (!el) return

    const onScroll = () => {
      setScrolled(el.scrollTop > 130)
      // active section
      for (const id of [...SECTIONS].reverse()) {
        const sec = el.querySelector(`#${id}`) as HTMLElement | null
        if (sec && el.scrollTop + 120 >= sec.offsetTop) { setActive(id); break }
      }
    }

    el.addEventListener('scroll', onScroll, { passive: true })

    // smooth scroll anchor links inside the overflow container
    const onAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null
      if (!target) return
      const id = target.getAttribute('href')?.slice(1)
      if (!id) return
      const sec = el.querySelector(`#${id}`) as HTMLElement | null
      if (!sec) return
      e.preventDefault()
      el.scrollTo({ top: sec.offsetTop, behavior: 'smooth' })
    }
    el.addEventListener('click', onAnchorClick)

    return () => {
      el.removeEventListener('scroll', onScroll)
      el.removeEventListener('click', onAnchorClick)
    }
  }, [active])

  return (
    <div
      ref={wrapRef}
      className={`${styles.wrap} ${active ? styles.on : ''}`}
    >
      {active && <>
        <DraggableSticker src="/media/onigiri.png" alt="onigiri" initialX={200}  initialY={900}  width={300} rotate={-12} containerRef={wrapRef} />
        <DraggableSticker src="/media/su57.png"    alt="su-57"   fromRight={120} initialY={1300} width={320} containerRef={wrapRef} />
      </>}
      <div className={styles.layout}>

      {/* ── Sticky sidebar (appears on scroll) ── */}
      <aside className={`${styles.sidebar} ${scrolled ? styles.sidebarOn : ''}`}>
        <span className={styles.sName}>diane.</span>
        <div className={styles.sDiv} />
        <nav className={styles.sNav}>
          {SECTIONS.map(s => (
            <a
              key={s}
              href={`#${s}`}
              className={activeSection === s ? styles.sActive : ''}
            >
              {s}
            </a>
          ))}
        </nav>
        <div className={styles.sSocial}>
          <a href="https://github.com/diaaney" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.607.069-.607 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
            </svg>
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
          <a href="mailto:diane@email.com" aria-label="Email">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2"/>
              <path d="m2 7 10 7 10-7"/>
            </svg>
          </a>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className={styles.content}>

        {/* HERO */}
        <header className={`${styles.hero} ${scrolled ? styles.heroOut : ''}`}>
          <span className={styles.heroDeco}>✦ ✦ ✦</span>
          <h1 className={styles.heroName}>diane.</h1>
          <p className={styles.heroBio}>ml engineer & defense enthusiast</p>
          <nav className={styles.heroNav}>
            <a href="#about">about</a>
            <a href="#work">work</a>
          </nav>
          <div className={styles.heroSocial}>
            <a href="https://github.com/diaaney" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.607.069-.607 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
              </svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a href="mailto:diane@email.com" aria-label="Email">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <path d="m2 7 10 7 10-7"/>
              </svg>
            </a>
          </div>
        </header>

        {/* ABOUT */}
        <section id="about" className={styles.sec}>
          <div className={styles.aboutFloat}>
            <div className={styles.aboutImgWrap}>
              <img src="/media/diane.png" alt="diane" className={styles.aboutImg} />
            </div>
            <h2 className={styles.secH}>ABOUT ME</h2>
            <p className={styles.p}>
              hi, i&apos;m diane. i&apos;m an undergrad ml engineering student fascinated by one thing: how machines can process enormous amounts of data and find patterns humans would never see.
            </p>
            <p className={styles.p}>
              what excites me is taking that into the real world, specifically on defense. building systems that can detect objects at extreme distances is one of the things that fascinates me most, despite how brutally complex it is.
            </p>
            <p className={styles.p}>
              right now i&apos;m learning by doing, building projects that touch both and getting my hands dirty with the things that excite me most.
            </p>
          </div>
        </section>

        {/* GITHUB GRAPH */}
        <section className={styles.sec}>
          <h2 className={styles.secH}>GITHUB ACTIVITY</h2>
          <GitHubGraph />
        </section>

        {/* WORK */}
        <section id="work" className={styles.sec}>
          <h2 className={styles.secH}>WORK</h2>
          <div className={styles.projList}>
            {PROJECTS.map(p => (
              <div key={p.id} className={styles.proj}>
                <div className={styles.projTop}>
                  <span className={styles.projIdx}>{p.id}</span>
                  <span className={styles.projTitle}>{p.title}</span>
                  <a href="#" className={styles.projLink}>↗</a>
                </div>
                <p className={styles.projDesc}>{p.desc}</p>
                <div className={styles.tags}>
                  {p.tags.map(t => <span key={t} className={styles.tag}>{t}</span>)}
                </div>
              </div>
            ))}
          </div>
        </section>


        <footer className={styles.footer}>diane. © 2026</footer>
      </div>

      </div>
    </div>
  )
}
