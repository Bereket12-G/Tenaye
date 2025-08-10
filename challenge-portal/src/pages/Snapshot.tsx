import { useMemo, useState } from 'react'

type Player = {
  id: string
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

export default function SnapshotPage() {
  const [snapshots, setSnapshots] = useState<Snapshot[]>([])

  async function onFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    const loaded: Snapshot[] = []
    for (const f of Array.from(files)) {
      try {
        const text = await f.text()
        const json = JSON.parse(text)
        if (json && Array.isArray(json.players)) {
          loaded.push(json)
        }
      } catch {}
    }
    setSnapshots((prev) => [...prev, ...loaded])
  }

  const merged = useMemo(() => {
    const map = new Map<string, Player>()
    for (const s of snapshots) {
      for (const p of s.players) {
        const key = p.name + '_' + p.emoji
        const prev = map.get(key)
        if (!prev) map.set(key, { ...p })
        else {
          // Combine positively: take max streak, sum kindness/highFives
          map.set(key, {
            ...prev,
            kindness: prev.kindness + p.kindness,
            highFives: prev.highFives + p.highFives,
            streak: Math.max(prev.streak, p.streak),
          })
        }
      }
    }
    return Array.from(map.values()).sort((a,b) => (
      b.kindness - a.kindness || b.streak - a.streak || b.highFives - a.highFives
    ))
  }, [snapshots])

  return (
    <section className="grid gap-6">
      <header className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="h2">Snapshot Leaderboard</h2>
          <p className="p-muted">Import JSON snapshots from multiple devices to see a combined ranking. 100% frontend.</p>
        </div>
        <label className="btn-outline cursor-pointer">
          Import Snapshots
          <input type="file" accept="application/json" multiple className="hidden" onChange={(e)=>onFiles(e.target.files)} />
        </label>
      </header>

      <div className="card divide-y divide-slate-800">
        {merged.length === 0 && (
          <div className="p-muted text-sm py-4 px-2">No data yet. Export from the main Leaderboard, then import files here.</div>
        )}
        {merged.map((p, idx) => (
          <div key={idx} className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="w-8 text-slate-400">{idx + 1}</div>
              <div className="text-2xl">{p.emoji}</div>
              <div>
                <div className="font-medium">{p.name}</div>
                <div className="text-xs p-muted">{p.flair}</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm"><span className="p-muted">Kindness</span> <span className="font-semibold text-brand-400">{p.kindness}</span></div>
              <div className="text-sm"><span className="p-muted">Streak</span> <span className="font-semibold">{p.streak}🔥</span></div>
              <div className="text-sm"><span className="p-muted">High-Fives</span> <span className="font-semibold">{p.highFives}</span></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}