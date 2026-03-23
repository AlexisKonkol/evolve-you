import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;1,400&display=swap');
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes pulse { 0%,100% { opacity:0.2; transform:scale(0.8); } 50% { opacity:1; transform:scale(1.1); } }
  @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
`;

const MODULE_DESCRIPTIONS: Record<string, string> = {
  "Confidence Builder": "Build belief through evidence, not affirmations",
  "Communication Skills": "Say what you mean. Be heard the way you intend",
  "Decision Making": "Stop second-guessing. Start trusting your judgment",
  "Boundary Setting": "Protect your energy. Say no without guilt",
  "Self-Advocacy": "Speak up for yourself. Own your value",
};

interface EdgeProfileData {
  navigationStyle: string;
  styleDescription: string;
  navoSees: string;
  strengths: string[];
  skillsToBuild: string[];
  directions: { title: string; description: string }[];
  recommendedModules: string[];
}

export default function EdgeProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<EdgeProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [saved, setSaved] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const answers = sessionStorage.getItem("compassAnswers");
    const results = sessionStorage.getItem("compassResults");
    if (!answers) { navigate("/compass"); return; }

    const generate = async () => {
      try {
        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01",
            "anthropic-dangerous-direct-browser-access": "true",
          },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1500,
            system: `You are NAVO. Based on the user's COMPASS session answers, identify their navigation style and generate their Edge Profile.

Navigation styles — pick the ONE that fits best:
- True North: person who already knows their direction deep down, just needs permission to follow it
- Uncharted: person starting completely over with a blank map, something just ended
- Crossroads: person pulled in too many directions at once, capable of many things but unclear which is theirs
- Fogbound: person moving forward but can't see clearly yet, navigating on instinct
- Fixed Star: person who has lost their anchor or north star, knows who they are but lost what they're oriented around

Return ONLY a valid JSON object with these exact keys:
{
  "navigationStyle": "True North" | "Uncharted" | "Crossroads" | "Fogbound" | "Fixed Star",
  "styleDescription": "one sentence describing what this means for them specifically — personal not generic",
  "navoSees": "2-3 sentences written in second person like a trusted friend who sees clearly. Name their real pattern. Say what they actually need to hear. Warm but direct.",
  "strengths": ["strength 1", "strength 2", "strength 3", "strength 4"],
  "skillsToBuild": ["skill 1", "skill 2", "skill 3"],
  "directions": [
    { "title": "direction 1 — short, specific", "description": "1-2 sentences why it fits them based on what they shared" },
    { "title": "direction 2 — short, specific", "description": "1-2 sentences why it fits them based on what they shared" },
    { "title": "direction 3 — short, specific", "description": "1-2 sentences why it fits them based on what they shared" }
  ],
  "recommendedModules": ["Module 1", "Module 2", "Module 3"]
}

For recommendedModules only pick from: Confidence Builder, Communication Skills, Decision Making, Boundary Setting, Self-Advocacy

Return ONLY the JSON. No markdown. No backticks. No explanation.`,
            messages: [{
              role: "user",
              content: `Here are the user's COMPASS session answers:
${answers}

${results ? `And their COMPASS results: ${results}` : ""}

