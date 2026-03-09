import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import {
  FlaskConical, Sparkles, ChevronRight, CheckCircle2, Clock, Lightbulb,
  ArrowRight, Target, BarChart3, Flame, Star, BookOpen, Cpu, Brush,
  Users, TrendingUp, Zap, Brain, MessageCircle, ChevronDown, ChevronUp,
  RefreshCw, Play, Check,
} from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

// ── Types ─────────────────────────────────────────────────────────────────────

type ExperimentStatus = "available" | "active" | "completed";

interface DayActivity {
  day: number;
  title: string;
  description: string;
  reflection: string;
}

interface Experiment {
  id: string;
  title: string;
  tagline: string;
  category: string;
  duration: 7 | 14;
  icon: React.ElementType;
  colorKey: "amber" | "violet" | "coral" | "teal";
  activities: DayActivity[];
}

interface ActiveExperiment extends Experiment {
  status: ExperimentStatus;
  currentDay: number;
  completedDays: number[];
  reflections: Record<number, string>;
  startedAt: string;
}

// ── Data ──────────────────────────────────────────────────────────────────────

const colorTokens: Record<string, { bg: string; border: string; text: string; badge: string; glow: string }> = {
  amber:  { bg: "hsl(var(--amber) / 0.06)",  border: "hsl(var(--amber) / 0.2)",  text: "text-amber",  badge: "hsl(var(--amber) / 0.12)",  glow: "hsl(var(--amber) / 0.15)" },
  violet: { bg: "hsl(var(--violet) / 0.06)", border: "hsl(var(--violet) / 0.2)", text: "text-violet", badge: "hsl(var(--violet) / 0.12)", glow: "hsl(var(--violet) / 0.15)" },
  coral:  { bg: "hsl(var(--coral) / 0.06)",  border: "hsl(var(--coral) / 0.2)",  text: "text-coral",  badge: "hsl(var(--coral) / 0.12)",  glow: "hsl(var(--coral) / 0.15)" },
  teal:   { bg: "hsl(150 55% 52% / 0.06)",   border: "hsl(150 55% 52% / 0.2)",   text: "text-teal",   badge: "hsl(150 55% 52% / 0.12)",   glow: "hsl(150 55% 52% / 0.15)" },
};

