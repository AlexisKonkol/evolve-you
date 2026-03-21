import { useState } from "react";
import { useNavigate } from "react-router-dom";

const steps = [
  {
    letter: "C", name: "Curate Your Inputs",
    subtitle: "Filter the noise. You are the DJ of your own consciousness.",
    q1: "What's draining your energy right now?", q1p: "The thing that's costing you the most...",
    q2: "What would you cut out if you were being honest?", q2p: "You already know the answer.",
  },
  {
    letter: "O", name: "Own Your Narrative",
    subtitle: "You aren't displaced — you're transitioning. You write the story.",
    q1: "What's the story you keep telling about why you're stuck?", q1p: "The narrative you keep replaying...",
    q2: "What if that story wasn't true?", q2p: "Sit with that for a second.",
  },
  {
    letter: "M", name: "Meaning Over Metrics",
    subtitle: "Build your life on core values, not someone else's scorecard.",
    q1: "What metrics have you been using to measure your worth or success?", q1p: "Title, salary, followers, approval...",
    q2: "What actually means something to you — beneath all of that?", q2p: "Strip away the scorecard. What's left?",
  },
  {
    letter: "P", name: "Pivot With Purpose",
    subtitle: "Every transition is a door, not a wall. Move with intention.",
    q1: "What pivot are you being called to make right now?", q1p: "The move you've been avoiding or considering...",
    q2: "What would this pivot look like if it was done with full intention?", q2p: "Not reactive. Purposeful.",
  },
  {
    letter: "A", name: "Amplify Your Atmosphere",
    subtitle: "Shift your physical and digital space to support your growth.",
    q1: "What in your current environment is working against who you're becoming?", q1p: "Spaces, apps, people, habits...",
    q2: "What one change to your environment would create the most momentum?", q2p: "Small shifts create big changes.",
  },
  {
    letter: "S", name: "Savor Small Wins",
    subtitle: "Turn progress into a sensory reward. Feel every step forward.",
    q1: "What small wins have happened recently that you dismissed or forgot to celebrate?", q1p: "Even the tiny ones count — especially those.",
    q2: "What does forward movement feel like in your body when you notice it?", q2p: "Not a thought. A feeling.",
  },
  {
    letter: "S", name: "Sustain the Spark",
    subtitle: "Protect your energy. Keep the fire lit for the long game.",
    q1: "What has been quietly draining your spark lately?", q1p: "The slow leaks you haven't addressed...",
    q2: "What one thing — if you protected it fiercely — would keep you going?", q2p: "Your non-negotiable.",
  },
];

const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600&family=Playfair+Display:wght@400;500&display=swap');
  textarea::placeholder { color: rgba(255,255,255,0.2); font-style: italic; }
  textarea:focus { outline: none; }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes pulse { 0%,100% { opacity:0.2; transform:scale(0.8); } 50% { opacity:1; transform:scale(1.1); } }
