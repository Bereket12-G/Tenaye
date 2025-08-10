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
            'px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 border touch-manipulation ' +
            (value === opt
              ? 'bg-brand-500 border-brand-600 text-white shadow-sm scale-105'
              : 'border-slate-700 text-slate-300 hover:bg-slate-800/60 hover:scale-105 active:scale-95')
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
    <article className="card space-y-4 hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg leading-tight">{challenge.title}</h3>
          <div className="mt-2 text-sm text-slate-400 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-800/50 text-xs">
              {challenge.category}
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-800/50 text-xs">
              {challenge.durationDays} days
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-800/50 text-xs">
              ~{challenge.estimatedDailyMinutes} min/day
            </span>
          </div>
        </div>
        <button className="btn-outline whitespace-nowrap touch-manipulation">Participate</button>
      </div>
      <p className="p-muted text-sm leading-relaxed">{challenge.description}</p>
      <div>
        <div className="text-sm font-medium mb-2 text-slate-200">How it works</div>
        <ul className="list-disc pl-5 text-sm text-slate-300 space-y-1.5">
          {challenge.guidelines.map((g, i) => (
            <li key={i} className="leading-relaxed">{g}</li>
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <h2 className="h2">Wellness Challenges</h2>
          <p className="p-muted max-w-2xl">Upbeat, doable sprints to help you feel better — one small step at a time.</p>
        </div>
        <CategoryFilter value={category} onChange={setCategory} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((ch) => (
          <ChallengeCard key={ch.id} challenge={ch} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="p-muted text-lg">No challenges found for this category.</p>
          <button 
            onClick={() => setCategory('All')}
            className="btn mt-4"
          >
            View All Challenges
          </button>
        </div>
      )}

      <p className="p-muted text-xs leading-relaxed max-w-3xl">
        Tips: Adjust durations to your energy level, invite a friend for accountability, and celebrate each tiny win.
      </p>
    </section>
  )
}