import { useState, useRef, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Sparkles, Send, ArrowRight, Zap, User } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const starterQuestions = [
  "What careers match my profile?",
  "What skills should I learn next?",
  "How do I pivot industries?",
  "How can I start earning independently?",
  "What makes me valuable in the AI age?",
  "How do I position myself as a consultant?",
];

const mockResponses: Record<string, string> = {
  default: `Based on your identity profile — **The Connector-Builder** — here's what I see:

Your greatest asset isn't any single skill. It's your ability to translate between people, systems, and ideas. That's rare, and it's exactly what the AI economy is hungry for.

**Here's what I'd focus on:**

1. **AI Workflow Design** — Your operations background + communication skills = the perfect profile for designing human-AI hybrid workflows. Companies are desperately hiring for this.

2. **Strategic Consulting** — You already think like a strategist. Add AI literacy on top and you become a rare solo consultant who can charge premium rates.

3. **Community Building** — Your leadership experience maps directly to the creator economy. You know how to bring people together around shared goals.

**My recommendation this week:**
Start with the AI Literacy module, then do a single information interview with someone doing AI workflow work. That conversation will be worth more than any course.

What would you like to dig deeper into? 🎯`,
};

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
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: mockResponses.default,
        },
      ]);
    }, 1800);
  };

  const renderContent = (content: string) => {
    return content.split("\n").map((line, i) => {
      if (line.startsWith("**") && line.endsWith("**")) {
        return <p key={i} className="font-bold text-foreground my-1">{line.slice(2, -2)}</p>;
      }
      if (line.startsWith("**") && line.includes("**")) {
        const parts = line.split("**");
        return (
          <p key={i} className="my-0.5">
            {parts.map((part, j) =>
              j % 2 === 1 ? <strong key={j} className="text-foreground font-semibold">{part}</strong> : part
            )}
          </p>
        );
      }
      if (line.startsWith("1.") || line.startsWith("2.") || line.startsWith("3.")) {
        const num = line.split(".")[0];
        const rest = line.slice(num.length + 1).trim();
        const parts = rest.split("**");
        return (
          <div key={i} className="flex gap-2 my-1">
            <span className="text-teal font-bold shrink-0">{num}.</span>
            <p>
              {parts.map((part, j) =>
                j % 2 === 1 ? <strong key={j} className="text-foreground font-semibold">{part}</strong> : part
              )}
            </p>
          </div>
        );
      }
      if (line === "") return <div key={i} className="h-2" />;
      return <p key={i} className="my-0.5">{line}</p>;
    });
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
              AI Reinvention Coach
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Your personal reinvention strategist
            </h1>
            <p className="text-muted-foreground">
              Ask anything about your career reinvention. I know your profile and I'm ready to help.
            </p>
          </div>

          {/* Chat container */}
          <div className="flex-1 bg-gradient-card border border-border/50 rounded-2xl flex flex-col overflow-hidden min-h-[500px]">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    msg.role === "assistant"
                      ? "bg-gradient-teal glow-teal"
                      : "bg-surface-2 border border-border"
                  }`}>
                    {msg.role === "assistant" ? (
                      <Sparkles className="w-4 h-4 text-primary-foreground" />
                    ) : (
                      <User className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed ${
                      msg.role === "assistant"
                        ? "bg-surface-2 text-muted-foreground rounded-tl-sm"
                        : "bg-teal-500/15 border border-teal-500/20 text-foreground rounded-tr-sm"
                    }`}
                  >
                    {msg.role === "assistant" ? renderContent(msg.content) : <p>{msg.content}</p>}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-teal flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div className="bg-surface-2 rounded-2xl rounded-tl-sm p-4 flex gap-1.5 items-center">
                    {[0, 1, 2].map((j) => (
                      <div
                        key={j}
                        className="w-2 h-2 bg-teal rounded-full animate-bounce"
                        style={{ animationDelay: `${j * 150}ms` }}
                      />
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
                  onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                  placeholder="Ask your AI coach anything..."
                  className="flex-1 bg-surface-2 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-teal-500/50 transition-colors"
                />
                <Button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || isTyping}
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
                Upgrade
                <ArrowRight className="w-3 h-3 ml-1.5" />
              </Button>
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
