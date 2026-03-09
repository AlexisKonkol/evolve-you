import { useState, useRef, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import {
  BookOpen, Sparkles, ArrowRight, Clock, ChevronRight,
  Lightbulb, Heart, Zap, Eye, Star, RefreshCw,
  ChevronLeft, Check, TrendingUp, Map, Circle,
} from "lucide-react";
import { Link } from "react-router-dom";

// ── Types ─────────────────────────────────────────────────────────────────────

interface JournalEntry {
  id: string;
  promptId: string;
  promptText: string;
  category: string;
  content: string;
  date: string; // ISO
  tags: string[];
}

interface Insight {
  theme: string;
  description: string;
  icon: React.ElementType;
  colorKey: "coral" | "amber" | "violet" | "teal";
}

// ── Prompt Library ────────────────────────────────────────────────────────────

const promptLibrary = [
  // Energy & Engagement
  { id: "e1", category: "Energy",       color: "coral"  as const, prompt: "What activities give you energy — even when you're tired?",                        followUp: "Can you think of a recent moment when you felt most alive in your work?" },
  { id: "e2", category: "Energy",       color: "coral"  as const, prompt: "When do you feel most engaged and fully present in what you're doing?",             followUp: "What conditions make that state easier to reach?" },
  { id: "e3", category: "Energy",       color: "coral"  as const, prompt: "What kind of work makes time seem to disappear?",                                   followUp: "What is it about that type of work that pulls you in so completely?" },

  // Curiosity & Interests
  { id: "c1", category: "Curiosity",    color: "violet" as const, prompt: "What topics do you find yourself reading about even when no one asks you to?",      followUp: "What is it about that subject that keeps drawing you back?" },
  { id: "c2", category: "Curiosity",    color: "violet" as const, prompt: "What problems do you naturally want to solve — even in your own life?",             followUp: "Where does that problem-solving instinct usually show up for you?" },
  { id: "c3", category: "Curiosity",    color: "violet" as const, prompt: "What emerging ideas or technologies genuinely excite you right now?",               followUp: "What excites you most about where that direction is headed?" },

  // Values & Meaning
  { id: "v1", category: "Values",       color: "amber"  as const, prompt: "What kind of impact would feel truly meaningful to you in your work?",              followUp: "Why does that kind of impact matter to you personally?" },
  { id: "v2", category: "Values",       color: "amber"  as const, prompt: "What is something you believe strongly in — even if others disagree?",              followUp: "How does that belief show up in how you live or work?" },
  { id: "v3", category: "Values",       color: "amber"  as const, prompt: "When have you done something that felt genuinely important — not just productive?",  followUp: "What made it feel important rather than just busy?" },

  // Strengths & Abilities
  { id: "s1", category: "Strengths",    color: "teal"   as const, prompt: "What do people tend to come to you for — advice, help, or perspective?",            followUp: "What does that tell you about where you naturally add value?" },
  { id: "s2", category: "Strengths",    color: "teal"   as const, prompt: "What have you learned quickly — faster than most people around you?",               followUp: "What does that natural speed of learning reveal about your strengths?" },
  { id: "s3", category: "Strengths",    color: "teal"   as const, prompt: "What are you doing when you feel most capable and confident in yourself?",          followUp: "What is it about that activity that brings out your best?" },

  // People & Collaboration
  { id: "p1", category: "People",       color: "coral"  as const, prompt: "What kinds of people do you enjoy working and collaborating with most?",            followUp: "What is it about those people that makes the work feel easier?" },
  { id: "p2", category: "People",       color: "coral"  as const, prompt: "Who inspires you, and what specifically about them resonates with you?",            followUp: "What does your admiration of them reveal about your own values?" },

  // Direction & Future
  { id: "d1", category: "Direction",    color: "violet" as const, prompt: "If you could spend the next year working on anything, what would it be?",           followUp: "What is pulling you toward that — curiosity, meaning, or something else?" },
  { id: "d2", category: "Direction",    color: "violet" as const, prompt: "What would you explore if failure wasn't a possibility?",                           followUp: "What does that answer tell you about what you're holding back from?" },
  { id: "d3", category: "Direction",    color: "violet" as const, prompt: "What version of yourself would you be proud to become in three years?",             followUp: "What is the most meaningful step toward that version of yourself right now?" },
];

// ── Color tokens ──────────────────────────────────────────────────────────────

const colorMap = {
  coral:  { bg: "hsl(var(--coral) / 0.06)",  border: "hsl(var(--coral) / 0.2)",  text: "text-coral",  badge: "hsl(var(--coral) / 0.12)" },
  amber:  { bg: "hsl(var(--amber) / 0.06)",  border: "hsl(var(--amber) / 0.2)",  text: "text-amber",  badge: "hsl(var(--amber) / 0.12)" },
  violet: { bg: "hsl(var(--violet) / 0.06)", border: "hsl(var(--violet) / 0.2)", text: "text-violet", badge: "hsl(var(--violet) / 0.12)" },
  teal:   { bg: "hsl(150 55% 52% / 0.06)",   border: "hsl(150 55% 52% / 0.2)",   text: "text-teal",   badge: "hsl(150 55% 52% / 0.12)" },
};

const categoryIcon: Record<string, React.ElementType> = {
  Energy:    Zap,
  Curiosity: Lightbulb,
  Values:    Heart,
  Strengths: Star,
  People:    Eye,
  Direction: Map,
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function getNextPrompt(entries: JournalEntry[]) {
  const usedIds = new Set(entries.map((e) => e.promptId));
  const unused = promptLibrary.filter((p) => !usedIds.has(p.id));
  if (unused.length === 0) return promptLibrary[Math.floor(Math.random() * promptLibrary.length)];
  // Rotate through categories for variety
  const categories = [...new Set(promptLibrary.map((p) => p.category))];
  const lastCategory = entries[entries.length - 1]?.category;
  const nextCategory = categories[(categories.indexOf(lastCategory ?? "") + 1) % categories.length];
  const fromCategory = unused.filter((p) => p.category === nextCategory);
  return fromCategory.length > 0
    ? fromCategory[0]
    : unused[Math.floor(Math.random() * unused.length)];
}

// ── Write View ────────────────────────────────────────────────────────────────

function WriteView({
  entries,
  onSave,
}: {
  entries: JournalEntry[];
  onSave: (entry: JournalEntry) => void;
}) {
  const prompt = getNextPrompt(entries);
  const c = colorMap[prompt.color];
  const [text, setText] = useState("");
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setText(val);
    setWordCount(val.trim() ? val.trim().split(/\s+/).length : 0);
    if (val.split(" ").length > 15 && !showFollowUp) setShowFollowUp(true);
  };

  const handleSave = () => {
    if (!text.trim() || text.trim().split(/\s+/).length < 5) {
      toast.error("Write a little more before saving.");
      return;
    }
    const entry: JournalEntry = {
      id: Date.now().toString(),
      promptId: prompt.id,
      promptText: prompt.prompt,
      category: prompt.category,
      content: text.trim(),
      date: new Date().toISOString(),
      tags: [],
    };
    onSave(entry);
    setText("");
    setWordCount(0);
    setShowFollowUp(false);
    toast.success("Entry saved", { description: "Your reflection has been recorded." });
  };

  const Icon = categoryIcon[prompt.category] ?? BookOpen;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Prompt card */}
      <div
        className="rounded-2xl p-6 mb-6 border"
        style={{ background: c.bg, borderColor: c.border }}
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: c.badge }}>
            <Icon className={`w-3.5 h-3.5 ${c.text}`} />
          </div>
          <span className={`text-xs font-semibold uppercase tracking-wider ${c.text}`}>
            {prompt.category}
          </span>
        </div>
        <h2 className="text-xl font-bold text-foreground leading-relaxed mb-2">
          {prompt.prompt}
        </h2>
        {showFollowUp && (
          <p className="text-sm text-muted-foreground mt-3 pt-3 border-t border-border/30 animate-fade-in">
            <span className={`font-medium ${c.text}`}>Going deeper: </span>
            {prompt.followUp}
          </p>
        )}
      </div>

      {/* Textarea */}
      <div className="relative mb-4">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleChange}
          rows={8}
          placeholder="Write freely. There are no wrong answers here…"
          className="w-full rounded-2xl border border-border bg-card px-5 py-4 text-foreground text-sm leading-relaxed placeholder:text-muted-foreground/50 focus:outline-none focus:border-border/60 resize-none transition-colors"
          style={{ minHeight: "200px" }}
        />
        <span className="absolute bottom-3 right-4 text-xs text-muted-foreground/40">
          {wordCount} words
        </span>
      </div>

      <div className="flex items-center gap-3">
        <Button
          onClick={handleSave}
          disabled={wordCount < 5}
          className="gap-2 text-primary-foreground hover:opacity-90 disabled:opacity-40"
          style={{ background: `linear-gradient(135deg, ${c.bg.replace("0.06", "1")}, hsl(var(--coral)))` }}
        >
          <Check className="w-4 h-4" />
          Save reflection
        </Button>
        <span className="text-xs text-muted-foreground">
          {promptLibrary.length - entries.length} prompts remaining
        </span>
      </div>
    </div>
  );
}

