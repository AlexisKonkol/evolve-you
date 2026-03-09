import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Brain,
  Sparkles,
  TrendingUp,
  Map,
  ArrowRight,
  Zap,
  Target,
  Heart,
  BookOpen,
  Users,
  MessageCircle,
  Share2,
  Compass,
} from "lucide-react";
import { TodayEvolution } from "@/components/dashboard/TodayEvolution";
import { ReinventionStreaks } from "@/components/dashboard/ReinventionStreaks";
import { FutureIdentityTracker } from "@/components/dashboard/FutureIdentityTracker";
import { MicroExperiments } from "@/components/dashboard/MicroExperiments";
import { ReinventionInsights } from "@/components/dashboard/ReinventionInsights";
import { EvolutionMap } from "@/components/dashboard/EvolutionMap";

const strengthClusters = [
  { label: "Communication", score: 92, color: "teal" },
  { label: "Systems Thinking", score: 78, color: "violet" },
  { label: "Leadership", score: 85, color: "amber" },
  { label: "Problem Solving", score: 88, color: "teal" },
  { label: "Creativity", score: 71, color: "violet" },
];

const identityProfile = {
  archetype: "The Connector-Builder",
  strengths: ["Cross-functional communication", "Team coordination", "Process optimization", "Client empathy"],
  curiosityPatterns: ["Systems & automation", "Human behavior", "Emerging technology", "Organizational design"],
  workStyle: "Collaborative with independent depth",
  motivations: ["Tangible impact", "Continuous learning", "Building teams"],
  values: ["Integrity", "Growth", "Connection", "Autonomy"],
};

const suggestedRoles = [
  { title: "AI Workflow Designer", match: 94, icon: Zap, tag: "Fastest Growing", tagColor: "teal" },
  { title: "Digital Experience Strategist", match: 88, icon: Target, tag: "High Income", tagColor: "amber" },
  { title: "Automation Consultant", match: 82, icon: Brain, tag: "Emerging Field", tagColor: "violet" },
];

