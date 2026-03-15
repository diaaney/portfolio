'use client'

import { useEffect, useState } from 'react'
import styles from './IntroPhase.module.css'

const FRAMES = [
  '/media/intro/1.png',
  '/media/intro/2.png',
  '/media/intro/3.png',
  '/media/intro/4.png',
]

const FRAME_MS = 380

export default function IntroPhase({ active, onDone }: { active: boolean; onDone: () => void }) {
  const [frame, setFrame]     = useState(0)
  const [flying, setFlying]   = useState(false)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    if (!active) return

    let current = 0
    const advance = () => {
      current++
      if (current < FRAMES.length) {
        setFrame(current)
        setTimeout(advance, FRAME_MS)
      } else {
        // hold on plane then fly off
        setTimeout(() => {
          setFlying(true)
          setTimeout(() => {
            setFadeOut(true)
            setTimeout(onDone, 600)
          }, 550)
        }, 500)
      }
    }

    setTimeout(advance, FRAME_MS)
  }, [active, onDone])

  return (
    <div className={`${styles.wrap} ${active ? styles.on : ''} ${fadeOut ? styles.out : ''}`}>
      <img
        key={frame}
        src={FRAMES[frame]}
        alt="intro"
        className={`${styles.img} ${flying ? styles.fly : ''}`}
        draggable={false}
      />
    </div>
  )
}
