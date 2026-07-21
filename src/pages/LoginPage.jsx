import { useState } from 'react'

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function submit(event) {
    event.preventDefault()
    setError('')
    if (!email.includes('@')) return setError('Enter a valid email address.')
    if (password.length < 6) return setError('Use at least 6 characters for your password.')
    setLoading(true)
    try { await onLogin({ email, password, name }) }
    catch { setError('Unable to sign in. Please try again.') }
    finally { setLoading(false) }
  }

  return <main className="login-page">
    <section className="login-intro">
      <div className="login-brand"><span className="brand-mark">▤</span> RecipeBook</div>
      <div><span className="eyebrow">Your kitchen, organized</span><h1>Every recipe you love, in one calm place.</h1><p>Save family favorites, organize weeknight dinners, and keep your collection with you wherever you cook.</p></div>
      <small>Private by default · Ready for secure cloud sync</small>
    </section>
    <section className="login-panel"><form className="login-card" onSubmit={submit}>
      <div><span className="eyebrow">Welcome back</span><h2>Sign in to RecipeBook</h2><p>Your recipes are organized by account.</p></div>
      <label>Name <span>optional</span><input value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" placeholder="Kellie" /></label>
      <label>Email<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" placeholder="you@example.com" /></label>
      <label>Password<input required type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" placeholder="At least 6 characters" /></label>
      {error && <p className="login-error" role="alert">{error}</p>}
      <button className="login-submit" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</button>
      <p className="local-mode-note"><strong>Local preview mode</strong>Your password is not stored or sent anywhere yet. When Supabase is connected, this form will use secure Supabase Auth.</p>
    </form></section>
  </main>
}
