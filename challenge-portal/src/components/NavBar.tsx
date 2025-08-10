import { NavLink } from 'react-router-dom'
import { useState } from 'react'
import PartySwitch from './PartySwitch'

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-slate-800 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'}`

  const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block px-4 py-3 text-base font-medium transition-colors ${isActive ? 'bg-slate-800 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'}`

  return (
    <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur supports-[backdrop-filter]:bg-slate-900/50 sticky top-0 z-40">
      <div className="container-page flex items-center justify-between h-16">
        <NavLink to="/" className="flex items-center gap-2 text-white font-semibold">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-brand-500" />
          <span className="hidden sm:inline">Challenge Portal</span>
          <span className="sm:hidden">Portal</span>
        </NavLink>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <NavLink to="/challenges" className={linkClass}>Challenges</NavLink>
          <NavLink to="/progress" className={linkClass}>Progress</NavLink>
          <NavLink to="/community" className={linkClass}>Community</NavLink>
          <NavLink to="/teams" className={linkClass}>Teams</NavLink>
          <NavLink to="/leaderboard" className={linkClass}>Leaderboard</NavLink>
        </nav>

        <div className="flex items-center gap-2">
          <PartySwitch />
          
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900/95 backdrop-blur">
          <nav className="container-page py-2">
            <NavLink to="/challenges" className={mobileLinkClass} onClick={() => setIsMenuOpen(false)}>Challenges</NavLink>
            <NavLink to="/progress" className={mobileLinkClass} onClick={() => setIsMenuOpen(false)}>Progress</NavLink>
            <NavLink to="/community" className={mobileLinkClass} onClick={() => setIsMenuOpen(false)}>Community</NavLink>
            <NavLink to="/teams" className={mobileLinkClass} onClick={() => setIsMenuOpen(false)}>Teams</NavLink>
            <NavLink to="/leaderboard" className={mobileLinkClass} onClick={() => setIsMenuOpen(false)}>Leaderboard</NavLink>
          </nav>
        </div>
      )}
    </header>
  )
}