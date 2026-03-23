import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/integrations/supabase/client'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        navigate('/login')
        return
      }

      setLoading(false)
    }

    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate('/login')
      } else {
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [navigate])

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: '#0B0F1A', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        gap: 24, 
        fontFamily: "'Plus Jakarta Sans', sans-serif" 
      }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600&family=Playfair+Display:wght@400;500&display=swap');
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @keyframes pulse { 0%,100% { opacity:0.2; transform:scale(0.8); } 50% { opacity:1; transform:scale(1.1); } }
        `}</style>
        <div style={{ fontSize: 64, animation: 'spin 5s linear infinite' }}>🧭</div>
        <p style={{ 
          fontFamily: "'Playfair Display', serif", 
          fontStyle: 'italic', 
          fontWeight: 400, 
          fontSize: 28, 
          color: 'rgba(255,255,255,0.5)', 
          margin: 0 
        }}>
          Loading...
        </p>
        <div style={{ display: 'flex', gap: 8 }}>
          {[0, 1, 2].map(i => (
            <div 
              key={i} 
              style={{ 
                width: 8, 
                height: 8, 
                borderRadius: '50%', 
                background: '#6366F1', 
                animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` 
              }} 
            />
          ))}
        </div>
      </div>
    )
  }

  return <>{children}</>
}
