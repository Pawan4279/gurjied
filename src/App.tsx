import { useEffect, useState } from 'react'
import './App.css'
import { api } from './api'
import AssessmentScreen from './components/AssessmentScreen'
import DashboardScreen from './components/DashboardScreen'
import LoginScreen from './components/LoginScreen'
import type { Assessment, GurujiProfile } from './types'

const emptyProfile: GurujiProfile = { name: '', projects: [], activeProjectId: '' }

function normalizeProfile(value: { projects?: GurujiProfile['projects']; activeProjectId?: string; name?: string; course?: string; subject?: string; learningMode?: string } | null | undefined): GurujiProfile {
  if (value?.projects?.length) return { name: value.name || '', projects: value.projects, activeProjectId: value.activeProjectId || value.projects[0].id }
  if (value?.course && value?.subject) {
    const project = { id: crypto.randomUUID(), name: `${value.course} · ${value.subject}`, course: value.course, learningMode: value.learningMode || 'Assessment', subject: value.subject }
    return { name: value.name || '', projects: [project], activeProjectId: project.id }
  }
  return { name: value?.name || '', projects: [], activeProjectId: '' }
}

function App() {
  const [profile, setProfile] = useState(emptyProfile), [isLoggedIn, setIsLoggedIn] = useState(false), [assessment, setAssessment] = useState<Assessment | null>(null)
  useEffect(() => { api('session').then(data => { setProfile(normalizeProfile(data.profile)); setIsLoggedIn(true) }).catch(() => {}) }, [])
  async function logout() { try { await api('logout', 'POST'); setIsLoggedIn(false); setProfile(emptyProfile); setAssessment(null) } catch (problem) { console.error((problem as Error).message) } }
  if (assessment) return <AssessmentScreen assessment={assessment} onExit={() => setAssessment(null)} />
  if (isLoggedIn) return <DashboardScreen profile={profile} onProfileChange={setProfile} onLogout={logout} onAssessment={setAssessment} />
  return <LoginScreen onLogin={value => { setProfile(normalizeProfile(value as Parameters<typeof normalizeProfile>[0])); setIsLoggedIn(true) }} />
}

export default App
