import { Outlet } from 'react-router-dom'
import NavBar from './NavBar'

export default function AppLayout() {
  return (
    <div className="min-h-full">
      <NavBar />
      <main className="container-page py-8">
        <Outlet />
      </main>
      <footer className="container-page py-8 text-sm text-slate-400">
        Built for exploration — data is local-only. No backend.
      </footer>
    </div>
  )
}