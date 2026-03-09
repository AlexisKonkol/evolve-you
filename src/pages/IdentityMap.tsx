import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Map, Sparkles, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "react-router-dom";

type Cluster = {
  id: string;
  label: string;
  color: "teal" | "violet" | "amber";
  score: number;
  description: string;
  skills: string[];
  opportunities: string[];
  aiInsight: string;
};

const clusters: Cluster[] = [
  {
    id: "communication",
    label: "Communication",
    color: "teal",
    score: 92,
    description: "You translate complex ideas into clear action. This is a superpower in AI-era roles where humans bridge technology and people.",
    skills: ["Stakeholder alignment", "Active listening", "Written storytelling", "Presentation", "Conflict resolution"],
    opportunities: ["AI Workflow Consultant", "Digital Experience Strategist", "Change Management Lead"],
    aiInsight: "Communication + AI literacy = extremely rare. People who can explain AI to non-technical stakeholders are in the highest demand category right now.",
  },
  {
    id: "leadership",
    label: "Leadership",
    color: "amber",
    score: 85,
    description: "You lead through influence rather than authority. This style scales well in flat, async, and distributed AI-powered teams.",
    skills: ["Team coordination", "Vision setting", "Coaching others", "Delegation", "Culture building"],
    opportunities: ["AI Team Lead", "Community Builder", "Operations Director"],
    aiInsight: "Leadership skills are becoming more valuable, not less, in AI teams. Machines don't inspire people. You do.",
  },
  {
    id: "systems-thinking",
    label: "Systems Thinking",
    color: "violet",
    score: 78,
    description: "You see patterns and connections most people miss. This is the foundation of automation strategy and process design.",
    skills: ["Process mapping", "Root cause analysis", "Workflow optimization", "Data pattern recognition"],
    opportunities: ["Automation Strategist", "AI Operations Lead", "Business Analyst"],
    aiInsight: "Systems thinkers are the architects of the AI economy. You don't just use tools — you design how tools fit together.",
  },
  {
    id: "problem-solving",
    label: "Problem Solving",
    color: "teal",
    score: 88,
    description: "You break down ambiguous challenges into structured action. This is core to consulting, strategy, and AI product work.",
    skills: ["First principles thinking", "Analytical reasoning", "Structured frameworks", "Creative pivoting"],
    opportunities: ["Strategy Consultant", "Product Manager", "AI Product Designer"],
    aiInsight: "Problem solving at your level is a consulting superpower. Pair it with AI tools and you can solve problems 10× faster than before.",
  },
  {
    id: "creativity",
    label: "Creativity",
    color: "violet",
    score: 71,
    description: "You generate original ideas and reframe problems. AI augments creative thinkers rather than replacing them.",
    skills: ["Idea generation", "Design thinking", "Reframing", "Lateral thinking", "Experimentation"],
    opportunities: ["Content Strategist", "Creative Director", "Digital Product Creator"],
    aiInsight: "Creativity is becoming more valuable as AI handles routine work. Your creative capacity is a long-term competitive advantage.",
  },
  {
    id: "curiosity",
    label: "Curiosity & Learning",
    color: "amber",
    score: 83,
    description: "You learn fast and connect ideas across domains. In a world of continuous change, this is the ultimate meta-skill.",
    skills: ["Self-directed learning", "Pattern recognition across fields", "Rapid skill acquisition", "Knowledge synthesis"],
    opportunities: ["Learning Designer", "AI Researcher", "Digital Educator"],
    aiInsight: "Your curiosity about systems, human behavior, and technology places you in the top tier of adaptable professionals. This is your biggest long-term asset.",
  },
];

const colorMap = {
  teal: {
    bg: "bg-teal-500/10",
    border: "border-teal-500/30",
    text: "text-teal",
    bar: "bg-gradient-teal",
    node: "bg-teal-500",
    glow: "shadow-teal",
    pill: "bg-teal-500/10 text-teal border-teal-500/20",
  },
  violet: {
    bg: "bg-violet-500/10",
    border: "border-violet-500/30",
    text: "text-violet",
    bar: "bg-violet-500",
    node: "bg-violet-500",
    glow: "",
    pill: "bg-violet-500/10 text-violet border-violet-500/20",
  },
  amber: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    text: "text-amber",
    bar: "bg-gradient-amber",
    node: "bg-amber-500",
    glow: "",
    pill: "bg-amber-500/10 text-amber border-amber-500/20",
  },
};

