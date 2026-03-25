import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface EdgeScore {
  score: number;
  streak: number;
  last_activity_date: string | null;
}

interface UseEdgeScoreReturn {
  score: number;
  streak: number;
  loading: boolean;
  addPoints: (action: "coach" | "module" | "commitment") => Promise<void>;
  todayActions: Set<string>;
}

const POINTS: Record<string, number> = {
  coach: 10,
  module: 25,
  commitment: 15,
};

export function useEdgeScore(): UseEdgeScoreReturn {
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [todayActions, setTodayActions] = useState<Set<string>>(new Set());
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserId(data.user.id);
    });
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchScore = async () => {
      const { data, error } = await supabase
        .from("edge_scores")
        .select("score, streak, last_activity_date")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching edge score:", error);
        setLoading(false);
        return;
      }

      if (data) {
        setScore(data.score);
        setStreak(data.streak);

        // Check if last activity was today — if so restore todayActions from localStorage
        const today = new Date().toISOString().split("T")[0];
        if (data.last_activity_date === today) {
          const saved = localStorage.getItem(`navo_today_actions_${today}`);
          if (saved) setTodayActions(new Set(JSON.parse(saved)));
        } else {
          localStorage.removeItem(`navo_today_actions_${data.last_activity_date}`);
        }
      }

      setLoading(false);
    };

    fetchScore();
  }, [userId]);

  const addPoints = useCallback(
    async (action: "coach" | "module" | "commitment") => {
      if (!userId) return;

      const today = new Date().toISOString().split("T")[0];
      const points = POINTS[action];

      // Fetch current state fresh from DB
      const { data: current } = await supabase
        .from("edge_scores")
        .select("score, streak, last_activity_date")
        .eq("user_id", userId)
        .maybeSingle();

      const currentScore = current?.score ?? 0;
      const currentStreak = current?.streak ?? 0;
      const lastDate = current?.last_activity_date ?? null;

      // Calculate new streak
      let newStreak = currentStreak;
      if (lastDate === null) {
        newStreak = 1;
      } else if (lastDate === today) {
        // Same day — streak unchanged
        newStreak = currentStreak;
      } else {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split("T")[0];
        newStreak = lastDate === yesterdayStr ? currentStreak + 1 : 1;
      }

      // Streak bonus: +5 if streak >= 7
      const streakBonus = newStreak >= 7 ? 5 : 0;
      const newScore = currentScore + points + streakBonus;

      const { error } = await supabase
        .from("edge_scores")
        .upsert(
          {
            user_id: userId,
            score: newScore,
            streak: newStreak,
            last_activity_date: today,
          },
          { onConflict: "user_id" }
        );

      if (error) {
        console.error("Error updating edge score:", error);
        return;
      }

      setScore(newScore);
      setStreak(newStreak);

      // Track today's actions in state + localStorage
      setTodayActions((prev) => {
        const next = new Set(prev).add(action);
        localStorage.setItem(
          `navo_today_actions_${today}`,
          JSON.stringify([...next])
        );
        return next;
      });
    },
    [userId]
  );

  return { score, streak, loading, addPoints, todayActions };
}
