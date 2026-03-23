import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from '@/integrations/supabase/client';

const SECTIONS = [
  {
    label: "Section 1 of 3 — What Lights You Up",
    questions: [
      {
        key: "q1",
        question: "What makes you completely lose track of time?",
        hint: "Not what you think you should enjoy. What actually absorbs you.",
        placeholder: "When I'm doing this, hours feel like minutes..."
      },
      {
        key: "q2", 
        question: "What would you do even if nobody paid you or noticed?",
        hint: "The thing you'd do anyway, just because it matters to you.",
        placeholder: "Even if no one ever saw it, I'd still..."
      }
    ]
  },
  {
    label: "Section 2 of 3 — What Gives You Meaning",
    questions: [
      {
        key: "q3",
        question: "When have you felt most proud of yourself — not for the result, but for who you were in that moment?",
        hint: "Not the achievement — the person you were while achieving it.",
        placeholder: "I felt most proud when I..."
      },
      {
        key: "q4",
        question: "What kind of impact do you most want to have on the people around you?",
        hint: "Not your job title. The feeling you want to leave people with.",
        placeholder: "I want people to feel..."
      }
    ]
  },
  {
    label: "Section 3 of 3 — What Energises You",
    questions: [
      {
        key: "q5",
        question: "What kind of work or environment brings out the best version of you?",
        hint: "The conditions where you actually thrive — not just cope.",
        placeholder: "I do my best work when..."
      },
      {
        key: "q6",
        question: "When you imagine a life that feels deeply right — what's actually happening in it?",
        hint: "Not a fantasy. What does a life that truly fits you look like?",
        placeholder: "In a life that feels right, I'm..."
      }
    ]
  }
];

