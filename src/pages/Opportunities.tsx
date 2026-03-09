import { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  Zap,
  Users,
  Globe,
  BookOpen,
  Briefcase,
  ArrowRight,
  DollarSign,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const trendCategories = [
  { label: "All", value: "all" },
  { label: "AI & Automation", value: "ai" },
  { label: "Creator Economy", value: "creator" },
  { label: "Digital Services", value: "digital" },
  { label: "Entrepreneurship", value: "entrepreneur" },
];

const opportunities = [
  {
    id: 1,
    title: "AI Workflow Designer",
    category: "ai",
    trend: "AI & Automation",
    trendIcon: Zap,
    growthRate: "+340%",
    growthLabel: "demand growth",
    incomeRange: "$85K–$160K",
    timeToTransition: "6–12 months",
    matchScore: 94,
    description:
      "Design and optimize workflows that combine AI tools with human expertise. Help organizations move faster, smarter, and more efficiently.",
    whyGrowing:
      "Every company is racing to integrate AI. They need human architects who understand both the technology and the business context.",
    skills: ["Prompt engineering", "Process mapping", "AI tool proficiency", "Change management", "Systems thinking"],
    steps: [
      "Learn core AI tools (ChatGPT, Claude, Midjourney, Make/Zapier)",
      "Document and redesign 3 real workflows",
      "Build a portfolio of automation case studies",
      "Network in AI communities and offer pro bono consults",
      "Land first client or role",
    ],
    tag: "Fastest Growing",
    tagColor: "teal",
  },
  {
    id: 2,
    title: "Community Builder",
    category: "creator",
    trend: "Creator Economy",
    trendIcon: Users,
    growthRate: "+280%",
    growthLabel: "demand growth",
    incomeRange: "$60K–$200K+",
    timeToTransition: "3–9 months",
    matchScore: 88,
    description:
      "Build and nurture online communities around brands, niches, or causes. This is one of the most human-centric roles in the digital economy.",
    whyGrowing:
      "The creator economy is $250B+. Every brand, product, and movement needs skilled humans who can build genuine communities.",
    skills: ["Community platforms", "Content strategy", "Audience psychology", "Event facilitation", "Analytics"],
    steps: [
      "Start a community around something you're passionate about",
      "Learn Discord, Slack, Circle, and Mighty Networks",
      "Grow to 100+ engaged members",
      "Document your growth playbook",
      "Pitch to brands or companies as a consultant",
    ],
    tag: "High Income Potential",
    tagColor: "amber",
  },
  {
    id: 3,
    title: "Automation Strategist",
    category: "ai",
    trend: "AI & Automation",
    trendIcon: Zap,
    growthRate: "+410%",
    growthLabel: "demand growth",
    incomeRange: "$90K–$175K",
    timeToTransition: "6–18 months",
    matchScore: 82,
    description:
      "Help businesses identify which processes to automate, how to do it, and how to manage the human + AI transition.",
    whyGrowing:
      "Automation creates massive efficiency gains, but most companies don't know where to start. Strategic human guides are essential.",
    skills: ["Business analysis", "RPA tools", "AI platforms", "Project management", "Stakeholder communication"],
    steps: [
      "Study automation platforms (UiPath, Zapier, n8n)",
      "Get certified in one major automation tool",
      "Run automation sprints inside your current company",
      "Build a track record of ROI-proven automations",
      "Transition to consultant or in-house strategist",
    ],
    tag: "Emerging Field",
    tagColor: "violet",
  },
  {
    id: 4,
    title: "Digital Educator",
    category: "creator",
    trend: "Creator Economy",
    trendIcon: BookOpen,
    growthRate: "+190%",
    growthLabel: "demand growth",
    incomeRange: "$50K–$300K+",
    timeToTransition: "3–12 months",
    matchScore: 79,
    description:
      "Turn deep expertise into courses, cohorts, and content. Teach what you know to thousands of people who need it most.",
    whyGrowing:
      "The global e-learning market is $400B+. People want to learn from real practitioners, not institutions.",
    skills: ["Curriculum design", "Video production", "Community building", "Marketing funnels", "Public speaking"],
    steps: [
      "Identify your unique area of expertise",
      "Create a free email series or YouTube channel",
      "Launch a small paid cohort or workshop",
      "Collect testimonials and refine your curriculum",
      "Scale with a course platform or membership",
    ],
    tag: "High Income Potential",
    tagColor: "amber",
  },
  {
    id: 5,
    title: "AI-Powered Consultant",
    category: "entrepreneur",
    trend: "Digital Entrepreneurship",
    trendIcon: Briefcase,
    growthRate: "+250%",
    growthLabel: "demand growth",
    incomeRange: "$100K–$500K+",
    timeToTransition: "9–18 months",
    matchScore: 76,
    description:
      "Use AI tools to supercharge your consulting practice. Deliver faster insights, better analysis, and higher-value work than traditional consultants.",
    whyGrowing:
      "Solo consultants empowered by AI can now compete with large firms at a fraction of the cost. Clients are noticing.",
    skills: ["Domain expertise", "AI tools proficiency", "Client management", "Proposal writing", "Data analysis"],
    steps: [
      "Pick a consulting niche you already know",
      "Learn 5-10 AI tools that apply to that niche",
      "Build case studies proving your AI-enhanced output",
      "Price based on outcomes, not hours",
      "Build referral pipeline through community",
    ],
    tag: "Solopreneur Path",
    tagColor: "teal",
  },
  {
    id: 6,
    title: "Remote Service Designer",
    category: "digital",
    trend: "Digital Services",
    trendIcon: Globe,
    growthRate: "+170%",
    growthLabel: "demand growth",
    incomeRange: "$55K–$120K",
    timeToTransition: "3–9 months",
    matchScore: 71,
    description:
      "Design and optimize digital services, customer journeys, and remote experiences for global organizations.",
    whyGrowing:
      "Remote work is permanent. Every service touchpoint needs to be redesigned for a distributed, digital-first world.",
    skills: ["Service design", "UX fundamentals", "Remote facilitation", "Journey mapping", "Prototyping"],
    steps: [
      "Learn service design fundamentals",
      "Map and redesign a service you use regularly",
      "Get IDEO Design Thinking certification",
      "Build portfolio with 3 remote-first case studies",
      "Apply to service design roles or consult independently",
    ],
    tag: "Remote-First",
    tagColor: "violet",
  },
];

export default function Opportunities() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [expanded, setExpanded] = useState<number | null>(null);

  const filtered =
    activeCategory === "all" ? opportunities : opportunities.filter((o) => o.category === activeCategory);

  const tagColorMap: Record<string, string> = {
    teal: "bg-teal-500/10 text-teal border-teal-500/20",
    amber: "bg-amber-500/10 text-amber border-amber-500/20",
    violet: "bg-violet-500/10 text-violet-500 border-violet-500/20",
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-28 pb-20">
        <div className="container max-w-5xl">
          {/* Header */}
          <div className="text-center mb-12">
            <p className="text-teal text-sm font-semibold uppercase tracking-widest mb-3">Future Opportunity Scanner</p>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Where the world is heading
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Emerging roles shaped by AI, automation, and digital transformation. Each one matched to your identity profile.
            </p>
          </div>

          {/* Trend banner */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
            {[
              { label: "Artificial Intelligence", growth: "+340%", icon: Zap },
              { label: "Creator Economy", growth: "+280%", icon: Users },
              { label: "Remote Services", growth: "+170%", icon: Globe },
              { label: "Digital Entrepreneurship", growth: "+250%", icon: Briefcase },
            ].map((t) => (
              <div key={t.label} className="bg-surface-1 border border-border/50 rounded-xl p-4">
                <t.icon className="w-5 h-5 text-teal mb-2" />
                <p className="text-xs text-muted-foreground mb-1">{t.label}</p>
                <p className="text-lg font-bold text-gradient-teal">{t.growth}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            {trendCategories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat.value
                    ? "bg-gradient-teal text-primary-foreground"
                    : "bg-surface-1 border border-border text-muted-foreground hover:text-foreground hover:border-teal-500/40"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Opportunity Cards */}
          <div className="space-y-4">
            {filtered.map((opp) => {
              const isOpen = expanded === opp.id;
              const TrendIcon = opp.trendIcon;
              return (
                <div
                  key={opp.id}
                  className="bg-gradient-card border border-border/50 rounded-2xl overflow-hidden hover:border-teal-500/20 transition-colors"
                >
                  {/* Card header */}
                  <button
                    className="w-full p-6 text-left"
                    onClick={() => setExpanded(isOpen ? null : opp.id)}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className={`text-xs px-2.5 py-1 rounded-full border ${tagColorMap[opp.tagColor]}`}>
                            {opp.tag}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <TrendIcon className="w-3 h-3" />
                            {opp.trend}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-foreground">{opp.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{opp.description}</p>
                      </div>
                      <div className="flex sm:flex-col items-center sm:items-end gap-4 sm:gap-1 shrink-0">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gradient-teal">{opp.matchScore}%</div>
                          <div className="text-xs text-muted-foreground">match</div>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3 text-teal" />
                            {opp.growthRate}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3 text-amber" />
                            {opp.incomeRange}
                          </span>
                        </div>
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Expanded */}
                  {isOpen && (
                    <div className="px-6 pb-6 border-t border-border/40">
                      <div className="grid md:grid-cols-2 gap-6 mt-5">
                        <div>
                          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Why It's Growing</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">{opp.whyGrowing}</p>

                          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mt-5 mb-3">Key Skills</h4>
                          <div className="flex flex-wrap gap-2">
                            {opp.skills.map((s) => (
                              <span key={s} className="text-xs bg-surface-2 border border-border rounded-lg px-3 py-1.5 text-foreground/80">
                                {s}
                              </span>
                            ))}
                          </div>

                          <div className="flex gap-4 mt-5">
                            <div className="flex items-center gap-2 text-sm">
                              <DollarSign className="w-4 h-4 text-amber" />
                              <span className="text-foreground font-semibold">{opp.incomeRange}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="w-4 h-4 text-teal" />
                              <span className="text-muted-foreground">{opp.timeToTransition}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Transition Steps</h4>
                          <div className="space-y-2">
                            {opp.steps.map((step, i) => (
                              <div key={i} className="flex gap-3 text-sm">
                                <div className="w-5 h-5 rounded-full bg-teal-500/15 border border-teal-500/20 flex items-center justify-center shrink-0 mt-0.5">
                                  <span className="text-teal text-xs font-bold">{i + 1}</span>
                                </div>
                                <p className="text-muted-foreground leading-relaxed">{step}</p>
                              </div>
                            ))}
                          </div>

                          <Link to="/paths" className="block mt-5">
                            <Button className="w-full bg-gradient-teal text-primary-foreground font-semibold gap-2 hover:opacity-90">
                              Build My Reinvention Path
                              <ArrowRight className="w-4 h-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
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