Generate their Edge Profile now.`
            }]
          })
        });

        const data = await res.json();
        const text = data.content[0].text;
        const parsed = JSON.parse(text);
        setProfile(parsed);
        sessionStorage.setItem("edgeProfile", JSON.stringify(parsed));
        setTimeout(() => setVisible(true), 100);
      } catch (e) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    generate();
  }, []);

  const handleSave = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { navigate("/signup"); return; }
    setSaved(true);
  };

  if (loading) return (
    <div style={{ minHeight:"100vh", background:"#0A0A0A", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:24, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      <style>{FONTS}</style>
      <div style={{ fontSize:64, animation:"spin 5s linear infinite" }}>🧭</div>
      <p style={{ fontFamily:"'Playfair Display',serif", fontStyle:"italic", fontWeight:400, fontSize:24, color:"rgba(255,255,255,0.5)", margin:0 }}>
        Building your edge profile...
      </p>
      <div style={{ display:"flex", gap:8 }}>
        {[0,1,2].map(i => (
          <div key={i} style={{ width:8, height:8, borderRadius:"50%", background:"#FF6B2B", animation:`pulse 1.2s ease-in-out ${i*0.2}s infinite` }} />
        ))}
      </div>
    </div>
  );

  if (error || !profile) return (
    <div style={{ minHeight:"100vh", background:"#0A0A0A", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:16, fontFamily:"'Plus Jakarta Sans',sans-serif", padding:32 }}>
      <style>{FONTS}</style>
      <p style={{ color:"white", fontSize:18, margin:0 }}>Something went wrong.</p>
      <button onClick={() => navigate("/compass")} style={{ background:"#FF6B2B", color:"white", border:"none", borderRadius:4, padding:"12px 28px", fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:11, fontWeight:600, letterSpacing:"0.14em", textTransform:"uppercase", cursor:"pointer" }}>
        Try Again
      </button>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:"#0A0A0A", fontFamily:"'Plus Jakarta Sans',sans-serif", position:"relative" }}>
      <style>{FONTS}</style>

      {/* Glow */}
      <div style={{ position:"fixed", top:0, left:"50%", transform:"translateX(-50%)", width:"100%", height:400, background:"radial-gradient(ellipse 700px 350px at 50% -60px, rgba(255,107,43,0.13) 0%, transparent 70%)", pointerEvents:"none", zIndex:0 }} />

      <div style={{ maxWidth:640, margin:"0 auto", padding:"52px 32px 80px", position:"relative", zIndex:1, opacity: visible ? 1 : 0, transition:"opacity 0.4s ease" }}>

        {/* Header */}
        <div style={{ textAlign:"center", marginBottom:40 }}>
          <div style={{ display:"inline-block", fontSize:10, fontWeight:600, letterSpacing:"0.24em", textTransform:"uppercase", color:"#FF6B2B", border:"1px solid rgba(255,107,43,0.35)", borderRadius:999, padding:"6px 16px", marginBottom:20 }}>
            Your Edge Profile
          </div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(32px,5vw,44px)", fontWeight:400, color:"white", letterSpacing:"-0.02em", lineHeight:1.1, margin:"0 0 12px" }}>
            You are <span style={{ color:"#FF6B2B", fontStyle:"italic" }}>{profile.navigationStyle}.</span>
          </h1>
          <p style={{ fontSize:14, color:"rgba(255,255,255,0.4)", margin:0, lineHeight:1.7, maxWidth:480, marginLeft:"auto", marginRight:"auto" }}>
            {profile.styleDescription}
          </p>
        </div>

        {/* NAVO Sees */}
        <div style={{ background:"rgba(255,107,43,0.06)", border:"1px solid rgba(255,107,43,0.2)", borderRadius:16, padding:24, marginBottom:16, animation:"fadeUp 0.5s ease 0.1s both" }}>
          <div style={{ fontSize:10, fontWeight:600, letterSpacing:"0.2em", textTransform:"uppercase", color:"#FF6B2B", marginBottom:12 }}>
            What NAVO sees in you
          </div>
          <p style={{ fontFamily:"'Playfair Display',serif", fontSize:16, fontWeight:400, color:"white", lineHeight:1.75, margin:0, fontStyle:"italic" }}>
            "{profile.navoSees}"
          </p>
        </div>

        {/* Strengths + Skills */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16, animation:"fadeUp 0.5s ease 0.2s both" }}>
          <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, padding:20 }}>
            <div style={{ fontSize:10, fontWeight:600, letterSpacing:"0.18em", textTransform:"uppercase", color:"rgba(255,255,255,0.3)", marginBottom:14 }}>
              Strengths you already have
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {profile.strengths.map((s, i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:6, height:6, borderRadius:"50%", background:"#FF6B2B", flexShrink:0 }} />
                  <span style={{ fontSize:13, color:"white", lineHeight:1.5 }}>{s}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, padding:20 }}>
            <div style={{ fontSize:10, fontWeight:600, letterSpacing:"0.18em", textTransform:"uppercase", color:"rgba(255,255,255,0.3)", marginBottom:14 }}>
              Skills to build next
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {profile.skillsToBuild.map((s, i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:6, height:6, borderRadius:"50%", background:"rgba(255,107,43,0.4)", flexShrink:0 }} />
                  <span style={{ fontSize:13, color:"rgba(255,255,255,0.7)", lineHeight:1.5 }}>{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Directions */}
        <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, padding:24, marginBottom:16, animation:"fadeUp 0.5s ease 0.3s both" }}>
          <div style={{ fontSize:10, fontWeight:600, letterSpacing:"0.18em", textTransform:"uppercase", color:"rgba(255,255,255,0.3)", marginBottom:16 }}>
            3 directions worth exploring
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {profile.directions.map((d, i) => (
              <div key={i} style={{ padding:"14px 16px", background:"rgba(255,255,255,0.03)", borderRadius:12, borderLeft:`3px solid ${i === 0 ? "#FF6B2B" : "rgba(255,107,43,0.3)"}` }}>
                <div style={{ fontSize:13, fontWeight:600, color:"white", marginBottom:4 }}>{d.title}</div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", lineHeight:1.6 }}>{d.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Modules */}
        <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, padding:24, marginBottom:28, animation:"fadeUp 0.5s ease 0.4s both" }}>
          <div style={{ fontSize:10, fontWeight:600, letterSpacing:"0.18em", textTransform:"uppercase", color:"rgba(255,255,255,0.3)", marginBottom:16 }}>
            Your recommended edge modules
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {profile.recommendedModules.map((mod, i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 16px", background: i === 0 ? "rgba(255,107,43,0.06)" : "rgba(255,255,255,0.03)", border: i === 0 ? "1px solid rgba(255,107,43,0.2)" : "1px solid rgba(255,255,255,0.07)", borderRadius:12 }}>
                <div>
                  <div style={{ fontSize:13, fontWeight:600, color:"white", marginBottom:2 }}>{mod}</div>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,0.35)" }}>{MODULE_DESCRIPTIONS[mod] || ""}</div>
                </div>
                <button style={{ background: i === 0 ? "#FF6B2B" : "transparent", color: i === 0 ? "white" : "rgba(255,255,255,0.4)", border: i === 0 ? "none" : "1px solid rgba(255,255,255,0.15)", borderRadius:4, padding:"8px 16px", fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:10, fontWeight:600, letterSpacing:"0.14em", textTransform:"uppercase", cursor:"pointer", whiteSpace:"nowrap" }}
                  onClick={() => {
                    const moduleMap: Record<string, string> = {
                      "Confidence Builder": "confidence",
                      "Communication Skills": "communication", 
                      "Decision Making": "decisions",
                      "Boundary Setting": "boundaries",
                      "Self-Advocacy": "advocacy"
                    };
                    const moduleId = moduleMap[mod];
                    if (moduleId) navigate(`/module/${moduleId}`);
                  }}>
                  {i === 0 ? "Start →" : "Unlock"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display:"flex", gap:12, animation:"fadeUp 0.5s ease 0.5s both" }}>
          <button onClick={() => navigate("/compass")} style={{ flex:1, background:"#FF6B2B", color:"white", border:"none", borderRadius:4, padding:"15px", fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:11, fontWeight:600, letterSpacing:"0.16em", textTransform:"uppercase", cursor:"pointer", transition:"all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.opacity="0.9"; e.currentTarget.style.transform="translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.opacity="1"; e.currentTarget.style.transform="translateY(0)"; }}>
            Start {profile.recommendedModules[0]} →
          </button>
          <button onClick={handleSave} style={{ background:"transparent", color: saved ? "#FF6B2B" : "rgba(255,255,255,0.35)", border: saved ? "1px solid rgba(255,107,43,0.4)" : "1px solid rgba(255,255,255,0.12)", borderRadius:4, padding:"15px 24px", fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:11, fontWeight:500, letterSpacing:"0.1em", textTransform:"uppercase", cursor:"pointer", transition:"all 0.2s", whiteSpace:"nowrap" }}>
            {saved ? "✓ Saved" : "Save Profile"}
          </button>
        </div>

      </div>
    </div>
  );
}
