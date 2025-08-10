import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

const STORAGE_KEY = 'team-steps-arena-v1'

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

const COLORS = ['emerald','sky','violet','amber','rose','indigo','lime','pink','cyan','orange']

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)] }
function randomName() { return pick(['Zoomy','Wiggle','Bouncy','Sunny','Sassy','Zippy','Giddy','Snappy']) + ' ' + pick(['Feet','Sneaker','Sock','Heel','Toe','Stride','Shuffle']) }
function colorToClasses(color: string) {
  const map: Record<string, string> = {
    emerald: 'bg-emerald-500 border-emerald-600',
    sky: 'bg-sky-500 border-sky-600',
    violet: 'bg-violet-500 border-violet-600',
    amber: 'bg-amber-500 border-amber-600',
    rose: 'bg-rose-500 border-rose-600',
    indigo: 'bg-indigo-500 border-indigo-600',
    lime: 'bg-lime-500 border-lime-600',
    pink: 'bg-pink-500 border-pink-600',
    cyan: 'bg-cyan-500 border-cyan-600',
    orange: 'bg-orange-500 border-orange-600',
  }
  return map[color] || map.emerald
}

function useAudio() {
  const ctxRef = useRef<AudioContext | null>(null)
  function ensureCtx() {
    if (!ctxRef.current) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      ctxRef.current = new AudioContextClass()
    }
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
    } catch {
      // Handle audio errors silently
    }
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
    } catch {
      // Handle audio errors silently
    }
  }
  return { blip, fanfare }
}

