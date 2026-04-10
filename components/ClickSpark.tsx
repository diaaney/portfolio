'use client'

import { useEffect } from 'react'

const COLORS = ['#e8869a', '#f9c8d4', '#d4607a', '#f4a0b8', '#e8869a', '#f9c8d4']
const COUNT   = 8
const DIST    = 30

export default function ClickSpark() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      for (let i = 0; i < COUNT; i++) {
        const angle = (i * 360) / COUNT
        const color = COLORS[i % COLORS.length]

        const el = document.createElement('div')
        el.style.cssText = `
          position: fixed;
          left: ${e.clientX}px;
          top: ${e.clientY}px;
          width: 2px;
          height: 8px;
          background: ${color};
          border-radius: 2px;
          pointer-events: none;
          z-index: 9998;
        `
        document.body.appendChild(el)

        el.animate(
          [
            { transform: `translate(-50%,-50%) rotate(${angle}deg) translateY(0px)`,        opacity: 1 },
            { transform: `translate(-50%,-50%) rotate(${angle}deg) translateY(-${DIST}px)`, opacity: 0 },
          ],
          { duration: 500, easing: 'cubic-bezier(0.25,0.46,0.45,0.94)', fill: 'forwards' }
        ).onfinish = () => el.remove()
      }
    }

    window.addEventListener('click', onClick)
    return () => window.removeEventListener('click', onClick)
  }, [])

  return null
}
