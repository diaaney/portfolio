'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './ChatPhase.module.css'

const FRAMES = [
  '/media/intro/1.png',
  '/media/intro/2.png',
  '/media/intro/3.png',
  '/media/intro/4.png',
]

const TEXT = `Create the things you wish existed.`

const FRAME_MS = 1100
const TYPE_MS  = 71   // finish 300ms before last frame

interface Props { active: boolean; onDone: () => void }

export default function ChatPhase({ active, onDone }: Props) {
  const [frame,  setFrame]  = useState(0)
  const [typed,  setTyped]  = useState('')
  const [done,   setDone]   = useState(false)
  const [fading, setFading] = useState(false)
  const [ready,  setReady]  = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)
  const ran    = useRef(false)

  useEffect(() => {
    let n = 0
    FRAMES.forEach(src => {
      const img = new window.Image()
      img.onload = img.onerror = () => { n++; if (n === FRAMES.length) setReady(true) }
      img.src = src
    })
  }, [])

  useEffect(() => {
    if (!active || !ready || ran.current) return
    ran.current = true
    const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms))

    function popFrame() {
      imgRef.current?.animate(
        [
          { transform: 'scale(0.86)', opacity: 0.2 },
          { transform: 'scale(1)',    opacity: 1   },
        ],
        { duration: 180, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'forwards' }
      )
    }

    async function run() {
      popFrame()
      await sleep(500)

      // Cycle frames on fixed interval, stop at last
      let frameIdx = 0
      const interval = setInterval(() => {
        const next = frameIdx + 1
        if (next < FRAMES.length) {
          frameIdx = next
          setFrame(next)
          popFrame()
        } else {
          clearInterval(interval)
        }
      }, FRAME_MS)

      // Type text
      for (let i = 1; i <= TEXT.length; i++) {
        setTyped(TEXT.slice(0, i))
        await sleep(TYPE_MS)
      }
      setDone(true)

      // Wait until last frame appears if not there yet
      const typingMs  = TEXT.length * TYPE_MS
      const framesMs  = (FRAMES.length - 1) * FRAME_MS
      const remaining = Math.max(framesMs - typingMs + 500, 900)
      await sleep(remaining)

      setFading(true)
      await sleep(750)
      onDone()
    }

    run()
  }, [active, ready, onDone])

  return (
    <div className={`${styles.wrap} ${active ? styles.on : ''} ${fading ? styles.off : ''}`}>
      <div className={styles.inner}>
        <img
          ref={imgRef}
          src={FRAMES[frame]}
          alt=""
          className={styles.frame}
          draggable={false}
        />
        <div className={styles.chat}>
          <span className={styles.text}>
            {typed}
            {!done && <b className={styles.caret} />}
          </span>
        </div>
      </div>
    </div>
  )
}
