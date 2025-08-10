import { useCallback, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'progress-playground-logs-v1'

const FUN_ICONS = ['✨','🌈','🧘','🎉','💪']

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
    } catch {
      // Handle localStorage errors silently
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(logs))
    } catch {
      // Handle localStorage errors silently
    }
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
    <section className="space-responsive">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <h2 className="h2">Progress Playground</h2>
          <p className="p-muted max-w-2xl">Log your antics, earn goofy badges, and watch the silliness meter rise.</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1))}
            className="btn-outline touch-friendly"
          >
            ←
          </button>
          <span className="px-4 py-2 text-sm font-medium">
            {month.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
          </span>
          <button 
            onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1))}
            className="btn-outline touch-friendly"
          >
            →
          </button>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="card space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="text-2xl font-bold">{loggedCount}/{target}</div>
                <div className="text-sm p-muted">Days logged this month</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{streak}</div>
                <div className="text-sm p-muted">Day streak</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{pct}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-brand-500 to-brand-400 transition-all duration-500 ease-out"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">{headerMsg}</p>
          </div>

          <div className="card space-y-4">
            <h3 className="font-semibold text-lg">Calendar</h3>
            <div className="space-y-2">
              <div className="grid grid-cols-7 gap-1 text-xs text-slate-400 mb-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                  <div key={day} className="text-center py-1">{day}</div>
                ))}
              </div>
              {monthWeeks.map((week, i) => (
                <div key={i} className="grid grid-cols-7 gap-1">
                  {week.map((date, j) => (
                    <button
                      key={j}
                      onClick={() => date && addLog(date)}
                      disabled={!date}
                      className={`
                        aspect-square rounded-md text-sm font-medium transition-all duration-200 touch-friendly
                        ${!date ? 'invisible' : ''}
                        ${date && logs[toKey(date)] 
                          ? 'bg-brand-500 text-white shadow-sm hover:bg-brand-600 active:scale-95' 
                          : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 active:scale-95'
                        }
                        ${date && date.toDateString() === new Date().toDateString() 
                          ? 'ring-2 ring-brand-400' 
                          : ''
                        }
                      `}
                    >
                      {date && logs[toKey(date)] ? logs[toKey(date)] : date?.getDate()}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card space-y-4">
            <h3 className="font-semibold text-lg">Badges Earned</h3>
            {badges.length === 0 ? (
              <p className="text-sm p-muted">Complete challenges to earn badges!</p>
            ) : (
              <div className="space-y-3">
                {badges.map((badge, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/30">
                    <div className="text-2xl">{badge.icon}</div>
                    <div>
                      <div className="font-medium text-sm">{badge.name}</div>
                      <div className="text-xs p-muted leading-relaxed">{badge.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card space-y-4">
            <h3 className="font-semibold text-lg">Quick Actions</h3>
            <div className="space-y-2">
              <button 
                onClick={() => addLog(new Date())}
                className="w-full btn"
              >
                Log Today's Progress
              </button>
              <button 
                onClick={() => setLogs({})}
                className="w-full btn-outline"
              >
                Reset All Logs
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}