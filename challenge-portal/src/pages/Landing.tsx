import { NavLink } from 'react-router-dom'

export default function LandingPage() {
  return (
    <section className="grid gap-8">
      <div className="grid gap-3">
        <h1 className="h1">Level up with challenges</h1>
        <p className="p-muted max-w-2xl">Pick weekly challenges, track your momentum, collaborate in groups, and climb the community leaderboard. Everything here runs in your browser.</p>
        <div className="flex gap-3">
          <NavLink to="/challenges" className="btn">Browse Challenges</NavLink>
          <NavLink to="/progress" className="btn-outline">Track Progress</NavLink>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <h3 className="font-semibold">Micro-commit design</h3>
          <p className="p-muted">Daily micro-actions build streaks and XP. Small wins compound.</p>
        </div>
        <div className="card">
          <h3 className="font-semibold">Social accountability</h3>
          <p className="p-muted">Teams, nudges, and gentle reminders keep motivation high.</p>
        </div>
        <div className="card">
          <h3 className="font-semibold">Fair leaderboard</h3>
          <p className="p-muted">Score by consistency, not just volume. Streaks matter.</p>
        </div>
      </div>
    </section>
  )
}