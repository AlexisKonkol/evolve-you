import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  Lock,
  Star,
  BookOpen,
  Users,
  Clock,
  TrendingUp,
} from "lucide-react";

const paths = [
  {
    id: 1,
    from: "Retail Manager",
    to: "AI-Enhanced Customer Experience Leader",
    duration: "9 months",
    difficulty: "Moderate",
    matchScore: 91,
    steps: [
      { title: "Learn foundational AI tools", desc: "Master ChatGPT, Claude, and AI analytics tools. Understand how AI can augment customer interactions.", duration: "4 weeks", status: "available" },
      { title: "Understand customer data systems", desc: "Learn CRM data architecture, customer journey analytics, and how AI extracts insights from behavior patterns.", duration: "6 weeks", status: "available" },
      { title: "Build automation workflows", desc: "Create AI-powered customer service workflows using Zapier, Make, and customer support AI tools.", duration: "8 weeks", status: "locked" },
      { title: "Lead hybrid human + AI teams", desc: "Develop management frameworks for teams where humans and AI collaborate on customer experience.", duration: "10 weeks", status: "locked" },
      { title: "Launch signature method", desc: "Document your unique CX + AI methodology and position yourself as a thought leader.", duration: "8 weeks", status: "locked" },
    ],
  },
  {
    id: 2,
    from: "Teacher",
    to: "Digital Curriculum Creator",
    duration: "6 months",
    difficulty: "Beginner-Friendly",
    matchScore: 86,
    steps: [
      { title: "Master course creation tools", desc: "Learn Teachable, Notion, Loom, and AI writing assistants to create compelling digital learning experiences.", duration: "3 weeks", status: "available" },
      { title: "Design your first digital course", desc: "Transform one of your strongest teaching subjects into a structured, self-paced online course.", duration: "6 weeks", status: "available" },
      { title: "Build your audience", desc: "Use social media, email lists, and community platforms to attract learners who need your expertise.", duration: "8 weeks", status: "locked" },
      { title: "Launch and iterate", desc: "Run your first paid cohort, collect feedback, and refine the experience based on learner outcomes.", duration: "6 weeks", status: "locked" },
    ],
  },
  {
    id: 3,
    from: "Marketing Manager",
    to: "AI-Powered Consultant",
    duration: "12 months",
    difficulty: "Advanced",
    matchScore: 78,
    steps: [
      { title: "Define your consulting niche", desc: "Choose the specific marketing intersection where your expertise plus AI creates maximum value.", duration: "2 weeks", status: "available" },
      { title: "AI-enhance your skillset", desc: "Master AI tools for content, analytics, ads, and strategy that directly amplify your marketing work.", duration: "8 weeks", status: "available" },
      { title: "Build your first case studies", desc: "Apply your AI-enhanced marketing skills to real projects and document the measurable ROI.", duration: "10 weeks", status: "locked" },
      { title: "Launch consulting practice", desc: "Set up your positioning, pricing, contracts, and outreach system for your first paying clients.", duration: "6 weeks", status: "locked" },
      { title: "Scale and specialize", desc: "Productize your process, raise rates, and build a waiting list for your unique consulting approach.", duration: "12 weeks", status: "locked" },
    ],
  },
];

