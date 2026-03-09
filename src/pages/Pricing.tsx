import { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Check,
  Sparkles,
  Zap,
  ArrowRight,
  Users,
  BookOpen,
  Brain,
  TrendingUp,
  MessageCircle,
  Shield,
} from "lucide-react";

const plans = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    tagline: "Start your reinvention journey",
    cta: "Get Started Free",
    ctaLink: "/onboarding",
    highlight: false,
    features: [
      { text: "Full Identity Discovery onboarding", included: true },
      { text: "AI Identity Profile generation", included: true },
      { text: "1 Reinvention Path (first 2 stages)", included: true },
      { text: "Future Opportunity Scanner", included: true },
      { text: "Community access (all groups)", included: true },
      { text: "1 Learning module (AI Literacy)", included: true },
      { text: "10 AI Coach messages/month", included: true },
      { text: "Advanced learning modules (5)", included: false },
      { text: "Unlimited AI Coach sessions", included: false },
      { text: "Full Reinvention Path (all stages)", included: false },
      { text: "Deeper identity analysis", included: false },
      { text: "Priority support", included: false },
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: "$29",
    period: "per month",
    annualPrice: "$19",
    tagline: "Everything you need to fully reinvent",
    cta: "Start Premium Free",
    ctaLink: "/onboarding",
    highlight: true,
    badge: "Most Popular",
    features: [
      { text: "Full Identity Discovery onboarding", included: true },
      { text: "AI Identity Profile generation", included: true },
      { text: "All Reinvention Paths (complete)", included: true },
      { text: "Future Opportunity Scanner (advanced)", included: true },
      { text: "Community access (all groups)", included: true },
      { text: "All 6 Learning modules", included: true },
      { text: "Unlimited AI Coach sessions", included: true },
      { text: "Deeper identity & strength analysis", included: true },
      { text: "Personalized weekly reinvention plan", included: true },
      { text: "Progress tracking & accountability", included: true },
      { text: "Exclusive premium events & workshops", included: true },
      { text: "Priority support", included: true },
    ],
  },
];

const faqItems = [
  {
    q: "Is this a job board or recruiter platform?",
    a: "No. EVOLVE is an identity exploration and career reinvention platform. We don't post jobs or connect you with recruiters. We help you understand who you are, identify new opportunities, and design your next career chapter.",
  },
  {
    q: "How is this different from LinkedIn Learning or Coursera?",
    a: "Those platforms offer courses. EVOLVE offers a complete reinvention system — starting with identity discovery, then skill translation, then personalized paths. It's coaching + learning + community in one place.",
  },
  {
    q: "What if I don't know what I want to do next?",
    a: "That's exactly who we're built for. The onboarding process is designed to help you discover new directions, not assume you already have one. Many users say the Identity Map alone changes how they see themselves.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. No contracts, no lock-in. Cancel anytime from your account settings. You keep your Identity Profile and community access on the Free plan.",
  },
  {
    q: "Is the AI Coach actually helpful or just a chatbot?",
    a: "It's context-aware and tuned specifically for career reinvention strategy. It knows your Identity Profile and gives personalized, actionable guidance — not generic advice.",
  },
];

