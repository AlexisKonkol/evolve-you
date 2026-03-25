import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/integrations/supabase/client'
import { EdgeScoreWidget } from '@/components/EdgeScoreWidget'

export default function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(null)
  const [userName, setUserName] = useState('')
  const [greeting, setGreeting] = useState('')
  const [loading, setLoading] = useState(true)
  const [sparkAnswers, setSparkAnswers] = useState<any>(null)
  const [sparkComplete, setSparkComplete] = useState(false)
  const [compassComplete, setCompassComplete] = useState(false)

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

          // Load Spark Profile answers
          const sparkData = sessionStorage.getItem('sparkAnswers')
          if (sparkData) {
            setSparkAnswers(JSON.parse(sparkData))
          }

          // Check spark_complete and compass_complete status
          const { data: profile } = await (supabase as any)
            .from('profiles')
            .select('spark_complete, compass_complete')
            .eq('id', user.id)
            .single()
          
          if (profile?.spark_complete) {
            setSparkComplete(true)
          }
          
          if (profile?.compass_complete) {
            setCompassComplete(true)
          }
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground font-sans tracking-wide">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background font-sans pb-20 selection:bg-indigo-500/20">
      {/* Top Bar */}
      <div className="flex justify-between items-center px-8 py-6">
        <div className="font-display text-2xl text-foreground font-normal tracking-tight">
          Good {greeting}, {userName}
        </div>
        <button
          onClick={handleSignOut}
          className="bg-transparent border-none text-muted-foreground font-sans text-sm cursor-pointer px-4 py-2 rounded transition-colors duration-200 hover:text-foreground"
        >
          Sign out
        </button>
      </div>

      {/* Spark Profile Card */}
      {sparkAnswers && (
        <div className="max-w-2xl mx-auto mt-8 bg-orange-500/5 border border-orange-500/20 rounded-[20px] p-8 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-glow opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          <div className="text-[11px] font-semibold tracking-widest uppercase text-orange-400 mb-4 font-sans relative z-10">
            What lights you up
          </div>
          
          <h2 className="font-display text-[24px] text-foreground font-normal m-0 mb-4 tracking-[-0.02em] relative z-10">
            Your Spark Profile
          </h2>
          
          <div className="space-y-4 font-sans relative z-10">
            <div>
              <div className="text-[11px] font-semibold tracking-widest uppercase text-orange-400/70 mb-1">
                You lose track of time when
              </div>
              <div className="text-sm text-foreground/90 leading-[1.5]">
                {sparkAnswers.q1}
              </div>
            </div>
            
            <div>
              <div className="text-[11px] font-semibold tracking-widest uppercase text-orange-400/70 mb-1">
                You would do for free
              </div>
              <div className="text-sm text-foreground/90 leading-[1.5]">
                {sparkAnswers.q2}
              </div>
            </div>
            
            <div>
              <div className="text-[11px] font-semibold tracking-widest uppercase text-orange-400/70 mb-1">
                You're most proud of
              </div>
              <div className="text-sm text-foreground/90 leading-[1.5]">
                {sparkAnswers.q3}
              </div>
            </div>
            
            <div>
              <div className="text-[11px] font-semibold tracking-widest uppercase text-orange-400/70 mb-1">
                Impact you want to make
              </div>
              <div className="text-sm text-foreground/90 leading-[1.5]">
                {sparkAnswers.q4}
              </div>
            </div>
          </div>
          
          <button
            onClick={() => navigate('/spark-profile')}
            className="w-full mt-6 bg-transparent border border-orange-500/30 text-orange-400 rounded p-3 font-sans text-sm font-semibold cursor-pointer transition-all duration-300 hover:bg-orange-500/10 hover:border-orange-500/50 relative z-10"
          >
            Update Spark Profile →
          </button>
        </div>
      )}

      {/* Edge Score Widget */}
      <div className="max-w-2xl mx-auto mt-8">
        <EdgeScoreWidget />
      </div>

      {/* Hero Card */}
      <div className="max-w-2xl mx-auto mt-12 bg-indigo-500/5 border border-indigo-500/20 rounded-[20px] p-10 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-glow opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        
        {compassComplete ? (
          <>
            <div className="text-[11px] font-semibold tracking-widest uppercase text-green-400 mb-4 font-sans relative z-10">
              Your edge profile is ready.
            </div>
            
            <h1 className="font-display text-[32px] text-foreground font-normal m-0 mb-3 tracking-[-0.02em] relative z-10">
              Welcome back.
            </h1>
            
            <p className="text-sm text-foreground/60 leading-[1.6] m-0 mb-6 font-sans relative z-10">
              Your navigation style has been analyzed.
            </p>
            
            <div className="flex gap-3 relative z-10">
              <button
                onClick={() => navigate('/edge-profile')}
                className="flex-1 bg-gradient-primary text-primary-foreground border-none rounded p-4 font-sans text-sm font-semibold cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glow"
              >
                View Your Edge Profile →
              </button>
              <button
                onClick={() => navigate('/compass')}
                className="flex-1 bg-transparent border border-indigo-500/30 text-indigo-400 rounded p-4 font-sans text-sm font-semibold cursor-pointer transition-all duration-300 hover:bg-indigo-500/10 hover:border-indigo-500/50"
              >
                New COMPASS Session →
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="text-[11px] font-semibold tracking-widest uppercase text-indigo-400 mb-4 font-sans relative z-10">
              Your compass is ready.
            </div>
            
            <h1 className="font-display text-[32px] text-foreground font-normal m-0 mb-3 tracking-[-0.02em] relative z-10">
              What's your direction today?
            </h1>
            
            <p className="text-sm text-foreground/60 leading-[1.6] m-0 mb-8 font-sans relative z-10">
              Each session builds on the last. Your direction gets clearer every time.
            </p>
            
            <button
              onClick={() => navigate('/compass')}
              className="w-full bg-gradient-primary text-primary-foreground border-none rounded p-4 font-sans text-sm font-semibold cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glow relative z-10"
            >
              Start COMPASS Session →
            </button>
          </>
        )}
      </div>

      {/* Stats Cards */}
      <div className="max-w-2xl mx-auto mt-6 grid grid-cols-3 gap-4">
        {[
          { number: '0', label: 'Total Sessions' },
          { number: '0', label: 'Day Streak' },
          { number: 'Free', label: 'Current Plan' }
        ].map((stat, i) => (
          <div key={i} className="bg-surface-2/50 border border-border/50 rounded-2xl p-5 text-center transition-all duration-300 hover:bg-surface-2 hover:border-indigo-500/20 hover:shadow-soft">
            <div className="font-display text-[32px] text-foreground font-normal mb-2">
              {stat.number}
            </div>
            <div className="text-[11px] font-semibold tracking-widest uppercase text-muted-foreground font-sans">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Build Your Edge Section */}
      <div id="modules" className="max-w-2xl mx-auto mt-12">
        <div className="text-[11px] font-semibold tracking-widest uppercase text-orange-400 mb-4 font-sans">
          Build Your Edge
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { moduleId: "mindset", title: "Mindset", description: "Watch the loop before you change it" },
            { moduleId: "confidence", title: "Confidence Builder", description: "Build a file of real evidence" },
            { moduleId: "communication", title: "Communication Skills", description: "Stop hinting and start saying it" },
            { moduleId: "decisions", title: "Decision Making", description: "Learn your own decision traps" },
            { moduleId: "boundaries", title: "Boundary Setting", description: "Find what you keep giving away" },
            { moduleId: "self-advocacy", title: "Self-Advocacy", description: "Get honest about what you're actually good at" }
          ].map((module, i) => (
            <div 
              key={i}
              onClick={() => navigate(`/module/${module.moduleId}`)}
              className="bg-orange-500/5 border border-orange-500/20 rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:bg-orange-500/10 hover:border-orange-500/40 hover:shadow-soft group"
            >
              <h3 className="font-display text-[18px] text-foreground font-normal mb-2 tracking-[-0.02em] group-hover:text-orange-400 transition-colors">
                {module.title}
              </h3>
              <p className="text-sm text-foreground/70 leading-[1.5] font-sans">
                {module.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Your Edge Profile Card */}
      <div className="max-w-2xl mx-auto mt-8">
        <div 
          onClick={() => navigate('/edge-profile')}
          className="bg-orange-500/5 border border-orange-500/20 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:bg-orange-500/10 hover:border-orange-500/40 hover:shadow-soft flex items-center justify-between group"
        >
          <div>
            <h3 className="font-display text-[20px] text-foreground font-normal mb-2 tracking-[-0.02em] group-hover:text-orange-400 transition-colors">
              Your Edge Profile
            </h3>
            <p className="text-sm text-foreground/70 leading-[1.5] font-sans">
              See your full edge profile →
            </p>
          </div>
          <div className="text-orange-400 group-hover:text-orange-300 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Your Spark Profile Card */}
      <div className="max-w-2xl mx-auto mt-6">
        {sparkComplete ? (
          <div className="bg-green-500/5 border border-green-500/20 rounded-2xl p-6 flex items-center justify-between">
            <div>
              <h3 className="font-display text-[20px] text-foreground font-normal mb-2 tracking-[-0.02em]">
                Spark Profile Complete ✓
              </h3>
              <p className="text-sm text-foreground/70 leading-[1.5] font-sans">
                You've discovered what lights you up
              </p>
            </div>
            <div className="text-green-400">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        ) : (
          <div 
            onClick={() => navigate('/spark-profile')}
            className="bg-orange-500/5 border border-orange-500/20 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:bg-orange-500/10 hover:border-orange-500/40 hover:shadow-soft flex items-center justify-between group"
          >
            <div>
              <h3 className="font-display text-[20px] text-foreground font-normal mb-2 tracking-[-0.02em] group-hover:text-orange-400 transition-colors">
                Your Spark Profile
              </h3>
              <p className="text-sm text-foreground/70 leading-[1.5] font-sans">
                Discover what lights you up →
              </p>
            </div>
            <div className="text-orange-400 group-hover:text-orange-300 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-xl border-t border-border py-4">
        <div className="flex justify-center items-center gap-12">
          {[
            { icon: '🧭', label: 'Compass', route: compassComplete ? '/edge-profile' : '/compass', active: false },
            { icon: '🏠', label: 'Home', route: '/dashboard', active: true },
            { icon: '🔪', label: 'Edge', route: '/edge-profile', active: false },
            { icon: '📚', label: 'Modules', route: '#modules', active: false, scroll: true },
            { icon: '📓', label: 'Journal', route: '/journal', active: false }
          ].map((item, i) => (
            <button
              key={i}
              onClick={() => {
                if (item.scroll) {
                  document.getElementById('modules')?.scrollIntoView({ behavior: 'smooth' });
                } else {
                  navigate(item.route);
                }
              }}
              className="flex flex-col items-center gap-1.5 bg-transparent border-none cursor-pointer group"
            >
              <div className="text-[20px] filter drop-shadow hover:-translate-y-0.5 transition-transform duration-300 ease-out">{item.icon}</div>
              <div className={`text-[10px] font-sans transition-colors duration-300 ${item.active ? 'text-indigo-400 font-medium' : 'text-muted-foreground font-normal group-hover:text-foreground/80'}`}>
                {item.label}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
