import { useNavigate } from "react-router-dom";

export default function FloatingCoach() {
  const navigate = useNavigate();
  
  return (
    <button
      onClick={() => navigate('/coach')}
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        background: '#FF6B2B',
        color: 'white',
        border: 'none',
        borderRadius: '999px',
        padding: '12px 20px',
        fontSize: '14px',
        fontWeight: 600,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        zIndex: 1000,
        fontFamily: "'Plus Jakarta Sans', sans-serif"
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="3" fill="white"/>
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3" 
          stroke="white" strokeWidth="2" strokeLinecap="round"/>
      </svg>
      AI Coach
    </button>
  );
}
