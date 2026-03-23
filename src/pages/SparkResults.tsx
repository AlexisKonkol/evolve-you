import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from '@/integrations/supabase/client';

const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;1,400&display=swap');
  @keyframes pulse { 0%,100% { opacity:0.2; transform:scale(0.8); } 50% { opacity:1; transform:scale(1.1); } }
`;

interface SparkResult {
  purposeStatement: string;
  mirrorMoment: string;
  directions: Array<{
    title: string;
    why: string;
    fit: "High" | "Medium";
  }>;
  thrives: string;
  energisedBy: string;
  impact: string;
}

export default function SparkResults() {
  const navigate = useNavigate();
  const [sparkResult, setSparkResult] = useState<SparkResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateSparkResult = async () => {
      try {
        console.log("Key check:", import.meta.env.VITE_ANTHROPIC_API_KEY?.slice(0,10));
        
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate('/signup');
          return;
        }

        const { data: spark } = await (supabase as any)
          .from('spark_profiles')
          .select('*')
          .eq('user_id', user.id)
          .order('completed_at', { ascending: false })
          .limit(1)
          .single();

        if (!spark) {
          navigate('/spark-profile');
          return;
        }

        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01",
            "anthropic-dangerous-direct-browser-access": "true"
          },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1000,
            system: `You are NAVO — a deeply perceptive life direction coach. Based on someone's Spark Profile answers, generate their personal Spark result.

Return ONLY valid JSON, no markdown, no backticks, no explanation — just the raw JSON object:
{
  "purposeStatement": "One powerful sentence. Who they are and what they are built for. Max 25 words. Make it feel like you read their soul. First person — start with 'I' or 'You'.",
  "mirrorMoment": "2-3 sentences that describe this person so accurately it feels almost uncomfortable. Reference their specific answers directly. This is the paragraph people screenshot and share.",
  "directions": [
    {
      "title": "Direction name 3-5 words",
      "why": "One sentence — why this fits THEM specifically, referencing their answers.",
      "fit": "High"
    },
    {
      "title": "Direction name 3-5 words",
      "why": "One sentence referencing their answers.",
      "fit": "High"
    },
    {
      "title": "Direction name 3-5 words",
      "why": "One sentence referencing their answers.",
      "fit": "Medium"
    }
  ],
  "thrives": "The environment where they do their best work — 6 words max",
  "energisedBy": "What gives them energy — 6 words max",
  "impact": "The impact they want to leave — 6 words max"
}`,
            messages: [{
              role: "user",
              content: `What lights me up: ${spark?.q1 || 'not answered'}
