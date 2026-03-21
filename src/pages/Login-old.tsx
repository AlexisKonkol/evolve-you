import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600&family=Playfair+Display:wght@400;500&display=swap');
  input::placeholder { color: rgba(255,255,255,0.2); font-style: italic; }
  input:focus { outline: none; }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes pulse { 0%,100% { opacity:0.2; transform:scale(0.8); } 50% { opacity:1; transform:scale(1.1); } }
`

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      navigate('/dashboard')
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{FONTS}</style>

      {/* Orange glow */}
      <div style={{ position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', height: 350, background: 'radial-gradient(ellipse 700px 300px at 50% -40px, rgba(255,107,43,0.15) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      {/* Content */}
      <div style={{ maxWidth: 400, width: '100%', padding: '32px', position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🧭</div>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 32, fontWeight: 400, color: 'white', letterSpacing: '-0.02em', margin: '0 0 8px' }}>
            Welcome Back
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.38)', margin: 0 }}>
            Sign in to continue your journey with NAVO
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {/* Email */}
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'white', marginBottom: 14 }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              style={{
                width: '100%',
                display: 'block',
                background: 'transparent',
                border: 'none',
                borderBottom: '1.5px solid rgba(255,255,255,0.1)',
                padding: '8px 0 14px',
                color: '#F5ECD7',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 15,
                fontWeight: 400,
                lineHeight: 1.7,
                boxSizing: 'border-box',
                caretColor: '#FF6B2B',
                transition: 'border-color 0.3s'
              }}
              onFocus={(e) => { e.currentTarget.style.borderBottomColor = '#FF6B2B' }}
              onBlur={(e) => { e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.1)' }}
            />
          </div>

          {/* Password */}
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'white', marginBottom: 14 }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: '100%',
                display: 'block',
                background: 'transparent',
                border: 'none',
                borderBottom: '1.5px solid rgba(255,255,255,0.1)',
                padding: '8px 0 14px',
                color: '#F5ECD7',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 15,
                fontWeight: 400,
                lineHeight: 1.7,
                boxSizing: 'border-box',
                caretColor: '#FF6B2B',
                transition: 'border-color 0.3s'
              }}
              onFocus={(e) => { e.currentTarget.style.borderBottomColor = '#FF6B2B' }}
              onBlur={(e) => { e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.1)' }}
            />
          </div>

          {/* Error */}
          {error && (
            <div style={{ padding: '12px 16px', background: 'rgba(255,107,43,0.1)', border: '1px solid rgba(255,107,43,0.3)', borderRadius: 4, fontSize: 13, color: '#FF6B2B' }}>
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? 'rgba(255,107,43,0.15)' : '#FF6B2B',
              color: loading ? 'rgba(255,107,43,0.3)' : 'white',
              border: 'none',
              borderRadius: 4,
              padding: '14px 34px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(255,107,43,0.3)'; } }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Link to signup */}
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)', margin: 0 }}>
            Don't have an account?{' '}
            <Link
              to="/signup"
              style={{
                color: '#FF6B2B',
                textDecoration: 'none',
                fontWeight: 500
              }}
              onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
              onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Footer */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '12px 32px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0A0A0A', zIndex: 10 }}>
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.1)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>NAVO</span>
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.1)' }}>Sign In</span>
      </div>
    </div>
  )
}
