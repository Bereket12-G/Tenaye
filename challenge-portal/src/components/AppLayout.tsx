import { Outlet } from 'react-router-dom'
import NavBar from './NavBar'
import { usePartyMode } from '../hooks/usePartyMode'

export default function AppLayout() {
  const { partyOn } = usePartyMode()
  return (
    <div className="min-h-full relative overflow-x-hidden">
      <NavBar />
      {partyOn && (
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 opacity-20">
          <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-brand-500 blur-3xl animate-pulse" />
          <div className="absolute top-20 right-0 h-80 w-80 rounded-full bg-fuchsia-500 blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-sky-500 blur-3xl animate-pulse" />
        </div>
      )}
      <main className="container-page py-8">
        <Outlet />
      </main>
      <footer className="container-page py-8 text-sm text-slate-400">
        Built for exploration — data is local-only. No backend.
      </footer>
    </div>
  )
}