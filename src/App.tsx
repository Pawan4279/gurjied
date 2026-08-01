import { useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'

const subjects = ['K–12 Learning', 'NEET', 'JEE Advanced', 'SSC', 'Current Affairs']

function App() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loginStatus, setLoginStatus] = useState<'idle' | 'success' | 'error'>('idle')

  function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (email.trim().toLowerCase() === 'guru@ji.com' && password === '12345') {
      setLoginStatus('success')
      setMessage('Login successful! Welcome to your Guruji learning space.')
      return
    }

    setLoginStatus('error')
    setMessage('Email or password is incorrect. Please try again.')
  }

  return (
    <main className="page-shell">
      <div className="orb orb-one" /><div className="orb orb-two" />
      <nav className="brand" aria-label="Guruji AI home">
        <span className="brand-mark">गु</span><span>Guruji<span className="brand-ai">AI</span></span>
      </nav>

      <section className="hero-panel">
        <div className="eyebrow"><span>✦</span> Your personal AI teacher</div>
        <h1>Har sawaal ka jawab.<br /><em>Har sapne ko udaan.</em></h1>
        <p className="hero-copy">Aapka intelligent virtual teacher jo har concept ko aapki pace par samjhaye—school se competitive exams tak, anytime, anywhere.</p>
        <div className="subject-row" aria-label="Learning categories">
          {subjects.map((subject) => <span key={subject}>{subject}</span>)}
        </div>
        <div className="feature-grid">
          <article><span className="feature-icon purple">✦</span><div><strong>Smart Assessments</strong><small>Personalised tests & instant feedback</small></div></article>
          <article><span className="feature-icon amber">▤</span><div><strong>Mock Papers</strong><small>Exam-ready practice & analysis</small></div></article>
          <article><span className="feature-icon blue">◉</span><div><strong>Story Learning</strong><small>Concepts that stay with you</small></div></article>
          <article><span className="feature-icon pink">⌁</span><div><strong>All Subjects</strong><small>Maths, English, GK, History & more</small></div></article>
        </div>
        <div className="proof">
          <div className="avatars"><span>AR</span><span>SK</span><span>MP</span></div>
          <div><b>10,000+ learners</b><small>already learning smarter</small></div>
          <div className="rating">★★★★★ <small>4.9</small></div>
        </div>
      </section>

      <aside className="login-card">
        <div className="login-top"><div className="mini-mark">गु</div><h2>Welcome back!</h2><p>Continue your learning journey</p></div>
        <form onSubmit={handleLogin}>
          <label htmlFor="email">Email or mobile number</label>
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
