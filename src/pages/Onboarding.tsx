import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Zap, Check } from "lucide-react";

const questions = [
  {
    id: "energized",
    question: "When do you feel most energized or alive?",
    subtitle: "Not when you're productive — when you feel genuinely lit up. Think about specific moments, not job descriptions.",
    options: [
      "When I'm helping someone have a breakthrough",
      "When I'm deep in a complex problem",
      "When I'm creating something from nothing",
      "When I'm bringing order to chaos",
      "When I'm exploring a completely new idea",
      "When I'm connecting people or ideas together",
    ],
  },
  {
    id: "problems",
    question: "What kinds of problems do you naturally enjoy solving?",
    subtitle: "The problems you'd think about on a Sunday morning, not because you have to — because you can't help it.",
    options: [
      "How to help people understand something difficult",
      "How systems work and why they break",
      "How to make something beautiful or meaningful",
      "Why people behave and feel the way they do",
      "How ideas can be turned into real things",
      "How to make something run better or faster",
    ],
  },
  {
    id: "flow",
    question: "What activities make you lose track of time?",
    subtitle: "Flow states reveal your deepest identity. These aren't hobbies — they're clues about who you really are.",
    options: [
      "Writing, storytelling, or explaining ideas",
      "Building, coding, or making things work",
      "Learning something new and connecting dots",
      "Having deep conversations with interesting people",
      "Designing, drawing, or creating visually",
      "Organizing, planning, or solving logistical puzzles",
    ],
    multi: true,
  },
  {
    id: "proud",
    question: "What moments in your life made you feel most proud of yourself?",
    subtitle: "Forget accolades. Think about moments where you felt — quietly, genuinely — like you showed up as your best self.",
    options: [
      "When I helped someone navigate something hard",
      "When I built or shipped something real",
      "When I figured out a problem no one else could",
      "When I brought people together around something meaningful",
      "When I created something that moved or inspired someone",
      "When I led something from uncertainty to clarity",
    ],
  },
  {
    id: "environment",
    question: "What kind of environment helps you thrive?",
    subtitle: "Identity includes how you work, not just what you do. Your environment is part of who you are.",
    options: [
      "Deep focus with long stretches of uninterrupted time",
      "Collaborative energy with a team I trust",
      "Freedom to explore and change direction",
      "Clear structure with meaningful goals",
      "A mix of solitude and rich conversations",
      "Spaces where I'm always learning something new",
    ],
  },
  {
    id: "values",
    question: "What matters most to you in how you spend your time?",
    subtitle: "Not what you think you should value — what you actually feel when you're living in alignment.",
    options: [
      "Creating genuine impact in people's lives",
      "Mastery and depth in something I care about",
      "Freedom to design my own days",
      "Building something that could outlast me",
      "Being part of a community I belong to",
      "Continuous growth and becoming more",
    ],
    multi: true,
  },
];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const navigate = useNavigate();

  const current = questions[step];
  const selected = answers[current.id] || [];
  const total = questions.length;
  const progress = (step / total) * 100;

  const toggle = (opt: string) => {
    if (current.multi) {
      setAnswers((prev) => {
        const cur = prev[current.id] || [];
        return {
          ...prev,
          [current.id]: cur.includes(opt) ? cur.filter((x) => x !== opt) : [...cur, opt],
        };
      });
    } else {
      setAnswers((prev) => ({ ...prev, [current.id]: [opt] }));
    }
  };

  const canProceed = selected.length > 0;

  const next = () => {
    if (step < total - 1) setStep(step + 1);
    else navigate("/dashboard");
  };

  const back = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-40 glass border-b border-border/50 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-coral flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground tracking-wide text-sm">
              Path<span className="text-gradient-coral">ly</span>
            </span>
          </div>
          <div className="text-xs text-muted-foreground font-medium">
            Identity Reset · {step + 1} of {total}
          </div>
        </div>
        {/* Progress */}
        <div className="mt-3 max-w-2xl mx-auto">
          <div className="h-1 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-coral rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 pt-28 pb-16">
        <div className="w-full max-w-2xl">
          {/* Step indicator dots */}
          <div className="flex gap-2 justify-center mb-10">
            {questions.map((_, i) => (
              <div
                key={i}
                className={`rounded-full transition-all duration-300 ${
                  i === step
                    ? "w-6 h-2 bg-coral"
                    : i < step
                    ? "w-2 h-2 bg-coral/50"
                    : "w-2 h-2 bg-border"
                }`}
              />
            ))}
          </div>

          {/* Question */}
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-coral mb-3">
              Rediscovering who you are
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 leading-snug">
              {current.question}
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto leading-relaxed">{current.subtitle}</p>
            {current.multi && (
              <span className="inline-block mt-3 text-xs text-amber bg-amber-500/10 border border-amber-500/20 rounded-full px-3 py-1">
                Select all that feel true
              </span>
            )}
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
            {current.options.map((opt) => {
              const isSelected = selected.includes(opt);
              return (
                <button
                  key={opt}
                  onClick={() => toggle(opt)}
                  className={`relative p-4 rounded-xl border text-left transition-all duration-200 group ${
                    isSelected
                      ? "border-coral-500/60 bg-coral-500/10 text-foreground"
                      : "border-border bg-surface-1 text-muted-foreground hover:border-coral-500/30 hover:bg-surface-2 hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                        isSelected
                          ? "border-coral bg-coral"
                          : "border-muted-foreground/30"
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
                    </div>
                    <span className="text-sm font-medium leading-snug">{opt}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Reassurance note */}
          <p className="text-center text-xs text-muted-foreground/50 mb-6 italic">
            There are no right or wrong answers. Choose what actually resonates — not what you think sounds good.
          </p>

          {/* Nav */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={back}
              disabled={step === 0}
              className="text-muted-foreground hover:text-foreground gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <Button
              onClick={next}
              disabled={!canProceed}
              className="bg-gradient-coral text-primary-foreground font-semibold px-7 gap-2 hover:opacity-90 disabled:opacity-30"
            >
              {step === total - 1 ? "Show me my identity profile" : "Continue"}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