export default function SparkProfile() {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState({
    q1: '',
    q2: '',
    q3: '',
    q4: '',
    q5: '',
    q6: ''
  });
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  const currentSectionData = SECTIONS[currentSection];
  const allQuestionsInSectionAnswered = currentSectionData.questions.every(
    q => answers[q.key as keyof typeof answers].trim().length > 0
  );

  const handleContinue = () => {
    if (currentSection < 2) {
      setVisible(false);
      setTimeout(() => {
        setCurrentSection(currentSection + 1);
        setVisible(true);
      }, 300);
    }
  };

  const handleBack = () => {
    if (currentSection > 0) {
      setVisible(false);
      setTimeout(() => {
        setCurrentSection(currentSection - 1);
        setVisible(true);
      }, 300);
    }
  };

  const handleComplete = async () => {
    if (!allQuestionsInSectionAnswered) return;

    setLoading(true);
    
    try {
      // Save to Supabase
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Save spark profile
        await supabase.from('spark_profiles').insert({
          user_id: user.id,
          q1: answers.q1,
          q2: answers.q2,
          q3: answers.q3,
          q4: answers.q4,
          q5: answers.q5,
          q6: answers.q6,
          completed_at: new Date().toISOString()
        });

        // Update profile
        await supabase.from('profiles').update({
          spark_complete: true
        }).eq('user_id', user.id);
      }

      // Save to sessionStorage for AI generation
      sessionStorage.setItem('sparkAnswers', JSON.stringify(answers));

      // Navigate to compass
      navigate('/compass');
    } catch (error) {
      console.error('Error saving spark profile:', error);
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', fontFamily: "'Plus Jakarta Sans', sans-serif", position: 'relative' }}>
      {/* Orange glow */}
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: '50%', 
        transform: 'translateX(-50%)', 
        width: '100%', 
        height: 400, 
        background: 'radial-gradient(ellipse 700px 350px at 50% -60px, rgba(255,107,43,0.13) 0%, transparent 70%)', 
        pointerEvents: 'none', 
        zIndex: 0 
      }} />

      <div style={{ 
        maxWidth: '580px', 
        margin: '0 auto', 
        padding: '40px 32px', 
        position: 'relative', 
        zIndex: 1,
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.3s ease'
      }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ 
            display: 'inline-block', 
            fontSize: 10, 
            fontWeight: 600, 
            letterSpacing: '0.24em', 
            textTransform: 'uppercase', 
            color: '#FF6B2B', 
            border: '1px solid rgba(255,107,43,0.35)', 
            borderRadius: 999, 
            padding: '6px 16px', 
            marginBottom: 20 
          }}>
            Your Spark Profile
          </div>
          <h1 style={{ 
            fontFamily: "'Playfair Display', serif", 
            fontSize: 36, 
            fontWeight: 400, 
            color: 'white', 
            letterSpacing: '-0.02em', 
            lineHeight: 1.1, 
            margin: '0 0 8px' 
          }}>
            Now let's find out what
          </h1>
          <h2 style={{ 
            fontFamily: "'Playfair Display', serif", 
            fontSize: 36, 
            fontWeight: 400, 
            color: '#FF6B2B', 
            fontStyle: 'italic', 
            letterSpacing: '-0.02em', 
            lineHeight: 1.1, 
            margin: '0 0 16px' 
          }}>
            lights you up.
          </h2>
          <p style={{ 
            fontSize: 13, 
            color: 'rgba(255,255,255,0.35)', 
            margin: 0, 
            lineHeight: 1.7,
            maxWidth: '480px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            The COMPASS showed us what's blocking you.<br />
            These 6 questions reveal what's already alive in you.<br />
            Together — that's your full picture.
          </p>
        </div>

        {/* Progress Dots */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '6px', 
          marginBottom: 32 
        }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: '28px',
                height: '3px',
                borderRadius: '999px',
                background: i === currentSection ? '#FF6B2B' : 'rgba(255,255,255,0.15)'
              }}
            />
          ))}
        </div>

        {/* Section Label */}
        <div style={{ 
          display: 'inline-block',
          fontSize: 9,
          fontWeight: 600,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'white',
          background: 'rgba(255,107,43,0.15)',
          border: '1px solid rgba(255,107,43,0.35)',
          borderRadius: 999,
          padding: '8px 16px',
          marginBottom: 24
        }}>
          {currentSectionData.label}
        </div>

        {/* Questions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {currentSectionData.questions.map((q, index) => (
            <div key={q.key}>
              <h3 style={{ 
                fontFamily: "'Playfair Display', serif", 
                fontSize: 18, 
                color: 'white', 
                margin: '0 0 8px',
                lineHeight: 1.3
              }}>
                {q.question}
              </h3>
              <p style={{ 
                fontSize: 12, 
                color: 'rgba(255,255,255,0.3)', 
                fontStyle: 'italic', 
                margin: '0 0 12px',
                lineHeight: 1.5
              }}>
                {q.hint}
              </p>
              <textarea
                value={answers[q.key as keyof typeof answers]}
                onChange={(e) => setAnswers({
                  ...answers,
                  [q.key]: e.target.value
                })}
                placeholder={q.placeholder}
                style={{
                  width: '100%',
                  minHeight: '90px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  color: '#F5ECD7',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '14px',
                  fontWeight: 300,
                  resize: 'vertical',
                  transition: 'border-color 0.2s',
                  caretColor: '#FF6B2B'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(255,107,43,0.35)'}
                onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
              />
              {index < currentSectionData.questions.length - 1 && (
                <div style={{
                  height: '1px',
                  background: 'rgba(255,255,255,0.06)',
                  margin: '24px 0'
                }} />
              )}
            </div>
          ))}
        </div>

        {/* Bottom Info Box */}
        <div style={{
          background: 'rgba(255,107,43,0.05)',
          border: '1px solid rgba(255,107,43,0.15)',
          borderRadius: '14px',
          padding: '20px',
          marginTop: '32px',
          marginBottom: '24px'
        }}>
          <p style={{
            fontSize: 11,
            color: 'rgba(255,255,255,0.35)',
            margin: 0,
            lineHeight: 1.6,
            textAlign: 'center'
          }}>
            NAVO uses your answers to build a complete picture of you —<br />
            what's blocking you + what's already alive in you.<br />
            Together, that's your Edge Profile.
          </p>
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            onClick={currentSection === 2 ? handleComplete : handleContinue}
            disabled={!allQuestionsInSectionAnswered || loading}
            style={{
              width: '100%',
              background: allQuestionsInSectionAnswered && !loading ? '#FF6B2B' : 'rgba(255,107,43,0.3)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '15px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              cursor: allQuestionsInSectionAnswered && !loading ? 'pointer' : 'not-allowed',
              opacity: allQuestionsInSectionAnswered && !loading ? 1 : 0.4
            }}
          >
            {loading ? 'Saving...' : currentSection === 2 ? 'Complete My Spark Profile →' : 'Continue →'}
          </button>

          {currentSection > 0 && (
            <button
              onClick={handleBack}
              style={{
                width: '100%',
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
              ← Back
            </button>
          )}
        </div>

        {/* Privacy Note */}
        <p style={{
          fontSize: 11,
          color: 'rgba(255,255,255,0.2)',
          textAlign: 'center',
          margin: '16px 0 0'
        }}>
          Your answers are private. Only NAVO sees them.
        </p>

      </div>
    </div>
  );
}