// ── Entries View ──────────────────────────────────────────────────────────────

function EntriesView({
  entries,
  onSelectEntry,
}: {
  entries: JournalEntry[];
  onSelectEntry: (entry: JournalEntry) => void;
}) {
  const categories = [...new Set(entries.map((e) => e.category))];

  if (entries.length === 0) {
    return (
      <div className="text-center py-16">
        <BookOpen className="w-10 h-10 text-muted-foreground/30 mx-auto mb-4" />
        <p className="text-muted-foreground text-sm">Your journal entries will appear here.</p>
        <p className="text-xs text-muted-foreground/60 mt-1">Start by writing your first reflection.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {categories.map((cat) => {
        const catEntries = entries.filter((e) => e.category === cat).reverse();
        const color = promptLibrary.find((p) => p.category === cat)?.color ?? "coral";
        const c = colorMap[color];
        const Icon = categoryIcon[cat] ?? BookOpen;
        return (
          <div key={cat}>
            <div className="flex items-center gap-2 mb-3">
              <Icon className={`w-3.5 h-3.5 ${c.text}`} />
              <span className={`text-xs font-semibold uppercase tracking-wider ${c.text}`}>{cat}</span>
              <span className="text-xs text-muted-foreground">({catEntries.length})</span>
            </div>
            <div className="space-y-3">
              {catEntries.map((entry) => (
                <button
                  key={entry.id}
                  onClick={() => onSelectEntry(entry)}
                  className="w-full text-left border rounded-2xl p-4 transition-all hover:border-border hover:bg-surface-2 bg-card"
                  style={{ borderColor: "hsl(var(--border))" }}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <p className="text-sm font-medium text-foreground/80 leading-relaxed line-clamp-2">
                      {entry.promptText}
                    </p>
                    <span className="text-xs text-muted-foreground/50 shrink-0 mt-0.5">
                      {formatDate(entry.date)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {entry.content}
                  </p>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Insights View ─────────────────────────────────────────────────────────────

function InsightsView({ entries }: { entries: JournalEntry[] }) {
  const [insights, setInsights] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const generateInsights = async () => {
    if (entries.length < 2) {
      toast.error("Write at least 2 entries to get insights.");
      return;
    }
    setLoading(true);
    setInsights("");
    try {
      const entryText = entries
        .slice(-8)
        .map((e) => `[${e.category}] Prompt: "${e.promptText}"\nReflection: "${e.content}"`)
        .join("\n\n---\n\n");

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/journal-insights`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ type: "insights", entries: entryText }),
        }
      );

      if (!response.ok || !response.body) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error ?? "Failed to fetch insights");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let done = false;

      while (!done) {
        const { done: d, value } = await reader.read();
        if (d) break;
        buffer += decoder.decode(value, { stream: true });
        let nl: number;
        while ((nl = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, nl);
          buffer = buffer.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const j = line.slice(6).trim();
          if (j === "[DONE]") { done = true; break; }
          try {
            const parsed = JSON.parse(j);
            const chunk = parsed.choices?.[0]?.delta?.content;
            if (chunk) setInsights((prev) => prev + chunk);
          } catch { /* skip */ }
        }
      }

      setHasGenerated(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const categoryBreakdown = promptLibrary
    .map((p) => p.category)
    .filter((v, i, a) => a.indexOf(v) === i)
    .map((cat) => ({
      cat,
      count: entries.filter((e) => e.category === cat).length,
      color: promptLibrary.find((p) => p.category === cat)?.color ?? "coral",
    }))
    .filter((c) => c.count > 0);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-gradient-card border border-border/50 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-coral">{entries.length}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Entries written</p>
        </div>
        <div className="bg-gradient-card border border-border/50 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-violet">{categoryBreakdown.length}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Areas explored</p>
        </div>
        <div className="bg-gradient-card border border-border/50 rounded-2xl p-4 text-center col-span-2 sm:col-span-1">
          <p className="text-2xl font-bold text-amber">
            {entries.reduce((acc, e) => acc + e.content.split(/\s+/).length, 0)}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">Words reflected</p>
        </div>
      </div>

      {/* Category breakdown */}
      {categoryBreakdown.length > 0 && (
        <div className="bg-gradient-card border border-border/50 rounded-2xl p-5">
          <h3 className="font-semibold text-foreground text-sm mb-4">Areas of exploration</h3>
          <div className="space-y-3">
            {categoryBreakdown.map(({ cat, count, color }) => {
              const c = colorMap[color];
              const Icon = categoryIcon[cat] ?? BookOpen;
              const pct = Math.round((count / Math.max(entries.length, 1)) * 100);
              return (
                <div key={cat}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Icon className={`w-3.5 h-3.5 ${c.text}`} />
                    <span className="text-xs font-medium text-foreground">{cat}</span>
                    <span className="text-xs text-muted-foreground ml-auto">{count} {count === 1 ? "entry" : "entries"}</span>
                  </div>
                  <div className="h-1.5 bg-border rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, background: `hsl(var(--${color}))` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* AI Insights */}
      <div
        className="border rounded-2xl p-5"
        style={{ background: "hsl(var(--violet) / 0.05)", borderColor: "hsl(var(--violet) / 0.2)" }}
      >
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "hsl(var(--violet) / 0.15)" }}>
              <Sparkles className="w-4 h-4 text-violet" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-sm">Patterns we're noticing</h3>
              <p className="text-xs text-muted-foreground">AI-generated insights from your reflections</p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={generateInsights}
            disabled={loading || entries.length < 2}
            className="text-xs gap-1.5 text-primary-foreground hover:opacity-90 shrink-0"
            style={{ background: "linear-gradient(135deg, hsl(var(--violet)), hsl(var(--coral)))" }}
          >
            {loading
              ? <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              : <Sparkles className="w-3.5 h-3.5" />}
            {loading ? "Analyzing…" : hasGenerated ? "Refresh" : "Analyze"}
          </Button>
        </div>

        {insights ? (
          <div
            className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line rounded-xl p-4"
            style={{ background: "hsl(var(--violet) / 0.08)" }}
          >
            {insights}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">
            {entries.length < 2
              ? "Write at least 2 entries and then come back here for personalized pattern insights."
              : "Your reflections are ready to be analyzed. Tap Analyze to discover what patterns emerge from your thinking."}
          </p>
        )}

        {insights && (
          <div className="mt-4 pt-3 border-t border-border/30">
            <p className="text-xs text-muted-foreground mb-2">These patterns can guide your Path Finder results:</p>
            <Link to="/path-finder">
              <Button size="sm" variant="outline" className="gap-1.5 text-xs border-border hover:border-violet/40 text-violet">
                Open Path Finder
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Timeline View ─────────────────────────────────────────────────────────────

function TimelineView({ entries }: { entries: JournalEntry[] }) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-16">
        <TrendingUp className="w-10 h-10 text-muted-foreground/30 mx-auto mb-4" />
        <p className="text-muted-foreground text-sm">Your evolution timeline will grow here.</p>
        <p className="text-xs text-muted-foreground/60 mt-1">Start writing to see your journey unfold.</p>
      </div>
    );
  }

  const sorted = [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="max-w-2xl mx-auto">
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-4 top-0 bottom-0 w-px bg-border/50" />

        <div className="space-y-4 pl-12">
          {sorted.map((entry, i) => {
            const color = promptLibrary.find((p) => p.id === entry.promptId)?.color ?? "coral";
            const c = colorMap[color];
            const Icon = categoryIcon[entry.category] ?? BookOpen;
            const isLast = i === sorted.length - 1;

            return (
              <div key={entry.id} className="relative">
                {/* Dot */}
                <div
                  className="absolute -left-[2.25rem] w-6 h-6 rounded-full flex items-center justify-center border-2"
                  style={{
                    background: isLast ? `hsl(var(--${color}))` : c.bg,
                    borderColor: `hsl(var(--${color}))`,
                  }}
                >
                  {isLast
                    ? <Circle className="w-2.5 h-2.5 text-background fill-current" />
                    : <Check className="w-3 h-3" style={{ color: `hsl(var(--${color}))` }} />}
                </div>

                <div
                  className="border rounded-2xl p-4 transition-all"
                  style={{
                    background: isLast ? c.bg : "hsl(var(--card))",
                    borderColor: isLast ? c.border : "hsl(var(--border))",
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: c.badge }}>
                      <Icon className={`w-3 h-3 ${c.text}`} />
                    </div>
                    <span className={`text-xs font-semibold ${c.text}`}>{entry.category}</span>
                    <span className="text-xs text-muted-foreground ml-auto">{formatDate(entry.date)}</span>
                    {isLast && (
                      <span className={`text-xs font-semibold ${c.text} bg-surface-2 px-2 py-0.5 rounded-full`}>
                        Latest
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-medium text-muted-foreground mb-1.5">{entry.promptText}</p>
                  <p className="text-sm text-foreground/80 leading-relaxed line-clamp-3">{entry.content}</p>
                </div>
              </div>
            );
          })}

          {/* Future node */}
          <div className="relative">
            <div
              className="absolute -left-[2.25rem] w-6 h-6 rounded-full flex items-center justify-center border-2 border-dashed"
              style={{ borderColor: "hsl(var(--border))", background: "transparent" }}
            >
              <ArrowRight className="w-3 h-3 text-muted-foreground/40" />
            </div>
            <div className="border border-dashed border-border/40 rounded-2xl p-4 text-center">
              <p className="text-xs text-muted-foreground/50">Your next reflection awaits</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Entry Detail ──────────────────────────────────────────────────────────────

function EntryDetail({
  entry,
  onBack,
}: {
  entry: JournalEntry;
  onBack: () => void;
}) {
  const color = promptLibrary.find((p) => p.id === entry.promptId)?.color ?? "coral";
  const c = colorMap[color];
  const Icon = categoryIcon[entry.category] ?? BookOpen;

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ChevronLeft className="w-3.5 h-3.5" /> Back to entries
      </button>

      <div className="border rounded-2xl p-6" style={{ background: c.bg, borderColor: c.border }}>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: c.badge }}>
            <Icon className={`w-3.5 h-3.5 ${c.text}`} />
          </div>
          <span className={`text-xs font-semibold uppercase tracking-wider ${c.text}`}>{entry.category}</span>
          <span className="text-xs text-muted-foreground ml-auto">{formatDate(entry.date)}</span>
        </div>
        <h2 className="font-bold text-foreground mb-4 leading-relaxed">{entry.promptText}</h2>
        <p className="text-sm text-foreground/85 leading-loose whitespace-pre-line">{entry.content}</p>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

type View = "write" | "entries" | "insights" | "timeline";

export default function Journal() {
  const [view, setView] = useState<View>("write");
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);

  const addEntry = (entry: JournalEntry) => {
    setEntries((prev) => [...prev, entry]);
    setView("entries");
  };

  const tabs: { key: View; label: string; icon: React.ElementType }[] = [
    { key: "write",    label: "Reflect",  icon: BookOpen },
    { key: "entries",  label: "Entries",  icon: Clock },
    { key: "insights", label: "Insights", icon: Sparkles },
    { key: "timeline", label: "Timeline", icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container max-w-3xl">

          {/* Header */}
          <div className="mb-8">
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium mb-4 border"
              style={{ background: "hsl(var(--coral) / 0.06)", borderColor: "hsl(var(--coral) / 0.2)" }}
            >
              <BookOpen className="w-4 h-4 text-coral" />
              <span className="text-coral">Path Journal</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Your path begins with{" "}
              <span className="bg-gradient-coral bg-clip-text text-transparent">understanding yourself</span>
            </h1>
            <p className="text-muted-foreground max-w-lg leading-relaxed">
              The Path Journal helps you reflect on your experiences, explore your thinking, and
              notice the patterns that reveal who you are becoming.
            </p>
          </div>

          {/* Tab bar */}
          <div className="flex gap-1 bg-surface-2 p-1 rounded-2xl mb-8">
            {tabs.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => { setView(key); setSelectedEntry(null); }}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  view === key
                    ? "bg-gradient-card border border-border/50 text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>

          {/* Views */}
          {view === "write" && (
            <WriteView entries={entries} onSave={addEntry} />
          )}

          {view === "entries" && !selectedEntry && (
            <EntriesView entries={entries} onSelectEntry={setSelectedEntry} />
          )}

          {view === "entries" && selectedEntry && (
            <EntryDetail entry={selectedEntry} onBack={() => setSelectedEntry(null)} />
          )}

          {view === "insights" && (
            <InsightsView entries={entries} />
          )}

          {view === "timeline" && (
            <TimelineView entries={entries} />
          )}

          {/* Bottom CTA */}
          {view !== "write" && (
            <div className="mt-10 bg-gradient-card border border-border/50 rounded-2xl p-6 text-center">
              <BookOpen className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-1.5">Keep reflecting</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-4">
                Your path becomes clearer when you learn to listen to yourself.
              </p>
              <Button
                onClick={() => setView("write")}
                className="gap-2 text-primary-foreground hover:opacity-90"
                style={{ background: "linear-gradient(135deg, hsl(var(--coral)), hsl(var(--peach)))" }}
              >
                <BookOpen className="w-4 h-4" />
                Write a reflection
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
