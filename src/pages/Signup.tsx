import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Signup() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name
          }
        }
      })

      if (error) throw error

      navigate('/onboarding')
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#0A0A0A', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      position: 'relative'
    }}>
      {/* Orange glow */}
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        left: '50%', 
        transform: 'translateX(-50%)', 
        width: '100%', 
        height: 350, 
        background: 'radial-gradient(ellipse 600px 300px at 50% -60px, rgba(255,107,43,0.12) 0%, transparent 70%)', 
        pointerEvents: 'none', 
        zIndex: 0 
      }} />

      <div style={{ 
        maxWidth: '420px', 
        width: '100%', 
        padding: '32px',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Logo */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: 48,
          fontFamily: "'Playfair Display', serif"
        }}>
          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: 400, 
            color: 'white',
            margin: 0,
            letterSpacing: '-0.02em'
          }}>
            NAV<span style={{ color: '#FF6B2B' }}>O</span>
          </h1>
        </div>

        {/* Headline */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h2 style={{ 
            fontFamily: "'Playfair Display', serif", 
            fontSize: '36px', 
            fontWeight: 400, 
            color: 'white',
            margin: '0 0 8px',
            letterSpacing: '-0.02em'
          }}>
            Let's get started.
          </h2>
          <p style={{ 
            fontSize: '14px', 
            color: 'rgba(255,255,255,0.35)', 
            margin: 0,
            lineHeight: 1.5
          }}>
            Find your direction.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Name */}
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '11px', 
              fontWeight: 600, 
              letterSpacing: '0.16em', 
              textTransform: 'uppercase', 
              color: 'white', 
              marginBottom: 14 
            }}>
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
              style={{
                width: '100%',
                display: 'block',
                background: 'transparent',
                border: 'none',
                borderBottom: '1px solid rgba(255,255,255,0.2)',
                padding: '8px 0 14px',
                color: '#F5ECD7',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '14px',
                fontWeight: 400,
                lineHeight: 1.7,
                boxSizing: 'border-box',
                caretColor: '#FF6B2B',
                transition: 'border-color 0.3s'
              }}
              onFocus={(e) => { e.currentTarget.style.borderBottomColor = '#FF6B2B' }}
              onBlur={(e) => { e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.2)' }}
            />
          </div>

          {/* Email */}
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '11px', 
              fontWeight: 600, 
              letterSpacing: '0.16em', 
              textTransform: 'uppercase', 
              color: 'white', 
              marginBottom: 14 
            }}>
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
                borderBottom: '1px solid rgba(255,255,255,0.2)',
                padding: '8px 0 14px',
                color: '#F5ECD7',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '14px',
                fontWeight: 400,
                lineHeight: 1.7,
                boxSizing: 'border-box',
                caretColor: '#FF6B2B',
                transition: 'border-color 0.3s'
              }}
              onFocus={(e) => { e.currentTarget.style.borderBottomColor = '#FF6B2B' }}
              onBlur={(e) => { e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.2)' }}
            />
          </div>

          {/* Password */}
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '11px', 
              fontWeight: 600, 
              letterSpacing: '0.16em', 
              textTransform: 'uppercase', 
              color: 'white', 
              marginBottom: 14 
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              style={{
                width: '100%',
                display: 'block',
                background: 'transparent',
                border: 'none',
                borderBottom: '1px solid rgba(255,255,255,0.2)',
                padding: '8px 0 14px',
                color: '#F5ECD7',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '14px',
                fontWeight: 400,
                lineHeight: 1.7,
                boxSizing: 'border-box',
                caretColor: '#FF6B2B',
                transition: 'border-color 0.3s'
              }}
              onFocus={(e) => { e.currentTarget.style.borderBottomColor = '#FF6B2B' }}
              onBlur={(e) => { e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.2)' }}
            />
          </div>

          {/* Error */}
          {error && (
            <div style={{ 
              padding: '12px 16px', 
              background: 'rgba(255,107,43,0.1)', 
              border: '1px solid rgba(255,107,43,0.3)', 
              borderRadius: 4, 
              fontSize: '13px', 
              color: '#FF6B2B' 
            }}>
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: loading ? 'rgba(255,107,43,0.5)' : '#FF6B2B',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              padding: '14px 24px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(255,107,43,0.3)'; } }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            {loading ? 'Creating account...' : 'Create Account →'}
          </button>
        </form>

        {/* Link to login */}
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <Link
            to="/login"
            style={{
              fontSize: '14px',
              color: 'rgba(255,255,255,0.4)',
              textDecoration: 'none',
              fontWeight: 400
            }}
            onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
            onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
          >
            Already have an account? Sign in →
          </Link>
        </div>
      </div>
    </div>
  )
}
