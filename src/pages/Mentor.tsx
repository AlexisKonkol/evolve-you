import { useState, useRef, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Compass, Send, User, RefreshCw, Lightbulb,
  Heart, Zap, Map, BookOpen, Star,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

// ── Types ─────────────────────────────────────────────────────────────────────

type Message = { role: "user" | "assistant"; content: string };

// ── Conversation starters ─────────────────────────────────────────────────────

const starters = [
  { icon: Compass, text: "I feel stuck and unsure what direction to take next." },
  { icon: Lightbulb, text: "I'm curious about starting something new but don't know where to begin." },
  { icon: Map, text: "I want to explore different paths but feel overwhelmed by the options." },
  { icon: Heart, text: "I know what I don't want — but not what I actually want." },
  { icon: Zap, text: "I'm facing an important decision and want to think it through clearly." },
  { icon: BookOpen, text: "I've been exploring new paths but need help making sense of what I've found." },
  { icon: Star, text: "I want to understand what I'm really good at and where it could lead." },
  { icon: RefreshCw, text: "I'm thinking about a major change in my life and feel uncertain." },
];

// ── Stream helper ─────────────────────────────────────────────────────────────

const MENTOR_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/path-mentor`;

async function streamMentor({
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
  let resp: Response;
  try {
    resp = await fetch(MENTOR_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ messages }),
    });
  } catch {
    onError("Connection error. Please check your network and try again.");
    return;
  }

  if (!resp.ok || !resp.body) {
    const data = await resp.json().catch(() => ({}));
    if (resp.status === 429) { onError("Rate limit reached. Please wait a moment before continuing."); return; }
    if (resp.status === 402) { onError("Usage limit reached. Please add credits to continue."); return; }
    onError(data.error ?? "Something went wrong. Please try again.");
    return;
  }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  let done = false;

  while (!done) {
    const { done: d, value } = await reader.read();
    if (d) break;
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
        const chunk = parsed.choices?.[0]?.delta?.content as string | undefined;
        if (chunk) onDelta(chunk);
      } catch {
        buf = line + "\n" + buf;
        break;
      }
    }
  }

  // flush remaining buffer
  if (buf.trim()) {
    for (let raw of buf.split("\n")) {
      if (!raw.startsWith("data: ")) continue;
      const json = raw.slice(6).trim();
      if (json === "[DONE]") continue;
      try {
        const parsed = JSON.parse(json);
        const chunk = parsed.choices?.[0]?.delta?.content as string | undefined;
        if (chunk) onDelta(chunk);
      } catch { /* ignore */ }
    }
  }

  onDone();
}

// ── Message bubble ────────────────────────────────────────────────────────────

function MentorAvatar() {
  return (
    <div
      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
      style={{ background: "linear-gradient(135deg, hsl(var(--coral)), hsl(var(--peach)))" }}
    >
      <Compass className="w-4 h-4 text-primary-foreground" />
    </div>
  );
}

function UserAvatar() {
  return (
    <div className="w-9 h-9 rounded-xl bg-surface-2 border border-border flex items-center justify-center shrink-0">
      <User className="w-4 h-4 text-muted-foreground" />
    </div>
  );
}

function MessageBubble({ msg }: { msg: Message }) {
  const isAssistant = msg.role === "assistant";
  return (
    <div className={`flex gap-3 ${isAssistant ? "" : "flex-row-reverse"}`}>
      {isAssistant ? <MentorAvatar /> : <UserAvatar />}
      <div
        className={`max-w-[82%] rounded-2xl px-4 py-3.5 text-sm leading-relaxed ${
          isAssistant
            ? "bg-surface-2 text-muted-foreground rounded-tl-sm"
            : "rounded-tr-sm text-foreground"
        }`}
        style={
          isAssistant
            ? {}
            : { background: "hsl(var(--coral) / 0.12)", border: "1px solid hsl(var(--coral) / 0.2)" }
        }
      >
        {isAssistant ? (
          <div className="prose prose-sm prose-invert max-w-none
            prose-headings:text-foreground prose-headings:font-semibold
            prose-strong:text-foreground prose-strong:font-semibold
            prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:my-1.5
            prose-li:text-muted-foreground prose-ul:my-2 prose-ol:my-2
            prose-code:text-coral prose-code:bg-coral-500/10 prose-code:px-1 prose-code:rounded
            [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
            <ReactMarkdown>{msg.content}</ReactMarkdown>
          </div>
        ) : (
          <p>{msg.content}</p>
        )}
      </div>
    </div>
  );
}

// ── Typing indicator ──────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <MentorAvatar />
      <div className="bg-surface-2 rounded-2xl rounded-tl-sm px-4 py-3.5 flex gap-1.5 items-center">
        {[0, 1, 2].map((j) => (
          <div
            key={j}
            className="w-1.5 h-1.5 rounded-full animate-bounce"
            style={{
              background: "hsl(var(--coral))",
              animationDelay: `${j * 160}ms`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

const INITIAL_MESSAGE: Message = {
  role: "assistant",
  content: `Hello. I'm your Path Mentor.

I'm here to help you think more clearly about where you are and where you might be headed — not by telling you what to do, but by asking the kinds of questions that help you discover your own answers.

There's no pressure here. No right answers. Just an open space to think.

**What's on your mind today?**`,
};