export default function TeamStepsArena() {
  const { blip, fanfare } = useAudio()
  const [state, setState] = useState<RaceState>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) return JSON.parse(raw)
    } catch {
      // Handle localStorage errors silently
    }
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
    try { 
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) 
    } catch {
      // Handle localStorage errors silently
    }
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
    }, 1000)
    return () => clearInterval(id)
  }, [state.autoSim, state.winnerId, fanfare])

  const step = useCallback((id: string) => {
    setState((prev) => {
      if (prev.winnerId) return prev
      const updated = prev.runners.map((r) => r.id === id ? { ...r, steps: r.steps + 1 } : r)
      const winner = updated.find((r) => r.steps >= prev.target)
      if (winner && !prev.winnerId) {
        setTimeout(() => fanfare(), 0)
      }
      return { ...prev, runners: updated, winnerId: winner ? winner.id : null }
    })
  }, [fanfare])

  // motion sensor
  useEffect(() => {
    if (!motionOn || !visibleRef.current) return

    const onStep = () => {
      if (!visibleRef.current || !state.youId) return
      const now = Date.now()
      if (now - lastStepRef.current < debounceMs) return
      lastStepRef.current = now
      step(state.youId)
      blip()
    }

    const dmHandler = (e: DeviceMotionEvent) => {
      if (!e.accelerationIncludingGravity) return
      const { x, y, z } = e.accelerationIncludingGravity
      if (x === null || y === null || z === null) return
      const g = Math.sqrt(x*x + y*y + z*z) / 9.81
      setCurrentG(g)
      if (g > sensitivityG && lastBelowRef.current) {
        lastBelowRef.current = false
        onStep()
      } else if (g < sensitivityG * 0.8) {
        lastBelowRef.current = true
      }
    }

    const maybeRequestPermission = async () => {
      try {
        if ('DeviceMotionEvent' in window && 'requestPermission' in (DeviceMotionEvent as unknown as { requestPermission?: () => Promise<string> })) {
          const permission = await (DeviceMotionEvent as unknown as { requestPermission: () => Promise<string> }).requestPermission()
          if (permission === 'granted') {
            window.addEventListener('devicemotion', dmHandler)
          }
        } else {
          window.addEventListener('devicemotion', dmHandler)
        }
      } catch {
        // Handle permission errors silently
      }
    }

    const start = async () => {
      try {
        await maybeRequestPermission()
      } catch {
        // Handle motion sensor errors silently
      }
    }

    start()
    return () => {
      try {
        window.removeEventListener('devicemotion', dmHandler)
      } catch {
        // Handle cleanup errors silently
      }
    }
  }, [motionOn, sensitivityG, debounceMs, state.youId, blip, step])

  function addRunner(name?: string, emoji?: string) {
    const runner: Runner = {
      id: crypto.randomUUID(),
      name: name || randomName(),
      emoji: emoji || pick(['👟','🧦','🦶','👡','🥾','👢','🩴','👞']),
      color: pick(COLORS),
      steps: 0
    }
    setState((prev) => ({ ...prev, runners: [...prev.runners, runner] }))
  }

  function resetRace() {
    setState((prev) => ({
      ...prev,
      runners: prev.runners.map((r) => ({ ...r, steps: 0 })),
      winnerId: null
    }))
  }

  const sorted = useMemo(() => state.runners.slice().sort((a, b) => b.steps - a.steps), [state.runners])
  const maxSteps = Math.max(...state.runners.map((r) => r.steps), state.target)

  return (
    <section className="space-responsive">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <h2 className="h2">Footsteps Arena</h2>
          <p className="p-muted max-w-2xl">Race your friends to the finish line! Use motion controls or auto-simulate.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-outline" onClick={resetRace}>Reset Race</button>
          <button className="btn-outline" onClick={() => addRunner()}>Add Runner</button>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="card space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="text-2xl font-bold">{state.target}</div>
                <div className="text-sm p-muted">Target steps</div>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={state.autoSim}
                    onChange={(e) => setState((prev) => ({ ...prev, autoSim: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm">Auto-simulate</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={motionOn}
                    onChange={(e) => setMotionOn(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Motion sensor</span>
                </label>
              </div>
            </div>
            {motionOn && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="p-muted">Current G</div>
                  <div className="font-semibold">{currentG.toFixed(2)}</div>
                </div>
                <div>
                  <div className="p-muted">Threshold</div>
                  <div className="font-semibold">{sensitivityG.toFixed(1)}</div>
                </div>
                <div>
                  <div className="p-muted">Debounce</div>
                  <div className="font-semibold">{debounceMs}ms</div>
                </div>
                <div className="flex gap-2">
                  <input
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.1"
                    value={sensitivityG}
                    onChange={(e) => setSensitivityG(parseFloat(e.target.value))}
                    className="flex-1"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {sorted.map((runner) => (
              <div key={runner.id} className="card space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{runner.emoji}</div>
                    <div>
                      <div className="font-semibold flex items-center gap-2">
                        {runner.name}
                        {runner.id === state.youId && <span className="text-xs text-brand-400">(You)</span>}
                        {runner.id === state.winnerId && <span className="motion-safe:animate-pop">🏆</span>}
                      </div>
                      <div className="text-sm p-muted">{runner.steps} steps</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      className="btn-outline" 
                      onClick={() => step(runner.id)}
                      disabled={!!state.winnerId}
                    >
                      Step
                    </button>
                    {runner.id === state.youId ? null : (
                      <button 
                        className="btn-outline" 
                        onClick={() => setState((prev) => ({ ...prev, youId: runner.id }))}
                      >
                        Set Me
                      </button>
                    )}
                  </div>
                </div>
                <div className="relative h-4 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${colorToClasses(runner.color)} transition-all duration-300 ease-out`}
                    style={{ width: `${Math.min(100, (runner.steps / maxSteps) * 100)}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-xs font-medium text-white drop-shadow">
                      {Math.round((runner.steps / maxSteps) * 100)}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card space-y-4">
            <h3 className="font-semibold text-lg">Race Controls</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-2">Target Steps</label>
                <input
                  type="number"
                  min="10"
                  max="1000"
                  value={state.target}
                  onChange={(e) => setState((prev) => ({ ...prev, target: parseInt(e.target.value) || 100 }))}
                  className="w-full rounded-md bg-slate-900/50 border border-slate-800 px-3 py-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  className="btn-outline" 
                  onClick={() => setState((prev) => ({ ...prev, target: Math.max(10, prev.target - 10) }))}
                >
                  -10
                </button>
                <button 
                  className="btn-outline" 
                  onClick={() => setState((prev) => ({ ...prev, target: Math.min(1000, prev.target + 10) }))}
                >
                  +10
                </button>
              </div>
            </div>
          </div>

          <div className="card space-y-4">
            <h3 className="font-semibold text-lg">Motion Settings</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-2">Sensitivity: {sensitivityG.toFixed(1)}g</label>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.1"
                  value={sensitivityG}
                  onChange={(e) => setSensitivityG(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Debounce: {debounceMs}ms</label>
                <input
                  type="range"
                  min="100"
                  max="1000"
                  step="50"
                  value={debounceMs}
                  onChange={(e) => setDebounceMs(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}