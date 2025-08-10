import { NavLink, Outlet, Route, Routes } from 'react-router-dom'
import './index.css'

function Nav() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-slate-800 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'}`

  return (
    <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur supports-[backdrop-filter]:bg-slate-900/50 sticky top-0 z-40">
      <div className="container-page flex items-center justify-between h-16">
        <NavLink to="/" className="flex items-center gap-2 text-white font-semibold">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-brand-500" />
          Challenge Portal
        </NavLink>
        <nav className="flex items-center gap-1">
          <NavLink to="/challenges" className={linkClass}>Challenges</NavLink>
          <NavLink to="/progress" className={linkClass}>Progress</NavLink>
          <NavLink to="/community" className={linkClass}>Community</NavLink>
          <NavLink to="/teams" className={linkClass}>Teams</NavLink>
          <NavLink to="/leaderboard" className={linkClass}>Leaderboard</NavLink>
        </nav>
      </div>
    </header>
  )
}

function Layout() {
  return (
    <div className="min-h-full">
      <Nav />
      <main className="container-page py-8">
        <Outlet />
      </main>
      <footer className="container-page py-8 text-sm text-slate-400">
        Built for exploration — data is local-only. No backend.
      </footer>
    </div>
  )
}

function Landing() {
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

// Pages
import ChallengeList from './components/ChallengeList'

function ChallengesPage() {
  return (
    <ChallengeList />
  )
}

function ProgressPage() {
  return <section className="grid gap-6">
    <header className="flex items-center justify-between">
      <div>
        <h2 className="h2">Progress Tracking</h2>
        <p className="p-muted">Log micro-commits, maintain streaks, and see XP growth.</p>
      </div>
      <button className="btn">Log Progress</button>
    </header>
    <div className="grid gap-4 md:grid-cols-2">
      <div className="card">
        <h3 className="font-semibold mb-2">This Week</h3>
        <ul className="space-y-2 text-sm">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => (
            <li key={d} className="flex items-center justify-between">
              <span>{d}</span>
              <span className="text-brand-400">{i < 4 ? '✓' : '—'}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="card">
        <h3 className="font-semibold mb-2">XP Overview</h3>
        <div className="h-40 bg-slate-800 rounded grid place-items-center text-slate-400">
          Mini chart placeholder
        </div>
      </div>
    </div>
  </section>
}

function CommunityPage() {
  return <section className="grid gap-6">
    <header>
      <h2 className="h2">Community</h2>
      <p className="p-muted">Share wins, ask for help, and celebrate streaks.</p>
    </header>
    <div className="space-y-4">
      {[1,2,3].map((p) => (
        <article key={p} className="card">
          <div className="flex items-center justify-between">
            <div className="font-medium">@user{p}</div>
            <span className="text-xs p-muted">2h ago</span>
          </div>
          <p className="mt-2">Day {p} of my 7-day focus sprint. Feeling good!</p>
          <div className="mt-3 flex gap-2">
            <button className="btn-outline">Applaud</button>
            <button className="btn-outline">Reply</button>
          </div>
        </article>
      ))}
    </div>
  </section>
}

function TeamsPage() {
  return <section className="grid gap-6">
    <header className="flex items-center justify-between">
      <div>
        <h2 className="h2">Teams & Groups</h2>
        <p className="p-muted">Form squads, coordinate sprints, and keep momentum.</p>
      </div>
      <button className="btn">Create Team</button>
    </header>
    <div className="grid gap-4 md:grid-cols-2">
      {[{ name: 'Early Birds', members: 8 }, { name: 'Night Owls', members: 6 }].map((team) => (
        <article key={team.name} className="card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">{team.name}</h3>
              <p className="p-muted text-sm">{team.members} members</p>
            </div>
            <button className="btn-outline">Join</button>
          </div>
          <div className="mt-3 text-sm p-muted">Next sprint: Mon → Sun</div>
        </article>
      ))}
    </div>
  </section>
}

function LeaderboardPage() {
  const users = [
    { name: 'Ava', points: 920, streak: 12 },
    { name: 'Ben', points: 880, streak: 8 },
    { name: 'Kai', points: 860, streak: 15 },
    { name: 'Mia', points: 780, streak: 6 },
  ]
  return <section className="grid gap-6">
    <header>
      <h2 className="h2">Leaderboard</h2>
      <p className="p-muted">Consistency-weighted. Streak boosts points, resets penalize gently.</p>
    </header>
    <div className="card divide-y divide-slate-800">
      {users.map((u, idx) => (
        <div key={u.name} className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <div className="w-8 text-slate-400">{idx + 1}</div>
            <div className="font-medium">{u.name}</div>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-brand-400">{u.streak}🔥</span>
            <span className="font-semibold">{u.points} XP</span>
          </div>
        </div>
      ))}
    </div>
  </section>
}

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Landing />} />
        <Route path="challenges" element={<ChallengesPage />} />
        <Route path="progress" element={<ProgressPage />} />
        <Route path="community" element={<CommunityPage />} />
        <Route path="teams" element={<TeamsPage />} />
        <Route path="leaderboard" element={<LeaderboardPage />} />
      </Route>
    </Routes>
  )
}
