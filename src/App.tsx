import { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import './App.css'
import { api } from './api'
import AssessmentRoute from './components/AssessmentRoute'
import DashboardScreen from './components/DashboardScreen'
import LoginScreen from './components/LoginScreen'
import type { GurujiProfile } from './types'

const emptyProfile: GurujiProfile = { name: '', projects: [], activeProjectId: '' }

function normalizeProfile(value: { projects?: GurujiProfile['projects']; activeProjectId?: string; name?: string; course?: string; subject?: string; learningMode?: string } | null | undefined): GurujiProfile {
  if (value?.projects?.length) return { name: value.name || '', projects: value.projects, activeProjectId: value.activeProjectId || value.projects[0].id }
  if (value?.course && value?.subject) {
    const project = { id: crypto.randomUUID(), name: `${value.course} · ${value.subject}`, course: value.course, learningMode: value.learningMode || 'Assessment', subject: value.subject }
    return { name: value.name || '', projects: [project], activeProjectId: project.id }
  }
  return { name: value?.name || '', projects: [], activeProjectId: '' }
}

function AppRoutes() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(emptyProfile)
  const [authStatus, setAuthStatus] = useState<'checking' | 'authenticated' | 'anonymous'>('checking')

  useEffect(() => {
    let active = true
    api('session')
      .then(data => { if (active) { setProfile(normalizeProfile(data.profile)); setAuthStatus('authenticated') } })
      .catch(() => { if (active) setAuthStatus('anonymous') })
    return () => { active = false }
  }, [])

  async function logout() {
    try {
      await api('logout', 'POST')
      setProfile(emptyProfile)
      setAuthStatus('anonymous')
      navigate('/login', { replace: true })
    } catch (problem) {
      console.error((problem as Error).message)
    }
  }

  if (authStatus === 'checking') return <main className="route-loading" role="status">Loading Guruji…</main>

  return <Routes>
    <Route path="/" element={<Navigate to={authStatus === 'authenticated' ? '/dashboard' : '/login'} replace />} />
    <Route path="/login" element={authStatus === 'authenticated'
      ? <Navigate to="/dashboard" replace />
      : <LoginScreen onLogin={value => { setProfile(normalizeProfile(value as Parameters<typeof normalizeProfile>[0])); setAuthStatus('authenticated'); navigate('/dashboard', { replace: true }) }} />} />
    <Route path="/dashboard" element={authStatus === 'authenticated'
      ? <DashboardScreen profile={profile} onProfileChange={setProfile} onLogout={logout} onAssessment={assessment => navigate(`/assessment/${encodeURIComponent(assessment.id)}`)} />
      : <Navigate to="/login" replace />} />
    <Route path="/assessment/:assessmentId" element={authStatus === 'authenticated'
      ? <AssessmentRoute onExit={() => navigate('/dashboard')} />
      : <Navigate to="/login" replace />} />
    <Route path="*" element={<Navigate to={authStatus === 'authenticated' ? '/dashboard' : '/login'} replace />} />
  </Routes>
}

function App() {
  return <BrowserRouter><AppRoutes /></BrowserRouter>
}

export default App
