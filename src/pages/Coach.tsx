import { useState, useRef, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Sparkles, Send, ArrowRight, Zap, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

type Message = { role: "user" | "assistant"; content: string };

const COACH_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-coach`;

const starterQuestions = [
  "What careers match my strengths?",
  "What skills should I prioritize?",
  "How do I pivot into an AI role?",
  "What business could I build?",
  "How do I start earning independently?",
  "How do I position myself as a consultant?",
];

async function streamCoach({
  messages,
  onDelta,
  onDone,
  onError,
}: {
  messages: Message[];
  onDelta: (chunk: string) => void;
  onDone: () => void;
  onError: (msg: string) => void;
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
    onError(data.error ?? "Something went wrong. Please try again.");
    return;
  }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  let done = false;

  while (!done) {
    const { done: readerDone, value } = await reader.read();
    if (readerDone) break;
    buf += decoder.decode(value, { stream: true });

    let nl: number;
    while ((nl = buf.indexOf("\n")) !== -1) {
      let line = buf.slice(0, nl);
      buf = buf.slice(nl + 1);
      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (line.startsWith(":") || line.trim() === "") continue;
      if (!line.startsWith("data: ")) continue;
      const json = line.slice(6).trim();
      if (json === "[DONE]") { done = true; break; }
      try {
        const parsed = JSON.parse(json);
        const content = parsed.choices?.[0]?.delta?.content as string | undefined;
        if (content) onDelta(content);
      } catch {
        buf = line + "\n" + buf;
        break;
      }
    }
  }
  onDone();
}

export default function Coach() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hello! I'm your AI Reinvention Coach. 👋

I've analyzed your Identity Profile — you're a **Connector-Builder** with strong communication skills, curiosity about systems, and a natural leadership presence.

I'm here to help you navigate your next career chapter. Whether you have a specific question or just need clarity on your next step, let's figure it out together.

What's on your mind today?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isStreaming) return;
    const userMsg: Message = { role: "user", content: text };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput("");
    setIsStreaming(true);

    let assistantText = "";

    try {
      await streamCoach({
        messages: history,
        onDelta: (chunk) => {
          assistantText += chunk;
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (last?.role === "assistant") {
              return prev.map((m, i) =>
                i === prev.length - 1 ? { ...m, content: assistantText } : m
              );
            }
            return [...prev, { role: "assistant", content: assistantText }];
          });
        },
        onDone: () => setIsStreaming(false),
        onError: (msg) => {
          setIsStreaming(false);
          toast.error(msg);
        },
      });
    } catch {
      setIsStreaming(false);
      toast.error("Connection error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 pt-20 flex flex-col">
        <div className="container max-w-4xl flex flex-col flex-1 py-8 gap-6">

          {/* Header */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/20 rounded-full px-4 py-2 text-sm text-teal font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              AI Reinvention Coach · Powered by Lovable AI
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Your personal reinvention strategist
            </h1>
            <p className="text-muted-foreground">
              Ask anything about your career reinvention. I know your profile and I'm here to help.
            </p>
          </div>

          {/* Chat container */}
          <div className="flex-1 bg-gradient-card border border-border/50 rounded-2xl flex flex-col overflow-hidden min-h-[500px]">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    msg.role === "assistant" ? "bg-gradient-teal glow-teal" : "bg-surface-2 border border-border"
                  }`}>
                    {msg.role === "assistant" ? (
                      <Sparkles className="w-4 h-4 text-primary-foreground" />
                    ) : (
                      <User className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed ${
                    msg.role === "assistant"
                      ? "bg-surface-2 text-muted-foreground rounded-tl-sm"
                      : "bg-teal-500/15 border border-teal-500/20 text-foreground rounded-tr-sm"
                  }`}>
                    {msg.role === "assistant" ? (
                      <div className="prose prose-sm prose-invert max-w-none
                        prose-headings:text-foreground prose-headings:font-bold
                        prose-strong:text-foreground prose-strong:font-semibold
                        prose-p:text-muted-foreground prose-p:leading-relaxed
                        prose-li:text-muted-foreground prose-ul:my-1 prose-ol:my-1
                        prose-code:text-teal prose-code:bg-teal-500/10 prose-code:px-1 prose-code:rounded">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <p>{msg.content}</p>
                    )}
                  </div>
                </div>
              ))}

              {/* Streaming indicator dots when waiting for first token */}
              {isStreaming && messages[messages.length - 1]?.role === "user" && (
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-teal flex items-center justify-center animate-pulse-glow">
                    <Sparkles className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div className="bg-surface-2 rounded-2xl rounded-tl-sm p-4 flex gap-1.5 items-center">
                    {[0, 1, 2].map((j) => (
                      <div key={j} className="w-2 h-2 bg-teal rounded-full animate-bounce" style={{ animationDelay: `${j * 150}ms` }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Starter questions */}
            {messages.length <= 1 && (
              <div className="px-6 pb-4">
                <p className="text-xs text-muted-foreground mb-3 font-medium">Try asking:</p>
                <div className="flex flex-wrap gap-2">
                  {starterQuestions.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="text-xs bg-surface-2 border border-border hover:border-teal-500/40 hover:text-foreground text-muted-foreground px-3 py-2 rounded-xl transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-border/40">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage(input)}
                  placeholder="Ask your AI coach anything..."
                  className="flex-1 bg-surface-2 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-teal-500/50 transition-colors"
                />
                <Button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || isStreaming}
                  className="bg-gradient-teal text-primary-foreground px-4 hover:opacity-90 disabled:opacity-30"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Upgrade note */}
          <div className="bg-surface-1 border border-amber-500/15 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4 text-sm">
            <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4 text-amber" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <span className="font-semibold text-foreground">Free plan: 10 coach messages/month. </span>
              <span className="text-muted-foreground">Upgrade to Premium for unlimited coaching and deeper insights.</span>
            </div>
            <a href="/pricing">
              <Button size="sm" className="bg-gradient-amber text-primary-foreground font-semibold text-xs hover:opacity-90 shrink-0">
                Upgrade <ArrowRight className="w-3 h-3 ml-1.5" />
              </Button>
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