export default function IdentityMap() {
  const [expanded, setExpanded] = useState<string | null>("communication");

  const toggle = (id: string) => setExpanded(expanded === id ? null : id);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-20">
        <div className="container max-w-5xl">

          {/* Header */}
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/20 rounded-full px-4 py-2 text-sm text-teal font-medium mb-4">
              <Map className="w-4 h-4" />
              Interactive Identity Map
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Your <span className="text-gradient-teal">Strength Network</span>
            </h1>
            <p className="text-muted-foreground max-w-xl">
              Each cluster represents a core dimension of who you are. Click any node to explore how your strengths translate into future opportunities.
            </p>
          </div>

          {/* Visual network map */}
          <div className="bg-gradient-card border border-border/50 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-teal" />
              <span className="text-sm font-semibold text-foreground">Archetype: The Connector-Builder</span>
              <span className="ml-auto text-xs text-muted-foreground">Click a node to expand</span>
            </div>

            {/* Node grid — visual representation */}
            <div className="relative flex flex-wrap justify-center gap-4 py-4">
              {/* Center node */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-gradient-teal flex items-center justify-center glow-teal z-10 hidden lg:flex">
                <span className="text-xs font-bold text-primary-foreground text-center leading-tight px-1">YOU</span>
              </div>

              {clusters.map((c) => {
                const cm = colorMap[c.color];
                const isActive = expanded === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => toggle(c.id)}
                    className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all duration-300 w-32 ${
                      isActive
                        ? `${cm.bg} ${cm.border} scale-105 ${cm.glow}`
                        : "bg-surface-2 border-border hover:border-teal-500/20 hover:bg-surface-3"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full ${cm.node} flex items-center justify-center text-primary-foreground font-bold text-sm`}>
                      {c.score}
                    </div>
                    <span className={`text-xs font-semibold text-center ${isActive ? cm.text : "text-foreground"}`}>
                      {c.label}
                    </span>
                    <div className="w-full h-1 bg-border rounded-full overflow-hidden">
                      <div className={`h-full ${cm.bar} rounded-full`} style={{ width: `${c.score}%` }} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Expanded cluster detail */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-foreground">Strength Clusters</h2>
            {clusters.map((c) => {
              const cm = colorMap[c.color];
              const isOpen = expanded === c.id;
              return (
                <div
                  key={c.id}
                  className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                    isOpen ? `${cm.border}` : "border-border/50"
                  } bg-gradient-card`}
                >
                  {/* Header row */}
                  <button
                    onClick={() => toggle(c.id)}
                    className="w-full flex items-center gap-4 p-5 text-left"
                  >
                    <div className={`w-10 h-10 rounded-xl ${cm.bg} flex items-center justify-center shrink-0`}>
                      <span className={`text-sm font-bold ${cm.text}`}>{c.score}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">{c.label}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${cm.pill}`}>
                          {c.score >= 85 ? "Exceptional" : c.score >= 75 ? "Strong" : "Developing"}
                        </span>
                      </div>
                      <div className="h-1.5 bg-border rounded-full overflow-hidden w-48">
                        <div className={`h-full ${cm.bar} rounded-full`} style={{ width: `${c.score}%` }} />
                      </div>
                    </div>
                    {isOpen ? (
                      <ChevronUp className={`w-5 h-5 ${cm.text} shrink-0`} />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
                    )}
                  </button>

                  {/* Expanded content */}
                  {isOpen && (
                    <div className="px-5 pb-5 space-y-4 animate-fade-in">
                      {/* Description */}
                      <p className="text-sm text-muted-foreground leading-relaxed">{c.description}</p>

                      <div className="grid sm:grid-cols-2 gap-4">
                        {/* Skills */}
                        <div className="bg-surface-2 rounded-xl p-4">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Skills in This Cluster</p>
                          <div className="flex flex-wrap gap-1.5">
                            {c.skills.map((sk) => (
                              <span key={sk} className={`text-xs px-2 py-1 rounded-md border ${cm.pill}`}>
                                {sk}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Opportunities */}
                        <div className="bg-surface-2 rounded-xl p-4">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Matching Opportunities</p>
                          <div className="space-y-2">
                            {c.opportunities.map((op) => (
                              <div key={op} className="flex items-center gap-2">
                                <div className={`w-1.5 h-1.5 rounded-full ${cm.node} shrink-0`} />
                                <span className="text-sm text-foreground">{op}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* AI Insight */}
                      <div className={`${cm.bg} border ${cm.border} rounded-xl p-4`}>
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className={`w-4 h-4 ${cm.text}`} />
                          <span className={`text-xs font-semibold uppercase tracking-wider ${cm.text}`}>AI Coach Insight</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">"{c.aiInsight}"</p>
                      </div>

                      <Link to="/opportunities">
                        <Button size="sm" className={`${cm.bg} border ${cm.border} ${cm.text} hover:opacity-80 gap-2`}>
                          Explore matching opportunities
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
