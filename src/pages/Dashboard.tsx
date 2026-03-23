import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/integrations/supabase/client'

export default function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(null)
  const [userName, setUserName] = useState('')
  const [greeting, setGreeting] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        
        if (error) throw error
        
        if (user) {
          setUser(user)
          setUserName(user.user_metadata?.name || 'there')
          
          const hour = new Date().getHours()
          if (hour < 12) setGreeting('morning')
          else if (hour < 17) setGreeting('afternoon')
          else setGreeting('evening')
        }
      } catch (error) {
        console.error('Error getting user:', error)
      } finally {
        setLoading(false)
      }
    }

    getUser()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'white', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Loading...</div>
      </div>
    )
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#0A0A0A', 
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      paddingBottom: '80px'
    }}>
      {/* Top Bar */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '24px 32px'
      }}>
        <div style={{ 
          fontFamily: "'Playfair Display', serif", 
          fontSize: '24px', 
          color: 'white',
          fontWeight: 400
        }}>
          Good {greeting}, {userName}
        </div>
        <button
          onClick={handleSignOut}
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255,255,255,0.3)',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '14px',
            cursor: 'pointer',
            padding: '8px 16px',
            borderRadius: '4px',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}
        >
          Sign out
        </button>
      </div>

      {/* Hero Card */}
      <div style={{
        maxWidth: '640px',
        margin: '48px auto 0',
        background: 'rgba(255,107,43,0.06)',
        border: '1px solid rgba(255,107,43,0.25)',
        borderRadius: '20px',
        padding: '40px'
      }}>
        <div style={{
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: '#FF6B2B',
          marginBottom: '16px',
          fontFamily: "'Plus Jakarta Sans', sans-serif"
        }}>
          Your compass is ready.
        </div>
        
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '32px',
          color: 'white',
          fontWeight: 400,
          margin: '0 0 12px',
          letterSpacing: '-0.02em'
        }}>
          What's your direction today?
        </h1>
        
        <p style={{
          fontSize: '14px',
          color: 'rgba(255,255,255,0.4)',
          lineHeight: 1.6,
          margin: '0 0 32px',
          fontFamily: "'Plus Jakarta Sans', sans-serif"
        }}>
          Each session builds on the last. Your direction gets clearer every time.
        </p>
        
        <button
          onClick={() => navigate('/compass')}
          style={{
            width: '100%',
            background: '#FF6B2B',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '16px',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(255,107,43,0.3)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          Enter Compass Mode →
        </button>
      </div>

      {/* Stats Cards */}
      <div style={{
        maxWidth: '640px',
        margin: '24px auto 0',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '16px'
      }}>
        {[
          { number: '0', label: 'Total Sessions' },
          { number: '0', label: 'Day Streak' },
          { number: 'Free', label: 'Current Plan' }
        ].map((stat, i) => (
          <div key={i} style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '16px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <div style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '32px',
              color: 'white',
              fontWeight: 400,
              marginBottom: '8px'
            }}>
              {stat.number}
            </div>
            <div style={{
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.35)',
              fontFamily: "'Plus Jakarta Sans', sans-serif"
            }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Nav */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: '#0A0A0A',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '16px 0'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '48px'
        }}>
          {[
            { icon: '🧭', label: 'Compass', route: '/compass', active: false },
            { icon: '🏠', label: 'Home', route: '/dashboard', active: true },
            { icon: '📓', label: 'Journal', route: '/journal', active: false }
          ].map((item, i) => (
            <button
              key={i}
              onClick={() => navigate(item.route)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ fontSize: '20px' }}>{item.icon}</div>
              <div style={{
                fontSize: '10px',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                color: item.active ? '#FF6B2B' : 'rgba(255,255,255,0.25)',
                fontWeight: item.active ? 600 : 400
              }}>
                {item.label}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
