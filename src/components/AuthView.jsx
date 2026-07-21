import { useEffect, useState } from 'react'
import { isSupabaseConfigured, signInWithEmail, signOutFromSupabase, signUpWithEmail, supabase } from '../lib/supabase'

export default function AuthView({ onAuthenticated }) {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (!supabase) return

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user)
        onAuthenticated(session.user)
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [onAuthenticated])

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setError('')

    const action = mode === 'login' ? signInWithEmail(email, password) : signUpWithEmail(email, password, name)
    const { data, error: authError } = await action

    if (authError) {
      setError(authError.message)
    } else if (data?.user) {
      setUser(data.user)
      onAuthenticated(data.user)
    }

    setLoading(false)
  }

  async function handleSignOut() {
    setLoading(true)
    await signOutFromSupabase()
    setLoading(false)
  }

  return <div className="login-page">
    <section className="login-intro">
      <div>
        <div className="login-brand">
          <span className="brand-mark">R</span>
          <span>RecipeBook</span>
        </div>
        <h1>Keep your recipes in sync across devices.</h1>
        <p>Sign in to save recipes securely with Supabase and share them across your accounts.</p>
      </div>
      <small>Supabase auth + PostgreSQL storage</small>
    </section>

    <section className="login-panel">
      <form className="login-card" onSubmit={handleSubmit}>
        <div>
          <h2>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2>
          <p>{mode === 'login' ? 'Use your email and password to continue.' : 'Start storing recipes in your own account.'}</p>
        </div>

        {mode === 'signup' && <label>
          <span>Name</span>
          <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Alex" />
        </label>}

        <label>
          <span>Email</span>
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required />
        </label>

        <label>
          <span>Password</span>
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" required minLength="6" />
        </label>

        {error && <p className="login-error">{error}</p>}

        {!isSupabaseConfigured && <div className="local-mode-note">
          <strong>Supabase is not configured yet.</strong>
          <span>Add your Supabase URL and anon key to the Vite environment before signing in.</span>
        </div>}

        <button className="login-submit" type="submit" disabled={loading}>
          {loading ? 'Working…' : mode === 'login' ? 'Sign in' : 'Create account'}
        </button>

        <button type="button" className="secondary-button" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
          {mode === 'login' ? 'Need an account?' : 'Already have an account?'}
        </button>

        {user && <div className="account-card">
          <div>
            <div className="avatar">{user.email?.[0]?.toUpperCase() || 'U'}</div>
            <span>
              <strong>{user.email}</strong>
              <small>Signed in with Supabase</small>
            </span>
          </div>
          <button type="button" onClick={handleSignOut}>Sign out</button>
        </div>}
      </form>
    </section>
  </div>
}
