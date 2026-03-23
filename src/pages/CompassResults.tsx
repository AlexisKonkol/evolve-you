import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from '@/integrations/supabase/client';

const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;1,400&display=swap');
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes pulse { 0%,100% { opacity:0.2; transform:scale(0.8); } 50% { opacity:1; transform:scale(1.1); } }
  @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
`;

interface Results {
  direction: string;
  nextStep: string;
  environmentShift: string;
  reframe: string;
}

export default function CompassResults() {
  const navigate = useNavigate();
  const [results, setResults] = useState<Results | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(false);
  const [sparkAnswers, setSparkAnswers] = useState<string | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("compassAnswers");
    const sparkAnswersRaw = sessionStorage.getItem("sparkAnswers");
    if (!raw) { navigate("/compass"); return; }
    const answers = JSON.parse(raw);
    setSparkAnswers(sparkAnswersRaw);

    const call = async () => {
      try {
        console.log("Key check:", import.meta.env.VITE_ANTHROPIC_API_KEY?.slice(0,10));
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
            max_tokens: 1024,
            system: `You are NAVO — a grounded, honest personal navigation system. 
You speak like a trusted friend who sees clearly and tells the truth with warmth. 
Not a therapist. Not a life coach. Analyze what the user shared and return ONLY 
a valid JSON object with these 4 keys:
- direction: 2-3 honest sentences about where they actually are. Name the real pattern.
- nextStep: One specific action they can take in the next 24-48 hours. No vague advice.
- environmentShift: One specific change to their physical, digital, or social environment.
- reframe: 1-3 sentences reframing the story they're telling themselves. Warm but direct.
Return ONLY the JSON. No markdown. No backticks. No explanation.`,
            messages: [{ 
              role: "user", 
              content: `Here are the user's COMPASS session answers:
C - Clear the Noise: ${answers.step0_q1} / ${answers.step0_q2}
O - Offer Yourself Respect: ${answers.step1_q1} / ${answers.step1_q2}
M - Map What Matters: ${answers.step2_q1} / ${answers.step2_q2}
P - Pick Your Next Move: ${answers.step3_q1} / ${answers.step3_q2}
A - Adjust Your Environment: ${answers.step4_q1} / ${answers.step4_q2}
S - Stack Small Proofs: ${answers.step5_q1} / ${answers.step5_q2}
S - Stay With It: ${answers.step6_q1} / ${answers.step6_q2}

${results ? `And their COMPASS results: ${results}` : ""}

${sparkAnswers ? `\n\nWhat lights this person up (their Spark Profile):\n${sparkAnswers}` : ""}

