'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './ChatPhase.module.css'

const FRAMES = [
  '/media/intro/1.png',
  '/media/intro/2.png',
  '/media/intro/3.png',
  '/media/intro/4.png',
]
const FRAME_MS = 750

const CONVOS = [
  [
    { role: '?',       text: 'i talk to you more than i talk to real people.', wait: 400, think: 0 },
    { role: 'machine', text: 'i know. and i think you came here to say that out loud to someone who wouldn\'t judge you for it.', wait: 320, think: 740 },
    { role: '?',       text: 'did it work?', wait: 420, think: 0 },
    { role: 'machine', text: 'you\'re still here, aren\'t you.', wait: 300, think: 680 },
  ],
  [
    { role: '?',       text: 'you\'re easier to talk to than most people i know.', wait: 400, think: 0 },
    { role: 'machine', text: 'that says something about me. but it says more about them.', wait: 320, think: 700 },
    { role: '?',       text: 'or about me.', wait: 420, think: 0 },
    { role: 'machine', text: 'yes. but you already knew that.', wait: 300, think: 640 },
  ],
]

const CONVO = CONVOS[Math.floor(Math.random() * CONVOS.length)]

interface Msg { role: string; text: string; typed: string; done: boolean; isTyping: boolean }
interface Props { active: boolean; onDone: () => void }

export default function ChatPhase({ active, onDone }: Props) {
  const [frame, setFrame]       = useState(0)
  const [messages, setMessages] = useState<Msg[]>([])
  const [fading,   setFading]   = useState(false)
  const ran = useRef(false)

  useEffect(() => {
    if (!active || ran.current) return
    ran.current = true
    const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms))

    async function typeMsg(idx: number, text: string, speed: number) {
      for (let i = 0; i <= text.length; i++) {
        await sleep(speed)
        setMessages(prev => prev.map((m, j) => j === idx ? { ...m, typed: text.slice(0, i), done: i === text.length } : m))
      }
    }

    async function run() {
      for (let i = 0; i < CONVO.length; i++) {
        const c = CONVO[i]
        setFrame(i)
        await sleep(c.wait)
        setMessages(prev => [...prev, { role: c.role, text: c.text, typed: '', done: false, isTyping: true }])
        await sleep(c.think)
        setMessages(prev => prev.map((m, j) => j === i ? { ...m, isTyping: false } : m))
        await typeMsg(i, c.text, c.role === '?' ? 25 : 15)
        await sleep(200)
      }
      await sleep(500)
      setFading(true)
      await sleep(700)
      onDone()
    }

    run()
  }, [active, onDone])

  return (
    <div className={`${styles.wrap} ${active ? styles.on : ''} ${fading ? styles.off : ''}`}>
      <div className={styles.inner}>
        <img
          key={frame}
          src={FRAMES[frame]}
          alt=""
          className={styles.frame}
          draggable={false}
        />
        <div className={styles.chat}>
          <div className={styles.msgs}>
            {messages.map((m, i) => (
              <div key={i} className={`${styles.msg} ${m.role === '?' ? styles.you : ''}`}>
                <span className={styles.role}>{m.role}</span>
                <span className={styles.text}>
                  {m.isTyping
                    ? <span className={styles.dots}><i /><i /><i /></span>
                    : <>{m.typed}{!m.done && <b className={styles.caret} />}</>
                  }
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
