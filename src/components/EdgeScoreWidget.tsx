import { useEdgeScore } from "@/hooks/useEdgeScore";

const ACTIONS = [
  { key: "coach", label: "Coach check-in", points: 10, color: "#C084FC", dimColor: "rgba(192,132,252,0.07)", borderColor: "rgba(192,132,252,0.15)" },
  { key: "module", label: "Module done", points: 25, color: "#FF6B2B", dimColor: "rgba(255,107,43,0.07)", borderColor: "rgba(255,107,43,0.2)" },
  { key: "commitment", label: "Commitment kept", points: 15, color: "#C084FC", dimColor: "rgba(192,132,252,0.07)", borderColor: "rgba(192,132,252,0.15)" },
] as const;

export function EdgeScoreWidget() {
  const { score, streak, loading, todayActions } = useEdgeScore();

  if (loading) {
    return (
      <div style={{
        background: "#0D0028",
        border: "1px solid rgba(192,132,252,0.18)",
        borderRadius: "16px",
        padding: "20px 22px",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        color: "rgba(255,255,255,0.3)",
        fontSize: "13px",
      }}>
        Loading Edge Score...
      </div>
    );
  }

  const allDone = ACTIONS.every((a) => todayActions.has(a.key));

  return (
    <div style={{
      background: "#0D0028",
      border: "1px solid rgba(192,132,252,0.18)",
      borderRadius: "16px",
      padding: "20px 22px",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Glow accent */}
      <div style={{
        position: "absolute", top: 0, right: 0,
        width: "160px", height: "160px",
        background: "radial-gradient(circle at 100% 0%, rgba(192,132,252,0.07) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Header row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "18px" }}>
        <div>
          <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(192,132,252,0.6)", marginBottom: "4px" }}>
            Edge Score
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
            <span style={{ fontSize: "48px", fontWeight: 700, color: "white", lineHeight: 1 }}>{score}</span>
          </div>
        </div>
        <div style={{
          textAlign: "center",
          background: "rgba(255,107,43,0.1)",
          border: "1px solid rgba(255,107,43,0.25)",
          borderRadius: "12px",
          padding: "10px 14px",
        }}>
          <div style={{ fontSize: "26px", fontWeight: 700, color: "#FF6B2B", lineHeight: 1 }}>{streak}</div>
          <div style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,107,43,0.6)", marginTop: "3px" }}>
            day streak
          </div>
        </div>
      </div>

      {/* Today's activity */}
      <div style={{ marginBottom: "14px" }}>
        <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: "8px" }}>
          Today's activity
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {ACTIONS.map((action) => {
            const done = todayActions.has(action.key);
            return (
              <div
                key={action.key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  background: done ? action.dimColor : "rgba(255,255,255,0.02)",
                  border: `1px solid ${done ? action.borderColor : "rgba(255,255,255,0.06)"}`,
                  borderRadius: "8px",
                  padding: "8px 10px",
                  transition: "all 0.2s ease",
                }}
              >
                <div style={{
                  width: "7px", height: "7px", borderRadius: "50%",
                  background: done ? action.color : "rgba(255,255,255,0.15)",
                  flexShrink: 0,
                  transition: "background 0.2s ease",
                }} />
                <span style={{ fontSize: "11px", color: done ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.25)" }}>
                  {action.label}
                </span>
                <span style={{ marginLeft: "auto", fontSize: "11px", fontWeight: 600, color: done ? action.color : "rgba(255,255,255,0.15)" }}>
                  +{action.points}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer nudge */}
      <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)" }}>
        {allDone
          ? "All done today — streak secured 🔒"
          : `${streak >= 7 ? "+5 streak bonus active · " : ""}Keep the streak — log something today`}
      </div>
    </div>
  );
}
