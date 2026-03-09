import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Clock,
  Star,
  Play,
  CheckCircle,
  Lock,
  TrendingUp,
  Zap,
  Brain,
  Target,
  Users,
  BarChart2,
  ArrowRight,
} from "lucide-react";

const modules = [
  {
    id: 1,
    title: "AI Literacy for Professionals",
    desc: "Understand what AI actually is, what it can and can't do, and how to work alongside it effectively.",
    duration: "45 min",
    lessons: 6,
    level: "Beginner",
    icon: Zap,
    status: "available",
    progress: 40,
    tags: ["AI Fundamentals", "Must-Have"],
    color: "teal",
    lessons_list: [
      "What is generative AI (and what it isn't)",
      "The 10 AI tools changing every industry",
      "How to prompt like a pro",
      "AI ethics and what you need to know",
      "Integrating AI into your daily workflow",
      "Building an AI-first mindset",
    ],
  },
  {
    id: 2,
    title: "Thinking Like a Systems Builder",
    desc: "Learn to see processes, patterns, and leverage points — the core skill of the automation economy.",
    duration: "60 min",
    lessons: 8,
    level: "Intermediate",
    icon: Brain,
    status: "available",
    progress: 0,
    tags: ["Systems Thinking", "Strategy"],
    color: "violet",
    lessons_list: [
      "The systems mindset: seeing leverage everywhere",
      "Mapping processes you can automate",
      "Input-output thinking for career design",
      "How compounding applies to skills",
      "Building feedback loops in your work",
      "The difference between reactive and strategic work",
      "Designing your personal operating system",
      "Systems thinking case studies",
    ],
  },
  {
    id: 3,
    title: "Designing Your Career Strategy",
    desc: "Use first-principles thinking to design a career that's built for resilience, not just the next job title.",
    duration: "50 min",
    lessons: 7,
    level: "Intermediate",
    icon: Target,
    status: "available",
    progress: 0,
    tags: ["Career Design", "Strategy"],
    color: "amber",
    lessons_list: [
      "Why traditional career advice is broken",
      "Identity-first career design",
      "The reinvention portfolio approach",
      "Positioning in a crowded market",
      "How to make bold career moves with less risk",
      "Building your personal moat",
      "The 10-year career architecture exercise",
    ],
  },
  {
    id: 4,
    title: "Building Digital Leverage",
    desc: "Create assets, audiences, and systems that work for you — even when you're not working.",
    duration: "55 min",
    lessons: 7,
    level: "Advanced",
    icon: TrendingUp,
    status: "locked",
    progress: 0,
    tags: ["Digital Assets", "Income"],
    color: "teal",
    lessons_list: [],
  },
  {
    id: 5,
    title: "Community & Network as Career Capital",
    desc: "The most underrated professional skill. Build relationships that open doors you didn't know existed.",
    duration: "40 min",
    lessons: 5,
    level: "Beginner",
    icon: Users,
    status: "locked",
    progress: 0,
    tags: ["Networking", "Community"],
    color: "violet",
    lessons_list: [],
  },
  {
    id: 6,
    title: "Monetizing Your Reinvention",
    desc: "Practical strategies for earning from your skills during and after the transition period.",
    duration: "65 min",
    lessons: 9,
    level: "Advanced",
    icon: BarChart2,
    status: "locked",
    progress: 0,
    tags: ["Income Strategy", "Premium"],
    color: "amber",
    lessons_list: [],
  },
];

