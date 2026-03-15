import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const res = await fetch('https://github-contributions-api.jogruber.de/v4/diaaney?y=last', {
      next: { revalidate: 3600 },
    })
    if (!res.ok) throw new Error(`upstream ${res.status}`)
    const data = await res.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ contributions: null }, { status: 500 })
  }
}