const experimentCatalog: Experiment[] = [
  {
    id: "ai-builder",
    title: "Explore AI Product Builder",
    tagline: "Discover if building AI tools excites you",
    category: "Technology",
    duration: 7,
    icon: Cpu,
    colorKey: "amber",
    activities: [
      { day: 1, title: "Understand what AI products are",    description: "Spend 15 minutes reading about AI tools that solve real problems. Browse Product Hunt's AI section or scan a tech newsletter.",        reflection: "What surprised you most about how AI products work?" },
      { day: 2, title: "Explore real-world AI tools",        description: "Pick 2-3 AI tools and actually use them. Try Notion AI, Perplexity, or any AI assistant you haven't tried before.",                  reflection: "Which tool felt most useful? What problem was it solving?" },
      { day: 3, title: "Build something small with AI",      description: "Use a no-code AI tool like Make.com, Zapier AI, or ChatGPT to automate one small task in your life.",                                  reflection: "What did you create? Did the process feel natural or frustrating?" },
      { day: 4, title: "Read how AI startups are built",     description: "Read one story about an AI startup founder (IndieHackers, FirstRound blog, or Lenny's Newsletter). Focus on how they started.",      reflection: "What resonated with you in their story?" },
      { day: 5, title: "Identify one problem AI could solve", description: "Think of a real frustration you have and write down how AI could potentially help. Don't worry about how — just explore the idea.", reflection: "Does thinking about this problem give you energy or feel like work?" },
      { day: 6, title: "Sketch a simple AI tool idea",       description: "Sketch or write a 1-paragraph description of a simple AI tool you'd want to exist. Who would use it? What problem does it solve?",    reflection: "How did it feel to imagine building something real?" },
      { day: 7, title: "Reflect on the whole week",          description: "Look back at your 6 days. Write 3 sentences on what you learned about yourself and whether this direction pulls at you.",             reflection: "Would you want to spend more time exploring AI product building?" },
    ],
  },
  {
    id: "content-creator",
    title: "Explore Content & Storytelling",
    tagline: "Discover if sharing ideas through writing excites you",
    category: "Creative",
    duration: 7,
    icon: Brush,
    colorKey: "coral",
    activities: [
      { day: 1, title: "Read 3 pieces of writing you admire",  description: "Find 3 articles, essays, or newsletters you find compelling. Notice what makes them effective.",                                   reflection: "What do the pieces you admire have in common?" },
      { day: 2, title: "Write a short personal essay",         description: "Write 200 words about something you genuinely believe in or have experienced. Don't edit — just write.",                          reflection: "Did writing feel natural or difficult? Did you lose track of time?" },
      { day: 3, title: "Study one creator's strategy",         description: "Pick a writer or creator you admire. How do they share ideas? What platform, format, and frequency do they use?",                 reflection: "What elements of their approach could you see yourself adopting?" },
      { day: 4, title: "Write something for a real audience",  description: "Publish a short post on LinkedIn, a personal blog, or even just share with one friend. It doesn't need to be perfect.",          reflection: "How did it feel to share your thinking with others?" },
      { day: 5, title: "Explore different content formats",    description: "Spend 20 minutes experimenting with a format you've never tried: a thread, a video script, a visual essay, or a short podcast.", reflection: "Which format felt most natural for how you think?" },
      { day: 6, title: "Map out a content idea",               description: "Imagine a simple newsletter or content series. What topic would you cover? Who would it help? Write a brief outline.",            reflection: "Does the idea of building a consistent creative practice excite you?" },
      { day: 7, title: "Reflect on the week",                  description: "Review your week of exploration. What felt energizing? What felt like a chore? Be honest with yourself.",                         reflection: "Could you see yourself dedicating real time to this kind of work?" },
    ],
  },
  {
    id: "startup-operator",
    title: "Explore Startup Operations",
    tagline: "Discover if building and running things excites you",
    category: "Entrepreneurship",
    duration: 7,
    icon: TrendingUp,
    colorKey: "violet",
    activities: [
      { day: 1, title: "Study how startups work",             description: "Read or watch a short primer on how startups operate — YC Startup School, Stratechery, or Lenny's Newsletter are great starting points.", reflection: "What about startup culture surprised or excited you?" },
      { day: 2, title: "Talk to someone building something",  description: "Reach out to one founder, freelancer, or early-stage builder you know. Ask them one question about what their day actually looks like.", reflection: "What stood out from that conversation?" },
      { day: 3, title: "Identify a problem worth solving",    description: "Walk through your day and note 3 problems people (including you) face. Write them down without judging whether they're 'big enough'.",     reflection: "Which problem made you most curious or frustrated?" },
      { day: 4, title: "Map a simple business model",         description: "Pick one of your problems and sketch how someone might make money solving it. Even a rough model: who pays, how much, why.",             reflection: "Did mapping this feel interesting or tedious?" },
      { day: 5, title: "Read one indie founder's story",      description: "Find a story from IndieHackers or a Substack about someone who built something small and sustainable.",                                   reflection: "What part of their journey do you relate to most?" },
      { day: 6, title: "Design your minimum viable experiment", description: "If you were to test one small business idea in 30 days, what would it be? Write a one-paragraph description.",                        reflection: "How does it feel to imagine running your own thing?" },
      { day: 7, title: "Reflect on the week",                  description: "Look back at what you explored. What energized you? What felt uncertain? What do you want to learn more about?",                     reflection: "Does the path of building things feel like it fits who you are?" },
    ],
  },
  {
    id: "community-builder",
    title: "Explore Community Building",
    tagline: "Discover if connecting and growing people excites you",
    category: "People & Leadership",
    duration: 7,
    icon: Users,
    colorKey: "teal",
    activities: [
      { day: 1, title: "Study communities you admire",         description: "Think of 2-3 communities (online or offline) that feel alive and meaningful. What makes them work?",                                    reflection: "What elements make those communities feel worth belonging to?" },
      { day: 2, title: "Contribute to a community",            description: "Post a thoughtful comment, question, or insight in a community you're already part of. Make it genuinely useful.",                     reflection: "How did it feel to show up for others?" },
      { day: 3, title: "Interview a community member",         description: "Have a 15-minute conversation with someone in a community you admire. Ask what brought them there and what they get from it.",          reflection: "What did you learn about what people are searching for?" },
      { day: 4, title: "Identify an underserved group",        description: "Think of a group of people who would benefit from connection and support but don't have a great community yet.",                        reflection: "What problem would a community for this group solve?" },
      { day: 5, title: "Design a simple gathering",            description: "Sketch a simple community format: who it's for, what brings them together, and how it would run week to week.",                        reflection: "Does the work of organizing and energizing people excite you?" },
      { day: 6, title: "Facilitate a small discussion",        description: "Organize or lead a 20-minute conversation or discussion — even informally with 2-3 friends or colleagues.",                           reflection: "What did you notice about how you showed up as a facilitator?" },
      { day: 7, title: "Reflect on the week",                  description: "Review the week. Where did you feel most alive? What felt draining? What surprised you about yourself?",                              reflection: "Could you imagine spending your work building communities for others?" },
    ],
  },
  {
    id: "learning-designer",
    title: "Explore Learning & Education Design",
    tagline: "Discover if helping others grow and learn excites you",
    category: "Education",
    duration: 7,
    icon: BookOpen,
    colorKey: "amber",
    activities: [
      { day: 1, title: "Reflect on your best learning experience", description: "Think of a time you learned something deeply — a course, a mentor, a book. What made it exceptional?",                          reflection: "What elements of learning matter most to you?" },
      { day: 2, title: "Teach something you know well",         description: "Write a simple 3-step explanation of something you understand well. Make it clear enough for a complete beginner.",                  reflection: "Did breaking something down feel energizing?" },
      { day: 3, title: "Analyze how great courses are built",   description: "Browse 2-3 well-reviewed online courses (Coursera, Maven, Reforge). Notice how they structure information and build momentum.",      reflection: "What design choices made them effective?" },
      { day: 4, title: "Create a micro-lesson",                 description: "Build a 5-minute lesson on any topic. It could be a short video, a written guide, or a slide deck.",                               reflection: "How did it feel to design an experience for someone else's growth?" },
      { day: 5, title: "Talk to someone who learns from you",   description: "Ask a friend, colleague, or peer what they think you're good at explaining. Listen for patterns in their answers.",                  reflection: "What did their perspective reveal about your strengths?" },
      { day: 6, title: "Design your dream course concept",      description: "Sketch a simple concept for a course or workshop you'd want to create. What would it teach? Who would it serve?",                   reflection: "Does the idea of building something that teaches feel like a fit?" },
      { day: 7, title: "Reflect on the week",                   description: "Look back at what you created and explored. Where did you feel most alive and most uncertain?",                                      reflection: "Could you see yourself designing learning experiences as your work?" },
    ],
  },
  {
    id: "deep-work-challenge",
    title: "Explore Deep Work & Focus",
    tagline: "Discover if focused, independent work suits you",
    category: "Work Style",
    duration: 14,
    icon: Brain,
    colorKey: "violet",
    activities: [
      { day: 1,  title: "Read about deep work",              description: "Read the introduction to Cal Newport's Deep Work concept or watch his 10-min talk. Take notes.",                                           reflection: "Does the idea of uninterrupted focus excite or intimidate you?" },
      { day: 2,  title: "Eliminate one distraction",         description: "Identify your single biggest distraction and remove it for the day. Log what happens.",                                                   reflection: "What did you notice about your attention without that distraction?" },
      { day: 3,  title: "Schedule a 90-minute focus block",  description: "Block 90 uninterrupted minutes for your most important task. No phone, no notifications, no multitasking.",                               reflection: "How did the quality of your work compare to a normal work session?" },
      { day: 4,  title: "Track your energy",                 description: "Every 2 hours, note your energy level (1–5) and what you were doing. Look for patterns by end of day.",                                  reflection: "When do you do your best thinking?" },
      { day: 5,  title: "Design your ideal work environment", description: "Experiment with a different space, setup, or time of day for your most focused work.",                                                   reflection: "What environmental factors help you think clearly?" },
      { day: 6,  title: "Do a single-task day",              description: "Work on just one main project all day. Resist the urge to context-switch.",                                                               reflection: "How did it feel to commit to one thing?" },
      { day: 7,  title: "Mid-point reflection",              description: "Halfway through. Write what you've learned about how you work best so far.",                                                              reflection: "What changes have you noticed in your output or how you feel?" },
      { day: 8,  title: "Explore a topic at depth",          description: "Spend 60 minutes going deep on one topic that genuinely interests you. No skimming — actually understand it.",                           reflection: "What did deep exploration reveal about your interests?" },
      { day: 9,  title: "Protect your morning",              description: "For one day, do your most important thinking before you check email or messages. Guard the first hour.",                                  reflection: "How did starting intentionally change the quality of your morning?" },
      { day: 10, title: "Build something tangible",          description: "Use a focused session to create something real: a document, a design, a plan, a prototype.",                                              reflection: "How satisfying was it to finish something real?" },
      { day: 11, title: "Reduce meetings",                   description: "Decline or postpone any non-essential meetings today. Use that time for deep work instead.",                                              reflection: "How much better was your output when you had uninterrupted time?" },
      { day: 12, title: "Evaluate your week 2 patterns",     description: "Review your tracking notes. Where were you most productive? What conditions helped most?",                                               reflection: "What would your ideal work week look like based on this data?" },
      { day: 13, title: "Share one insight",                 description: "Write one insight from these two weeks and share it — a post, a message to a friend, or just a journal entry.",                         reflection: "What's the one thing you learned about yourself that surprised you?" },
      { day: 14, title: "Design your deep work practice",    description: "Write a simple 3-rule system for how you'll protect your best thinking time going forward.",                                              reflection: "Would you describe yourself as someone who thrives with deep, independent work?" },
    ],
  },
];