export default function Learn() {
  const [expanded, setExpanded] = useState<number | null>(1);
  const available = modules.filter((m) => m.status === "available");
  const locked = modules.filter((m) => m.status === "locked");

  const colorMap: Record<string, { icon: string; tag: string; bar: string }> = {
    teal: { icon: "bg-teal-500/10 text-teal", tag: "bg-teal-500/10 text-teal border-teal-500/20", bar: "bg-gradient-teal" },
    violet: { icon: "bg-violet-500/10 text-violet-500", tag: "bg-violet-500/10 text-violet-500 border-violet-500/20", bar: "bg-violet-500" },
    amber: { icon: "bg-amber-500/10 text-amber", tag: "bg-amber-500/10 text-amber border-amber-500/20", bar: "bg-gradient-amber" },
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-28 pb-20">
        <div className="container max-w-4xl">
          <div className="text-center mb-12">
            <p className="text-teal text-sm font-semibold uppercase tracking-widest mb-3">Learning System</p>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Short modules, lasting change
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Focused, interactive lessons designed for busy professionals navigating career reinvention.
            </p>
          </div>

          {/* Progress overview */}
          <div className="bg-gradient-card border border-border/50 rounded-2xl p-6 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="font-semibold text-foreground">Your Learning Progress</h3>
                <p className="text-sm text-muted-foreground">1 module in progress · 5 remaining</p>
              </div>
              <div className="flex gap-4 text-center text-sm">
                <div>
                  <div className="font-bold text-foreground">3</div>
                  <div className="text-muted-foreground text-xs">lessons done</div>
                </div>
                <div>
                  <div className="font-bold text-foreground">45</div>
                  <div className="text-muted-foreground text-xs">min learned</div>
                </div>
                <div>
                  <div className="font-bold text-gradient-teal">5%</div>
                  <div className="text-muted-foreground text-xs">complete</div>
                </div>
              </div>
            </div>
            <div className="h-2 bg-border rounded-full overflow-hidden">
              <div className="h-full bg-gradient-teal rounded-full" style={{ width: "5%" }} />
            </div>
          </div>

          {/* Available Modules */}
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-4">
            Available Now ({available.length})
          </h2>
          <div className="space-y-4 mb-8">
            {available.map((mod) => {
              const isOpen = expanded === mod.id;
              const c = colorMap[mod.color];
              const Icon = mod.icon;
              return (
                <div
                  key={mod.id}
                  className="bg-gradient-card border border-border/50 rounded-2xl overflow-hidden hover:border-teal-500/15 transition-colors"
                >
                  <button
                    className="w-full p-6 text-left"
                    onClick={() => setExpanded(isOpen ? null : mod.id)}
                  >
                    <div className="flex gap-4 items-start">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${c.icon}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap gap-2 mb-1.5">
                          {mod.tags.map((t) => (
                            <span key={t} className={`text-xs px-2.5 py-0.5 rounded-full border ${c.tag}`}>{t}</span>
                          ))}
                        </div>
                        <h3 className="font-bold text-foreground text-lg">{mod.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{mod.desc}</p>
                        <div className="flex flex-wrap gap-4 mt-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{mod.duration}</span>
                          <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{mod.lessons} lessons</span>
                          <span className="flex items-center gap-1"><Star className="w-3 h-3" />{mod.level}</span>
                        </div>
                        {mod.progress > 0 && (
                          <div className="mt-3">
                            <div className="h-1.5 bg-border rounded-full overflow-hidden max-w-[200px]">
                              <div className={`h-full ${c.bar} rounded-full`} style={{ width: `${mod.progress}%` }} />
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">{mod.progress}% complete</p>
                          </div>
                        )}
                      </div>
                      <Button
                        size="sm"
                        className={`shrink-0 ${mod.progress > 0 ? "bg-gradient-teal text-primary-foreground" : "bg-surface-2 border border-border text-muted-foreground hover:text-foreground"}`}
                      >
                        {mod.progress > 0 ? (
                          <><Play className="w-3 h-3 mr-1.5" />Continue</>
                        ) : (
                          <><Play className="w-3 h-3 mr-1.5" />Start</>
                        )}
                      </Button>
                    </div>
                  </button>

                  {isOpen && mod.lessons_list.length > 0 && (
                    <div className="px-6 pb-6 border-t border-border/40">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mt-4 mb-3">Lessons</h4>
                      <div className="space-y-2">
                        {mod.lessons_list.map((lesson, i) => (
                          <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-surface-2 transition-colors group cursor-pointer">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                              i < 3 && mod.progress > 0
                                ? "bg-teal text-primary-foreground"
                                : "bg-surface-2 border border-border text-muted-foreground"
                            }`}>
                              {i < 3 && mod.progress > 0 ? (
                                <CheckCircle className="w-3.5 h-3.5" />
                              ) : (
                                <span className="text-xs">{i + 1}</span>
                              )}
                            </div>
                            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{lesson}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Locked Modules */}
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-4">
            Premium Modules ({locked.length})
          </h2>
          <div className="space-y-3">
            {locked.map((mod) => {
              const c = colorMap[mod.color];
              const Icon = mod.icon;
              return (
                <div key={mod.id} className="bg-gradient-card border border-border/30 rounded-2xl p-5 opacity-70">
                  <div className="flex gap-4 items-center">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${c.icon}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-foreground">{mod.title}</h3>
                      <p className="text-sm text-muted-foreground">{mod.desc}</p>
                      <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{mod.duration}</span>
                        <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{mod.lessons} lessons</span>
                      </div>
                    </div>
                    <div className="shrink-0">
                      <Lock className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 bg-gradient-card border border-amber-500/20 rounded-2xl p-6 text-center">
            <p className="font-bold text-foreground text-lg mb-2">Unlock all 6 learning modules</p>
            <p className="text-muted-foreground text-sm mb-5">Plus AI coaching, reinvention paths, and deeper analysis with Premium.</p>
            <Link to="/pricing">
              <Button className="bg-gradient-amber text-primary-foreground font-bold px-8 hover:opacity-90">
                Upgrade to Premium
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
