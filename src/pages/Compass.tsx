import { useState } from "react";
import { useNavigate } from "react-router-dom";

const steps = [
  { letter:"C", name:"Curate Your Inputs",
    subtitle:"Filter the noise. You are the DJ of your own consciousness.",
    q1:"What's draining your energy right now?", q1p:"The thing that's costing you the most...",
    q2:"What would you cut out if you were being honest?", q2p:"You already know the answer." },
  { letter:"O", name:"Own Your Narrative",
    subtitle:"You aren't displaced — you're transitioning. You write the story.",
    q1:"What's the story you keep telling about why you're stuck?", q1p:"The narrative you keep replaying...",
    q2:"What if that story wasn't true?", q2p:"Sit with that for a second." },
  { letter:"M", name:"Meaning Over Metrics",
    subtitle:"Build your life on core values, not someone else's scorecard.",
    q1:"What have you been measuring yourself by?", q1p:"Title, salary, followers, approval...",
    q2:"What actually matters to you — underneath all that?", q2p:"Strip away the scorecard. What's left?" },
  { letter:"P", name:"Pivot With Purpose",
    subtitle:"Every transition is a door, not a wall. Move with intention.",
    q1:"What do you know you need to change?", q1p:"The move you've been avoiding or considering...",
    q2:"What would that change look like if you did it on your terms?", q2p:"Not reactive. Purposeful." },
  { letter:"A", name:"Amplify Your Atmosphere",
    subtitle:"Shift your physical and digital space to support your growth.",
    q1:"What in your environment is holding you back?", q1p:"Spaces, apps, people, habits...",
    q2:"What one change would move the needle most?", q2p:"Small shifts create big changes." },
  { letter:"S", name:"Savor Small Wins",
    subtitle:"Turn progress into a sensory reward. Feel every step forward.",
    q1:"What have you accomplished recently that you dismissed?", q1p:"Even the tiny ones count — especially those.",
    q2:"What does it feel like when things are going right?", q2p:"Not a thought. A feeling." },
  { letter:"S", name:"Sustain the Spark",
    subtitle:"Protect your energy. Keep the fire lit for the long game.",
    q1:"What's been quietly draining you?", q1p:"The slow leaks you haven't addressed...",
    q2:"What's the one thing you need to protect right now?", q2p:"Your non-negotiable." },
];

