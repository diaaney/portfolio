'use client'

import { useState } from 'react'
import ChatPhase   from '@/components/ChatPhase'
import Portfolio   from '@/components/Portfolio'
import ClickSpark  from '@/components/ClickSpark'

type Phase = 'chat' | 'portfolio'

export default function Home() {
  const [phase, setPhase] = useState<Phase>('chat')
  return (
    <>
      <ClickSpark />
      <ChatPhase active={phase === 'chat'} onDone={() => setPhase('portfolio')} />
      <Portfolio active={phase === 'portfolio'} />
    </>
  )
}
