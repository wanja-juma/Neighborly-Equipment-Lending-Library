import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ToolsPanel from './ToolsPanel.jsx'
import { registerUser, loginUser } from '../mockAuth.js'
import { useAuth } from '../context/AuthProvider.jsx'
import './AuthPage.css'

function AuthPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [isRegister, setIsRegister] = useState(true)
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  async function handleSubmit(e) {
    e.preventDefault()

    if (isRegister && (!form.firstName || !form.lastName)) {
      return setError('Please enter your first and last name')
    }
    if (!form.email.includes('@')) {
      return setError('Please enter a valid email address')
    }
    if (!form.password || (isRegister && form.password.length < 8)) {
      return setError('Password must be at least 8 characters')
    }

    setError('')
    setSuccess('')
    setSubmitting(true)

    try {
      const response = isRegister
        ? await registerUser(form)
        : await loginUser(form)

      /*
       * Supports both response structures:
       *
       * {
       *   access_token: "...",
       *   user: {...}
       * }
       *
       * and the existing mock response:
       *
       * {
       *   accessToken: "...",
       *   firstName: "..."
       * }
       */
      const userData = response.user || response

      const accessToken =
        response.access_token ||
        response.accessToken ||
        userData.access_token ||
        userData.accessToken ||
        null

      const firstName =
        userData.profile?.first_name ||
        userData.firstName ||
        form.firstName

      const lastName =
        userData.profile?.last_name ||
        userData.lastName ||
        form.lastName

      const fullName = [firstName, lastName].filter(Boolean).join(' ')

      const authenticatedUser = {
        id: String(userData.id || ''),
        firstName,
        lastName,
        name: userData.name || fullName || userData.email || form.email,
        email: userData.email || form.email,
        role: userData.role || 'Member',
        profile: userData.profile || null,
      }

      if (!accessToken) {
        throw new Error('Authentication succeeded, but no access token was returned.')
      }

      // Save the token for protected API requests.
      localStorage.setItem('access_token', accessToken)

      // Update the shared authentication state.
      login(authenticatedUser, accessToken)

      setSuccess(
        isRegister
          ? `Account created! Welcome, ${authenticatedUser.firstName}.`
          : `Welcome back, ${authenticatedUser.firstName}.`
      )

      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleModeChange = () => {
    setIsRegister((currentMode) => !currentMode)
    setError('')
    setSuccess('')
    setForm({ firstName: '', lastName: '', email: '', password: '' })
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <section className="auth-form-panel">
          <span className="brand-badge">Neighborly</span>
          <div className="auth-heading">
            <h1>{isRegister ? 'Create an account' : 'Welcome back'}</h1>
            <p>
              {isRegister
                ? 'Sign up to borrow and lend equipment with your neighbors'
                : 'Sign in to manage your borrowed and lent items'}
            </p>
          </div>
          <form className="auth-form" onSubmit={handleSubmit}>
            {isRegister && (
              <div className="field-row">
                <label className="field">
                  <span>First name</span>
                  <input value={form.firstName} onChange={update('firstName')} />
                </label>
                <label className="field">
                  <span>Last name</span>
                  <input value={form.lastName} onChange={update('lastName')} />
                </label>
              </div>
            )}
            <label className="field">
              <span>Email</span>
              <input
                type="email"
                value={form.email}
                onChange={update('email')}
                placeholder="you@example.com"
              />
            </label>
            <label className="field">
              <span>Password</span>
              <div className="password-input">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={update('password')}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </label>
            {error && <p className="server-error">{error}</p>}
            {success && <p className="server-success">{success}</p>}
            <button type="submit" className="submit-button" disabled={submitting}>
              {submitting ? 'Please wait…' : isRegister ? 'Create account' : 'Sign in'}
            </button>
          </form>
          <p className="switch-mode">
            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button type="button" onClick={handleModeChange}>
              {isRegister ? 'Sign in' : 'Sign up'}
            </button>
          </p>
        </section>
        <section className="auth-illustration-panel">
          <ToolsPanel />
        </section>
      </div>
    </div>
  )
}

export default AuthPage