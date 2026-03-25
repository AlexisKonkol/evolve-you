import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from '@/integrations/supabase/client';
import { useEdgeScore } from "@/hooks/useEdgeScore";

const MODULES = [
  {
    id: "mindset",
    title: "Mindset",
    tagline: "You're not stuck because of your circumstances. You're stuck because of the thoughts you keep choosing — and thoughts can change.",
    steps: [
      {
        title: "Watch the loop before you try to change it",
        body: "Most of us are running the same mental programme on repeat without knowing it. Your thoughts create feelings. Feelings drive action. Action shapes your life. For one day — just observe. Don't fix anything. Just notice what thoughts your mind keeps defaulting to. That's the loop. You can't break what you can't see.",
        action: "Today's practice: Set a reminder every 2 hours. When it goes off, write down what thought you were just having. No judgment — just notice."
      },
      {
        title: "Your words are your wiring",
        body: "The sentences you repeat about yourself aren't just thoughts — they're instructions to your brain. 'I can't' closes doors. 'I'm working on' opens them. Research suggests most of our inner dialogue is negative — and most of it runs without us choosing it. Start choosing. Swap one phrase a day. Your brain responds to repetition, not intensity.",
        action: "Write 3 phrases you say about yourself that close doors. Then rewrite each one as something honest that leaves a door open."
      },
      {
        title: "Are you reacting to your life or creating it?",
        body: "When your first thought of the day is about a problem, your brain enters protection mode — scanning for threat, defending against loss. When your first thought is about something you're building, your brain enters a completely different state. Same morning. Two completely different days. The question is which one you're choosing to start.",
        action: "Tomorrow morning, before you check your phone, write one sentence about something you're building. Make that your first thought."
      },
      {
        title: "Practice feeling it before it happens",
        body: "Your brain has difficulty distinguishing between something vividly experienced in the mind and something that happened in reality. Spend 5 minutes every morning not just picturing who you're becoming — but feeling it. The emotion is what makes it land. The clearer the feeling, the faster your behaviour starts to follow.",
        action: "Set a 5-minute timer right now. Close your eyes. Picture yourself 6 months from now having figured this out. Don't just see it — feel it."
      },
      {
        title: "Act like that person now, not later",
        body: "Most people wait to feel ready before they show up differently. That's backwards. You don't feel your way into new behaviour — you act your way into new feelings. Start speaking, deciding, and carrying yourself like the version of you that already figured this out. Identity follows behaviour. Not the other way around.",
        action: "Identify one thing the future version of you does consistently that you don't do yet. Do it today. Just once. That's how it starts."
      }
    ]
  },
  {
    id: "confidence",
    title: "Confidence Builder",
    tagline: "Confidence isn't the absence of doubt. It's choosing to back yourself even when doubt shows up loudest.",
    steps: [
      {
        title: "Accept where you are without making it permanent",
        body: "Self-doubt doesn't mean you're not capable. It means the stakes are high enough to matter. The first move is accepting where you are right now — without turning it into a verdict on who you are. Where you are is not where you're staying. That separation is where everything starts.",
        action: "Write this down: 'Where I am right now is not who I am. It is simply where I am starting from.' Read it out loud. Mean it."
      },
      {
        title: "Build a file of real evidence",
        body: "Every day for 7 days, write down 3 things you actually did. Not feelings — facts. Things that happened because of you. Your brain trusts proof more than pep talks. This is how you build a case for yourself that doubt genuinely struggles to argue against.",
        action: "Start today. Write 3 things you did this week — big or small — that actually happened because of you."
      },
      {
        title: "Reclaim your agency one small choice at a time",
        body: "Confidence isn't rebuilt in one leap — it's rebuilt through small, repeated choices that say: I trust myself here. Make one slightly uncomfortable decision today. Then another tomorrow. The feeling that your actions matter comes from taking them, not from waiting until you're certain.",
        action: "Name one thing you've been avoiding because it feels uncomfortable. Make a decision about it right now — even a small one."
      },
      {
        title: "Stop measuring yourself against everyone else's highlight reel",
        body: "Comparison is one of the quietest thieves of self-trust. You are not behind. You are on your own timeline, building your own thing. The moment you stop outsourcing your sense of direction to what other people are doing, everything gets quieter — and clearer.",
        action: "For 24 hours, every time you catch yourself comparing, write down what you noticed about yourself — not them. Redirect the lens."
      },
      {
        title: "Let setbacks make you, not define you",
        body: "The most unshakeable confidence isn't built by people who never fail. It's built by people who adapt. Every time something doesn't go to plan, ask: what does this teach me? What did it build? The answer is always something. That's your edge growing.",
        action: "Think of your hardest recent setback. Write down 3 things it built in you that you didn't have before. Name them specifically."
      }
    ]
  },
  {
    id: "communication",
    title: "Communication Skills",
    tagline: "The clearest thing you can do for someone is tell them the truth about what you need.",
    steps: [
      { title: "Stop hinting and start saying it", body: "Here's a structure that works in every situation: what you observed (no judgment) → how it landed for you → what you actually need → your specific ask. No hints. No hoping they'll figure it out. Saying it clearly isn't harsh — it's the most respectful thing you can do.", action: "Think of one situation where you've been hinting instead of saying it. Write out what you actually need using the structure above." },
      { title: "Listen to understand, not to respond", body: "Before you reply, pause. Repeat back what you heard: 'So what I'm getting is...' Then ask: 'Is that right?' Most people are already forming their next sentence while the other person is still speaking. This single shift changes the quality of every conversation you'll have.", action: "In your next conversation today, practice the pause + reflect back. Notice what you hear that you would have missed." },
      { title: "Separate what happened from what it means", body: "Most hard conversations have three layers: what actually happened, how you feel about it, and what you've decided it means about you. Most of the heat is in that third layer. Once you separate them, the conversation stops being a threat — and starts being solvable.", action: "Think of a recent hard conversation. Write: what happened (facts only), how you felt, and what story you told yourself about what it meant." },
      { title: "Ask for what you want and don't apologize for it", body: "Describe what you want. Say it directly. Stay calm when they respond. Don't apologize for having a need. People don't respond well to hints, over-explaining, or circling — they respond to clear, steady requests made without apology.", action: "Write out one ask you've been avoiding. Say it in one clear sentence. No 'sorry to bother you', no 5-sentence preamble. Just the ask." },
      { title: "Earn trust in the small moments", body: "Real influence isn't built in the big ask — it's built in every conversation before it. People follow people they trust. Trust comes from showing up consistently, saying what you mean, and meaning what you say. Do that enough and the yes becomes the easy part.", action: "Identify one relationship where you want more trust. What's one consistent thing you can do in every interaction to build it?" }
    ]
  },
  {
    id: "decisions",
    title: "Decision Making",
    tagline: "Indecision is still a decision. It just means someone or something else is making it for you.",
    steps: [
      { title: "Learn your own decision traps", body: "Everyone has a default pattern when decisions get hard: overthink, freeze, or stay in something past its expiry. These aren't flaws — they're learned responses. Name yours. That awareness alone changes how much power those patterns have over you.", action: "Which is your default: overthink, freeze, or stay too long? Write about the last time it cost you something. What would you do differently?" },
      { title: "Ask: 10 minutes, 10 months, 10 years", body: "How will you feel about this decision in 10 minutes? 10 months? 10 years? Most decisions feel enormous right now and obvious in hindsight. This question stretches your perspective past the fear of the moment and shows you what actually matters.", action: "Apply this to a decision you're currently sitting on. Write your honest answers for each timeframe." },
      { title: "Picture the failure before it happens", body: "Before committing, imagine it's one year from now and things went wrong. What happened? Where did it break? This isn't pessimism — it's one of the most effective ways to surface real problems before they become real.", action: "Take your current big decision. Write a paragraph from one year in the future where it failed. What went wrong? Now — can you prevent that?" },
      { title: "Will 80-year-old you regret not trying?", body: "Project yourself to the end of your life and look back at this moment. Will you wish you'd tried? Research consistently shows that over time, people regret inaction far more than failure. This question cuts through short-term noise and gives you an honest answer.", action: "Write a letter from your 80-year-old self about the decision you're facing right now. What do they say?" },
      { title: "Your body already knows", body: "Tightness in your chest. A quiet sense of expansion. Dread you can't explain. These aren't distractions from your thinking — they are part of it. Your nervous system processes information before your conscious mind does. Learning to read those signals is one of the most underrated things you can develop.", action: "Sit quietly for 2 minutes. Think about each option in your current decision. Notice where you feel tension vs. expansion. Write it down." }
    ]
  },
  {
    id: "boundaries",
    title: "Boundary Setting",
    tagline: "Every time you say yes to something that isn't right for you, you're saying no to something that is.",
    steps: [
      { title: "Find what you keep giving away", body: "Write down your 5 most important values. Then look at the last month — where did you consistently act against them? That gap is where your limits need to live. Boundaries built from values hold. Boundaries built from guilt don't.", action: "Write your 5 values. Next to each one, honestly note whether you've been living it or overriding it. Circle the ones you keep overriding." },
      { title: "Say no like you mean it — without the speech", body: "'That doesn't work for me.' End of sentence. You don't owe a reason. The habit of over-explaining is the habit that makes saying no feel impossible — it's people-pleasing dressed up as politeness. Practice the short answer until the guilt stops showing up with it.", action: "Think of one thing you need to say no to this week. Write exactly what you'll say. Keep it to one sentence. Practice saying it out loud." },
      { title: "Steady beats loud every time", body: "When someone pushes back on your no, repeat it calmly. Same words, same tone, no escalation. Most pressure only works if you get flustered. Stay steady, stay quiet, say it again — and the pressure loses its grip without you having to fight for it.", action: "Role-play this in your mind: someone pushes back on a limit you set. Write out your calm, repeated response. Practice it until it feels natural." },
      { title: "Where does your time actually go?", body: "Track your time for one week. Then honestly compare where it went with where you want it to go. That gap is your boundary problem made visible. Protecting your time on purpose — not reactively — is what stops burnout before it starts.", action: "Block out your ideal week in a calendar. Then compare it to what last week actually looked like. Where is the biggest gap?" },
      { title: "'I'm being selfish' is not a fact", body: "That thought is your conditioning talking — not reality. Notice it. Name it. Choose not to follow it. Taking care of yourself is not selfishness. It is the thing that makes you available, present, and genuinely useful to the people who actually matter to you.", action: "Write down the last time you felt guilty for protecting your own time or energy. What would you tell a close friend in that exact situation?" }
    ]
  },
  {
    id: "advocacy",
    title: "Self-Advocacy",
    tagline: "Nobody is coming to notice your value for you. That's your job — and it starts with believing it yourself.",
    steps: [
      { title: "Get honest about what you're actually good at", body: "Not what you wish you were good at. What you genuinely do well — especially the things that feel so natural you've stopped counting them as skills. Write the list. Take it seriously. What feels ordinary to you is often extraordinary to someone else watching.", action: "Write 10 things you do well. Include the things that feel too obvious. Ask someone who knows you well to add 3 more. Read the whole list." },
      { title: "Challenge the 'who am I to ask?' thought", body: "When imposter doubt shows up before a big ask, that's not a warning — it's self-doubt trying to keep you safe by keeping you small. Catch it. Talk back: 'I've done the work. I've earned the right to ask.' Then ask anyway. That's how you rewire it.", action: "Write down the ask you've been avoiding because you feel like you don't deserve it. Then write: 'I have earned the right to ask this because...' Finish it honestly." },
      { title: "Lead with the ask. Then let the silence work.", body: "In any negotiation, the first number said shapes the whole conversation. State what you want first. Keep it specific. Give one clear reason. Then stop talking. The person who fills the silence first loses ground — and the silence always feels longer to you than it does to them.", action: "Practice your ask out loud. Time it — it should take under 30 seconds. Say it. Then practice stopping. Don't fill the silence." },
      { title: "Keep a private record of what you've built", body: "Write down what you accomplished every week. Keep it somewhere private. Read it before anything high-stakes. Results speak louder than self-description — but only if they're visible. Let your track record do the heavy lifting.", action: "Start your record right now. Write every meaningful thing you've accomplished in the last 3 months. Don't filter. Include everything." },
      { title: "Own your point of view and say it out loud", body: "One sentence. What you believe and what you're building. Put it in your bio, your emails, your introductions. Real authority isn't given by a title — it's earned through a clear, consistent point of view that you show up with every time. Own it fully and people start to follow it.", action: "Write your one-sentence point of view right now. Not perfect — just honest. 'I believe [X] and I'm building [Y].' Say it out loud. That's your authority." }
    ]
  }
];

