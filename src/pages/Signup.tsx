import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from '@/integrations/supabase/client'

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
  setError("");
  setLoading(true);
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } }
    });
    
    if (error?.message?.includes("Email not confirmed")) {
      navigate("/onboarding");
      return;
    }
    
    if (error) throw error;
    
    // If we get a session back, user is auto-confirmed — navigate immediately
    if (data?.session) {
      navigate("/onboarding");
      return;
    }
    
    // If no session, sign in manually
    const { data: signInData, error: signInError } = 
      await supabase.auth.signInWithPassword({ email, password });
    
    if (signInError?.message?.includes("Email not confirmed")) {
      // User created but needs manual confirm — just navigate anyway
      // since we turned off email confirmation in Supabase
      navigate("/onboarding");
      return;
    }
    
    if (signInError) {
      throw signInError;
    }
    
    navigate("/onboarding");
  } catch (err: any) {
    setError(err.message || "Something went wrong. Try again.");
  } finally {
    setLoading(false);
  }
};

  const FONTS = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600&family=Playfair+Display:wght@400;500&display=swap');
    input::placeholder { color: rgba(255,255,255,0.2); }
    input:focus { outline: none; }
  `;

  return (
    <div style={{ minHeight:"100vh", background:"#0A0A0A", display:"flex", 
      alignItems:"center", justifyContent:"center", fontFamily:"'Plus Jakarta Sans',sans-serif",
      position:"relative" }}>
      <style>{FONTS}</style>
      <div style={{ position:"absolute", top:0, left:"50%", transform:"translateX(-50%)",
        width:"100%", height:300, background:"radial-gradient(ellipse 600px 300px at 50% -60px, rgba(255,107,43,0.12) 0%, transparent 70%)",
        pointerEvents:"none" }} />
      <div style={{ width:"100%", maxWidth:420, padding:"0 32px", position:"relative", zIndex:1 }}>
        <div style={{ textAlign:"center", marginBottom:48 }}>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:24, color:"white", marginBottom:32 }}>
            NAV<span style={{ color:"#FF6B2B" }}>O</span>
          </div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:36, fontWeight:400, 
            color:"white", margin:"0 0 8px", letterSpacing:"-0.02em" }}>
            Let's get started.
          </h1>
          <p style={{ fontSize:14, color:"rgba(255,255,255,0.35)", margin:0 }}>
            Find your direction.
          </p>
        </div>

        {[
          { label:"NAME", value:name, setter:setName, type:"text", placeholder:"Your first name" },
          { label:"EMAIL", value:email, setter:setEmail, type:"email", placeholder:"you@email.com" },
          { label:"PASSWORD", value:password, setter:setPassword, type:"password", placeholder:"Min 6 characters" },
        ].map((field, i) => (
          <div key={i} style={{ marginBottom:32 }}>
            <label style={{ display:"block", fontSize:10, fontWeight:600, 
              letterSpacing:"0.18em", textTransform:"uppercase", color:"white", marginBottom:12 }}>
              {field.label}
            </label>
            <input
              type={field.type}
              value={field.value}
              onChange={e => field.setter(e.target.value)}
              placeholder={field.placeholder}
              style={{ width:"100%", background:"transparent", border:"none",
                borderBottom:"1px solid rgba(255,255,255,0.15)", padding:"8px 0 14px",
                color:"#F5ECD7", fontFamily:"'Plus Jakarta Sans',sans-serif",
                fontSize:15, fontWeight:300, boxSizing:"border-box",
                caretColor:"#FF6B2B" }}
              onFocus={e => e.currentTarget.style.borderBottomColor="#FF6B2B"}
              onBlur={e => e.currentTarget.style.borderBottomColor="rgba(255,255,255,0.15)"}
            />
          </div>
        ))}

        {error && (
          <div style={{ background:"rgba(255,50,50,0.1)", border:"1px solid rgba(255,50,50,0.3)",
            borderRadius:8, padding:"12px 16px", marginBottom:24,
            color:"#ff6b6b", fontSize:13 }}>
            {error}
          </div>
        )}

        <button onClick={handleSignup} disabled={loading || !name || !email || !password}
          style={{ width:"100%", background: loading ? "rgba(255,107,43,0.5)" : "#FF6B2B",
            color:"white", border:"none", borderRadius:4, padding:"16px",
            fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:11, fontWeight:600,
            letterSpacing:"0.16em", textTransform:"uppercase", cursor:"pointer",
            marginBottom:24, transition:"all 0.2s" }}>
          {loading ? "Creating account..." : "Create Account →"}
        </button>

        <p style={{ textAlign:"center", fontSize:13, color:"rgba(255,255,255,0.3)" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color:"rgba(255,107,43,0.8)", textDecoration:"none" }}>
            Sign in →
          </Link>
        </p>
      </div>
    </div>
  );
}