export default function Compass() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(true);

  const step = steps[current];
  const q1Key = `step${current}_q1`;
  const q2Key = `step${current}_q2`;
  const canContinue = !!(answers[q1Key]?.trim() && answers[q2Key]?.trim());

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
    <div className="min-h-screen bg-[#0B0F1A] flex flex-col items-center justify-center gap-6 font-sans">
      <style>{`@keyframes custom-pulse { 0%,100% { opacity:0.2; transform:scale(0.8); } 50% { opacity:1; transform:scale(1.1); } }`}</style>
      <div className="text-[64px] animate-[spin_5s_linear_infinite]">🧭</div>
      <p className="font-display italic font-normal text-[28px] text-white/50 m-0">Finding your direction...</p>
      <div className="flex gap-2">
        {[0,1,2].map(i => <div key={i} className="w-2 h-2 rounded-full bg-[#6366F1]" style={{ animation: `custom-pulse 1.2s ease-in-out ${i * 0.2}s infinite` }} />)}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0B0F1A] relative font-sans">
      {/* Orange glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-[350px] pointer-events-none z-0" style={{ background:"radial-gradient(ellipse 700px 300px at 50% -40px, rgba(99, 102, 241,0.15) 0%, transparent 70%)" }} />

      {/* Back */}
      {current > 0 && (
        <button onClick={handleBack} className="fixed top-6 left-7 z-10 bg-transparent border-none cursor-pointer font-sans text-xs text-white/30 tracking-[0.08em] hover:text-white/60 transition-colors duration-200">
          ← back
        </button>
      )}

      {/* Progress */}
      <div className="fixed top-0 left-0 right-0 z-10 flex items-center justify-center py-5 gap-0">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center">
            <div className={`w-[30px] h-[30px] rounded-full flex items-center justify-center text-[11px] font-semibold font-sans transition-all duration-300 border-[1.5px] ${
              i < current ? 'bg-[#6366F1] border-[#6366F1] text-white' : 
              i === current ? 'bg-transparent border-[#6366F1] text-[#6366F1] ring-4 ring-[#6366F1]/20' : 
              'bg-white/5 border-transparent text-white/20'
            }`}>
              {i < current ? "✓" : s.letter}
            </div>
            {i < steps.length - 1 && <div className={`w-[18px] h-px transition-colors duration-300 ${i < current ? 'bg-[#6366F1]/30' : 'bg-white/5'}`} />}
          </div>
        ))}
        <span className="absolute right-7 text-[11px] text-white/20">{current + 1} / 7</span>
      </div>

      {/* Content */}
      <div className={`max-w-[560px] mx-auto min-h-screen flex flex-col justify-center px-8 py-[100px] relative z-10 transition-all duration-250 ease-in-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2.5'}`}>

        {/* Badge */}
        <div className="mb-5">
          <span className="inline-block text-[10px] font-semibold tracking-[0.24em] uppercase text-[#6366F1] border border-[#6366F1]/35 rounded-full px-4 py-1.5">
            {step.letter} — {step.name.toUpperCase()}
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-display text-[clamp(34px,5vw,44px)] font-normal text-white tracking-[-0.02em] leading-[1.08] m-0 mb-2.5">
          {step.name}
        </h1>

        {/* Subtitle */}
        <p className="text-[13px] font-normal text-white/40 m-0 mb-11 leading-[1.6]">
          {step.subtitle}
        </p>

        {/* Questions */}
        {[{ label: step.q1, placeholder: step.q1p, key: q1Key }, { label: step.q2, placeholder: step.q2p, key: q2Key }].map((q, i) => (
          <div key={i} className={i === 0 ? "mb-9" : "mb-11"}>
            <label className="block text-[11px] font-semibold tracking-[0.16em] uppercase text-white mb-3.5">
              {q.label}
            </label>
            <textarea
              value={answers[q.key] || ""}
              onChange={e => setAnswers(a => ({ ...a, [q.key]: e.target.value }))}
              placeholder={q.placeholder}
              rows={3}
              className={`w-full block bg-transparent border-0 border-b-[1.5px] ${answers[q.key]?.trim() ? 'border-[#6366F1]/55' : 'border-white/10'} pt-2 pb-3.5 text-[#F5ECD7] font-sans text-[15px] font-normal leading-[1.7] resize-none caret-[#6366F1] transition-colors duration-300 placeholder:text-white/20 placeholder:italic focus:outline-none focus:border-b-[#6366F1]`}
            />
          </div>
        ))}

        {/* Footer */}
        <div className="flex justify-between items-center">
           <span className="text-[11px] text-white/20 flex items-center">
            {canContinue ? "Ready to continue" : "Answer both to continue"}
          </span>
          <button 
            onClick={handleContinue} 
            disabled={!canContinue}
            className={`rounded px-8 py-3.5 font-sans text-[11px] font-semibold tracking-[0.16em] uppercase transition-all duration-200 border-none ${
              canContinue 
                ? 'bg-[#6366F1] text-white cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(99, 102, 241,0.3)]' 
                : 'bg-[#6366F1]/15 text-[#6366F1]/30 cursor-not-allowed'
            }`}
          >
            {current === steps.length - 1 ? "Find My Direction →" : "Continue →"}
          </button>
        </div>
      </div>

      {/* Footer bar */}
      <div className="fixed bottom-0 left-0 right-0 px-8 py-3 border-t border-white/5 flex justify-between items-center bg-[#0B0F1A] z-10">
        <span className="text-[10px] text-white/10 tracking-[0.14em] uppercase">NAVO</span>
        <div className="flex gap-[5px]">
          {steps.map((_, i) => <div key={i} className={`w-[6px] h-[6px] rounded-full transition-colors duration-300 ${i === current ? 'bg-[#6366F1]' : 'bg-white/10'}`} />)}
        </div>
        <span className="text-[10px] text-white/10">Compass Mode</span>
      </div>
    </div>
  );
}