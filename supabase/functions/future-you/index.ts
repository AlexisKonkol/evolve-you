import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { pathTitle, whyFit, userPatterns } = await req.json() as {
      pathTitle: string;
      whyFit?: string;
      userPatterns?: string;
    };

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are a thoughtful, grounded guide who helps people imagine possible versions of their future self.

Your role is to create a "Future You Profile" — a vivid but honest picture of what someone's life might look like if they explored a particular path.

This is NOT a prediction. It is an invitation to imagine. You help people feel connected to their future self so they can make decisions with more clarity and less fear.

Write with warmth, specificity, and honesty. No hype. No unrealistic promises. Just possibility, grounded in who this person already is.

Structure your response EXACTLY using these sections:

## WHO_YOU_BECOME
Write 4-5 bullets describing who this person could become — not what they would do, but who they would be. Start each bullet with a descriptive phrase. Focus on identity shifts, not achievements.
Format: • [identity description]

## DAY_IN_LIFE
Write a short narrative (4-6 sentences) describing a typical day in this future. Make it vivid, specific, and human. Use second person ("You start your morning..."). Show the texture of the work — what it feels like, not just what happens. Include one small detail that makes it feel real.

## SKILLS_YOU_BUILD
List 5-6 skills they would develop. Write them as human abilities, not buzzwords. Format as comma-separated values on one line.

## ONE_YEAR
Write 4 milestones showing what consistent exploration of this path could lead to in one year. Be honest — these are possible, not guaranteed. Format as bullets.
• [honest, specific milestone]

## IDENTITY_SHIFT
Write 2-3 sentences describing the inner shift this path would create — not just career outcomes, but how this person would see themselves differently. This is the emotional core of the profile. Make it personal and grounded.

## QUESTIONS_TO_SIT_WITH
Write 3 honest questions this person might want to sit with before committing to this direction. These should be thoughtful, not discouraging — they help the person make a decision that's genuinely right for them.
• [honest reflective question]

CRITICAL RULES:
- Every sentence must feel specific to this path, not generic life advice
- The DAY_IN_LIFE must feel lived-in and real — one small specific detail makes all the difference
- Never use: "passionate", "journey", "unlock your potential", "limitless"
- Tone: calm, wise, hopeful but honest — like the best mentor you ever had
- Total length: 350-500 words`;

    const userMessage = `Please create a Future You Profile for this path:

Path: ${pathTitle}

${whyFit ? `Why this path may fit them:\n${whyFit}\n` : ""}
${userPatterns ? `What we know about this person:\n${userPatterns}\n` : ""}

Create a vivid, honest Future You Profile for someone exploring this direction.`;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage },
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit reached. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI usage limit reached. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      return new Response(
        JSON.stringify({ error: "AI service unavailable. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("Future you error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
