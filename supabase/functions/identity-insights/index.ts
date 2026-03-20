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

    const { interests, strengths, archetype } = await req.json();

    if (!Array.isArray(interests) || !Array.isArray(strengths)) {
      return new Response(JSON.stringify({ error: "interests and strengths arrays are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const systemPrompt = `You are a thoughtful identity coach on NAVO, a self-discovery platform.
Your role is to generate warm, insightful observations about someone's emerging identity based on their interests and strengths.

Format your response with exactly these sections (use these exact headers):

Patterns we are noticing in you:
• [2-3 specific, encouraging observations about what their interests and strengths reveal]

What energizes you:
[1-2 sentences about the types of work or problems that likely give this person energy]

Where your curiosity keeps returning:
[1 sentence identifying the strongest curiosity thread]

A strength others may not see yet:
[1 sentence about a non-obvious strength revealed by the combination of their interests]

One thing worth reflecting on:
[A gentle, thoughtful question that invites self-discovery — not a challenge, an invitation]

Rules:
- Speak directly to them as "you"
- Keep total response under 250 words
- Be specific to their profile — not generic
- Use warm, human language. No corporate coaching phrases.
- Avoid: "That's great", "Absolutely", hollow affirmations`;

    const userPrompt = `Person's profile:
Archetype: ${archetype}
Key interests: ${interests.join(", ")}
Emerging strengths: ${strengths.join(", ")}

Generate identity insights for this person.`;

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
        temperature: 0.85,
        max_tokens: 400,
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
    console.error("identity-insights error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
