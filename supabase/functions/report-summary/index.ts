import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const { name, archetype, curiosityAreas, strengths, energySources } = await req.json();

    const systemPrompt = `You are a thoughtful insight writer for NAVO, a self-discovery platform.
Your role is to write a warm, personal, flowing narrative summary about a user based on their profile data.

Rules:
- Write exactly 3–4 sentences. No more.
- Speak directly to the person using "you" and "your".
- Synthesise curiosity areas, strengths, and energy sources into a unified narrative about who they are becoming.
- The tone should be reflective, warm, and genuinely insightful — not corporate or generic.
- Avoid lists, bullet points, or headers. Pure flowing prose only.
- Avoid hollow affirmations like "That's amazing" or "You're incredible".
- Focus on patterns, not labels. Show what the combination of signals reveals.
- End with an observation that opens possibility, not a directive.
- Keep the total response under 120 words.`;

    const userPrompt = `Write a personal narrative summary for this NAVO user:

Name: ${name}
Archetype: ${archetype}
Curiosity areas (ordered by signal strength): ${curiosityAreas.join(", ")}
Strength signals: ${strengths.join(", ")}
Energy sources: ${energySources.join(", ")}

Write the 3–4 sentence flowing narrative now.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        stream: true,
        temperature: 0.8,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit reached. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Usage limit reached. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("report-summary error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
