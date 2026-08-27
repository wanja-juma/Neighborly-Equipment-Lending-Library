import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ToolsPanel from './ToolsPanel.jsx'
import { registerUser, loginUser } from '../mockAuth.js'
import useAuth from '../hooks/useAuth.js'
import './AuthPage.css'

const NAME_PATTERN = /^[A-Za-z\s'-]+$/

function AuthPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [isRegister, setIsRegister] = useState(true)
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const update = (field) => (event) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: event.target.value,
    }))
  }

  const updateName = (field) => (event) => {
    const lettersOnly = event.target.value.replace(/[^A-Za-z\s'-]/g, '')
    setForm((currentForm) => ({
      ...currentForm,
      [field]: lettersOnly,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (isRegister && (!form.firstName.trim() || !form.lastName.trim())) {
      setError('Please enter your first and last name.')
      return
    }

    if (
      isRegister &&
      (!NAME_PATTERN.test(form.firstName.trim()) || !NAME_PATTERN.test(form.lastName.trim()))
    ) {
      setError('Names can only contain letters.')
      return
    }

    if (!form.email.includes('@')) {
      setError('Please enter a valid email address.')
      return
    }

    if (!form.password) {
      setError('Please enter your password.')
      return
    }

    if (isRegister && form.password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
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
       * { access_token: "...", user: {...} }
       *
       * and the existing mock response:
       *
       * { accessToken: "...", firstName: "..." }
       */
      const userData = response.user || response

      const accessToken =
        response.access_token ||
        response.accessToken ||
        userData.access_token ||
        userData.accessToken ||
        null

      const firstName = userData.profile?.first_name || userData.firstName || form.firstName
      const lastName = userData.profile?.last_name || userData.lastName || form.lastName
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

      localStorage.setItem('access_token', accessToken)
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
                ? 'Sign up to borrow and lend equipment with your neighbors.'
                : 'Sign in to manage your borrowed and lent items.'}
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {isRegister && (
              <div className="field-row">
                <label className="field">
                  <span>First name</span>
                  <input
                    type="text"
                    pattern="[A-Za-z\s'-]+"
                    value={form.firstName}
                    onChange={updateName('firstName')}
                    autoComplete="given-name"
                  />
                </label>

                <label className="field">
                  <span>Last name</span>
                  <input
                    type="text"
                    pattern="[A-Za-z\s'-]+"
                    value={form.lastName}
                    onChange={updateName('lastName')}
                    autoComplete="family-name"
                  />
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
                autoComplete="email"
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
                  autoComplete={isRegister ? 'new-password' : 'current-password'}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((currentValue) => !currentValue)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </label>

            {error && (
              <p className="server-error" role="alert">
                {error}
              </p>
            )}

            {success && (
              <p className="server-success" role="status">
                {success}
              </p>
            )}

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
