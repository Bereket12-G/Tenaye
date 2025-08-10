import { useEffect, useMemo, useRef, useState } from 'react'

type Runner = {
  id: string
  name: string
  emoji: string
  color: string
  steps: number
}

type RaceState = {
  target: number
  autoSim: boolean
  youId: string | null
  runners: Runner[]
  winnerId: string | null
}

const STORAGE_KEY = 'team-steps-arena-v1'
const EMOJIS = ['👟','🦶','🥾','🩴','🧦','🚀']
const COLORS = ['emerald','sky','violet','pink','amber','lime']

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)] }
function randomName() { return pick(['Zoomy','Wiggle','Bouncy','Sunny','Sassy','Zippy','Giddy','Snappy']) + ' ' + pick(['Feet','Sneaker','Sock','Heel','Toe','Stride','Shuffle']) }
function colorToClasses(color: string) {
  const map: Record<string, { dot: string; bar: string; btn: string }> = {
    emerald: { dot: 'bg-emerald-500', bar: 'from-emerald-400 to-emerald-600', btn: 'bg-emerald-600 hover:bg-emerald-700' },
    sky:     { dot: 'bg-sky-500',     bar: 'from-sky-400 to-sky-600',         btn: 'bg-sky-600 hover:bg-sky-700' },
    violet:  { dot: 'bg-violet-500',  bar: 'from-violet-400 to-violet-600',   btn: 'bg-violet-600 hover:bg-violet-700' },
    pink:    { dot: 'bg-pink-500',    bar: 'from-pink-400 to-pink-600',       btn: 'bg-pink-600 hover:bg-pink-700' },
    amber:   { dot: 'bg-amber-500',   bar: 'from-amber-400 to-amber-600',     btn: 'bg-amber-600 hover:bg-amber-700' },
    lime:    { dot: 'bg-lime-500',    bar: 'from-lime-400 to-lime-600',       btn: 'bg-lime-600 hover:bg-lime-700' },
  }
  return map[color] ?? map.emerald
}

function useAudio() {
  const ctxRef = useRef<AudioContext | null>(null)
  function ensureCtx() {
    if (!ctxRef.current) ctxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    return ctxRef.current!
  }
  function blip(freq = 660, durationMs = 80) {
    try {
      const ctx = ensureCtx()
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.type = 'square'
      o.frequency.value = freq
      g.gain.value = 0.001
      o.connect(g); g.connect(ctx.destination)
      o.start()
      g.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + durationMs / 1000)
      o.stop(ctx.currentTime + durationMs / 1000)
    } catch {}
  }
  function fanfare() {
    try {
      const ctx = ensureCtx()
      const now = ctx.currentTime
      const freqs = [523.25, 659.25, 783.99, 1046.5] // C5 E5 G5 C6
      freqs.forEach((f, i) => {
        const o = ctx.createOscillator()
        const g = ctx.createGain()
        o.type = 'triangle'
        o.frequency.value = f
        g.gain.value = 0.001
        o.connect(g); g.connect(ctx.destination)
        const start = now + i * 0.12
        const stop = start + 0.25
        o.start(start)
        g.gain.setValueAtTime(0.001, start)
        g.gain.exponentialRampToValueAtTime(0.00001, stop)
        o.stop(stop)
      })
    } catch {}
  }
  return { blip, fanfare }
}

