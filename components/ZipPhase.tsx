'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './ZipPhase.module.css'

const BW   = 104
const BH   = 28
const BGAP = 10
const TOTAL_H = BH * 3 + BGAP * 2   // 104

const CX = BW + 12     // chain left edge
const CW = 16
const NL = 7
const LH = Math.round(TOTAL_H / NL)

const SVG_W = CX + CW + 6
const SVG_H = TOTAL_H

const BOOK_OPEN = [
  'translate(-30px,-34px) rotate(-9deg)',
  'translate(8px,10px) rotate(3deg)',
  'translate(22px,30px) rotate(7deg)',
]

interface Props { active: boolean; onDone: () => void }

export default function ZipPhase({ active, onDone }: Props) {
  const [entered,  setEntered]  = useState(false)
  const [openedN,  setOpenedN]  = useState(0)
  const [split,    setSplit]    = useState(false)
  const [fading,   setFading]   = useState(false)
  const ran = useRef(false)

  useEffect(() => {
    if (!active || ran.current) return
    ran.current = true
    const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms))
    async function run() {
      await sleep(300)
      setEntered(true)
      await sleep(900)
      for (let i = 1; i <= NL; i++) { await sleep(130); setOpenedN(i) }
      await sleep(280)
      setSplit(true)
      await sleep(950)
      setFading(true)
      await sleep(700)
      onDone()
    }
    run()
  }, [active, onDone])

  return (
    <div className={`${styles.wrap} ${fading ? styles.hidden : ''}`}>
      <div className={`${styles.scene} ${entered ? styles.sceneIn : ''}`}>
        <svg width={SVG_W} height={SVG_H} viewBox={`0 0 ${SVG_W} ${SVG_H}`} overflow="visible">

          {[0,1,2].map(i => {
            const y   = i * (BH + BGAP)
            const off = (2 - i) * 4
            return (
              <g key={i} style={{
                transform: split ? BOOK_OPEN[i] : 'none',
                transformOrigin: `${BW/2}px ${y + BH/2}px`,
                transition: 'transform 0.65s cubic-bezier(.4,0,.2,1)',
              }}>
                <rect x={off+3} y={y+3} width={BW} height={BH} rx={3} fill="var(--light)" />
                <rect x={off}   y={y}   width={BW} height={BH} rx={3}
                  fill="var(--white)" stroke="var(--black)" strokeWidth="1.5" />
                <rect x={off}   y={y}   width={10} height={BH} rx={3} fill="var(--black)" />
                <rect x={off+7} y={y}   width={3}  height={BH} fill="var(--black)" />
                <line x1={off+16} y1={y+8}  x2={off+78} y2={y+8}  stroke="var(--light)" strokeWidth="1"/>
                <line x1={off+16} y1={y+15} x2={off+62} y2={y+15} stroke="var(--light)" strokeWidth="1"/>
                <line x1={off+16} y1={y+21} x2={off+70} y2={y+21} stroke="var(--light)" strokeWidth="1"/>
              </g>
            )
          })}

          {Array.from({length: NL}, (_, i) => {
            const y    = i * LH + 2
            const open = i < openedN
            return (
              <g key={i}>
                <rect x={open ? CX-10 : CX}          y={y} width={5} height={LH-3} rx={2}
                  fill="var(--black)" style={{transition:'all 0.15s ease'}} />
                <rect x={open ? CX+CW+5 : CX+CW-5}   y={y} width={5} height={LH-3} rx={2}
                  fill="var(--black)" style={{transition:'all 0.15s ease'}} />
                {!open && (
                  <rect x={CX+5} y={y+Math.floor((LH-4)/2)} width={CW-10} height={4} rx={1.5}
                    fill="var(--black)" />
                )}
              </g>
            )
          })}

        </svg>
      </div>
      <p className={`${styles.name} ${entered ? styles.in : ''}`}>diane_portfolio.zip</p>
      <p className={`${styles.hint} ${entered ? styles.in : ''}`}>
        {split ? 'done.' : openedN > 0 ? 'unzipping...' : 'opening...'}
      </p>
    </div>
  )
}
