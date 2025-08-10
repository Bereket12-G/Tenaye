import { useMemo, useState } from 'react'
import { CHALLENGES } from '../data/challenges'
import type { ChallengeCategory, Challenge } from '../types'

const ALL_CATEGORIES: ChallengeCategory[] = [
  'Mindfulness',
  'Creativity',
  'Physical Activity',
]

function CategoryFilter({
  value,
  onChange,
}: {
  value: ChallengeCategory | 'All'
  onChange: (c: ChallengeCategory | 'All') => void
}) {
  const options: (ChallengeCategory | 'All')[] = ['All', ...ALL_CATEGORIES]
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={
            'px-3 py-1.5 rounded-md text-sm transition border ' +
            (value === opt
              ? 'bg-brand-500 border-brand-600 text-white shadow-sm'
              : 'border-slate-700 text-slate-300 hover:bg-slate-800/60')
          }
        >
          {opt}
        </button>
      ))}
    </div>
  )
}

function ChallengeCard({ challenge }: { challenge: Challenge }) {
  return (
    <article className="card space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold">{challenge.title}</h3>
          <div className="mt-1 text-xs text-slate-400">
            {challenge.category} • {challenge.durationDays} days • ~{challenge.estimatedDailyMinutes} min/day
          </div>
        </div>
        <button className="btn-outline">Participate</button>
      </div>
      <p className="p-muted text-sm">{challenge.description}</p>
      <div>
        <div className="text-sm font-medium mb-1 text-slate-200">How it works</div>
        <ul className="list-disc pl-5 text-sm text-slate-300 space-y-1">
          {challenge.guidelines.map((g, i) => (
            <li key={i}>{g}</li>
          ))}
        </ul>
      </div>
    </article>
  )
}

export default function ChallengeList() {
  const [category, setCategory] = useState<ChallengeCategory | 'All'>('All')

  const filtered = useMemo(() => {
    if (category === 'All') return CHALLENGES
    return CHALLENGES.filter((c) => c.category === category)
  }, [category])

  return (
    <section className="grid gap-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="h2">Wellness Challenges</h2>
          <p className="p-muted">Upbeat, doable sprints to help you feel better — one small step at a time.</p>
        </div>
        <CategoryFilter value={category} onChange={setCategory} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((ch) => (
          <ChallengeCard key={ch.id} challenge={ch} />
        ))}
      </div>

      <p className="p-muted text-xs">
        Tips: Adjust durations to your energy level, invite a friend for accountability, and celebrate each tiny win.
      </p>
    </section>
  )
}