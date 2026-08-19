import { useState } from 'react'
import ToolsPanel from '../components/ToolsPanel.jsx'
import './AuthPage.css'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const emptyForm = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
}

function validate(mode, form) {
  const errors = {}

  if (mode === 'register') {
    if (!form.firstName.trim()) errors.firstName = 'First name is required'
    if (!form.lastName.trim()) errors.lastName = 'Last name is required'
  }

  if (!form.email.trim()) {
    errors.email = 'Email is required'
  } else if (!EMAIL_PATTERN.test(form.email.trim())) {
    errors.email = 'Enter a valid email address'
  }

  if (!form.password) {
    errors.password = 'Password is required'
  } else if (mode === 'register' && form.password.length < 8) {
    errors.password = 'Password must be at least 8 characters'
  }

  return errors
}

function AuthPage() {
  const [mode, setMode] = useState('register')
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState('')

  const isRegister = mode === 'register'

  function handleChange(field) {
    return (event) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }))
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  function switchMode(nextMode) {
    setMode(nextMode)
    setForm(emptyForm)
    setErrors({})
    setServerError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setServerError('')

    const validationErrors = validate(mode, form)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login'
    const payload = isRegister
      ? {
          first_name: form.firstName.trim(),
          last_name: form.lastName.trim(),
          email: form.email.trim(),
          password: form.password,
        }
      : {
          email: form.email.trim(),
          password: form.password,
        }

    setSubmitting(true)
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        setServerError(data.message || 'Something went wrong. Please try again.')
        return
      }

      if (data.token) {
        localStorage.setItem('authToken', data.token)
      }
      // TODO: redirect into the app once routing/dashboard exists
    } catch {
      setServerError('Unable to reach the server. Please try again shortly.')
    } finally {
      setSubmitting(false)
    }
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

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {isRegister && (
              <div className="field-row">
                <label className="field">
                  <span>First name</span>
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={handleChange('firstName')}
                    autoComplete="given-name"
                  />
                  {errors.firstName && <em>{errors.firstName}</em>}
                </label>
                <label className="field">
                  <span>Last name</span>
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={handleChange('lastName')}
                    autoComplete="family-name"
                  />
                  {errors.lastName && <em>{errors.lastName}</em>}
                </label>
              </div>
            )}

            <label className="field">
              <span>Email</span>
              <input
                type="email"
                value={form.email}
                onChange={handleChange('email')}
                placeholder="you@example.com"
                autoComplete="email"
              />
              {errors.email && <em>{errors.email}</em>}
            </label>

            <label className="field">
              <span>Password</span>
              <div className="password-input">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange('password')}
                  placeholder="••••••••"
                  autoComplete={isRegister ? 'new-password' : 'current-password'}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && <em>{errors.password}</em>}
            </label>

            {serverError && <p className="server-error">{serverError}</p>}

            <button type="submit" className="submit-button" disabled={submitting}>
              {submitting ? 'Please wait…' : isRegister ? 'Create account' : 'Sign in'}
            </button>
          </form>

          <p className="switch-mode">
            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button type="button" onClick={() => switchMode(isRegister ? 'login' : 'register')}>
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