const coachInsights = [
  "Your communication strengths are rare in technical fields — this is your edge.",
  "You've built leadership skills organically. AI tools will amplify, not replace, this.",
  "Your curiosity about systems maps directly to the automation economy.",
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-20">
        <div className="container max-w-7xl">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
              <p className="text-teal text-sm font-semibold uppercase tracking-widest mb-2">Identity Map Dashboard</p>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                Welcome back, <span className="text-gradient-teal">Alex</span>
              </h1>
              <p className="text-muted-foreground mt-1">Your reinvention journey is 35% complete · 12-day streak 🔥</p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <Link to="/profile">
                <Button variant="outline" className="border-border hover:border-teal-500/50 gap-2">
                  <Share2 className="w-4 h-4 text-teal" />
                  Share Profile
                </Button>
              </Link>
              <Link to="/coach">
                <Button variant="outline" className="border-border hover:border-teal-500/50 gap-2">
                  <MessageCircle className="w-4 h-4 text-teal" />
                  AI Coach
                </Button>
              </Link>
              <Link to="/opportunities">
                <Button className="bg-gradient-teal text-primary-foreground gap-2 hover:opacity-90">
                  Explore Opportunities
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Overall progress */}
          <div className="bg-gradient-card border border-border/50 rounded-2xl p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="font-semibold text-foreground">Reinvention Journey</h3>
                <p className="text-sm text-muted-foreground">Stage 2 of 5: Skill Translation</p>
              </div>
              <span className="text-teal font-bold text-2xl">35%</span>
            </div>
            <div className="h-2 bg-border rounded-full overflow-hidden">
              <div className="h-full bg-gradient-teal rounded-full" style={{ width: "35%" }} />
            </div>
            <div className="flex gap-2 mt-4 flex-wrap">
              {["Identity Discovery ✓", "Skill Translation →", "Opportunity Mapping", "Reinvention Paths", "Continuous Evolution"].map((s, i) => (
                <span
                  key={i}
                  className={`text-xs px-3 py-1 rounded-full border ${
                    i === 0
                      ? "border-teal-500/40 bg-teal-500/10 text-teal"
                      : i === 1
                      ? "border-amber-500/40 bg-amber-500/10 text-amber"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* === MAIN GRID === */}
          <div className="grid lg:grid-cols-3 gap-6">

            {/* Left col (2/3) */}
            <div className="lg:col-span-2 space-y-6">

              {/* Today's Evolution — top priority */}
              <TodayEvolution />

              {/* Identity Profile */}
              <div className="bg-gradient-card border border-border/50 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-teal-500/10 rounded-xl flex items-center justify-center">
                    <Brain className="w-5 h-5 text-teal" />
                  </div>
                  <div>
                    <h2 className="font-bold text-foreground">AI Identity Profile</h2>
                    <p className="text-xs text-muted-foreground">Generated from your discovery session</p>
                  </div>
                </div>

                <div className="bg-teal-500/5 border border-teal-500/15 rounded-xl p-4 mb-5">
                  <p className="text-xs text-teal font-semibold uppercase tracking-wider mb-1">Your Archetype</p>
                  <p className="text-xl font-bold text-foreground">{identityProfile.archetype}</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { label: "Core Strengths", items: identityProfile.strengths, icon: Zap, color: "teal" },
                    { label: "Curiosity Patterns", items: identityProfile.curiosityPatterns, icon: Sparkles, color: "violet" },
                    { label: "Motivations", items: identityProfile.motivations, icon: Heart, color: "amber" },
                    { label: "Core Values", items: identityProfile.values, icon: Target, color: "teal" },
                  ].map((section) => (
                    <div key={section.label} className="bg-surface-2 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <section.icon className={`w-4 h-4 ${section.color === "teal" ? "text-teal" : section.color === "amber" ? "text-amber" : "text-violet"}`} />
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{section.label}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {section.items.map((item) => (
                          <span key={item} className="text-xs px-2 py-1 bg-surface-3 rounded-md text-foreground/80">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 bg-surface-2 rounded-xl p-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Work Style</p>
                  <p className="text-sm text-foreground">{identityProfile.workStyle}</p>
                </div>
              </div>

              {/* Strength Clusters */}
              <div className="bg-gradient-card border border-border/50 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-violet-500/10 rounded-xl flex items-center justify-center">
                    <Map className="w-5 h-5 text-violet" />
                  </div>
                  <h2 className="font-bold text-foreground">Strength Clusters</h2>
                </div>
                <div className="space-y-4">
                  {strengthClusters.map((s) => {
                    const barColor = s.color === "teal" ? "bg-gradient-teal" : s.color === "amber" ? "bg-gradient-amber" : "bg-violet-500";
                    return (
                      <div key={s.label}>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="text-foreground font-medium">{s.label}</span>
                          <span className="text-muted-foreground">{s.score}%</span>
                        </div>
                        <div className="h-2 bg-border rounded-full overflow-hidden">
                          <div className={`h-full ${barColor} rounded-full transition-all duration-700`} style={{ width: `${s.score}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Micro Experiments */}
              <MicroExperiments />

              {/* Evolution Map */}
              <EvolutionMap />
            </div>

            {/* Right col (1/3) */}
            <div className="space-y-6">

              {/* Streaks */}
              <ReinventionStreaks />

              {/* Future Identity Tracker */}
              <FutureIdentityTracker />

              {/* AI Coach Insights */}
              <div className="bg-gradient-card border border-teal-500/20 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 bg-gradient-teal rounded-xl flex items-center justify-center glow-teal">
                    <Sparkles className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">AI Coach</h3>
                    <p className="text-xs text-muted-foreground">Insights for you</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {coachInsights.map((insight, i) => (
                    <div key={i} className="flex gap-3 text-sm">
                      <div className="w-5 h-5 rounded-full bg-teal-500/20 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-teal text-xs font-bold">{i + 1}</span>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">{insight}</p>
                    </div>
                  ))}
                </div>
                <Link to="/coach" className="block mt-4">
                  <Button size="sm" className="w-full bg-teal-500/10 border border-teal-500/30 text-teal hover:bg-teal-500/20">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Ask a question
                  </Button>
                </Link>
              </div>

              {/* Top Role Matches */}
              <div className="bg-gradient-card border border-border/50 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-4 h-4 text-amber" />
                  <h3 className="font-semibold text-foreground text-sm">Top Role Matches</h3>
                </div>
                <div className="space-y-3">
                  {suggestedRoles.map((r) => (
                    <div key={r.title} className="flex items-center gap-3 bg-surface-2 rounded-xl p-3">
                      <div className="w-9 h-9 bg-teal-500/10 rounded-lg flex items-center justify-center shrink-0">
                        <r.icon className="w-4 h-4 text-teal" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{r.title}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          r.tagColor === "teal"
                            ? "bg-teal-500/10 text-teal"
                            : r.tagColor === "amber"
                            ? "bg-amber-500/10 text-amber"
                            : "bg-violet-500/10 text-violet"
                        }`}>
                          {r.tag}
                        </span>
                      </div>
                      <span className="text-teal font-bold text-sm">{r.match}%</span>
                    </div>
                  ))}
                </div>
                <Link to="/opportunities">
                  <Button size="sm" variant="outline" className="w-full mt-3 border-border hover:border-teal-500/40 text-xs">
                    View All Opportunities →
                  </Button>
                </Link>
              </div>

              {/* Reinvention Insights */}
              <ReinventionInsights />

              {/* Quick links */}
              <div className="bg-gradient-card border border-border/50 rounded-2xl p-5 space-y-2">
                <h3 className="font-semibold text-foreground text-sm mb-3">Continue Your Journey</h3>
                {[
                  { icon: BookOpen, label: "AI Literacy Module", sub: "15 min · Beginner", href: "/learn" },
                  { icon: Map, label: "Explore Paths", sub: "3 paths ready", href: "/paths" },
                  { icon: Users, label: "Join Community", sub: "Career Pivots group", href: "/community" },
                ].map((item) => (
                  <Link
                    key={item.label}
                    to={item.href}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-2 transition-colors group"
                  >
                    <item.icon className="w-4 h-4 text-muted-foreground group-hover:text-teal transition-colors" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.sub}</p>
                    </div>
                    <ArrowRight className="w-3 h-3 text-muted-foreground/40 group-hover:text-teal group-hover:translate-x-0.5 transition-all" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
