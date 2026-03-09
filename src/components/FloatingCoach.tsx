import { useState, useRef, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Sparkles, Send, X, Minimize2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

type Msg = { role: "user" | "assistant"; content: string };

const COACH_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-coach`;

const starters = [
  "What should I focus on today?",
  "What opportunities match me?",
  "How do I build momentum?",
];

async function streamCoach({
  messages,
  onDelta,
  onDone,
  onError,
}: {
  messages: Msg[];
  onDelta: (c: string) => void;
  onDone: () => void;
  onError: (m: string) => void;
}) {
  const resp = await fetch(COACH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ messages }),
  });

  if (!resp.ok || !resp.body) {
    const data = await resp.json().catch(() => ({}));
    onError(data.error ?? "Something went wrong.");
    return;
  }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  let done = false;

  while (!done) {
    const { done: rd, value } = await reader.read();
    if (rd) break;
    buf += decoder.decode(value, { stream: true });
    let nl: number;
    while ((nl = buf.indexOf("\n")) !== -1) {
      let line = buf.slice(0, nl);
      buf = buf.slice(nl + 1);
      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (line.startsWith(":") || !line.startsWith("data: ")) continue;
      const json = line.slice(6).trim();
      if (json === "[DONE]") { done = true; break; }
      try {
        const p = JSON.parse(json);
        const c = p.choices?.[0]?.delta?.content as string | undefined;
        if (c) onDelta(c);
      } catch { buf = line + "\n" + buf; break; }
    }
  }
  onDone();
}

export function FloatingCoach() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content: "Hi! I'm your AI Coach. Ask me anything about your reinvention journey. 🎯",
    },
  ]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [messages, open]);

  // Hide on full coach page — AFTER all hooks
  if (location.pathname === "/coach") return null;

  const send = async (text: string) => {
    if (!text.trim() || streaming) return;
    const userMsg: Msg = { role: "user", content: text };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput("");
    setStreaming(true);

    let assistantText = "";
    try {
      await streamCoach({
        messages: history,
        onDelta: (chunk) => {
          assistantText += chunk;
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (last?.role === "assistant") {
              return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantText } : m);
            }
            return [...prev, { role: "assistant", content: assistantText }];
          });
        },
        onDone: () => setStreaming(false),
        onError: (msg) => { setStreaming(false); toast.error(msg); },
      });
    } catch {
      setStreaming(false);
      toast.error("Connection error. Please try again.");
    }
  };

  return (
    <>
      {/* Panel */}
      {open && (
        <div className="fixed bottom-24 right-4 md:right-6 z-50 w-80 md:w-96 flex flex-col bg-surface-1 border border-border/70 rounded-2xl shadow-card overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-gradient-card border-b border-border/50">
            <div className="w-8 h-8 bg-gradient-teal rounded-xl flex items-center justify-center glow-teal shrink-0">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">AI Coach</p>
              <p className="text-xs text-teal">Online · Ready to help</p>
            </div>
            <div className="flex items-center gap-1">
              <Link
                to="/coach"
                className="p-1.5 rounded-lg hover:bg-surface-3 text-muted-foreground hover:text-foreground transition-colors"
                title="Open full coach"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg hover:bg-surface-3 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Minimize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 max-h-72">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                {msg.role === "assistant" && (
                  <div className="w-6 h-6 bg-gradient-teal rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-3 h-3 text-primary-foreground" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                    msg.role === "assistant"
                      ? "bg-surface-2 text-muted-foreground rounded-tl-sm"
                      : "bg-teal-500/15 border border-teal-500/20 text-foreground rounded-tr-sm"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <div className="prose prose-sm prose-invert max-w-none
                      prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:my-0.5
                      prose-strong:text-foreground prose-strong:font-semibold
                      prose-li:text-muted-foreground prose-ul:my-1 prose-ol:my-1
                      [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                      {streaming && i === messages.length - 1 && msg.role === "assistant" && (
                        <span className="inline-block w-1.5 h-3 bg-teal ml-0.5 animate-pulse rounded-sm" />
                      )}
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}

            {/* Typing dots while waiting for first token */}
            {streaming && messages[messages.length - 1]?.role === "user" && (
              <div className="flex gap-2">
                <div className="w-6 h-6 bg-gradient-teal rounded-lg flex items-center justify-center shrink-0">
                  <Sparkles className="w-3 h-3 text-primary-foreground" />
                </div>
                <div className="bg-surface-2 rounded-xl rounded-tl-sm px-3 py-2.5 flex gap-1 items-center">
                  {[0, 1, 2].map((j) => (
                    <div key={j} className="w-1.5 h-1.5 bg-teal rounded-full animate-bounce" style={{ animationDelay: `${j * 150}ms` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Starter chips — show only on first message */}
          {messages.length === 1 && (
            <div className="px-3 pb-2 flex flex-wrap gap-1.5">
              {starters.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-xs bg-surface-2 border border-border hover:border-teal-500/30 text-muted-foreground hover:text-foreground px-2.5 py-1.5 rounded-lg transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-border/40">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send(input)}
                placeholder="Ask anything..."
                className="flex-1 bg-surface-2 border border-border rounded-xl px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-teal-500/40 transition-colors"
              />
              <Button
                onClick={() => send(input)}
                disabled={!input.trim() || streaming}
                size="sm"
                className="bg-gradient-teal text-primary-foreground hover:opacity-90 disabled:opacity-30 px-3 h-auto"
              >
                <Send className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setOpen(!open)}
        className={`fixed bottom-5 right-4 md:right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-gradient-teal text-primary-foreground font-semibold text-sm shadow-teal transition-all duration-300 hover:opacity-90 hover:scale-105 active:scale-95 ${
          open ? "opacity-0 pointer-events-none scale-75" : "opacity-100"
        }`}
      >
        <Sparkles className="w-4 h-4" />
        AI Coach
      </button>

      {/* Close FAB when open */}
      {open && (
        <button
          onClick={() => setOpen(false)}
          className="fixed bottom-5 right-4 md:right-6 z-50 w-12 h-12 rounded-2xl bg-surface-2 border border-border text-muted-foreground hover:text-foreground flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-card"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </>
  );
}