export default function Pricing() {
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-28 pb-20">
        <div className="container max-w-5xl">
          {/* Header */}
          <div className="text-center mb-14">
            <p className="text-teal text-sm font-semibold uppercase tracking-widest mb-3">Simple Pricing</p>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Invest in your reinvention
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Start free, upgrade when you're ready to go deep. No hidden fees. No surprises.
            </p>

            {/* Billing toggle */}
            <div className="inline-flex items-center gap-1 bg-surface-1 border border-border rounded-xl p-1 mt-6">
              <button
                onClick={() => setBilling("monthly")}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                  billing === "monthly"
                    ? "bg-gradient-teal text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBilling("annual")}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  billing === "annual"
                    ? "bg-gradient-teal text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Annual
                <span className="text-xs bg-amber-500/20 text-amber rounded-full px-2 py-0.5">Save 35%</span>
              </button>
            </div>
          </div>

          {/* Plans */}
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-2xl border p-8 flex flex-col ${
                  plan.highlight
                    ? "border-teal-500/50 bg-teal-500/5 shadow-teal"
                    : "border-border bg-gradient-card"
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-teal text-primary-foreground text-xs font-bold px-4 py-1.5 rounded-full">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    {plan.highlight && <Sparkles className="w-4 h-4 text-teal" />}
                    <h2 className="text-xl font-bold text-foreground">{plan.name}</h2>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4">{plan.tagline}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-foreground">
                      {billing === "annual" && plan.annualPrice ? plan.annualPrice : plan.price}
                    </span>
                    <span className="text-muted-foreground text-sm">{plan.period}</span>
                  </div>
                  {billing === "annual" && plan.annualPrice && (
                    <p className="text-xs text-teal mt-1">Billed annually — save $120/year</p>
                  )}
                </div>

                <Link to={plan.ctaLink} className="block mb-6">
                  <Button
                    className={`w-full font-bold py-6 text-base ${
                      plan.highlight
                        ? "bg-gradient-teal text-primary-foreground glow-teal hover:opacity-90"
                        : "bg-surface-2 border border-border text-foreground hover:border-teal-500/40"
                    }`}
                  >
                    {plan.cta}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>

                <div className="space-y-3 flex-1">
                  {plan.features.map((f, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        f.included ? "bg-teal-500/15 text-teal" : "bg-surface-2 text-border"
                      }`}>
                        <Check className="w-3 h-3" />
                      </div>
                      <span className={f.included ? "text-muted-foreground" : "text-muted-foreground/40 line-through"}>
                        {f.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Feature comparison highlights */}
          <div className="grid sm:grid-cols-3 gap-4 mb-16">
            {[
              { icon: Brain, title: "Full Identity System", desc: "Deep AI-powered profile revealing your strengths, values, and patterns", premium: false },
              { icon: TrendingUp, title: "Complete Paths", desc: "End-to-end transformation roadmaps with all stages unlocked", premium: true },
              { icon: MessageCircle, title: "Unlimited Coaching", desc: "Context-aware AI reinvention strategist available 24/7", premium: true },
              { icon: BookOpen, title: "All 6 Modules", desc: "Every learning module including premium advanced content", premium: true },
              { icon: Users, title: "Global Community", desc: "Access to all groups and exclusive premium member events", premium: false },
              { icon: Shield, title: "Privacy First", desc: "Your identity data is private, portable, and never sold", premium: false },
            ].map((f) => (
              <div key={f.title} className="bg-surface-1 border border-border/50 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <f.icon className="w-4 h-4 text-teal" />
                  <h4 className="font-semibold text-foreground text-sm">{f.title}</h4>
                  {f.premium && (
                    <span className="text-xs bg-amber-500/10 text-amber border border-amber-500/20 rounded-full px-2 py-0.5 ml-auto">
                      Premium
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground text-center mb-8">Common questions</h2>
            <div className="space-y-2">
              {faqItems.map((item, i) => (
                <div
                  key={i}
                  className="bg-gradient-card border border-border/50 rounded-xl overflow-hidden"
                >
                  <button
                    className="w-full text-left p-5 flex justify-between items-center gap-4"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span className="font-semibold text-foreground text-sm">{item.q}</span>
                    <Zap className={`w-4 h-4 shrink-0 transition-colors ${openFaq === i ? "text-teal" : "text-muted-foreground"}`} />
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-5">
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Final CTA */}
          <div className="text-center mt-16">
            <p className="text-muted-foreground mb-4">Ready to begin? No credit card required for the free plan.</p>
            <Link to="/onboarding">
              <Button size="lg" className="bg-gradient-teal text-primary-foreground font-bold px-10 py-6 glow-teal hover:opacity-90 hover:scale-105 transition-all">
                Start Your Reinvention — Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
