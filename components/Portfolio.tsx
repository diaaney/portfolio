'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import styles from './Portfolio.module.css'
import GitHubGraph from './GitHubGraph'

function DraggableSticker({ src, alt, initialY, fromRight, width, rotate = 0, containerRef }: {
  src: string; alt: string; initialY: number; fromRight?: number; width: number; rotate?: number
  containerRef: React.RefObject<HTMLDivElement | null>
}) {
  const isRight = fromRight != null

  const calcState = () => {
    if (typeof window === 'undefined') return { x: isRight ? 800 : 0, y: initialY, w: width }
    const vw = window.innerWidth
    const layoutW = Math.min(780, vw - 64)
    const layoutLeft = (vw - layoutW) / 2
    const available = Math.max(0, layoutLeft - 40)
    const w = Math.max(120, Math.min(width, available))
    const x = isRight ? layoutLeft + layoutW + 20 : layoutLeft - w - 20
    return { x, y: initialY, w }
  }

  const [pos, setPos] = useState(() => { const s = calcState(); return { x: s.x, y: s.y } })
  const [displayW, setDisplayW] = useState(() => calcState().w)
  const dragged  = useRef(false)
  const dragging = useRef(false)
  const offset   = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onResize = () => {
      if (!dragged.current) {
        const s = calcState()
        setPos({ x: s.x, y: s.y })
        setDisplayW(s.w)
      }
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const onMouseDown = (e: React.MouseEvent) => {
    dragged.current  = true
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
      style={{ left: pos.x, top: pos.y, width: displayW, transform: `rotate(${rotate}deg)` }}
      onMouseDown={onMouseDown}
      draggable={false}
    />
  )
}

const PROJECTS: {
  id: string
  title: string
  desc: string
  tags: string[]
  href?: string
}[] = [
  { id: '01', title: 'lumiose', desc: 'web design agency for local businesses', tags: ['TypeScript','React','PostgreSQL'], href: 'https://lumiose.studio' },
  { id: '02', title: 'soju network', desc: 'minecraft server where i learn gcp, multi-region infra, and java the hard way', tags: ['Java','Google Cloud','Networking'] },
]

const SECTIONS = ['about','work','gallery','blog']

const BLOG_POSTS: { slug: string; title: string; date: string; excerpt: string }[] = []

const GRID       = 42           // larger grid = less sensitive
const SEE_TTL    = 140          // ms before a position can spawn again
const DOT_TTL    = 320          // ms the dot lives
const MIN_MOVE   = 20           // px minimum mouse movement to trigger

const STAGE_SIZES: Record<number, number> = { 1: 17, 2: 11, 3: 6 }

const SHAPES: Record<number, string[]> = {
  1: ['blossom'],
  2: ['cherry', 'sparkle'],
  3: ['cross', 'dot', 'sparkle'],
}

const COLORS: Record<number, string[]> = {
  1: ['#e8869a', '#d4607a', '#f4a0b8'],
  2: ['#f9c8d4', '#e8a0b2', '#b8d4a8'],
  3: ['#f9c8d4', '#b8d4a8', '#f5d87a'],
}

type FieldDot = { id: number; x: number; y: number; born: number; stage: 1|2|3; shape: string; color: string; size: number }

function ShapeIcon({ type, size, color }: { type: string; size: number; color: string }) {
  if (!size || isNaN(size)) return null
  const r = size / 2
  const c = r

  if (type === 'blossom') {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {[0, 90, 180, 270].map(a => (
          <ellipse key={a} cx={c} cy={c - r * 0.35} rx={r * 0.3} ry={r * 0.46}
            transform={`rotate(${a} ${c} ${c})`} fill={color} />
        ))}
        <circle cx={c} cy={c} r={r * 0.26} fill={color} />
      </svg>
    )
  }

  if (type === 'cherry') {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {[0, 72, 144, 216, 288].map(a => (
          <ellipse key={a} cx={c} cy={c - r * 0.36} rx={r * 0.27} ry={r * 0.41}
            transform={`rotate(${a} ${c} ${c})`} fill={color} />
        ))}
        <circle cx={c} cy={c} r={r * 0.18} fill="white" opacity={0.55} />
      </svg>
    )
  }

  if (type === 'sparkle') {
    const pts = Array.from({ length: 8 }, (_, i) => {
      const a = (i * 45 - 90) * Math.PI / 180
      const rad = i % 2 === 0 ? r * 0.95 : r * 0.1
      return `${c + rad * Math.cos(a)},${c + rad * Math.sin(a)}`
    }).join(' ')
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <polygon points={pts} fill={color} />
      </svg>
    )
  }

  if (type === 'cross') {
    const arm = r * 0.74, w = r * 0.2
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <rect x={c - w / 2} y={c - arm} width={w} height={arm * 2} rx={w / 2} fill={color} />
        <rect x={c - arm} y={c - w / 2} width={arm * 2} height={w} rx={w / 2} fill={color} />
      </svg>
    )
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={c} cy={c} r={r * 0.68} fill={color} />
    </svg>
  )
}

