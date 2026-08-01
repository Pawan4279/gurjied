import { useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'

type GurujiProfile = {
  name: string
  course: string
  learningMode: string
  subject: string
}

const subjectTags = ['K–12 Learning', 'NEET', 'JEE Advanced', 'SSC', 'Current Affairs']
const emptyProfile: GurujiProfile = { name: '', course: '', learningMode: '', subject: '' }

function App() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loginStatus, setLoginStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [isLoggedIn, setIsLoggedIn] = useState(() => sessionStorage.getItem('guruji_logged_in') === 'true')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [profile, setProfile] = useState<GurujiProfile>(() => {
    const saved = sessionStorage.getItem('guruji_profile')
    return saved ? JSON.parse(saved) as GurujiProfile : emptyProfile
  })
  const [draft, setDraft] = useState<GurujiProfile>(profile)

  function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (email.trim().toLowerCase() === 'guru@ji.com' && password === '12345') {
      sessionStorage.setItem('guruji_logged_in', 'true')
      setLoginStatus('success')
      setMessage('')
      setIsLoggedIn(true)
      return
    }
    setLoginStatus('error')
    setMessage('Email or password is incorrect. Please try again.')
  }

  function openCreator() {
    setDraft(profile.name ? profile : emptyProfile)
    setIsModalOpen(true)
  }

  function saveGuruji(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    sessionStorage.setItem('guruji_profile', JSON.stringify(draft))
    setProfile(draft)
    setIsModalOpen(false)
  }

  function logout() {
    sessionStorage.removeItem('guruji_logged_in')
    setIsLoggedIn(false)
    setPassword('')
  }

  if (isLoggedIn) {
    return (
      <main className="dashboard-shell">
        <div className="dash-orb dash-orb-one" /><div className="dash-orb dash-orb-two" />
        <header className="dash-header">
          <div className="brand"><span className="brand-mark">गु</span><span>Guruji<span className="brand-ai">AI</span></span></div>
          <div className="dash-user">
            <span className="online-dot" /> <span>{profile.name || 'Learner'}</span>
            <button type="button" onClick={logout}>Logout</button>
          </div>
        </header>

        <section className="dash-hero">
          <div className="dash-copy">
            <span className="dash-kicker">✦ PERSONAL LEARNING SPACE</span>
            <h1>{profile.name ? `Welcome back, ${profile.name}!` : 'Build a Guruji who understands you.'}</h1>
            <p>Apni learning goals share karein aur ek personalized AI teacher banayein jo aapki pace, course aur favourite learning style ke hisaab se guide kare.</p>
            <button className="create-guruji" type="button" onClick={openCreator}>
              <span className="create-icon">✦</span>
              <span><b>{profile.name ? 'Update Your AI Guruji' : 'Create Your AI Guruji'}</b><small>Personalise your learning journey</small></span>
              <strong>→</strong>
            </button>
          </div>

          <div className="guru-visual" aria-hidden="true">
            <div className="visual-ring ring-one" /><div className="visual-ring ring-two" />
            <div className="guru-core"><span>गु</span><small>AI</small></div>
            <span className="float-pill pill-one">Assessment</span>
            <span className="float-pill pill-two">Story Learning</span>
            <span className="float-pill pill-three">Mock Tests</span>
          </div>
        </section>

        {profile.name ? (
          <section className="profile-summary">
            <div className="summary-head"><span>✓</span><div><small>YOUR AI GURUJI IS READY</small><h2>Namaste, {profile.name}!</h2></div></div>
            <div className="summary-grid">
              <article><small>COURSE / CLASS</small><b>{profile.course}</b></article>
              <article><small>LEARNING MODE</small><b>{profile.learningMode}</b></article>
              <article><small>SUBJECT</small><b>{profile.subject}</b></article>
            </div>
          </section>
        ) : (
          <section className="start-strip"><span>01</span><div><b>Tell us about yourself</b><small>It takes less than a minute</small></div><i>→</i><span>02</span><div><b>Meet your AI Guruji</b><small>Start a personalized lesson</small></div></section>
        )}

        {isModalOpen && (
          <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setIsModalOpen(false)}>
            <section className="creator-modal" role="dialog" aria-modal="true" aria-labelledby="creator-title">
              <button className="modal-close" type="button" onClick={() => setIsModalOpen(false)} aria-label="Close">×</button>
              <div className="modal-badge">गु</div>
              <span className="modal-step">PERSONALISE YOUR TEACHER</span>
              <h2 id="creator-title">Create your AI Guruji</h2>
              <p>Bas kuch details batayein, taaki Guruji aapke liye perfect learning plan bana sake.</p>
              <form className="creator-form" onSubmit={saveGuruji}>
                <label>Your name
                  <input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} placeholder="e.g. Aarav Sharma" autoFocus required />
                </label>
                <label>Class or exam course
                  <select value={draft.course} onChange={(event) => setDraft({ ...draft, course: event.target.value })} required>
                    <option value="">Select your class or exam</option><option>K–5 Foundation</option><option>Class 6–8</option><option>Class 9–10</option><option>Class 11–12</option><option>NEET</option><option>JEE Main & Advanced</option><option>SSC</option>
                  </select>
                </label>
                <fieldset><legend>What would you like to do?</legend>
                  <div className="choice-grid">
                    {['Assessment', 'Story Telling', 'Subject Tutorial', 'Mock Papers'].map((mode) => (
                      <label className={draft.learningMode === mode ? 'selected' : ''} key={mode}><input type="radio" name="mode" value={mode} checked={draft.learningMode === mode} onChange={(event) => setDraft({ ...draft, learningMode: event.target.value })} required /><span>{mode === 'Assessment' ? '✓' : mode === 'Story Telling' ? '◉' : mode === 'Subject Tutorial' ? '✦' : '▤'}</span>{mode}</label>
                    ))}
                  </div>
                </fieldset>
                <label>Choose your subject
                  <select value={draft.subject} onChange={(event) => setDraft({ ...draft, subject: event.target.value })} required>
                    <option value="">Select a subject</option><option>Mathematics</option><option>Science</option><option>English</option><option>History</option><option>Political Science</option><option>Current Affairs</option><option>General Knowledge</option>
                  </select>
                </label>
                <button className="save-guruji" type="submit">Create My Guruji <span>→</span></button>
              </form>
            </section>
          </div>
        )}
      </main>
    )
  }

  return (
    <main className="page-shell">
      <div className="orb orb-one" /><div className="orb orb-two" />
      <nav className="brand" aria-label="Guruji AI home"><span className="brand-mark">गु</span><span>Guruji<span className="brand-ai">AI</span></span></nav>
      <section className="hero-panel">
        <div className="eyebrow"><span>✦</span> Your personal AI teacher</div>
        <h1>Har sawaal ka jawab.<br /><em>Har sapne ko udaan.</em></h1>
        <p className="hero-copy">Aapka intelligent virtual teacher jo har concept ko aapki pace par samjhaye—school se competitive exams tak, anytime, anywhere.</p>
        <div className="subject-row">{subjectTags.map((subject) => <span key={subject}>{subject}</span>)}</div>
        <div className="feature-grid">
          <article><span className="feature-icon purple">✦</span><div><strong>Smart Assessments</strong><small>Personalised tests & instant feedback</small></div></article>
          <article><span className="feature-icon amber">▤</span><div><strong>Mock Papers</strong><small>Exam-ready practice & analysis</small></div></article>
          <article><span className="feature-icon blue">◉</span><div><strong>Story Learning</strong><small>Concepts that stay with you</small></div></article>
          <article><span className="feature-icon pink">⌁</span><div><strong>All Subjects</strong><small>Maths, English, GK, History & more</small></div></article>
        </div>
        <div className="proof"><div className="avatars"><span>AR</span><span>SK</span><span>MP</span></div><div><b>10,000+ learners</b><small>already learning smarter</small></div><div className="rating">★★★★★ <small>4.9</small></div></div>
      </section>
      <aside className="login-card">
        <div className="login-top"><div className="mini-mark">गु</div><h2>Welcome back!</h2><p>Continue your learning journey</p></div>
        <form onSubmit={handleLogin}>
          <label htmlFor="email">Email address</label>
          <div className="input-wrap"><span>✉</span><input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Enter your email" autoComplete="username" required /></div>
          <div className="label-row"><label htmlFor="password">Password</label><a href="#forgot">Forgot password?</a></div>
          <div className="input-wrap"><span>◆</span><input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" autoComplete="current-password" required /><button className="eye" type="button" onClick={() => setShowPassword(!showPassword)} aria-label="Show or hide password">{showPassword ? '◉' : '◎'}</button></div>
          <label className="remember"><input type="checkbox" /> <span>Remember me</span></label>
          <button className="login-button" type="submit">Login to Guruji <span>→</span></button>
          {message && <p className={`login-message ${loginStatus}`} role="status">{message}</p>}
        </form>
        <div className="divider"><span>or continue with</span></div>
        <button className="google-button" type="button"><b>G</b> Continue with Google</button>
        <p className="signup">New to Guruji? <a href="#signup">Create an account</a></p>
        <p className="terms">By continuing, you agree to our <a href="#terms">Terms</a> & <a href="#privacy">Privacy Policy</a></p>
      </aside>
      <footer>Built for curious minds <span>•</span> Learn without limits</footer>
    </main>
  )
}

export default App
