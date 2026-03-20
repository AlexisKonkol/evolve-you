import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Star,
  Share2,
  Linkedin,
  Twitter,
  Link2,
  CheckCircle2,
  FlaskConical,
  Compass,
  BookOpen,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";

const profile = {
  name: "Alex Rivera",
  archetype: "The Connector-Builder",
  futureIdentity: "AI Workflow Consultant",
  progress: 42,
  headline: "Reinventing from Retail Management into the AI Economy",
  skills: [
    "Cross-functional communication",
    "Process optimization",
    "Team coordination",
    "AI Literacy",
    "Systems thinking",
    "Automation workflows",
  ],
  experiments: [
    { label: "Built an AI workflow automation", done: true },
    { label: "Wrote a digital product concept", done: true },
    { label: "Launched community discussion", done: false },
  ],
  opportunities: [
    "AI Workflow Designer",
    "Digital Experience Strategist",
    "Automation Consultant",
  ],
  strengths: [
    { label: "Communication", score: 92 },
    { label: "Leadership", score: 85 },
    { label: "Problem Solving", score: 88 },
  ],
  milestones: [
    "Completed identity discovery",
    "Mapped 8 skills to AI economy",
    "Explored 14 opportunities",
    "7-day learning streak achieved",
  ],
};

export default function ProfilePage() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container max-w-3xl">

          {/* Hero card */}
          <div className="relative bg-gradient-card border border-border/50 rounded-2xl p-8 mb-6 overflow-hidden">
            {/* Glow blob */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 relative z-10">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold uppercase tracking-widest text-teal bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 rounded-full">
                    Future Identity Profile
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-1">{profile.name}</h1>
                <p className="text-teal font-semibold mb-2">→ {profile.futureIdentity}</p>
                <p className="text-muted-foreground text-sm">{profile.headline}</p>

                <div className="mt-3 bg-teal-500/5 border border-teal-500/15 rounded-lg px-3 py-2 inline-flex items-center gap-2">
                  <Star className="w-3.5 h-3.5 text-teal" />
                  <span className="text-xs text-foreground font-medium">{profile.archetype}</span>
                </div>
              </div>

              {/* Progress ring */}
              <div className="relative w-24 h-24 shrink-0">
                <svg viewBox="0 0 96 96" className="w-full h-full -rotate-90">
                  <circle cx="48" cy="48" r="38" fill="none" stroke="hsl(var(--border))" strokeWidth="7" />
                  <circle
                    cx="48" cy="48" r="38"
                    fill="none" stroke="hsl(172 80% 40%)"
                    strokeWidth="7" strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 38}`}
                    strokeDashoffset={`${2 * Math.PI * 38 * (1 - profile.progress / 100)}`}
                    className="transition-all duration-700"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-bold text-teal">{profile.progress}%</span>
                  <span className="text-xs text-muted-foreground">evolved</span>
                </div>
              </div>
            </div>
          </div>

          {/* Share bar */}
          <div className="bg-gradient-card border border-border/50 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row items-center gap-3">
            <div className="flex items-center gap-2 flex-1">
              <Share2 className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Share your reinvention journey</span>
            </div>
            <div className="flex gap-2">
              <Button size="sm" className="bg-blue-600/20 border border-blue-600/30 text-blue-400 hover:bg-blue-600/30 gap-2 h-8">
                <Linkedin className="w-3.5 h-3.5" />
                LinkedIn
              </Button>
              <Button size="sm" className="bg-surface-2 border border-border text-muted-foreground hover:text-foreground gap-2 h-8">
                <Twitter className="w-3.5 h-3.5" />
                Twitter
              </Button>
              <Button
                size="sm"
                onClick={handleCopy}
                className="bg-surface-2 border border-border text-muted-foreground hover:text-teal hover:border-teal-500/30 gap-2 h-8"
              >
                <Link2 className="w-3.5 h-3.5" />
                {copied ? "Copied!" : "Copy link"}
              </Button>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">

            {/* Skills building */}
            <div className="bg-gradient-card border border-border/50 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-teal" />
                <h3 className="font-semibold text-foreground text-sm">Skills Being Built</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((sk) => (
                  <span key={sk} className="text-xs px-2.5 py-1 bg-surface-2 border border-border rounded-full text-foreground/80">
                    {sk}
                  </span>
                ))}
              </div>

              {/* Strength bars */}
              <div className="mt-4 space-y-2">
                {profile.strengths.map((s) => (
                  <div key={s.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">{s.label}</span>
                      <span className="text-teal font-semibold">{s.score}%</span>
                    </div>
                    <div className="h-1 bg-border rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-teal rounded-full" style={{ width: `${s.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Experiments */}
            <div className="bg-gradient-card border border-border/50 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <FlaskConical className="w-4 h-4 text-amber" />
                <h3 className="font-semibold text-foreground text-sm">Experiments Running</h3>
              </div>
              <div className="space-y-3">
                {profile.experiments.map((exp, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle2 className={`w-4 h-4 shrink-0 ${exp.done ? "text-teal" : "text-muted-foreground/30"}`} />
                    <span className={`text-sm ${exp.done ? "text-foreground" : "text-muted-foreground"}`}>{exp.label}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 border-t border-border pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <Compass className="w-4 h-4 text-violet" />
                  <h3 className="font-semibold text-foreground text-sm">Opportunities Exploring</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.opportunities.map((op) => (
                    <span key={op} className="text-xs px-2.5 py-1 bg-violet-500/10 border border-violet-500/20 rounded-full text-violet">
                      {op}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Milestones */}
            <div className="sm:col-span-2 bg-gradient-card border border-border/50 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-4 h-4 text-teal" />
                <h3 className="font-semibold text-foreground text-sm">Reinvention Milestones</h3>
              </div>
              <div className="grid sm:grid-cols-2 gap-2">
                {profile.milestones.map((m, i) => (
                  <div key={i} className="flex items-center gap-2 bg-surface-2 rounded-lg px-3 py-2">
                    <CheckCircle2 className="w-4 h-4 text-teal shrink-0" />
                    <span className="text-sm text-foreground/80">{m}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 text-center">
            <p className="text-muted-foreground text-sm mb-4">Start your own journey on NAVO</p>
            <Link to="/onboarding">
              <Button className="bg-gradient-coral text-primary-foreground gap-2 hover:opacity-90 px-6">
                Begin Your Journey
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
