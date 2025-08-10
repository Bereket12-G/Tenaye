import { NavLink } from 'react-router-dom'

export default function NavBar() {
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