What I would do for free: ${spark?.q2 || 'not answered'}
My proudest moment: ${spark?.q3 || 'not answered'}
The impact I want to have: ${spark?.q4 || 'not answered'}
My best environment: ${spark?.q5 || 'not answered'}
A life that feels right looks like: ${spark?.q6 || 'not answered'}`
            }]
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`API ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        const text = data.content[0].text;
        const clean = text.replace(/```json|```/g, '').trim();
        const result = JSON.parse(clean);
        setSparkResult(result);
        setLoading(false);
        
      } catch (err: any) {
        console.error('SparkResults error:', err);
        setError(err?.message || JSON.stringify(err));
        setLoading(false);
      }
    };

    generateSparkResult();
  }, [navigate]);

  if (loading) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        background: "#0A0A0A", 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        justifyContent: "center", 
        gap: 24, 
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        position: "relative"
      }}>
        <style>{FONTS}</style>
        
        {/* Radial glow */}
        <div style={{ 
          position: "absolute", 
          top: 0, 
          left: "50%", 
          transform: "translateX(-50%)", 
          width: "100%", 
          height: 400, 
          background: "radial-gradient(circle, rgba(245,197,66,0.08) 0%, transparent 70%)", 
          pointerEvents: "none" 
        }} />
        
        {/* Gold compass icon */}
        <div style={{ 
          fontSize: 40, 
          color: "#F5C542", 
          position: "relative", 
          zIndex: 1 
        }}>
          🧭
        </div>
        
        <p style={{ 
          fontFamily: "'Playfair Display', serif", 
          fontStyle: "italic", 
          fontWeight: 400, 
          fontSize: 20, 
          color: "white", 
          margin: 0,
          position: "relative",
          zIndex: 1
        }}>
          Finding your spark...
        </p>
        
        <div style={{ display: "flex", gap: 8, position: "relative", zIndex: 1 }}>
          {[0, 1, 2].map(i => (
            <div 
              key={i} 
              style={{ 
                width: 8, 
                height: 8, 
                borderRadius: "50%", 
                background: "#F5C542", 
                animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` 
              }} 
            />
          ))}
        </div>
      </div>
    );
  }

  if (error || !sparkResult) {
    return (
      <div style={{ minHeight: "100vh", background: "#0A0A0A", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, fontFamily: "'Plus Jakarta Sans', sans-serif", padding: 32 }}>
        <style>{FONTS}</style>
        <p style={{ color: "white", fontSize: 18, margin: 0, textAlign: "center" }}>
          {error ? `Error: ${error}` : "Something went wrong generating your spark result."}
        </p>
        {error && (
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, margin: 0, textAlign: "center", maxWidth: 400 }}>
            Check the console for more details.
          </p>
        )}
        <button 
          onClick={() => window.location.reload()} 
          style={{ 
            background: "#F5C542", 
            color: "#0A0A0A", 
            border: "none", 
            borderRadius: 4, 
            padding: "12px 28px", 
            fontFamily: "'Plus Jakarta Sans', sans-serif", 
            fontSize: 11, 
            fontWeight: 600, 
            letterSpacing: "0.14em", 
            textTransform: "uppercase", 
            cursor: "pointer" 
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  const handleShare = async () => {
    const text = `${sparkResult.purposeStatement}\n\n${sparkResult.mirrorMoment}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Spark Result - NAVO",
          text: text,
          url: window.location.href
        });
      } catch (err) {
        navigator.clipboard.writeText(text);
      }
    } else {
      navigator.clipboard.writeText(text);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0A", fontFamily: "'Plus Jakarta Sans', sans-serif", position: "relative" }}>
      <style>{FONTS}</style>

      {/* Gold radial glow behind content */}
      <div style={{ 
        position: "fixed", 
        top: 0, 
        left: "50%", 
        transform: "translateX(-50%)", 
        width: "100%", 
        height: 400, 
        background: "radial-gradient(circle at 50% 0%, rgba(245,197,66,0.06) 0%, transparent 60%)", 
        pointerEvents: "none", 
        zIndex: 0 
      }} />

      <div style={{ maxWidth: 580, margin: "0 auto", padding: "40px 32px", position: "relative", zIndex: 1 }}>

        {/* Badge pill */}
        <div style={{ 
          display: "inline-block", 
          fontSize: 10, 
          fontWeight: 600, 
          letterSpacing: "0.24em", 
          textTransform: "uppercase", 
          color: "#F5C542", 
          background: "rgba(245,197,66,0.1)", 
          border: "1px solid rgba(245,197,66,0.25)", 
          borderRadius: 999, 
          padding: "6px 16px", 
          marginBottom: 16 
        }}>
          Your Spark
        </div>

        {/* SECTION 1 — PURPOSE */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ 
            fontSize: 12, 
            fontWeight: 600, 
            letterSpacing: "0.2em", 
            textTransform: "uppercase", 
            color: "rgba(255, 255, 255, 0.3)", 
            marginBottom: 12 
          }}>
            your purpose
          </div>
          
          <p style={{ 
            fontFamily: "'Playfair Display', serif", 
            fontStyle: "italic", 
            fontSize: 24, 
            fontWeight: 400, 
            color: "white", 
            lineHeight: 1.6, 
            textAlign: "center", 
            maxWidth: 460, 
            margin: "0 auto 40px" 
          }}>
            {sparkResult.purposeStatement}
          </p>
        </div>

        {/* SECTION 2 — MIRROR MOMENT */}
        <div style={{ 
          background: "rgba(245,197,66,0.05)", 
          border: "1px solid rgba(245,197,66,0.2)", 
          borderRadius: 16, 
          padding: 28, 
          marginBottom: 24 
        }}>
          <div style={{ marginBottom: 12 }}>
            <span style={{ 
              fontSize: 9, 
              fontWeight: 600, 
              letterSpacing: "0.2em", 
              textTransform: "uppercase", 
              color: "rgba(245,197,66,0.7)" 
            }}>
              NAVO SEES YOU
            </span>
          </div>
          
          <p style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: "italic",
            fontSize: 16,
            fontWeight: 400,
            color: "white",
            lineHeight: 1.85,
            margin: 0,
          }}>
            {sparkResult.mirrorMoment}
          </p>

          <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={handleShare}
              style={{
                background: "transparent",
                border: "none",
                color: "#F5C542",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 12,
                fontWeight: 500,
                cursor: "pointer",
                padding: "4px 8px",
                borderRadius: 4,
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(245, 197, 66, 0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              Share this →
            </button>
          </div>
        </div>

        {/* Directions */}
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ 
            fontFamily: "'Plus Jakarta Sans', sans-serif", 
            fontSize: 16, 
            fontWeight: 600, 
            color: "white", 
            margin: "0 0 16px" 
          }}>
            Directions worth exploring
          </h3>
          
          {sparkResult.directions.map((direction, i) => (
            <div 
              key={i} 
              style={{ 
                background: direction.fit === "High" ? "rgba(245,197,66,0.08)" : "rgba(255,255,255,0.04)", 
                border: direction.fit === "High" ? "1px solid rgba(245,197,66,0.2)" : "1px solid rgba(255,255,255,0.1)", 
                borderRadius: 12, 
                padding: 16, 
                marginBottom: 12 
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <h4 style={{ 
                  fontFamily: "'Plus Jakarta Sans', sans-serif", 
                  fontSize: 14, 
                  fontWeight: 600, 
                  color: direction.fit === "High" ? "#F5C542" : "white", 
                  margin: 0 
                }}>
                  {direction.title}
                </h4>
                <span style={{ 
                  fontSize: 9, 
                  fontWeight: 600, 
                  letterSpacing: "0.1em", 
                  textTransform: "uppercase", 
                  background: direction.fit === "High" ? "rgba(245,197,66,0.15)" : "rgba(255,255,255,0.1)",
                  color: direction.fit === "High" ? "#F5C542" : "rgba(255,255,255,0.6)",
                  borderRadius: 999, 
                  padding: "2px 8px" 
                }}>
                  {direction.fit}
                </span>
              </div>
              <p style={{ 
                fontFamily: "'Plus Jakarta Sans', sans-serif", 
                fontSize: 13, 
                color: "rgba(255,255,255,0.7)", 
                lineHeight: 1.5, 
                margin: 0 
              }}>
                {direction.why}
              </p>
            </div>
          ))}
        </div>

        {/* Energy Profile */}
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ 
            fontFamily: "'Plus Jakarta Sans', sans-serif", 
            fontSize: 14, 
            fontWeight: 600, 
            color: "rgba(255,255,255,0.6)", 
            margin: "0 0 12px" 
          }}>
            Your energy profile
          </h3>
          
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ 
              background: "rgba(255,255,255,0.03)", 
              borderRadius: 8, 
              padding: 12, 
              flex: 1 
            }}>
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>
                Thrives in
              </div>
              <p style={{ fontSize: 12, color: "white", margin: 0 }}>
                {sparkResult.thrives}
              </p>
            </div>
            
            <div style={{ 
              background: "rgba(255,255,255,0.03)", 
              borderRadius: 8, 
              padding: 12, 
              flex: 1 
            }}>
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>
                Energised by
              </div>
              <p style={{ fontSize: 12, color: "white", margin: 0 }}>
                {sparkResult.energisedBy}
              </p>
            </div>
            
            <div style={{ 
              background: "rgba(255,255,255,0.03)", 
              borderRadius: 8, 
              padding: 12, 
              flex: 1 
            }}>
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>
                Impact
              </div>
              <p style={{ fontSize: 12, color: "white", margin: 0 }}>
                {sparkResult.impact}
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center" }}>
          <button
            onClick={() => navigate('/compass')}
            style={{
              background: "#F5C542",
              color: "#0A0A0A",
              border: "none",
              borderRadius: 4,
              padding: "14px 28px",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "all 0.2s",
              marginBottom: 12
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(245, 197, 66, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            Start COMPASS Session →
          </button>

          <div style={{ 
            fontSize: 11, 
            color: "rgba(255,255,255,0.3)", 
            textAlign: "center", 
            marginTop: 8 
          }}>
            Your spark is private. Only NAVO sees it.
          </div>
        </div>

      </div>
    </div>
  );
}
