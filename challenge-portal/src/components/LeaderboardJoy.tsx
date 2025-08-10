import { useEffect, useMemo, useState } from 'react'
import { useDeviceId } from '../hooks/useDeviceId'
import { Link } from 'react-router-dom'

const STORAGE_KEY = 'leaderboard-joy-players-v1'

const ADJ = ['Wholesome','Sparkly','Cozy','Giggle','Zen','Turbo','Chaotic','Glorious','Sneaky','Cosmic']
const NOUN = ['Noodle','Ninja','Walrus','Wizard','Tornado','Muffin','Comet','Yogi','Disco','Koala']
const PRAISE = ['Kindness Champion','Vibe Master','Joy Spreader','Peace Bringer','Smile Creator','Hug Expert','Laugh Generator','Calm Keeper','Energy Giver','Love Shower']
const EMOJIS = ['✨','🌈','🧘','🎉','💪','🫶','🌟','😄','🌺','🦋']

type Player = {
  id: string
  userId?: string
  name: string
  emoji: string
  kindness: number
  streak: number
  highFives: number
  flair: string
}

type Snapshot = {
  deviceId: string
  capturedAt: number
  players: Player[]
}

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)] }

function makeName(): string { return `${pick(ADJ)} ${pick(NOUN)}` }
function makeFlair(): string { return `${pick(PRAISE)} ${pick(EMOJIS)}` }

function seedPlayers(): Player[] {
  return Array.from({ length: 12 }, () => ({
    id: crypto.randomUUID(),
    name: makeName(),
    emoji: pick(['🦄','🐝','🐢','🐼','🦊','🐧','🦋','🦒','🐨','🦁','🐯','🐸']),
    kindness: Math.floor(Math.random() * 200) + 50,
    streak: Math.floor(Math.random() * 30) + 1,
    highFives: Math.floor(Math.random() * 100) + 10,
    flair: makeFlair()
  }))
}

export default function LeaderboardJoy() {
  const deviceId = useDeviceId()
  const [players, setPlayers] = useState<Player[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) return JSON.parse(raw)
    } catch {
      // Handle localStorage errors silently
    }
    return seedPlayers()
  })

  useEffect(() => {
    try { 
      localStorage.setItem(STORAGE_KEY, JSON.stringify(players)) 
    } catch {
      // Handle localStorage errors silently
    }
  }, [players])

  const sorted = useMemo(() => players.slice().sort((a,b) => {
    if (b.kindness !== a.kindness) return b.kindness - a.kindness
    if (b.streak !== a.streak) return b.streak - a.streak
    return b.highFives - a.highFives
  }), [players])

  const boost = (id: string) => {
    setPlayers((prev) => prev.map(p => p.id === id ? { ...p, kindness: p.kindness + 10 } : p))
  }

  const highfive = (id: string) => {
    setPlayers((prev) => prev.map(p => p.id === id ? { ...p, highFives: p.highFives + 1 } : p))
  }

  const reshuffle = () => setPlayers(seedPlayers())

  function exportSnapshot() {
    const snap: Snapshot = { deviceId, capturedAt: Date.now(), players }
    const blob = new Blob([JSON.stringify(snap, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `leaderboard-${deviceId.slice(0,8)}.json`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  function markAsMe(id: string) {
    setPlayers((prev) => prev.map(p => p.id === id ? { ...p, userId: deviceId } : p))
  }

  function copyMyId() {
    try { 
      navigator.clipboard.writeText(deviceId) 
    } catch {
      // Handle clipboard errors silently
    }
  }

  const podium = sorted.slice(0,3)
  const others = sorted.slice(3)

  const YouTag = ({ p }: { p: Player }) => p.userId === deviceId ? <span className="text-xs text-brand-400">(You)</span> : null

  return (
    <section className="grid gap-6">
      <header className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="h2">Leaderboard of Good Vibes</h2>
          <p className="p-muted">Ranked by kindness points, gentle streaks, and high-five power. Pure positivity.</p>
          <div className="text-xs p-muted mt-1">My ID: <span className="font-mono">{deviceId.slice(0,8)}</span> <button className="btn-outline px-2 py-0.5 ml-2" onClick={copyMyId}>Copy</button></div>
        </div>
        <div className="flex gap-2">
          <button className="btn-outline" onClick={reshuffle}>Refresh Demo</button>
          <button className="btn" onClick={exportSnapshot}>Export Snapshot</button>
          <Link to="/snapshot" className="btn-outline">Open Snapshot Leaderboard</Link>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {podium.map((p, idx) => (
          <article key={p.id} className="card">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="text-2xl" title="Emoji">{p.emoji}</div>
                <div>
                  <div className="font-semibold flex items-center gap-2">
                    {p.name} <YouTag p={p} />
                    {idx === 0 && <span className="motion-safe:animate-pop">👑</span>}
                    {idx === 1 && <span className="motion-safe:animate-pop">🥈</span>}
                    {idx === 2 && <span className="motion-safe:animate-pop">🥉</span>}
                  </div>
                  <div className="text-xs p-muted">{p.flair}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="btn-outline" onClick={() => boost(p.id)}>+10 Kindness</button>
                {p.userId === deviceId ? null : <button className="btn-outline" onClick={() => markAsMe(p.id)}>Set Me</button>}
              </div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center text-sm">
              <div className="rounded-md bg-slate-900/50 border border-slate-800 p-2">
                <div className="text-xs p-muted">Kindness</div>
                <div className="font-semibold text-brand-400">{p.kindness}</div>
              </div>
              <div className="rounded-md bg-slate-900/50 border border-slate-800 p-2">
                <div className="text-xs p-muted">Streak</div>
                <div className="font-semibold">{p.streak}🔥</div>
              </div>
              <div className="rounded-md bg-slate-900/50 border border-slate-800 p-2">
                <div className="text-xs p-muted">High-Fives</div>
                <div className="font-semibold">{p.highFives}✋</div>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <button className="btn-outline flex-1" onClick={() => highfive(p.id)}>High-Five! ✋</button>
            </div>
          </article>
        ))}
      </div>

      <div className="grid gap-3">
        <h3 className="font-semibold">Everyone Else</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((p) => (
            <article key={p.id} className="card">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-xl" title="Emoji">{p.emoji}</div>
                  <div>
                    <div className="font-semibold flex items-center gap-2">
                      {p.name} <YouTag p={p} />
                    </div>
                    <div className="text-xs p-muted">{p.flair}</div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button className="btn-outline text-sm" onClick={() => boost(p.id)}>+10</button>
                  {p.userId === deviceId ? null : <button className="btn-outline text-sm" onClick={() => markAsMe(p.id)}>Me</button>}
                </div>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-1 text-center text-xs">
                <div className="rounded bg-slate-900/50 p-1">
                  <div className="text-brand-400 font-semibold">{p.kindness}</div>
                </div>
                <div className="rounded bg-slate-900/50 p-1">
                  <div className="font-semibold">{p.streak}🔥</div>
                </div>
                <div className="rounded bg-slate-900/50 p-1">
                  <div className="font-semibold">{p.highFives}✋</div>
                </div>
              </div>
              <div className="mt-2">
                <button className="btn-outline w-full text-sm" onClick={() => highfive(p.id)}>High-Five! ✋</button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}