export default function ModulePage() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const { addPoints } = useEdgeScore();
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState<boolean[]>([false, false, false, false, false]);
  const [journalEntry, setJournalEntry] = useState('');
  const [stepComplete, setStepComplete] = useState(false);
  const [moduleComplete, setModuleComplete] = useState(false);

  const module = MODULES.find(m => m.id === moduleId);
  const step = module?.steps[currentStep];

  useEffect(() => {
    setStepComplete(journalEntry.trim().length > 0);
  }, [journalEntry]);

  useEffect(() => {
    if (completed.every(c => c)) {
      setModuleComplete(true);
    }
  }, [completed]);

  const handleCompleteStep = async () => {
    if (!stepComplete || !module) return;

    // Save journal entry
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('journal_entries').insert({
          user_id: user.id,
          module_id: module.id,
          step_index: currentStep,
          entry: journalEntry.trim(),
          created_at: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error saving journal entry:', error);
    }

    const newCompleted = [...completed];
    newCompleted[currentStep] = true;
    setCompleted(newCompleted);

    if (currentStep === 4) {
      // Complete module
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from('module_completions').insert({
            user_id: user.id,
            module_id: module.id,
            completed_at: new Date().toISOString()
          });
          // Add edge score points for module completion
          await addPoints("module");
        }
      } catch (error) {
        console.error('Error saving module completion:', error);
      }
    }

    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      setJournalEntry('');
      setStepComplete(false);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setJournalEntry('');
      setStepComplete(false);
    }
  };

  if (!module) {
    return (
      <div style={{ minHeight: '100vh', background: '#0B0F1A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'white', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Module not found</div>
      </div>
    );
  }

  if (moduleComplete) {
    return (
      <div style={{ minHeight: '100vh', background: '#0B0F1A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>🧭</div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', color: 'white', margin: '0 0 12px' }}>
            Module complete.
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', margin: '0 0 32px', lineHeight: 1.6 }}>
            You showed up. That's the work.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                background: '#6366F1',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '15px',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                cursor: 'pointer'
              }}
            >
              Back to Dashboard
            </button>
            <button
              onClick={() => navigate('/edge-profile')}
              style={{
                background: 'transparent',
                color: 'rgba(255,255,255,0.6)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '4px',
                padding: '15px',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '11px',
                fontWeight: 500,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                cursor: 'pointer'
              }}
            >
              See Your Edge Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0B0F1A', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Top Bar */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '20px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.05)'
      }}>
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255,255,255,0.6)',
            fontSize: '20px',
            cursor: 'pointer',
            padding: '8px'
          }}
        >
          ←
        </button>
        <div style={{ 
          color: 'white', 
          fontSize: '14px', 
          fontWeight: 500 
        }}>
          {module.title}
        </div>
        <div style={{ 
          color: '#6366F1', 
          fontSize: '12px', 
          fontWeight: 500 
        }}>
          Step {currentStep + 1} of 5
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ 
        width: '100%', 
        height: '3px', 
        background: 'rgba(255,255,255,0.08)',
        position: 'relative'
      }}>
        <div style={{
          width: `${((currentStep + 1) / 5) * 100}%`,
          height: '100%',
          background: '#6366F1',
          transition: 'width 0.3s ease'
        }} />
      </div>

      {/* Step Content */}
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '20px',
          padding: '32px',
          marginBottom: '24px'
        }}>
          {/* Step Number */}
          <div style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '48px',
            color: 'rgba(99, 102, 241,0.3)',
            fontWeight: 400,
            marginBottom: '16px'
          }}>
            0{currentStep + 1}
          </div>

          {/* Title */}
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '24px',
            color: 'white',
            fontWeight: 400,
            margin: '0 0 16px',
            lineHeight: 1.3
          }}>
            {step?.title}
          </h2>

          {/* Body */}
          <p style={{
            fontSize: '15px',
            color: 'rgba(255,255,255,0.6)',
            lineHeight: 1.8,
            margin: '0 0 24px'
          }}>
            {step?.body}
          </p>

          {/* Divider */}
          <div style={{
            height: '1px',
            background: 'rgba(255,255,255,0.06)',
            margin: '24px 0'
          }} />

          {/* Action Section */}
          <div style={{
            background: 'rgba(99, 102, 241,0.06)',
            border: '1px solid rgba(99, 102, 241,0.2)',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '24px'
          }}>
            <div style={{
              fontSize: '10px',
              fontWeight: 600,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: '#6366F1',
              marginBottom: '12px'
            }}>
              YOUR MOVE
            </div>
            <p style={{
              fontSize: '13px',
              color: 'rgba(255,255,255,0.8)',
              lineHeight: 1.7,
              margin: 0
            }}>
              {step?.action}
            </p>
          </div>

          {/* Journal Box */}
          <div>
            <div style={{
              fontSize: '11px',
              color: 'rgba(255,255,255,0.25)',
              fontStyle: 'italic',
              marginBottom: '12px'
            }}>
              Write your response here — no one else sees this
            </div>
            <textarea
              value={journalEntry}
              onChange={(e) => setJournalEntry(e.target.value)}
              placeholder="Start writing..."
              style={{
                width: '100%',
                minHeight: '120px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                padding: '16px',
                color: '#F5ECD7',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '14px',
                resize: 'vertical',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(99, 102, 241,0.4)'}
              onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
            />
          </div>
        </div>

        {/* Bottom Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          {currentStep > 0 && (
            <button
              onClick={handlePrevious}
              style={{
                flex: '0 0 auto',
                background: 'transparent',
                color: 'rgba(255,255,255,0.6)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '4px',
                padding: '15px 24px',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '11px',
                fontWeight: 500,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                cursor: 'pointer'
              }}
            >
              ← Previous
            </button>
          )}
          <button
            onClick={handleCompleteStep}
            disabled={!stepComplete}
            style={{
              flex: 1,
              background: stepComplete ? '#6366F1' : 'rgba(99, 102, 241,0.3)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '15px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              cursor: stepComplete ? 'pointer' : 'not-allowed',
              opacity: stepComplete ? 1 : 0.4
            }}
          >
            {currentStep === 4 ? 'Complete Module →' : 'Complete This Step →'}
          </button>
        </div>
      </div>
    </div>
  );
}
