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

import ProgressPlayground from './components/ProgressPlayground'

function ProgressPage() {
  return (
    <ProgressPlayground />
  )
}

import CommunityBoard from './components/CommunityBoard'

function CommunityPage() {
  return (
    <CommunityBoard />
  )
}

import TeamStudio from './components/TeamStudio'

function TeamsPage() {
  return (
    <TeamStudio />
  )
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