`;

export default function Compass() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(true);

  const step = steps[current];
  const q1Key = `step${current}_q1`;
  const q2Key = `step${current}_q2`;
  const canContinue = answers[q1Key]?.trim() && answers[q2Key]?.trim();

  const handleContinue = () => {
    if (!canContinue) return;
    if (current === steps.length - 1) {
      setLoading(true);
      setTimeout(() => {
        sessionStorage.setItem("compassAnswers", JSON.stringify(answers));
        navigate("/compass/results");
      }, 3000);
      return;
    }
    setVisible(false);
    setTimeout(() => { setCurrent(c => c + 1); setVisible(true); }, 220);
  };

  const handleBack = () => {
    if (current === 0) return;
    setVisible(false);
    setTimeout(() => { setCurrent(c => c - 1); setVisible(true); }, 220);
  };

  if (loading) return (
    <div style={{ minHeight:"100vh", background:"#0A0A0A", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:24, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      <style>{FONTS}</style>
      <div style={{ fontSize:64, animation:"spin 5s linear infinite" }}>🧭</div>
      <p style={{ fontFamily:"'Playfair Display',serif", fontStyle:"italic", fontWeight:400, fontSize:28, color:"rgba(255,255,255,0.5)", margin:0 }}>Finding your direction...</p>
      <div style={{ display:"flex", gap:8 }}>
        {[0,1,2].map(i => <div key={i} style={{ width:8, height:8, borderRadius:"50%", background:"#FF6B2B", animation:`pulse 1.2s ease-in-out ${i*0.2}s infinite` }} />)}
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:"#0A0A0A", position:"relative", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      <style>{FONTS}</style>

      {/* Orange glow */}
      <div style={{ position:"fixed", top:0, left:"50%", transform:"translateX(-50%)", width:"100%", height:350, background:"radial-gradient(ellipse 700px 300px at 50% -40px, rgba(255,107,43,0.15) 0%, transparent 70%)", pointerEvents:"none", zIndex:0 }} />

      {/* Back */}
      {current > 0 && (
        <button onClick={handleBack} style={{ position:"fixed", top:24, left:28, zIndex:10, background:"none", border:"none", cursor:"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:12, color:"rgba(255,255,255,0.28)", letterSpacing:"0.08em" }}
          onMouseEnter={e => e.currentTarget.style.color="rgba(255,255,255,0.6)"}
          onMouseLeave={e => e.currentTarget.style.color="rgba(255,255,255,0.28)"}>
          ← back
        </button>
      )}

      {/* Progress */}
      <div style={{ position:"fixed", top:0, left:0, right:0, zIndex:10, display:"flex", alignItems:"center", justifyContent:"center", padding:"20px 0", gap:0 }}>
        {steps.map((s, i) => (
          <div key={i} style={{ display:"flex", alignItems:"center" }}>
            <div style={{ width:30, height:30, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:600, fontFamily:"'Plus Jakarta Sans',sans-serif", transition:"all 0.3s",
              background: i < current ? "#FF6B2B" : i === current ? "transparent" : "rgba(255,255,255,0.06)",
              border: i === current ? "1.5px solid #FF6B2B" : "1.5px solid transparent",
              color: i < current ? "white" : i === current ? "#FF6B2B" : "rgba(255,255,255,0.2)",
              boxShadow: i === current ? "0 0 0 4px rgba(255,107,43,0.18)" : "none",
            }}>
              {i < current ? "✓" : s.letter}
            </div>
            {i < steps.length - 1 && <div style={{ width:18, height:1, background: i < current ? "rgba(255,107,43,0.3)" : "rgba(255,255,255,0.07)", transition:"background 0.3s" }} />}
          </div>
        ))}
        <span style={{ position:"absolute", right:28, fontSize:11, color:"rgba(255,255,255,0.18)" }}>{current + 1} / 7</span>
      </div>

      {/* Content */}
      <div style={{ maxWidth:560, margin:"0 auto", minHeight:"100vh", display:"flex", flexDirection:"column", justifyContent:"center", padding:"100px 32px 100px", position:"relative", zIndex:1,
        opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(-10px)", transition:"opacity 0.25s ease, transform 0.25s ease" }}>

        {/* Badge */}
        <div style={{ marginBottom:22 }}>
          <span style={{ display:"inline-block", fontSize:10, fontWeight:600, letterSpacing:"0.24em", textTransform:"uppercase", color:"#FF6B2B", border:"1px solid rgba(255,107,43,0.35)", borderRadius:999, padding:"6px 16px" }}>
            {step.letter} — {step.name.toUpperCase()}
          </span>
        </div>

        {/* Headline */}
        <h1 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"clamp(34px,5vw,44px)", fontWeight:400, color:"white", letterSpacing:"-0.02em", lineHeight:1.08, margin:"0 0 10px" }}>
          {step.name}
        </h1>

        {/* Subtitle */}
        <p style={{ fontSize:13, fontWeight:400, color:"rgba(255,255,255,0.38)", margin:"0 0 44px", lineHeight:1.6 }}>
          {step.subtitle}
        </p>

        {/* Questions */}
        {[{ label: step.q1, placeholder: step.q1p, key: q1Key }, { label: step.q2, placeholder: step.q2p, key: q2Key }].map((q, i) => (
          <div key={i} style={{ marginBottom: i === 0 ? 36 : 44 }}>
            <label style={{ display:"block", fontSize:11, fontWeight:600, letterSpacing:"0.16em", textTransform:"uppercase", color:"white", marginBottom:14 }}>
              {q.label}
            </label>
            <textarea
              value={answers[q.key] || ""}
              onChange={e => setAnswers(a => ({ ...a, [q.key]: e.target.value }))}
              placeholder={q.placeholder}
              rows={3}
              style={{ width:"100%", display:"block", background:"transparent", border:"none", borderBottom:`1.5px solid ${answers[q.key]?.trim() ? "rgba(255,107,43,0.55)" : "rgba(255,255,255,0.1)"}`, padding:"8px 0 14px", color:"#F5ECD7", fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:15, fontWeight:400, lineHeight:1.7, resize:"none", boxSizing:"border-box", caretColor:"#FF6B2B", transition:"border-color 0.3s" }}
              onFocus={e => { e.currentTarget.style.borderBottomColor = "#FF6B2B"; }}
              onBlur={e => { e.currentTarget.style.borderBottomColor = answers[q.key]?.trim() ? "rgba(255,107,43,0.55)" : "rgba(255,255,255,0.1)"; }}
            />
          </div>
        ))}

        {/* Footer */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontSize:11, color:"rgba(255,255,255,0.18)" }}>
            {canContinue ? "Ready to continue" : "Answer both to continue"}
          </span>
          <button onClick={handleContinue} disabled={!canContinue}
            style={{ background: canContinue ? "#FF6B2B" : "rgba(255,107,43,0.15)", color: canContinue ? "white" : "rgba(255,107,43,0.3)", border:"none", borderRadius:4, padding:"14px 34px", fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:11, fontWeight:600, letterSpacing:"0.16em", textTransform:"uppercase", cursor: canContinue ? "pointer" : "not-allowed", transition:"all 0.2s" }}
            onMouseEnter={e => { if (canContinue) { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 8px 24px rgba(255,107,43,0.3)"; }}}
            onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="none"; }}>
            {current === steps.length - 1 ? "Find My Direction →" : "Continue →"}
          </button>
        </div>
      </div>

      {/* Footer bar */}
      <div style={{ position:"fixed", bottom:0, left:0, right:0, padding:"12px 32px", borderTop:"1px solid rgba(255,255,255,0.05)", display:"flex", justifyContent:"space-between", alignItems:"center", background:"#0A0A0A", zIndex:10 }}>
        <span style={{ fontSize:10, color:"rgba(255,255,255,0.1)", letterSpacing:"0.14em", textTransform:"uppercase" }}>NAVO</span>
        <div style={{ display:"flex", gap:5 }}>
          {steps.map((_, i) => <div key={i} style={{ width:6, height:6, borderRadius:"50%", background: i === current ? "#FF6B2B" : "rgba(255,255,255,0.1)", transition:"background 0.3s" }} />)}
        </div>
        <span style={{ fontSize:10, color:"rgba(255,255,255,0.1)" }}>Compass Mode</span>
      </div>
    </div>
  );
}