const categories = [
  { label: "All",              icon: FlaskConical },
  { label: "Technology",       icon: Cpu },
  { label: "Creative",         icon: Brush },
  { label: "Entrepreneurship", icon: TrendingUp },
  { label: "People & Leadership", icon: Users },
  { label: "Education",        icon: BookOpen },
  { label: "Work Style",       icon: Brain },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function colorClass(key: string, type: "text" | "bg" | "border" | "badge" | "glow") {
  return colorTokens[key]?.[type] ?? "";
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatsBar({ active, completed, available }: { active: number; completed: number; available: number }) {
  return (
    <div className="grid grid-cols-3 gap-3 mb-8">
      {[
        { label: "Active", value: active,    color: "amber",  icon: Flame },
        { label: "Completed", value: completed, color: "teal", icon: CheckCircle2 },
        { label: "Available", value: available, color: "violet", icon: FlaskConical },
      ].map(({ label, value, color, icon: Icon }) => (
        <div key={label}
          className="border rounded-2xl p-4 text-center"
          style={{ background: colorTokens[color].bg, borderColor: colorTokens[color].border }}>
          <Icon className={`w-4 h-4 mx-auto mb-1.5 ${colorTokens[color].text}`} />
          <p className={`text-2xl font-bold ${colorTokens[color].text}`}>{value}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
        </div>
      ))}
    </div>
  );
}

function ExperimentCard({
  experiment,
  isActive,
  isCompleted,
  onStart,
  onOpen,
}: {
  experiment: Experiment;
  isActive: boolean;
  isCompleted: boolean;
  onStart: () => void;
  onOpen: () => void;
}) {
  const c = experiment.colorKey;
  const Icon = experiment.icon;
  return (
    <div
      className="border rounded-2xl p-5 transition-all hover:scale-[1.01] cursor-pointer"
      style={{ background: colorTokens[c].bg, borderColor: colorTokens[c].border }}
      onClick={isActive ? onOpen : undefined}
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: colorTokens[c].badge }}>
          <Icon className={`w-5 h-5 ${colorTokens[c].text}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full text-foreground/70"
              style={{ background: colorTokens[c].badge }}>
              {experiment.category}
            </span>
            <span className="text-xs text-muted-foreground">{experiment.duration} days</span>
            {isCompleted && (
              <span className="text-xs font-semibold text-teal flex items-center gap-1 ml-auto">
                <CheckCircle2 className="w-3.5 h-3.5" /> Complete
              </span>
            )}
            {isActive && (
              <span className={`text-xs font-semibold ${colorTokens[c].text} flex items-center gap-1 ml-auto`}>
                <Flame className="w-3.5 h-3.5" /> In Progress
              </span>
            )}
          </div>
          <h3 className="font-semibold text-foreground mb-1">{experiment.title}</h3>
          <p className="text-sm text-muted-foreground">{experiment.tagline}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-4">
        {isActive ? (
          <button
            onClick={(e) => { e.stopPropagation(); onOpen(); }}
            className={`flex items-center gap-1.5 text-xs font-medium ${colorTokens[c].text} hover:opacity-80 transition-opacity`}
          >
            <Play className="w-3.5 h-3.5" />
            Continue experiment
          </button>
        ) : isCompleted ? (
          <span className="text-xs text-teal flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5" /> Completed · great exploration
          </span>
        ) : (
          <button
            onClick={(e) => { e.stopPropagation(); onStart(); }}
            className={`flex items-center gap-1.5 text-xs font-medium ${colorTokens[c].text} hover:opacity-80 transition-opacity`}
          >
            <ArrowRight className="w-3.5 h-3.5" />
            Start this experiment
          </button>
        )}
        <Link
          to="/coach"
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-coral transition-colors ml-auto"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          Ask coach
        </Link>
      </div>
    </div>
  );
}

function DayView({
  experiment,
  currentDay,
  completedDays,
  reflections,
  onCompleteDay,
  onReflectionChange,
  onBack,
}: {
  experiment: ActiveExperiment;
  currentDay: number;
  completedDays: number[];
  reflections: Record<number, string>;
  onCompleteDay: (day: number, reflection: string) => void;
  onReflectionChange: (day: number, text: string) => void;
  onBack: () => void;
}) {
  const [expandedDay, setExpandedDay] = useState<number>(currentDay);
  const [aiInsight, setAiInsight] = useState<string>("");
  const [loadingInsight, setLoadingInsight] = useState(false);
  const c = experiment.colorKey;

  const fetchInsight = async (day: DayActivity, reflection: string) => {
    if (!reflection.trim()) return;
    setLoadingInsight(true);
    setAiInsight("");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/experiments-engine`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            type: "reflect",
            experimentTitle: experiment.title,
            dayTitle: day.title,
            reflection,
          }),
        }
      );
      if (!response.ok || !response.body) throw new Error("Failed");
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
            if (chunk) setAiInsight((prev) => prev + chunk);
          } catch { /* skip */ }
        }
      }
    } catch {
      toast.error("Couldn't load insight right now");
    } finally {
      setLoadingInsight(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
          ← Back
        </button>
        <div className="h-4 w-px bg-border" />
        <div className={`text-xs font-semibold ${colorTokens[c].text}`}>{experiment.title}</div>
      </div>

      {/* Progress bar */}
      <div className="bg-gradient-card border border-border/50 rounded-2xl p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="font-bold text-foreground">{experiment.title}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{completedDays.length} of {experiment.duration} days complete</p>
          </div>
          <div className={`text-lg font-bold ${colorTokens[c].text}`}>
            Day {currentDay}
          </div>
        </div>
        <div className="h-2 bg-border rounded-full overflow-hidden mb-3">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${(completedDays.length / experiment.duration) * 100}%`,
              background: `linear-gradient(90deg, ${colorTokens[c].bg.replace("0.06", "1")}, ${colorTokens[c].bg.replace("0.06", "0.7")})`,
              backgroundColor: `hsl(var(--${c}))`,
            }}
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {Array.from({ length: experiment.duration }, (_, i) => i + 1).map((d) => (
            <div key={d}
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium border transition-all"
              style={{
                background: completedDays.includes(d) ? colorTokens[c].badge : d === currentDay ? colorTokens[c].bg : "transparent",
                borderColor: completedDays.includes(d) || d === currentDay ? colorTokens[c].border : "hsl(var(--border))",
                color: completedDays.includes(d) ? `hsl(var(--${c}))` : d === currentDay ? `hsl(var(--${c}))` : "hsl(var(--muted-foreground))",
              }}>
              {completedDays.includes(d) ? <Check className="w-3 h-3" /> : d}
            </div>
          ))}
        </div>
      </div>

      {/* Day list */}
      <div className="space-y-3">
        {experiment.activities.map((activity) => {
          const isDone = completedDays.includes(activity.day);
          const isCurrent = activity.day === currentDay;
          const isLocked = activity.day > currentDay;
          const isExpanded = expandedDay === activity.day;
          const reflectionText = reflections[activity.day] ?? "";

          return (
            <div key={activity.day}
              className="border rounded-2xl overflow-hidden transition-all"
              style={{
                borderColor: isDone ? colorTokens[c].border : isCurrent ? colorTokens[c].border : "hsl(var(--border))",
                background: isDone ? colorTokens[c].bg : isCurrent ? colorTokens[c].bg : "hsl(var(--card))",
                opacity: isLocked ? 0.45 : 1,
              }}>
              <button
                disabled={isLocked}
                onClick={() => setExpandedDay(isExpanded ? -1 : activity.day)}
                className="w-full flex items-center gap-3 p-4 text-left"
              >
                <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
                  style={{
                    background: isDone ? colorTokens[c].badge : isCurrent ? colorTokens[c].badge : "hsl(var(--surface-2))",
                    color: isDone || isCurrent ? `hsl(var(--${c}))` : "hsl(var(--muted-foreground))",
                  }}>
                  {isDone ? <CheckCircle2 className="w-4 h-4" /> : activity.day}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs text-muted-foreground">Day {activity.day}</span>
                    {isCurrent && <span className={`text-xs font-semibold ${colorTokens[c].text}`}>Today</span>}
                    {isDone && <span className="text-xs text-teal font-medium">Done</span>}
                  </div>
                  <p className="font-medium text-foreground text-sm truncate">{activity.title}</p>
                </div>
                {!isLocked && (isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />)}
              </button>

              {isExpanded && !isLocked && (
                <div className="px-4 pb-5 space-y-4">
                  <div className="border-t border-border/30 pt-4">
                    <p className="text-sm text-foreground/90 leading-relaxed mb-3">{activity.description}</p>
                    <div className="rounded-xl p-3" style={{ background: colorTokens[c].badge }}>
                      <p className="text-xs font-semibold mb-1" style={{ color: `hsl(var(--${c}))` }}>Reflection prompt</p>
                      <p className="text-sm text-foreground/80">{activity.reflection}</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Your reflection</label>
                    <textarea
                      rows={3}
                      placeholder="What did you notice? Be honest with yourself…"
                      value={reflectionText}
                      onChange={(e) => onReflectionChange(activity.day, e.target.value)}
                      disabled={isDone}
                      className="w-full rounded-xl border border-border bg-surface-2 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-border resize-none disabled:opacity-60"
                    />
                  </div>

                  {aiInsight && (
                    <div className="rounded-xl p-4 border"
                      style={{ background: colorTokens[c].bg, borderColor: colorTokens[c].border }}>
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className={`w-3.5 h-3.5 ${colorTokens[c].text}`} />
                        <span className={`text-xs font-semibold ${colorTokens[c].text}`}>Coach Insight</span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{aiInsight}</p>
                    </div>
                  )}

                  <div className="flex gap-2 flex-wrap">
                    {!isDone && (
                      <button
                        onClick={() => onCompleteDay(activity.day, reflectionText)}
                        disabled={!reflectionText.trim()}
                        className={`flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-xl border transition-all disabled:opacity-40 disabled:cursor-not-allowed ${colorTokens[c].text}`}
                        style={{ background: colorTokens[c].badge, borderColor: colorTokens[c].border }}>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Complete day {activity.day}
                      </button>
                    )}
                    {reflectionText.trim() && !aiInsight && (
                      <button
                        onClick={() => fetchInsight(activity, reflectionText)}
                        disabled={loadingInsight}
                        className="flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-xl border border-border text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {loadingInsight ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                        {loadingInsight ? "Getting insight…" : "Get coach insight"}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function Experiments() {
  const [activeExperiments, setActiveExperiments] = useState<ActiveExperiment[]>([]);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [openExperimentId, setOpenExperimentId] = useState<string | null>(null);
  const [aiRecommendations, setAiRecommendations] = useState<string>("");
  const [loadingRec, setLoadingRec] = useState(false);

  const startExperiment = (exp: Experiment) => {
    if (activeExperiments.find((a) => a.id === exp.id)) {
      setOpenExperimentId(exp.id);
      return;
    }
    const newActive: ActiveExperiment = {
      ...exp,
      status: "active",
      currentDay: 1,
      completedDays: [],
      reflections: {},
      startedAt: new Date().toISOString(),
    };
    setActiveExperiments((prev) => [...prev, newActive]);
    setOpenExperimentId(exp.id);
    toast.success(`Started "${exp.title}"`, { description: "Day 1 is ready for you." });
  };

  const completeDay = (experimentId: string, day: number, reflection: string) => {
    setActiveExperiments((prev) =>
      prev.map((e) => {
        if (e.id !== experimentId) return e;
        const newCompleted = [...e.completedDays, day];
        const isFullyDone = newCompleted.length >= e.duration;
        if (isFullyDone) {
          setCompletedIds((c) => [...c, experimentId]);
          toast.success("Experiment complete! 🎉", {
            description: "You explored a new direction. That takes courage.",
          });
        } else {
          toast.success(`Day ${day} complete`, { description: reflection.slice(0, 60) + "…" });
        }
        return {
          ...e,
          completedDays: newCompleted,
          currentDay: isFullyDone ? e.duration : day + 1,
          status: isFullyDone ? "completed" : "active",
          reflections: { ...e.reflections, [day]: reflection },
        };
      })
    );
  };

  const updateReflection = (experimentId: string, day: number, text: string) => {
    setActiveExperiments((prev) =>
      prev.map((e) =>
        e.id === experimentId ? { ...e, reflections: { ...e.reflections, [day]: text } } : e
      )
    );
  };

  const fetchRecommendations = async () => {
    setLoadingRec(true);
    setAiRecommendations("");
    try {
      const completed = completedIds.map((id) => experimentCatalog.find((e) => e.id === id)?.title ?? id);
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/experiments-engine`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ type: "recommend", completedExperiments: completed }),
        }
      );
      if (!response.ok || !response.body) throw new Error("Failed");
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
            if (chunk) setAiRecommendations((prev) => prev + chunk);
          } catch { /* skip */ }
        }
      }
    } catch {
      toast.error("Couldn't load recommendations right now");
    } finally {
      setLoadingRec(false);
    }
  };

  const openExp = openExperimentId
    ? activeExperiments.find((e) => e.id === openExperimentId)
    : null;

  const filtered = selectedCategory === "All"
    ? experimentCatalog
    : experimentCatalog.filter((e) => e.category === selectedCategory);

  const stats = {
    active: activeExperiments.filter((e) => !completedIds.includes(e.id)).length,
    completed: completedIds.length,
    available: experimentCatalog.length - activeExperiments.length,
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container max-w-3xl">

          {/* Open experiment view */}
          {openExp ? (
            <DayView
              experiment={openExp}
              currentDay={openExp.currentDay}
              completedDays={openExp.completedDays}
              reflections={openExp.reflections}
              onCompleteDay={(day, ref) => completeDay(openExp.id, day, ref)}
              onReflectionChange={(day, text) => updateReflection(openExp.id, day, text)}
              onBack={() => setOpenExperimentId(null)}
            />
          ) : (
            <>
              {/* Header */}
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium mb-4 border"
                  style={{ background: colorTokens.amber.bg, borderColor: colorTokens.amber.border }}>
                  <FlaskConical className="w-4 h-4 text-amber" />
                  <span className="text-amber">Life Experiments</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                  Discover your path by{" "}
                  <span className="bg-gradient-amber bg-clip-text text-transparent">exploring it</span>
                </h1>
                <p className="text-muted-foreground max-w-lg leading-relaxed">
                  You don't need to have your entire future figured out. Clarity comes from trying small things and
                  seeing what resonates. Each experiment takes 5–30 minutes per day.
                </p>
              </div>

              {/* Stats */}
              <StatsBar active={stats.active} completed={stats.completed} available={stats.available} />

              {/* Active experiments spotlight */}
              {activeExperiments.filter((e) => !completedIds.includes(e.id)).length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Flame className="w-4 h-4 text-amber" />
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-amber">In Progress</h2>
                  </div>
                  <div className="space-y-3">
                    {activeExperiments
                      .filter((e) => !completedIds.includes(e.id))
                      .map((exp) => (
                        <ExperimentCard
                          key={exp.id}
                          experiment={exp}
                          isActive={true}
                          isCompleted={false}
                          onStart={() => startExperiment(exp)}
                          onOpen={() => setOpenExperimentId(exp.id)}
                        />
                      ))}
                  </div>
                </div>
              )}

              {/* AI Recommendations */}
              <div className="border rounded-2xl p-5 mb-8"
                style={{ background: "hsl(var(--violet) / 0.05)", borderColor: "hsl(var(--violet) / 0.2)" }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                      style={{ background: "hsl(var(--violet) / 0.15)" }}>
                      <Sparkles className="w-4 h-4 text-violet" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-sm">Personalized Suggestions</h3>
                      <p className="text-xs text-muted-foreground">Based on your exploration patterns</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={fetchRecommendations}
                    disabled={loadingRec}
                    className="text-xs gap-1.5 text-primary-foreground hover:opacity-90"
                    style={{ background: "linear-gradient(135deg, hsl(var(--violet)), hsl(var(--coral)))" }}
                  >
                    {loadingRec ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                    {loadingRec ? "Thinking…" : "Get suggestions"}
                  </Button>
                </div>
                {aiRecommendations ? (
                  <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line rounded-xl p-3"
                    style={{ background: "hsl(var(--violet) / 0.08)" }}>
                    {aiRecommendations}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Complete at least one experiment, then get AI-powered suggestions for what to explore next.
                  </p>
                )}
              </div>

              {/* Category filter */}
              <div className="flex gap-2 flex-wrap mb-5">
                {categories.map(({ label, icon: Icon }) => (
                  <button
                    key={label}
                    onClick={() => setSelectedCategory(label)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      selectedCategory === label
                        ? "border-amber-500/40 text-amber"
                        : "border-border text-muted-foreground hover:border-border/80 hover:text-foreground"
                    }`}
                    style={selectedCategory === label ? { background: colorTokens.amber.bg } : {}}
                  >
                    <Icon className="w-3 h-3" />
                    {label}
                  </button>
                ))}
              </div>

              {/* Experiment catalog */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-4 h-4 text-muted-foreground" />
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Explore Experiments
                  </h2>
                  <span className="text-xs text-muted-foreground">({filtered.length})</span>
                </div>
                <div className="space-y-3">
                  {filtered.map((exp) => (
                    <ExperimentCard
                      key={exp.id}
                      experiment={exp}
                      isActive={!!activeExperiments.find((a) => a.id === exp.id && !completedIds.includes(exp.id))}
                      isCompleted={completedIds.includes(exp.id)}
                      onStart={() => startExperiment(exp)}
                      onOpen={() => setOpenExperimentId(exp.id)}
                    />
                  ))}
                </div>
              </div>

              {/* Completed */}
              {completedIds.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle2 className="w-4 h-4 text-teal" />
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-teal">Completed</h2>
                    <span className="text-xs text-muted-foreground">({completedIds.length})</span>
                  </div>
                  <div className="space-y-3">
                    {experimentCatalog
                      .filter((e) => completedIds.includes(e.id))
                      .map((exp) => (
                        <ExperimentCard
                          key={exp.id}
                          experiment={exp}
                          isActive={false}
                          isCompleted={true}
                          onStart={() => {}}
                          onOpen={() => {}}
                        />
                      ))}
                  </div>
                </div>
              )}

              {/* Philosophy callout */}
              <div className="bg-gradient-card border border-border/50 rounded-2xl p-6 text-center">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
                  style={{ background: colorTokens.amber.badge }}>
                  <Target className="w-5 h-5 text-amber" />
                </div>
                <h3 className="font-bold text-foreground mb-2">The Experiment Mindset</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-4">
                  You don't discover your path by thinking alone. You discover it by exploring.
                </p>
                <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <BarChart3 className="w-3.5 h-3.5 text-teal" />
                    {completedIds.length} experiments complete
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FlaskConical className="w-3.5 h-3.5 text-amber" />
                    {activeExperiments.filter((e) => !completedIds.includes(e.id)).length} in progress
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ChevronRight className="w-3.5 h-3.5 text-violet" />
                    {experimentCatalog.length} total available
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
