import { useCallback, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'progress-playground-logs-v1'

const FUN_ICONS = ['🍌','🦄','🫠','🕺','🧠','🌈','🍩','💃','🪩','🦖','🪄','🍉','🐸','✨','🧘']

function randomIcon() {
  return FUN_ICONS[Math.floor(Math.random() * FUN_ICONS.length)]
}

function startOfDay(date: Date) {
  const d = new Date(date)
  d.setHours(0,0,0,0)
  return d
}

function toKey(date: Date) {
  return startOfDay(date).toISOString().slice(0,10)
}

function getMonthMatrix(anchor: Date) {
  const year = anchor.getFullYear()
  const month = anchor.getMonth()
  const first = new Date(year, month, 1)
  const startWeekday = (first.getDay() + 6) % 7 // Mon=0
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: (Date | null)[] = []

  for (let i = 0; i < startWeekday; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d))
  while (cells.length % 7 !== 0) cells.push(null)

  const weeks: (Date | null)[][] = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))
  return weeks
}

export default function ProgressPlayground() {
  const [month, setMonth] = useState<Date>(startOfDay(new Date()))
  const [logs, setLogs] = useState<Record<string, string>>({})

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setLogs(JSON.parse(raw))
    } catch {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(logs))
    } catch {}
  }, [logs])

  const monthWeeks = useMemo(() => getMonthMatrix(month), [month])
  const monthKeys = useMemo(() => monthWeeks.flat().filter(Boolean).map((d) => toKey(d as Date)), [monthWeeks])
  const loggedCount = monthKeys.filter((k) => logs[k]).length
  const target = 14
  const pct = Math.min(100, Math.round((loggedCount / target) * 100))

  const addLog = useCallback((date: Date) => {
    const k = toKey(date)
    setLogs((prev) => ({ ...prev, [k]: prev[k] ? '' : randomIcon() }))
  }, [])

  const streak = useMemo(() => {
    // Compute current backward streak ending today
    let s = 0
    for (let i = 0; i < 365; i++) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const k = toKey(d)
      if (logs[k]) s++
      else break
    }
    return s
  }, [logs])

  const badges = useMemo(() => {
    const earned: { name: string; icon: string; desc: string }[] = []
    if (loggedCount >= 1) earned.push({ name: 'Giggle Initiate', icon: '😄', desc: 'First log! The journey begins.' })
    if (streak >= 3) earned.push({ name: 'Banana Boss', icon: '🍌', desc: '3-day streak of silliness.' })
    if (pct >= 50) earned.push({ name: 'Halfway Hooray', icon: '🎉', desc: 'Over 50% progress — confetti vibes.' })
    if (streak >= 7) earned.push({ name: 'Disco Dynamo', icon: '🪩', desc: '7 days in a row? Party time.' })
    if (pct >= 100) earned.push({ name: 'Challenge Champion', icon: '🏆', desc: 'You filled the meter!' })
    return earned
  }, [loggedCount, streak, pct])

  const headerMsg = pct >= 100
    ? 'Hysterical hero! Meter maxed — you absolute legend.'
    : pct >= 50
      ? 'You are delightfully unstoppable. Keep the giggles rolling.'
      : 'Tiny steps, big smiles. Your future self is already proud.'

  return (
    <section className="grid gap-6">
      <header className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="h2">Progress Playground</h2>
          <p className="p-muted">Log your antics, earn goofy badges, and watch the silliness meter rise.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-outline" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}>← Prev</button>
          <div className="text-sm text-slate-300 w-32 text-center">
            {month.toLocaleString(undefined, { month: 'long', year: 'numeric' })}
          </div>
          <button className="btn-outline" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}>Next →</button>
        </div>
      </header>

      <div className="card">
        <div className="flex items-center justify-between mb-2">
          <div className="font-medium">Silliness Meter</div>
          <div className="text-sm text-slate-300">{pct}% • {loggedCount}/{target} logs</div>
        </div>
        <div className="relative h-6 rounded-full bg-slate-800 overflow-hidden">
          <div className="absolute inset-0 opacity-40 bg-[length:1rem_1rem] bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] animate-barberpole" />
          <div className="relative h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600 animate-jiggle" style={{ width: `${pct}%` }} />
        </div>
        <div className="mt-3 text-sm text-brand-400">{headerMsg}</div>
      </div>

      <div className="card">
        <div className="mb-3 font-medium">Log your days</div>
        <div className="grid grid-cols-7 gap-2 text-center text-xs text-slate-400 mb-2">
          {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d) => <div key={d}>{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {monthWeeks.map((week, wi) => (
            week.map((d, di) => (
              <button
                key={`${wi}-${di}`}
                disabled={!d}
                onClick={() => d && addLog(d)}
                className={
                  'aspect-square rounded-lg border flex items-center justify-center select-none transition ' +
                  (!d
                    ? 'opacity-0 pointer-events-none'
                    : logs[toKey(d)]
                      ? 'border-brand-700 bg-slate-900 text-base'
                      : 'border-slate-800 bg-slate-900/40 hover:bg-slate-800/60')
                }
                title={d ? d.toDateString() : ''}
              >
                {d ? (
                  logs[toKey(d)] ? <span className="animate-pop text-lg">{logs[toKey(d)]}</span> : <span className="text-slate-500">＋</span>
                ) : null}
              </button>
            ))
          ))}
        </div>
      </div>

      <div className="grid gap-3">
        <div className="font-medium">Badges</div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {badges.length === 0 && (
            <div className="p-muted text-sm">Earn badges by logging days and building streaks. Your first badge is just one tap away.</div>
          )}
          {badges.map((b) => (
            <div key={b.name} className="card flex items-center gap-3">
              <div className="text-2xl">{b.icon}</div>
              <div>
                <div className="font-semibold">{b.name}</div>
                <div className="text-sm p-muted">{b.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}