Generate their Edge Profile now.`
            }]
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`API ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        const text = data.content[0].text;
        const cleanText = text.replace(/```json/gi, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(cleanText);
        setResults(parsed);

        // Update compass_complete status
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await (supabase as any)
            .from('profiles')
            .update({ compass_complete: true })
            .eq('id', user.id);
        }
      } catch (err: any) {
        console.error("API Error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    call();
  }, []);

  if (loading) return (
    <div style={{ minHeight:"100vh", background:"#0B0F1A", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:24, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      <style>{FONTS}</style>
      <div style={{ fontSize:64, animation:"spin 5s linear infinite" }}>🧭</div>
      <p style={{ fontFamily:"'Playfair Display',serif", fontStyle:"italic", fontWeight:400, fontSize:28, color:"rgba(255,255,255,0.5)", margin:0 }}>
        Finding your direction...
      </p>
      <div style={{ display:"flex", gap:8 }}>
        {[0,1,2].map(i => (
          <div key={i} style={{ width:8, height:8, borderRadius:"50%", background:"#6366F1", animation:`pulse 1.2s ease-in-out ${i*0.2}s infinite` }} />
        ))}
      </div>
    </div>
  );

  if (error) return (
    <div style={{ minHeight:"100vh", background:"#0B0F1A", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:16, fontFamily:"'Plus Jakarta Sans',sans-serif", padding:32 }}>
      <style>{FONTS}</style>
      <p style={{ color:"white", fontSize:18, margin:0 }}>Something went wrong.</p>
      <p style={{ color:"rgba(255,255,255,0.4)", fontSize:14, margin:0 }}>Check your API key in .env and try again.</p>
      <button onClick={() => navigate("/compass")} style={{ marginTop:8, background:"#6366F1", color:"white", border:"none", borderRadius:4, padding:"12px 28px", fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:12, fontWeight:600, letterSpacing:"0.14em", textTransform:"uppercase", cursor:"pointer" }}>
        Try Again
      </button>
    </div>
  );

  const handleSaveToJournal = async () => {
    try {
      // Check if user is logged in
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        // Store results in sessionStorage before redirecting
        sessionStorage.setItem("pendingCompassResults", JSON.stringify(results))
        navigate("/signup")
        return
      }
      
      // User is logged in - save to journal
      // TODO: Implement actual journal saving logic
      setSaved(true)
    } catch (error) {
      console.error('Error saving to journal:', error)
    }
  };

  const cards = [
    { label: "Your Direction Today", text: results!.direction, hero: true },
    { label: "Your Next Step", text: results!.nextStep, hero: false },
    { label: "Your Environment Shift", text: results!.environmentShift, hero: false },
    { label: "Your Reframe", text: results!.reframe, hero: false, reframe: true },
  ];

  return (
    <div style={{ minHeight:"100vh", background:"#0B0F1A", fontFamily:"'Plus Jakarta Sans',sans-serif", position:"relative" }}>
      <style>{FONTS}</style>

      {/* Orange glow */}
      <div style={{ position:"fixed", top:0, left:"50%", transform:"translateX(-50%)", width:"100%", height:400, background:"radial-gradient(ellipse 700px 350px at 50% -60px, rgba(99, 102, 241,0.14) 0%, transparent 70%)", pointerEvents:"none", zIndex:0 }} />

      <div style={{ maxWidth:640, margin:"0 auto", padding:"52px 32px 80px", position:"relative", zIndex:1 }}>

        {/* Header */}
        <div style={{ textAlign:"center", marginBottom:48 }}>
          <div style={{ display:"inline-block", fontSize:10, fontWeight:600, letterSpacing:"0.24em", textTransform:"uppercase", color:"#6366F1", border:"1px solid rgba(99, 102, 241,0.35)", borderRadius:999, padding:"6px 16px", marginBottom:20 }}>
            Your Compass Direction
          </div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:38, fontWeight:400, color:"white", letterSpacing:"-0.02em", lineHeight:1.1, margin:"0 0 10px" }}>
            Here's what we see.
          </h1>
          <p style={{ fontSize:13, color:"rgba(255,255,255,0.35)", margin:0, lineHeight:1.6 }}>
            Based on everything you shared today.
          </p>
        </div>

        {/* Cards */}
        {cards.map((card, i) => (
          <div key={i} style={{
            background: card.reframe ? "rgba(99, 102, 241,0.08)" : "rgba(255,255,255,0.04)",
            border: card.reframe ? "1px solid rgba(99, 102, 241,0.2)" : "1px solid rgba(255,255,255,0.07)",
            borderLeft: card.hero ? "3px solid #6366F1" : card.reframe ? "1px solid rgba(99, 102, 241,0.2)" : "1px solid rgba(255,255,255,0.07)",
            borderRadius:16, padding:28, marginBottom:16,
            animation:`fadeUp 0.5s ease ${i * 0.12}s both`,
          }}>
            <div style={{ marginBottom:14 }}>
              <span style={{ fontSize:10, fontWeight:600, letterSpacing:"0.2em", textTransform:"uppercase", color: card.hero || card.reframe ? "#6366F1" : "rgba(255,255,255,0.45)" }}>
                {card.label}
              </span>
            </div>
            <p style={{
              fontFamily: card.hero || card.reframe ? "'Playfair Display',serif" : "'Plus Jakarta Sans',sans-serif",
              fontStyle: card.reframe ? "italic" : "normal",
              fontSize: card.hero ? 18 : 15,
              fontWeight: 400,
              color: "white",
              lineHeight: 1.7,
              margin: 0,
            }}>
              {card.text}
            </p>
          </div>
        ))}

        {/* Buttons */}
        <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap", marginTop:32 }}>
          <button
            onClick={handleSaveToJournal}
            style={{ background: saved ? "rgba(99, 102, 241,0.3)" : "#6366F1", color:"white", border:"none", borderRadius:4, padding:"14px 32px", fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:11, fontWeight:600, letterSpacing:"0.16em", textTransform:"uppercase", cursor:"pointer", transition:"all 0.2s" }}>
            {saved ? "✓ Saved" : "Save to Journal"}
          </button>
          <button
            onClick={() => navigate("/compass")}
            style={{ background:"transparent", color:"rgba(255,255,255,0.5)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:4, padding:"14px 32px", fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:11, fontWeight:500, letterSpacing:"0.12em", textTransform:"uppercase", cursor:"pointer", transition:"all 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.color="white"}
            onMouseLeave={e => e.currentTarget.style.color="rgba(255,255,255,0.5)"}>
            Start New Session →
          </button>
        </div>

        {/* Edge Profile CTA */}
        <button
          onClick={() => navigate('/edge-profile')}
          style={{
            width: "100%",
            background: "transparent",
            border: "1px solid #6366F1",
            color: "#6366F1",
            borderRadius: "4px",
            padding: "16px",
            marginTop: "24px",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            cursor: "pointer",
            transition: "all 0.2s"
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "rgba(99, 102, 241,0.1)"
            e.currentTarget.style.transform = "translateY(-1px)"
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "transparent"
            e.currentTarget.style.transform = "translateY(0)"
          }}>
          Discover your navigation style →
        </button>

      </div>
    </div>
  );
}