export default function Portfolio({ active }: { active: boolean }) {
  const [scrolled, setScrolled]       = useState(false)
  const [activeSection, setActive]    = useState('about')
  const [galleryMode, setGalleryMode] = useState(false)
  const [blogMode, setBlogMode]       = useState(false)
  const [transitioning, setTransitioning] = useState(false)
  const [fieldDots, setFieldDots]     = useState<FieldDot[]>([])
  const [mounted, setMounted]         = useState(false)
  const [emailCopied, setEmailCopied] = useState(false)
  const copyTimer   = useRef<ReturnType<typeof setTimeout> | null>(null)
  const wrapRef     = useRef<HTMLDivElement>(null)
  const dotId       = useRef(0)
  const seenPos     = useRef<Map<string, number>>(new Map())
  const lastPos     = useRef({ x: -999, y: -999 })

  const copyEmail = () => {
    navigator.clipboard.writeText('latte@diane.zip').catch(() => {})
    setEmailCopied(true)
    if (copyTimer.current) clearTimeout(copyTimer.current)
    copyTimer.current = setTimeout(() => setEmailCopied(false), 1800)
  }

  useEffect(() => {
    if (!active) return
    const el = wrapRef.current
    if (!el) return

    const onScroll = () => {
      setScrolled(el.scrollTop > 130)
      // active section (exclude gallery from auto-activation)
      for (const id of [...SECTIONS].reverse().filter(s => s !== 'gallery')) {
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
      // handle gallery separately - trigger transition
      if (id === 'gallery') {
        e.preventDefault()
        if (galleryMode) return
        setTransitioning(true)
        setTimeout(() => {
          setActive('gallery')
          el.scrollTo({ top: 0, behavior: 'auto' })
          setGalleryMode(false)
          setBlogMode(false)
          setGalleryMode(true)
        }, 300)
        setTimeout(() => setTransitioning(false), 600)
        return
      }
      // handle blog separately - trigger transition
      if (id === 'blog') {
        e.preventDefault()
        if (blogMode) return
        setTransitioning(true)
        setTimeout(() => {
          setActive('blog')
          el.scrollTo({ top: 0, behavior: 'auto' })
          setGalleryMode(false)
          setBlogMode(true)
        }, 300)
        setTimeout(() => setTransitioning(false), 600)
        return
      }
      // if in gallery or blog mode and clicking other links, exit
      if ((galleryMode || blogMode) && id !== 'gallery' && id !== 'blog') {
        e.preventDefault()
        setTransitioning(true)
        setTimeout(() => {
          el.scrollTo({ top: 0, behavior: 'auto' })
          setGalleryMode(false)
          setBlogMode(false)
          setActive(id)
        }, 300)
        setTimeout(() => {
          setTransitioning(false)
          const sec = el.querySelector(`#${id}`) as HTMLElement | null
          if (sec) el.scrollTo({ top: sec.offsetTop, behavior: 'smooth' })
        }, 600)
        return
      }
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

  useEffect(() => { setMounted(true) }, [])

  // ── dot field cleanup interval ──
  useEffect(() => {
    if (!active) return
    const interval = setInterval(() => {
      const now = Date.now()
      for (const [k, exp] of seenPos.current) if (exp <= now) seenPos.current.delete(k)
      setFieldDots(prev => prev.filter(d => now - d.born < DOT_TTL + 60))
    }, 50)
    return () => clearInterval(interval)
  }, [active])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const mx = e.clientX
    const my = e.clientY
    if (Math.hypot(mx - lastPos.current.x, my - lastPos.current.y) < MIN_MOVE) return
    if ((e.target as HTMLElement).closest('[data-no-dots]')) return
    lastPos.current = { x: mx, y: my }
    const smallZone = !!(e.target as HTMLElement).closest('[data-small-dots]')
    const gx = Math.round(mx / GRID) * GRID
    const gy = Math.round(my / GRID) * GRID
    const now = Date.now()
    const toAdd: FieldDot[] = []
    for (let dx = -2; dx <= 2; dx++) {
      for (let dy = -2; dy <= 2; dy++) {
        const px = gx + dx * GRID
        const py = gy + dy * GRID
        const dist = Math.hypot(px - mx, py - my)
        if (dist > GRID * 1.4) continue
        const key = `${px},${py}`
        if ((seenPos.current.get(key) ?? 0) > now) continue
        seenPos.current.set(key, now + SEE_TTL)
        const stage = (smallZone ? 3 : dist < GRID * 0.55 ? 1 : dist < GRID * 1.05 ? 2 : 3) as 1|2|3
        const shapeList = SHAPES[stage]
        const colorList = COLORS[stage]
        const shape = shapeList[Math.floor(Math.random() * shapeList.length)]
        const color = colorList[Math.floor(Math.random() * colorList.length)]
        const size  = STAGE_SIZES[stage]
        toAdd.push({ id: dotId.current++, x: px, y: py, born: now, stage, shape, color, size })
      }
    }
    if (toAdd.length) setFieldDots(prev => [...prev, ...toAdd].slice(-300))
  }, [])

  return (
    <>
    <div
      ref={wrapRef}
      className={`${styles.wrap} ${active ? styles.on : ''} ${transitioning ? styles.transitioning : ''}`}
      onMouseMove={active ? handleMouseMove : undefined}
    >

      {mounted && active && createPortal(
        <div className={styles.dotField} aria-hidden>
          {fieldDots.filter(d => d.size && d.shape && d.color).map(d => (
            <div key={d.id} className={styles.fieldDot} style={{ left: d.x, top: d.y }}>
              <ShapeIcon type={d.shape} size={d.size} color={d.color} />
            </div>
          ))}
        </div>,
        document.body
      )}

      {active && !galleryMode && !blogMode && <>
        <DraggableSticker src="/media/onigiri.png" alt="onigiri" initialY={900}  width={300} rotate={-12} containerRef={wrapRef} />
        <DraggableSticker src="/media/su57.png"    alt="su-57"   fromRight={0}   initialY={1300} width={320} containerRef={wrapRef} />
      </>}

      {/* Transition overlay */}
      {transitioning && <div className={styles.transitionOverlay} />}

      {!galleryMode && !blogMode ? (
      <div className={styles.layout}>

      {/* ── Sticky sidebar (appears on scroll) ── */}
      <aside className={`${styles.sidebar} ${scrolled ? styles.sidebarOn : ''}`} data-no-dots>
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
          <a href="https://x.com/diaaneyyy" target="_blank" rel="noopener noreferrer" aria-label="X">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
          <div className={`${styles.emailWrap} ${emailCopied ? styles.emailWrapCopied : ''}`}>
            <button onClick={copyEmail} className={styles.emailBtn} aria-label="Copy email">
              {emailCopied
                ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/></svg>
              }
            </button>
            <div className={styles.emailTooltip}>
              {emailCopied ? 'copied ✓' : 'latte@diane.zip'}
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className={styles.content}>

        {/* HERO */}
        <header className={`${styles.hero} ${scrolled ? styles.heroOut : ''}`}>
          <span className={styles.heroDeco}>✦ ✦ ✦</span>
          <h1 className={styles.heroName} data-small-dots>diane.</h1>
          <p className={styles.heroBio} data-small-dots>ml undergrad & insane vibecoder</p>
          <nav className={styles.heroNav}>
            <a href="#about">about</a>
            <a href="#work">work</a>
            <a href="#gallery">gallery</a>
            <a href="#blog">blog</a>
          </nav>
          <div className={styles.heroSocial}>
            <a href="https://github.com/diaaney" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.607.069-.607 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
              </svg>
            </a>
            <a href="https://x.com/diaaneyyy" target="_blank" rel="noopener noreferrer" aria-label="X">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <div className={`${styles.emailWrap} ${emailCopied ? styles.emailWrapCopied : ''}`}>
              <button onClick={copyEmail} className={styles.emailBtn} aria-label="Copy email">
                {emailCopied
                  ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/></svg>
                }
              </button>
              <div className={styles.emailTooltip}>
                {emailCopied ? 'copied ✓' : 'latte@diane.zip'}
              </div>
            </div>
          </div>
        </header>

        {/* ABOUT */}
        <section id="about" className={styles.sec} data-small-dots>
          <div className={styles.aboutFloat} data-no-dots>
            <div className={styles.aboutImgWrap}>
              <img src="/media/diane.png" alt="diane" className={styles.aboutImg} />
            </div>
            <h2 className={styles.secH}>ABOUT ME</h2>
            <p className={styles.p}>
              hi, i&apos;m diane. ml engineering student, i&apos;m currently working @{' '}
              <a
                href="https://lumiose.studio"
                target="_blank"
                rel="noreferrer"
                className={styles.lumioseLink}
              >
                <svg
                  className={styles.lumioseMark}
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden
                >
                  <g transform="rotate(30 12 12)">
                    <rect x="11" y="2" width="2" height="20" rx="1" />
                    <rect x="11" y="2" width="2" height="20" rx="1" transform="rotate(60 12 12)" />
                    <rect x="11" y="2" width="2" height="20" rx="1" transform="rotate(-60 12 12)" />
                  </g>
                </svg>
                Lumiose Studio
              </a>
              , this is my own business where i make websites for local businesses.
            </p>
            <p className={styles.p}>
              i&apos;m still early. i don&apos;t have years of experience or an impressive list of internships. what i do have is a habit of polishing day by day my projects. i learn better by doing than by watching someone else do it.
            </p>
            <p className={styles.p}>
              someday i want to work on software that matters in a real way, the kind that ends up on something that flies haha. i&apos;m not there yet, but let&apos;s keep pushing &gt;:3.
            </p>
          </div>
        </section>

        {/* GITHUB GRAPH */}
        <section className={styles.sec} data-small-dots>
          <h2 className={styles.secH} data-no-dots>GITHUB ACTIVITY</h2>
          <div data-no-dots><GitHubGraph /></div>
        </section>

        {/* WORK */}
        <section id="work" className={styles.sec} data-small-dots>
          <h2 className={styles.secH} data-no-dots>WORK</h2>
          <div className={styles.projList} data-no-dots>
            {PROJECTS.map(p => (
              <div key={p.id} className={styles.proj}>
                <div className={styles.projTop}>
                  <span className={styles.projIdx}>{p.id}</span>
                  <span className={styles.projTitle}>{p.title}</span>
                  {p.href ? (
                    <a
                      href={p.href}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.projLink}
                      aria-label={`Open ${p.title}`}
                    >
                      ↗
                    </a>
                  ) : (
                    <span className={styles.projLink} aria-hidden>
                      ↗
                    </span>
                  )}
                </div>
                <p className={styles.projDesc}>{p.desc}</p>
                <div className={styles.tags}>
                  {p.tags.map(t => <span key={t} className={styles.tag}>{t}</span>)}
                </div>
              </div>
            ))}
          </div>
        </section>

        <footer className={styles.footer} data-no-dots>diane. © 2026</footer>
      </div>

      </div>
      ) : blogMode ? (
      <div className={styles.galleryView}>
        <div className={styles.galleryGrid}>
          <button
            data-no-dots
            className={styles.galleryBack}
            onClick={() => {
              setTransitioning(true)
              const el = wrapRef.current
              setTimeout(() => {
                if (el) el.scrollTo({ top: 0, behavior: 'auto' })
                setBlogMode(false)
                setActive('work')
              }, 300)
              setTimeout(() => setTransitioning(false), 600)
            }}
          >
            ← back
          </button>

          <header className={styles.galleryHeader} data-small-dots>
            <h1 className={styles.galleryTitle}>blog.</h1>
            <p className={styles.gallerySubtitle}>thoughts & stuff</p>
          </header>

          <div className={styles.blogFeed} data-no-dots>
            {BLOG_POSTS.length === 0 ? (
              <p className={styles.blogEmpty}>nothing here yet. check back soon.</p>
            ) : (
              BLOG_POSTS.map(post => (
                <article key={post.slug} className={styles.blogPost}>
                  <div className={styles.blogPostMeta}>
                    <span className={styles.blogPostDate}>{post.date}</span>
                  </div>
                  <h2 className={styles.blogPostTitle}>{post.title}</h2>
                  <p className={styles.blogPostExcerpt}>{post.excerpt}</p>
                </article>
              ))
            )}
          </div>
        </div>
      </div>
      ) : (
      <div className={styles.galleryView}>
        <div className={styles.galleryGrid}>
          <button
            data-no-dots
            className={styles.galleryBack}
            onClick={() => {
              setTransitioning(true)
              const el = wrapRef.current
              setTimeout(() => {
                if (el) el.scrollTo({ top: 0, behavior: 'auto' })
                setGalleryMode(false)
                setActive('work')
              }, 300)
              setTimeout(() => setTransitioning(false), 600)
            }}
          >
            ← back
          </button>

          <header className={styles.galleryHeader} data-small-dots>
            <h1 className={styles.galleryTitle}>gallery.</h1>
            <p className={styles.gallerySubtitle}>cool pics</p>
          </header>

          <p className={styles.galleryIntro} data-small-dots>
            woOw you made it here! you must really wanna see some cool pics. don&apos;t worry, i got u.
          </p>

          <div className={styles.galleryFeed}>
            <article className={styles.post}>
              <p className={styles.postCaption} data-small-dots>me if i was a router</p>
              <div className={styles.postImage}>
                <img src="/gallery/1.png" alt="meme" />
              </div>
            </article>
            <article className={styles.post}>
              <p className={styles.postCaption} data-small-dots>this is ACTUALLY me</p>
              <div className={styles.postImage}>
                <img src="/gallery/2.jpg" alt="photo" />
              </div>
            </article>
            <article className={styles.post}>
              <div className={styles.postImage}>
                <img src="/gallery/4.png" alt="photo" />
              </div>
            </article>
            <article className={styles.post}>
              <p className={styles.postCaption} data-small-dots>bro</p>
              <div className={styles.postImage}>
                <img src="/gallery/5.png" alt="photo" />
              </div>
            </article>
            <article className={styles.post}>
              <p className={styles.postCaption} data-small-dots>take care of them...</p>
              <div className={styles.postImage}>
                <img src="/gallery/6.png" alt="photo" />
              </div>
            </article>
          </div>
        </div>
      </div>
      )}
    </div>
    </>
  )
}
