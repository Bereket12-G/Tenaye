import { Route, Routes } from 'react-router-dom'
import './index.css'
import AppLayout from './components/AppLayout'
import LandingPage from './pages/Landing'
import ChallengesPage from './pages/Challenges'
import ProgressPage from './pages/Progress'
import CommunityPage from './pages/Community'
import TeamsPage from './pages/Teams'
import LeaderboardPage from './pages/Leaderboard'
import OnboardingPage from './pages/Onboarding'

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="onboarding" element={<OnboardingPage />} />
        <Route path="challenges" element={<ChallengesPage />} />
        <Route path="progress" element={<ProgressPage />} />
        <Route path="community" element={<CommunityPage />} />
        <Route path="teams" element={<TeamsPage />} />
        <Route path="leaderboard" element={<LeaderboardPage />} />
      </Route>
    </Routes>
  )
}