export default function Paths() {
  const [activePath, setActivePath] = useState(0);
  const path = paths[activePath];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-28 pb-20">
        <div className="container max-w-5xl">
          <div className="text-center mb-12">
            <p className="text-teal text-sm font-semibold uppercase tracking-widest mb-3">Reinvention Paths</p>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Your transformation roadmap
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Step-by-step paths from where you are to where you want to be. Each one designed for your identity profile.
            </p>
          </div>

          {/* Path selector */}
          <div className="grid sm:grid-cols-3 gap-4 mb-10">
            {paths.map((p, i) => (
              <button
                key={p.id}
                onClick={() => setActivePath(i)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  activePath === i
                    ? "border-teal-500/50 bg-teal-500/8"
                    : "border-border bg-surface-1 hover:border-teal-500/20"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xl font-bold ${activePath === i ? "text-gradient-teal" : "text-foreground"}`}>
                    {p.matchScore}%
                  </span>
                  {activePath === i && <Star className="w-4 h-4 text-amber fill-amber" />}
                </div>
                <p className="text-xs text-muted-foreground mb-1">From: {p.from}</p>
                <p className="text-sm font-semibold text-foreground leading-snug">→ {p.to}</p>
                <div className="flex gap-3 mt-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {p.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {p.difficulty}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Active path detail */}
          <div className="bg-gradient-card border border-border/50 rounded-2xl overflow-hidden">
            <div className="p-6 md:p-8 border-b border-border/40">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Reinvention Path</p>
                  <h2 className="text-2xl font-bold text-foreground">
                    <span className="text-muted-foreground">{path.from}</span>
                    <span className="text-muted-foreground mx-3">→</span>
                    <span className="text-gradient-teal">{path.to}</span>
                  </h2>
                </div>
                <div className="flex gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-bold text-foreground">{path.duration}</div>
                    <div className="text-muted-foreground text-xs">timeline</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-foreground">{path.steps.length}</div>
                    <div className="text-muted-foreground text-xs">stages</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-gradient-teal">{path.matchScore}%</div>
                    <div className="text-muted-foreground text-xs">match</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8">
              <div className="space-y-4">
                {path.steps.map((step, i) => {
                  const isLocked = step.status === "locked";
                  return (
                    <div
                      key={i}
                      className={`flex gap-5 p-5 rounded-xl border transition-all ${
                        isLocked
                          ? "border-border/30 opacity-60"
                          : "border-teal-500/20 bg-teal-500/5"
                      }`}
                    >
                      {/* Step number */}
                      <div className="shrink-0 flex flex-col items-center gap-2">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                            isLocked
                              ? "bg-surface-2 text-muted-foreground"
                              : "bg-gradient-teal text-primary-foreground"
                          }`}
                        >
                          {isLocked ? <Lock className="w-4 h-4" /> : i + 1}
                        </div>
                        {i < path.steps.length - 1 && (
                          <div className="w-px flex-1 min-h-[20px] bg-border" />
                        )}
                      </div>

                      <div className="flex-1 pb-2">
                        <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                          <h3 className={`font-semibold ${isLocked ? "text-muted-foreground" : "text-foreground"}`}>
                            {step.title}
                          </h3>
                          <span className="text-xs text-muted-foreground bg-surface-2 px-2.5 py-1 rounded-full flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {step.duration}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                        {!isLocked && (
                          <div className="mt-3 flex gap-3">
                            <Link to="/learn">
                              <Button size="sm" className="bg-gradient-teal text-primary-foreground text-xs gap-1.5 hover:opacity-90">
                                <BookOpen className="w-3 h-3" />
                                Start Learning
                              </Button>
                            </Link>
                            <Link to="/coach">
                              <Button size="sm" variant="outline" className="border-border text-xs hover:border-teal-500/40">
                                Ask AI Coach
                              </Button>
                            </Link>
                          </div>
                        )}
                        {isLocked && (
                          <div className="mt-3">
                            <span className="text-xs text-muted-foreground bg-surface-2 px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5">
                              <Lock className="w-3 h-3" />
                              Complete previous steps to unlock
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Overall completion */}
              <div className="mt-6 bg-surface-2 rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-foreground">Path Progress</span>
                  <span className="text-sm text-teal font-bold">2 of {path.steps.length} stages available</span>
                </div>
                <div className="h-2 bg-border rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-teal rounded-full" style={{ width: `${(2 / path.steps.length) * 100}%` }} />
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  Complete all stages to achieve your reinvention. Premium unlocks all stages and AI coaching.
                </p>
                <Link to="/pricing" className="block mt-3">
                  <Button size="sm" className="bg-gradient-amber text-primary-foreground font-semibold text-xs hover:opacity-90">
                    Unlock Full Path with Premium
                    <ArrowRight className="w-3 h-3 ml-1.5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Community paths note */}
          <div className="mt-6 bg-gradient-card border border-border/50 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-4">
            <div className="w-12 h-12 bg-violet-500/10 rounded-xl flex items-center justify-center shrink-0">
              <Users className="w-6 h-6 text-violet-500" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <p className="font-semibold text-foreground">You're not alone on this path</p>
              <p className="text-sm text-muted-foreground">2,847 people are currently on similar reinvention journeys. Connect and learn together.</p>
            </div>
            <Link to="/community">
              <Button variant="outline" className="border-border hover:border-violet-500/40 shrink-0">
                Join Community →
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
