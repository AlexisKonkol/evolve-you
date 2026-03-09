import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Zap, Check } from "lucide-react";

const questions = [
  {
    id: "energizes",
    question: "What kind of work energizes you?",
    subtitle: "Think about moments when you felt alive and engaged — not just busy.",
    options: [
      "Teaching or helping others learn",
      "Solving complex problems",
      "Creating and building things",
      "Organizing and improving systems",
      "Connecting people and ideas",
      "Leading and inspiring teams",
    ],
  },
  {
    id: "problems",
    question: "What problems do you genuinely enjoy solving?",
    subtitle: "The problems you'd think about even on the weekend.",
    options: [
      "How things work and why they break",
      "Why people behave the way they do",
      "How to make processes more efficient",
      "How to communicate ideas more clearly",
      "How businesses grow and operate",
      "How communities and cultures form",
    ],
  },
  {
    id: "skills",
    question: "What skills have you developed through work or life?",
    subtitle: "Don't undersell yourself — every experience counts.",
    options: [
      "Communication & storytelling",
      "Technical & analytical thinking",
      "Management & leadership",
      "Sales & relationship building",
      "Creativity & design",
      "Operations & execution",
    ],
    multi: true,
  },
  {
    id: "lifestyle",
    question: "What kind of lifestyle do you want?",
    subtitle: "Work should serve life, not consume it.",
    options: [
      "Freedom to work from anywhere",
      "Stability and clear structure",
      "High income and growth",
      "Creative expression and autonomy",
      "Deep impact and meaning",
      "Community and collaboration",
    ],
  },
  {
    id: "impact",
    question: "What impact do you most want to make?",
    subtitle: "What would make your work feel meaningful?",
    options: [
      "Help individuals change their lives",
      "Build something that scales",
      "Fix broken systems",
      "Create art or culture",
      "Advance human knowledge",
      "Support local communities",
    ],
  },
];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const navigate = useNavigate();

  const current = questions[step];
  const selected = answers[current.id] || [];
  const total = questions.length;
  const progress = ((step) / total) * 100;

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
            Discovering who you are · {step + 1} of {total}
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
              Understanding who you are
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              {current.question}
            </h1>
            <p className="text-muted-foreground">{current.subtitle}</p>
            {current.multi && (
              <span className="inline-block mt-2 text-xs text-amber bg-amber-500/10 border border-amber-500/20 rounded-full px-3 py-1">
                Select all that apply
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
                    <span className="text-sm font-medium">{opt}</span>
                  </div>
                </button>
              );
            })}
          </div>

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
              {step === total - 1 ? "Reveal My Identity Profile" : "Continue becoming"}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
