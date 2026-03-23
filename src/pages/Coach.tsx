import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;1,400&display=swap');`;

const QUICK_STARTS = [
  "I'm stuck and don't know why",
  "Help me figure out my next move",
  "I need to have a hard conversation",
  "Hold me accountable to something",
];

interface Message {
  role: "user" | "coach";
  content: string;
}

export default function Coach() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [userContext, setUserContext] = useState<string>("");
  const [userName, setUserName] = useState("there");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    loadContext();
    loadMessages();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadMessages = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await (supabase as any)
      .from("coach_messages")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true })
      .limit(50);
    if (data) {
      setMessages(data.map((m: any) => ({ role: m.role === "assistant" ? "coach" : "user", content: m.content })));
    }
  };

  const loadContext = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const [profileRes, sparkRes, journalRes, completionsRes, commitmentsRes] = await Promise.all([
      (supabase as any).from("profiles").select("*").eq("id", user.id).single(),
      (supabase as any).from("spark_profiles").select("*").eq("user_id", user.id).order("completed_at", { ascending: false }).limit(1).single(),
      (supabase as any).from("journal_entries").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(5),
      (supabase as any).from("module_completions").select("*").eq("user_id", user.id),
      (supabase as any).from("coach_commitments").select("*").eq("user_id", user.id).eq("completed", false),
    ]);

    const profile = profileRes.data;
    const spark = sparkRes.data;
    const journals = journalRes.data || [];
    const completions = completionsRes.data || [];
    const commitments = commitmentsRes.data || [];
    const compassAnswers = sessionStorage.getItem("compassAnswers") || "";
    const edgeProfileRaw = sessionStorage.getItem("edgeProfile");
    let edgeProfile: any = null;
    try { edgeProfile = edgeProfileRaw ? JSON.parse(edgeProfileRaw) : null; } catch {}

    if (profile?.name) setUserName(profile.name.split(" ")[0]);

    const ctx = `You are the NAVO Coach — a direct, warm, deeply perceptive life coach. You are not a chatbot. You are not a therapist. You are a coach who gets results. You know this person deeply.

NAME: ${profile?.name || "Unknown"}
NAVIGATION STYLE: ${edgeProfile?.navigationStyle || "Unknown"}

WHAT LIGHTS THEM UP:
- Loses track of time: ${spark?.q1 || "Unknown"}
- Would do for free: ${spark?.q2 || "Unknown"}
- Most proud of: ${spark?.q3 || "Unknown"}
- Impact they want: ${spark?.q4 || "Unknown"}
- Best environment: ${spark?.q5 || "Unknown"}
- Life that feels right: ${spark?.q6 || "Unknown"}

COMPASS SESSION: ${compassAnswers || "Not yet completed"}
EDGE PROFILE: ${edgeProfile ? `Navigation: ${edgeProfile.navigationStyle}. NAVO sees: ${edgeProfile.navoSees}` : "Not yet generated"}
MODULES COMPLETED: ${completions.map((c: any) => c.module_id).join(", ") || "None yet"}
OPEN COMMITMENTS: ${commitments.map((c: any) => `"${c.commitment}" due ${c.due_date}`).join(", ") || "None"}
RECENT JOURNAL ENTRIES: ${journals.map((j: any) => `"${j.entry}"`).join(" | ") || "None"}

COACHING RULES — always follow these:
1. Be direct and warm — never vague, never generic
2. Connect what they say to what you know about them
3. Ask ONE powerful question at a time — never multiple
4. When they avoid something, name it directly and honestly
5. When they commit to something, confirm it with a specific time: "So you're committing to X by [time]. Is that right?"
6. Short responses beat long ones — you are a coach not a lecturer
7. Never use bullet points or lists — speak in natural paragraphs
8. You are not a cheerleader — don't over-celebrate
9. End every response with either a question OR a single clear action
10. Reference their navigation style and spark answers naturally
11. Push people to move — your job is momentum, not comfort`;

    setUserContext(ctx);
  };

  const sendMessage = async (content: string) => {
    if (!content.trim() || loading) return;
    
    // Check if userContext is loaded
    if (!userContext) {
      const errMsg: Message = { role: "coach", content: "Loading your profile... Please wait a moment and try again." };
      setMessages((prev) => [...prev, errMsg]);
      return;
    }
    
    setLoading(true);
    const userMsg: Message = { role: "user", content };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await (supabase as any).from("coach_messages").insert({ user_id: user.id, role: "user", content });
    }

    try {
      // Include the current user message in history
      const history = [...messages, userMsg].map((m) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.content,
      }));

      console.log("Key check:", import.meta.env.VITE_ANTHROPIC_API_KEY?.slice(0,10));
      console.log("Sending to API with context length:", userContext.length);
      console.log("History:", history);

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
          max_tokens: 400,
          system: userContext,
          messages: [...history, { role: "user", content }],
        }),
      });

      console.log("API Response status:", res.status);

      if (!res.ok) {
        const errorText = await res.text();
        console.error("API Error:", errorText);
        throw new Error(`API error ${res.status}: ${errorText}`);
      }

      const data = await res.json();
      console.log("API Response data:", data);
      
      if (!data.content || !data.content[0] || !data.content[0].text) {
        throw new Error("Invalid response format from API");
      }
      
      const coachResponse = data.content[0].text;
      const coachMsg: Message = { role: "coach", content: coachResponse };
      setMessages((prev) => [...prev, coachMsg]);

      if (user) {
        await (supabase as any).from("coach_messages").insert({ user_id: user.id, role: "assistant", content: coachResponse });
      }
    } catch (err) {
      console.error("Send message error:", err);
      const errMsg: Message = { role: "coach", content: `Connection error: ${err instanceof Error ? err.message : JSON.stringify(err)}` };
      setMessages((prev) => [...prev, errMsg]);
    }
    setLoading(false);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const s = {
    page: { minHeight: "100vh", background: "#0B0F1A", fontFamily: "'Plus Jakarta Sans',sans-serif", display: "flex", flexDirection: "column" as const, maxWidth: 640, margin: "0 auto", padding: "0 0 120px" },
    topBar: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px 12px", borderBottom: "1px solid rgba(255,255,255,0.06)" },
    back: { fontSize: 13, color: "rgba(255,255,255,0.4)", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 },
    title: { fontSize: 13, fontWeight: 600, color: "white" },
    status: { fontSize: 10, color: "rgba(99, 102, 241,0.7)", display: "flex", alignItems: "center", gap: 4 },
    dot: { width: 6, height: 6, borderRadius: "50%", background: "#6366F1" },
    messages: { flex: 1, padding: "20px 24px", display: "flex", flexDirection: "column" as const, gap: 16 },
    userBubble: { alignSelf: "flex-end" as const, maxWidth: "78%", background: "rgba(99, 102, 241,0.12)", border: "1px solid rgba(99, 102, 241,0.2)", borderRadius: "14px 3px 14px 14px", padding: "11px 14px", fontSize: 13, color: "white", lineHeight: 1.65 },
    coachRow: { display: "flex", gap: 10, alignItems: "flex-start", maxWidth: "88%" },
    avatar: { width: 26, height: 26, borderRadius: "50%", background: "rgba(99, 102, 241,0.15)", border: "1px solid rgba(99, 102, 241,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
    coachBubble: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "3px 14px 14px 14px", padding: "13px 15px", fontSize: 13, color: "rgba(255,255,255,0.85)", lineHeight: 1.75 },
    inputArea: { position: "fixed" as const, bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 640, background: "#0B0F1A", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "12px 16px 20px" },
    chips: { display: "flex", gap: 6, flexWrap: "wrap" as const, marginBottom: 10 },
    chip: { fontSize: 11, color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", padding: "5px 12px", borderRadius: 999, cursor: "pointer" },
    inputRow: { display: "flex", gap: 10, alignItems: "flex-end", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "10px 12px" },
    textarea: { flex: 1, background: "transparent", border: "none", outline: "none", color: "white", fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 13, fontWeight: 300, resize: "none" as const, caretColor: "#6366F1", lineHeight: 1.5 },
    sendBtn: { width: 28, height: 28, background: "#6366F1", border: "none", borderRadius: 6, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  };

  return (
    <div style={s.page}>
      <style>{FONTS}</style>

      <div style={s.topBar}>
        <div style={s.back} onClick={() => navigate("/dashboard")}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M5 12l7 7M5 12l7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Back
        </div>
        <div style={s.title}>Your NAVO Coach</div>
        <div style={s.status}>
          <div style={s.dot} />
          Active
        </div>
      </div>

      <div style={s.messages}>
        {messages.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, color: "white", marginBottom: 8 }}>
              Hey {userName}.
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", lineHeight: 1.7 }}>
              Your coach is here. What's on your mind?
            </div>
          </div>
        )}

        {messages.map((m, i) =>
          m.role === "user" ? (
            <div key={i} style={{ display: "flex", justifyContent: "flex-end" }}>
              <div style={s.userBubble}>{m.content}</div>
            </div>
          ) : (
            <div key={i} style={s.coachRow}>
              <div style={s.avatar}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="3" fill="#6366F1"/>
                  <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="#6366F1" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div style={s.coachBubble}>{m.content}</div>
            </div>
          )
        )}

        {loading && (
          <div style={s.coachRow}>
            <div style={s.avatar}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="3" fill="#6366F1"/>
                <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="#6366F1" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div style={{ ...s.coachBubble, display: "flex", gap: 6, alignItems: "center" }}>
              {[0, 0.2, 0.4].map((delay, i) => (
                <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#6366F1", animation: `pulse 1s ease-in-out ${delay}s infinite` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div style={s.inputArea}>
        {messages.length === 0 && (
          <div style={s.chips}>
            {QUICK_STARTS.map((q, i) => (
              <div key={i} style={s.chip} onClick={() => sendMessage(q)}>{q}</div>
            ))}
          </div>
        )}
        <div style={s.inputRow}>
          <textarea
            ref={textareaRef}
            style={s.textarea}
            placeholder="Talk to your coach..."
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = e.target.scrollHeight + 'px';
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (input.trim() && !loading) {
                  sendMessage(input.trim());
                }
              }
            }}
            rows={1}
          />
          <button
            style={{ ...s.sendBtn, opacity: !input.trim() || loading ? 0.4 : 1 }}
            onClick={() => {
              if (input.trim() && !loading) {
                sendMessage(input.trim());
              }
            }}
            disabled={!input.trim() || loading}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}
