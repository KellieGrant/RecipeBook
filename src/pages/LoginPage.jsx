import { useState } from 'react'

export default function LoginPage({ onLogin }) {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  async function submit(event) {
    event.preventDefault()
    setError('')
    setMessage('')
    if (!email.includes('@')) return setError('Enter a valid email address.')
    if (password.length < 6) return setError('Use at least 6 characters for your password.')
    setLoading(true)
    try {
      await onLogin({ email, password, name, mode })
      setMessage(mode === 'signup' ? 'Account created. You can sign in now.' : 'Signed in successfully.')
    }
    catch (authError) {
      setError(authError?.message || 'Unable to sign in. Please try again.')
    }
    finally { setLoading(false) }
  }

  return <main className="login-page">
    <section className="login-intro">
      <div className="login-brand"><span className="brand-mark">▤</span> RecipeBook</div>
      <div><span className="eyebrow">Your kitchen, organized</span><h1>Every recipe you love, in one calm place.</h1><p>Save family favorites, organize weeknight dinners, and keep your collection with you wherever you cook.</p></div>
      <small>Private by default · Ready for secure cloud sync</small>
    </section>
    <section className="login-panel"><form className="login-card" onSubmit={submit}>
      <div><span className="eyebrow">Welcome back</span><h2>{mode === 'signup' ? 'Create your RecipeBook account' : 'Sign in to RecipeBook'}</h2><p>Your recipes are organized by account.</p></div>
      <label>Name <span>optional</span><input value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" placeholder="Kellie" /></label>
      <label>Email<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" placeholder="you@example.com" /></label>
      <label>Password<input required type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" placeholder="At least 6 characters" /></label>
      {error && <p className="login-error" role="alert">{error}</p>}
      {message && <p className="login-error" style={{ color: '#2f7d4f' }}>{message}</p>}
      <button className="login-submit" disabled={loading}>{loading ? (mode === 'signup' ? 'Creating account…' : 'Signing in…') : (mode === 'signup' ? 'Create account' : 'Sign in')}</button>
      <button type="button" className="secondary-button" onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); setMessage('') }}>
        {mode === 'login' ? 'Need an account?' : 'Already have an account?'}
      </button>
      <p className="local-mode-note"><strong>Supabase auth</strong>Your account is now created and managed through Supabase. If email confirmation is enabled, you may need to confirm your email before signing in.</p>
    </form></section>
  </main>
}