export default function TeamStepsArena() {
  const { blip, fanfare } = useAudio()
  const [state, setState] = useState<RaceState>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) return JSON.parse(raw)
    } catch {}
    const runners: Runner[] = [
      { id: crypto.randomUUID(), name: 'You · Turbo Toe', emoji: '👟', color: 'emerald', steps: 0 },
      { id: crypto.randomUUID(), name: 'Ava · Sunny Sock', emoji: '🧦', color: 'sky', steps: 0 },
      { id: crypto.randomUUID(), name: 'Ben · Zippy Heel', emoji: '🦶', color: 'violet', steps: 0 },
    ]
    return { target: 100, autoSim: true, youId: runners[0].id, runners, winnerId: null }
  })

  // Motion pedometer controls
  const [motionOn, setMotionOn] = useState(false)
  const [sensitivityG, setSensitivityG] = useState(1.2) // threshold in g
  const [debounceMs, setDebounceMs] = useState(350)
  const [currentG, setCurrentG] = useState(0)
  const lastStepRef = useRef(0)
  const lastBelowRef = useRef(true)
  const visibleRef = useRef(true)

  // persist
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) } catch {}
  }, [state])

  // page visibility
  useEffect(() => {
    const onVis = () => { visibleRef.current = document.visibilityState === 'visible' }
    document.addEventListener('visibilitychange', onVis)
    onVis()
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  // auto simulate
  useEffect(() => {
    if (!state.autoSim || state.winnerId) return
    const id = setInterval(() => {
      setState((prev) => {
        if (prev.winnerId) return prev
        const updated = prev.runners.map((r) => ({
          ...r,
          steps: r.steps + (Math.random() < 0.35 ? Math.floor(1 + Math.random()*4) : 0),
        }))
        const winner = updated.find((r) => r.steps >= prev.target)
        if (winner && !prev.winnerId) {
          setTimeout(() => fanfare(), 0)
        }
        return { ...prev, runners: updated, winnerId: winner ? winner.id : null }
      })
    }, 700)
    return () => clearInterval(id)
  }, [state.autoSim, state.winnerId, state.target, fanfare])

  // motion pedometer listener
  useEffect(() => {
    if (!motionOn || state.winnerId) return
    const hasMotion = 'DeviceMotionEvent' in window
    if (!hasMotion) return

    const handler = (e: DeviceMotionEvent) => {
      if (!visibleRef.current) return
      const acc = (e.accelerationIncludingGravity || e.acceleration)
      if (!acc) return
      const ax = acc.x || 0, ay = acc.y || 0, az = acc.z || 0
      const m = Math.sqrt(ax*ax + ay*ay + az*az) // m/s^2
      const g = m / 9.81
      setCurrentG(g)

      const now = Date.now()
      const debounceOk = now - lastStepRef.current >= debounceMs
      const crossedUp = lastBelowRef.current && g > sensitivityG
      if (debounceOk && crossedUp) {
        lastStepRef.current = now
        lastBelowRef.current = false
        // increment your runner
        setState((prev) => {
          if (prev.winnerId) return prev
          const updated = prev.runners.map((r) => r.id === prev.youId ? { ...r, steps: r.steps + 1 } : r)
          const win = updated.find((r) => r.steps >= prev.target)
          if (win && !prev.winnerId) setTimeout(() => fanfare(), 0)
          return { ...prev, runners: updated, winnerId: win ? win.id : null }
        })
        blip()
      }
      if (g < Math.max(1, sensitivityG - 0.15)) {
        lastBelowRef.current = true
      }
    }

    // iOS permission
    const maybeRequestPermission = async () => {
      try {
        const anyDM = (DeviceMotionEvent as any)
        if (anyDM && typeof anyDM.requestPermission === 'function') {
          const res = await anyDM.requestPermission()
          if (res !== 'granted') return false
        }
      } catch {}
      return true
    }

    let active = true
    maybeRequestPermission().then((ok) => {
      if (!ok || !active) return
      window.addEventListener('devicemotion', handler)
    })

    return () => {
      active = false
      window.removeEventListener('devicemotion', handler)
    }
  }, [motionOn, sensitivityG, debounceMs, blip, fanfare, state.winnerId])

  const winner = useMemo(() => state.runners.find(r => r.id === state.winnerId) || null, [state])

  function step(id: string) {
    setState((prev) => {
      if (prev.winnerId) return prev
      const updated = prev.runners.map((r) => r.id === id ? { ...r, steps: r.steps + 1 } : r)
      const win = updated.find((r) => r.steps >= prev.target)
      if (win && !prev.winnerId) setTimeout(() => fanfare(), 0)
      return { ...prev, runners: updated, winnerId: win ? win.id : null }
    })
    blip()
  }

  function addRunner(name?: string, emoji?: string) {
    const r: Runner = { id: crypto.randomUUID(), name: name || randomName(), emoji: emoji || pick(EMOJIS), color: pick(COLORS), steps: 0 }
    setState((prev) => ({ ...prev, runners: [...prev.runners, r] }))
  }

  function resetRace() {
    setState((prev) => ({ ...prev, winnerId: null, runners: prev.runners.map(r => ({ ...r, steps: 0 })) }))
  }

  const sorted = useMemo(() => state.runners.slice().sort((a,b) => b.steps - a.steps), [state.runners])

  const motionSupported = typeof window !== 'undefined' && 'DeviceMotionEvent' in window

  return (
    <section className="grid gap-4">
      <header className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h3 className="h2">Footsteps Arena</h3>
          <p className="p-muted">Tap to add steps. First to reach the target wins. Purely for giggles.</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm p-muted">Target</label>
          <input type="number" min={10} max={10000} step={10} value={state.target}
                 onChange={(e)=>setState(s=>({ ...s, target: Math.max(10, Math.min(10000, Number(e.target.value)||0)) }))}
                 className="w-24 rounded-md bg-slate-900/50 border border-slate-800 px-3 py-2" />
          <label className="flex items-center gap-2 text-sm p-muted">
            <input type="checkbox" checked={state.autoSim} onChange={(e)=>setState(s=>({ ...s, autoSim: e.target.checked }))} /> Auto-sim
          </label>
          <button className="btn-outline" onClick={resetRace}>Reset Race</button>
          <button className="btn" onClick={()=>addRunner()}>Add Runner</button>
        </div>
      </header>

      <div className="card grid gap-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" disabled={!motionSupported} checked={motionOn} onChange={(e)=>setMotionOn(e.target.checked)} /> Use phone motion
            </label>
            {!motionSupported && <span className="text-xs p-muted">Not supported on this device</span>}
            {motionOn && <span className="text-xs text-brand-400">Live g: {currentG.toFixed(2)}</span>}
          </div>
          <div className="flex items-center gap-3">
            <label className="text-xs p-muted">Sensitivity ({sensitivityG.toFixed(2)}g)</label>
            <input type="range" min={1.05} max={1.60} step={0.01} value={sensitivityG} onChange={(e)=>setSensitivityG(Number(e.target.value))} />
            <label className="text-xs p-muted">Debounce {debounceMs}ms</label>
            <input type="range" min={200} max={600} step={10} value={debounceMs} onChange={(e)=>setDebounceMs(Number(e.target.value))} />
          </div>
        </div>
      </div>

      {winner && (
        <div className="card border-2 border-brand-500">
          <div className="font-semibold">Winner: {winner.emoji} {winner.name}</div>
          <div className="text-sm p-muted">Victory laps unlocked! Congrats on those turbo toes.</div>
        </div>
      )}

      <div className="grid gap-3">
        {sorted.map((r, idx) => {
          const theme = colorToClasses(r.color)
          const pct = Math.min(100, Math.round((r.steps / state.target) * 100))
          const isYou = r.id === state.youId
          return (
            <div key={r.id} className="card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`h-2.5 w-2.5 rounded-full ${theme.dot}`} />
                  <div className="text-xl" title="Runner">{r.emoji}</div>
                  <div className="font-medium">{idx+1}. {r.name}</div>
                  {isYou && <span className="text-xs text-brand-400">(You)</span>}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm p-muted">{r.steps} / {state.target}</span>
                  <button className={`px-3 py-1.5 rounded-md text-white ${theme.btn}`} onClick={()=>step(r.id)} disabled={!!state.winnerId}>Step</button>
                  <label className="text-xs p-muted flex items-center gap-1">
                    <input type="radio" checked={isYou} onChange={()=>setState(s=>({ ...s, youId: r.id }))} /> Mark as you
                  </label>
                </div>
              </div>
              <div className="mt-3">
                <div className="relative h-8 rounded-full bg-slate-800 overflow-hidden">
                  <div className={`absolute inset-y-0 left-0 bg-gradient-to-r ${theme.bar}`} style={{ width: pct + '%' }} />
                  <div className="absolute inset-y-0 left-0 flex items-center" style={{ transform: `translateX(${pct}%)` }}>
                    <span className="-translate-x-1/2 text-lg motion-safe:animate-pop" title="Foot">{r.emoji}</span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}