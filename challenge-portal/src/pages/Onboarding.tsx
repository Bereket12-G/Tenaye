import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CHALLENGES } from '../data/challenges'
import { useConfetti } from '../hooks/useConfetti'

const STORAGE = {
  challenge: 'onboarding-challenge',
  team: 'onboarding-team',
}

export default function OnboardingPage() {
  const navigate = useNavigate()
  const { confetti } = useConfetti()

  const [step, setStep] = useState(1)
  const [challengeId, setChallengeId] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE.challenge) || CHALLENGES[0].id
    } catch {
      return CHALLENGES[0].id
    }
  })
  const [teamName, setTeamName] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE.team) || ''
    } catch {
      return ''
    }
  })

  const challenge = useMemo(() => CHALLENGES.find(c => c.id === challengeId)!, [challengeId])

  useEffect(() => { 
    try { 
      localStorage.setItem(STORAGE.challenge, challengeId) 
    } catch {
      // Handle localStorage errors silently
    }
  }, [challengeId])
  
  useEffect(() => { 
    try { 
      localStorage.setItem(STORAGE.team, teamName) 
    } catch {
      // Handle localStorage errors silently
    }
  }, [teamName])

  function next() { setStep((s) => Math.min(3, s + 1)) }
  function prev() { setStep((s) => Math.max(1, s - 1)) }

  function finish() {
    try {
      const k = new Date(); k.setHours(0,0,0,0)
      const key = k.toISOString().slice(0,10)
      const LOG_KEY = 'progress-playground-logs-v1'
      const raw = localStorage.getItem(LOG_KEY)
      const logs = raw ? JSON.parse(raw) : {}
      if (!logs[key]) logs[key] = '🎉'
      localStorage.setItem(LOG_KEY, JSON.stringify(logs))
    } catch {
      // Handle localStorage errors silently
    }
    confetti()
    navigate('/progress')
  }

  return (
    <section className="grid gap-6">
      <header>
        <h2 className="h2">Quick Start (1–2 min)</h2>
        <p className="p-muted">Pick a challenge, choose a team vibe, and log your first tiny win.</p>
      </header>

      {step === 1 && (
        <div className="card grid gap-3">
          <div className="font-medium">Step 1 — Choose your challenge</div>
          <select className="rounded-md bg-slate-900/50 border border-slate-800 px-3 py-2" value={challengeId} onChange={(e)=>setChallengeId(e.target.value)}>
            {CHALLENGES.map((c) => (
              <option key={c.id} value={c.id}>{c.title} • {c.durationDays}d • ~{c.estimatedDailyMinutes}m/day</option>
            ))}
          </select>
          <div className="text-sm p-muted">{challenge.description}</div>
          <div className="flex gap-2">
            <button className="btn" onClick={next}>Next</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="card grid gap-3">
          <div className="font-medium">Step 2 — Team vibe</div>
          <input className="rounded-md bg-slate-900/50 border border-slate-800 px-3 py-2" placeholder="Team name (optional)" value={teamName} onChange={(e)=>setTeamName(e.target.value)} />
          <div className="p-muted text-sm">Tip: invite friends later from the Teams page — sharing works via link only, no accounts.</div>
          <div className="flex gap-2">
            <button className="btn-outline" onClick={prev}>Back</button>
            <button className="btn" onClick={next}>Next</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="card grid gap-3">
          <div className="font-medium">Step 3 — First micro-win</div>
          <div className="text-sm p-muted">We'll log a celebratory emoji for today to start your streak. You can change it later.</div>
          <div className="flex gap-2">
            <button className="btn-outline" onClick={prev}>Back</button>
            <button className="btn" onClick={finish}>Finish & Celebrate</button>
          </div>
        </div>
      )}
    </section>
  )
}