export default function Mentor() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 160) + "px";
  };

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isStreaming) return;

    const userMsg: Message = { role: "user", content: trimmed };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput("");

    // reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }

    setIsStreaming(true);
    let assistantText = "";

    try {
      await streamMentor({
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const isFirstMessage = messages.length <= 1;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 pt-20 flex flex-col">
        <div className="container max-w-3xl flex flex-col flex-1 py-8 gap-6">

          {/* Header */}
          <div className="text-center">
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium mb-4 border"
              style={{
                background: "hsl(var(--coral) / 0.06)",
                borderColor: "hsl(var(--coral) / 0.2)",
              }}
            >
              <Compass className="w-4 h-4 text-coral" />
              <span className="text-coral">Your Path Mentor</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              You don't need all the answers{" "}
              <span className="bg-gradient-coral bg-clip-text text-transparent">today</span>
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              With the right questions, your path becomes clearer. Your mentor is here to help you think,
              not to tell you what to think.
            </p>
          </div>

          {/* Chat window */}
          <div
            className="flex-1 border rounded-2xl flex flex-col overflow-hidden"
            style={{
              background: "hsl(var(--card))",
              borderColor: "hsl(var(--border))",
              minHeight: "520px",
            }}
          >
            {/* Mentor identity strip */}
            <div
              className="flex items-center gap-3 px-5 py-3.5 border-b"
              style={{
                background: "hsl(var(--coral) / 0.04)",
                borderColor: "hsl(var(--border))",
              }}
            >
              <MentorAvatar />
              <div>
                <p className="text-sm font-semibold text-foreground">Path Mentor</p>
                <p className="text-xs text-muted-foreground">Thoughtful guide · here to help you think clearly</p>
              </div>
              <div className="ml-auto flex items-center gap-1.5">
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: "hsl(var(--coral))" }}
                />
                <span className="text-xs text-muted-foreground">Ready</span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
              {messages.map((msg, i) => (
                <MessageBubble key={i} msg={msg} />
              ))}
              {isStreaming && messages[messages.length - 1]?.role === "user" && (
                <TypingIndicator />
              )}
              <div ref={bottomRef} />
            </div>

            {/* Conversation starters */}
            {isFirstMessage && (
              <div className="px-5 pb-4">
                <p className="text-xs text-muted-foreground/60 mb-2.5 font-medium">Start with something on your mind:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {starters.map(({ icon: Icon, text }) => (
                    <button
                      key={text}
                      onClick={() => sendMessage(text)}
                      disabled={isStreaming}
                      className="flex items-start gap-2.5 text-left px-3.5 py-2.5 rounded-xl text-xs text-muted-foreground border border-border hover:border-coral/30 hover:text-foreground transition-all group disabled:opacity-40"
                      style={{ background: "hsl(var(--surface-2))" }}
                    >
                      <Icon
                        className="w-3.5 h-3.5 mt-0.5 shrink-0 text-muted-foreground/50 group-hover:text-coral transition-colors"
                      />
                      {text}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="px-4 py-3 border-t" style={{ borderColor: "hsl(var(--border))" }}>
              <div className="flex gap-2.5 items-end">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={handleInput}
                  onKeyDown={handleKeyDown}
                  placeholder="Share what's on your mind…"
                  rows={1}
                  disabled={isStreaming}
                  className="flex-1 bg-surface-2 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-coral/40 transition-colors resize-none overflow-hidden disabled:opacity-50"
                  style={{ minHeight: "44px", maxHeight: "160px" }}
                />
                <Button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || isStreaming}
                  className="text-primary-foreground px-3 h-11 rounded-xl hover:opacity-90 disabled:opacity-30 shrink-0"
                  style={{
                    background: "linear-gradient(135deg, hsl(var(--coral)), hsl(var(--peach)))",
                  }}
                >
                  {isStreaming ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground/40 mt-2 text-center">
                Enter to send · Shift+Enter for new line
              </p>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
