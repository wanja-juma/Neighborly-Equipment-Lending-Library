import { useState } from 'react'
import ToolsPanel from './ToolsPanel.jsx'
import './AuthPage.css'
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function AuthPage() {
  const [isRegister, setIsRegister] = useState(true)
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(''); const [submitting, setSubmitting] = useState(false)
  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })
  async function handleSubmit(e) {
    e.preventDefault()
    if (isRegister && (!form.firstName || !form.lastName)) return setError('Please enter your first and last name')
    if (!form.email.includes('@')) return setError('Please enter a valid email address')
    if (!form.password || (isRegister && form.password.length < 8)) return setError('Password must be at least 8 characters')
    setError(''); setSubmitting(true)
    try {
      const res = await fetch(`${API}/api/auth/${isRegister ? 'register' : 'login'}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (!res.ok) setError('Something went wrong. Please try again.')
    } catch { setError('Unable to reach the server. Please try again shortly.') }
    setSubmitting(false)
  }
  return (
    <div className="auth-page"><div className="auth-card">
      <section className="auth-form-panel">
        <span className="brand-badge">Neighborly</span>
        <div className="auth-heading"><h1>{isRegister ? 'Create an account' : 'Welcome back'}</h1>
          <p>{isRegister ? 'Sign up to borrow and lend equipment with your neighbors' : 'Sign in to manage your borrowed and lent items'}</p></div>
        <form className="auth-form" onSubmit={handleSubmit}>
          {isRegister && <div className="field-row">
            <label className="field"><span>First name</span><input value={form.firstName} onChange={update('firstName')} /></label>
            <label className="field"><span>Last name</span><input value={form.lastName} onChange={update('lastName')} /></label>
          </div>}
          <label className="field"><span>Email</span><input type="email" value={form.email} onChange={update('email')} placeholder="you@example.com" /></label>
          <label className="field"><span>Password</span><div className="password-input">
            <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={update('password')} placeholder="••••••••" />
            <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>{showPassword ? '🙈' : '👁️'}</button>
          </div></label>
          {error && <p className="server-error">{error}</p>}
          <button type="submit" className="submit-button" disabled={submitting}>{submitting ? 'Please wait…' : isRegister ? 'Create account' : 'Sign in'}</button>
        </form>
        <p className="switch-mode">{isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button type="button" onClick={() => { setIsRegister(!isRegister); setError('') }}>{isRegister ? 'Sign in' : 'Sign up'}</button></p>
      </section>
      <section className="auth-illustration-panel"><ToolsPanel /></section>
    </div></div>
  )
}
export default AuthPage
