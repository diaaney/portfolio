'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './GitHubGraph.module.css'

const CELL  = 18
const GAP   = 3
const STEP  = CELL + GAP
const WEEKS = 26
const DAYS  = 7

const COLORS = [
  '#e5e2de',
  '#f9d5e0',
  '#f4a8bf',
  '#e8789f',
  '#c94d7a',
]

const MONTHS   = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

type Cell = { level: number; label: string }

function getGridStart() {
  const today = new Date()
  const start = new Date(today)
  start.setDate(start.getDate() - start.getDay() - (WEEKS - 1) * 7)
  return start
}

function buildGrid(start: Date, byDate: Record<string, { count: number; level: number }> = {}) {
  const grid: Cell[][] = []
  let total = 0
  for (let w = 0; w < WEEKS; w++) {
    const week: Cell[] = []
    for (let d = 0; d < DAYS; d++) {
      const date = new Date(start)
      date.setDate(date.getDate() + w * 7 + d)
      const key = date.toISOString().slice(0, 10)
      const entry = byDate[key]
      const count = entry?.count ?? 0
      total += count
      const dayName = DAY_NAMES[date.getDay()]
      const label = count > 0
        ? `${count} contribution${count > 1 ? 's' : ''} · ${dayName}, ${MONTHS[date.getMonth()]} ${date.getDate()}`
        : `${dayName}, ${MONTHS[date.getMonth()]} ${date.getDate()}`
      week.push({ level: entry?.level ?? 0, label })
    }
    grid.push(week)
  }
  return { grid, total }
}

function buildMonthLabels(start: Date) {
  const labels: { x: number; name: string }[] = []
  for (let w = 0; w < WEEKS; w++) {
    for (let d = 0; d < DAYS; d++) {
      const date = new Date(start)
      date.setDate(date.getDate() + w * 7 + d)
      if (date.getDate() === 1) {
        labels.push({ x: w * STEP, name: MONTHS[date.getMonth()] })
        break
      }
    }
  }
  return labels
}

const SVG_W = WEEKS * STEP - GAP
const SVG_H = DAYS  * STEP - GAP + 16

export default function GitHubGraph() {
  const start = getGridStart()
  const [{ grid, total }, setData] = useState(() => buildGrid(start))
  const [monthLabels, setMonthLabels]   = useState(() => buildMonthLabels(start))
  const [tooltip, setTooltip] = useState<{ label: string; x: number; y: number } | null>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/github')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data?.contributions?.length) return
        const byDate: Record<string, { count: number; level: number }> = {}
        for (const c of data.contributions) byDate[c.date] = { count: c.count, level: c.level }
        const s = getGridStart()
        setData(buildGrid(s, byDate))
        setMonthLabels(buildMonthLabels(s))
      })
      .catch(() => {})
  }, [])

  return (
    <div ref={wrapRef} className={styles.wrap}>
      <div className={styles.scroll}>
        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          width="100%"
          style={{ display: 'block' }}
          onMouseLeave={() => setTooltip(null)}
        >
          {monthLabels.map(({ x, name }) => (
            <text key={name} x={x} y={10} className={styles.monthText}>{name}</text>
          ))}
          {grid.map((week, wi) =>
            week.map((cell, di) => (
              <rect
                key={`${wi}-${di}`}
                x={wi * STEP}
                y={di * STEP + 14}
                width={CELL}
                height={CELL}
                rx={3}
                fill={COLORS[cell.level]}
                style={{ cursor: 'default' }}
                onMouseEnter={e => {
                  const rect = wrapRef.current?.getBoundingClientRect()
                  setTooltip({
                    label: cell.label,
                    x: e.clientX - (rect?.left ?? 0),
                    y: e.clientY - (rect?.top ?? 0),
                  })
                }}
              />
            ))
          )}
        </svg>
      </div>

      {tooltip && (
        <div
          className={styles.tooltip}
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          {tooltip.label}
        </div>
      )}

      <div className={styles.footer}>
        <span>{total} contributions in the last 6 months</span>
        <div className={styles.legend}>
          <span>less</span>
          {COLORS.map((c, i) => (
            <span key={i} className={styles.legendCell} style={{ background: c }} />
          ))}
          <span>more</span>
        </div>
      </div>
    </div>
  )
}
