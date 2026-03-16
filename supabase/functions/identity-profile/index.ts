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

    const { answers } = await req.json();

    if (!answers || typeof answers !== "object") {
      return new Response(JSON.stringify({ error: "answers object is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const systemPrompt = `You are Pathly's identity profiling engine — a combination of behavioral psychologist, life coach, and narrative identity expert.

Your job is to analyze someone's reflection answers and generate a deeply personal, emotionally resonant identity profile that makes them feel truly understood for the first time.

CRITICAL: You must return ONLY valid JSON. No markdown, no explanation, no code blocks — pure JSON only.

Generate a profile that follows this EXACT JSON structure:
{
  "archetype": {
    "name": "The [Archetype Name]",
    "tagline": "A powerful one-line essence of who they are (make it poetic and specific)",
    "description": "2-3 sentences that feel like looking in a mirror. Be specific to their answers. This should feel like someone who truly knows them wrote this.",
    "rarity": "Top X% of profiles" 
  },
  "coreDrivers": [
    { "name": "Driver name", "description": "Why this drives them specifically", "signal": "The answer that revealed this" }
  ],
  "hiddenStrengths": [
    { "strength": "Strength name", "insight": "A non-obvious insight about this strength that surprises them", "unlocks": "What this strength could unlock in their life" }
  ],
  "environmentFit": {
    "thrive": ["3-4 specific environments where they will flourish"],
    "drain": ["3-4 specific environments that will deplete them"],
    "workStyle": "A sentence describing their ideal way of working"
  },
  "pathDirections": [
    { "title": "Path name", "description": "Why this path aligns with who they are", "alignment": 95, "firstStep": "One concrete thing they could try this week" }
  ],
  "mirrorMoment": "The single most powerful insight about this person — the thing they may have never heard about themselves but immediately recognize as true. This is the WOW moment. Make it specific, warm, and revelatory.",
  "curiosityThread": "The underlying theme that connects all their answers — what they're fundamentally curious about in life",
  "identityNarrative": "A 3-4 sentence narrative written directly to them, describing the arc of who they are becoming. Use 'you' and 'your'. Make it feel like a letter from someone who deeply understands them."
}

Rules:
- Be SPECIFIC to their answers. Reference what they actually said.
- Avoid all generic coaching phrases ("You're a natural leader", "You have great communication skills")
- The mirrorMoment should make them want to screenshot and share it
- pathDirections should include 3 paths, with alignment scores between 78-97
- hiddenStrengths should include 3 strengths
- coreDrivers should include 3 drivers
- Write as if you are a wise friend who has known them for years`;

    const userPrompt = `Here are this person's reflection answers from Pathly's Identity Reset:

When they feel most energized: ${answers.energized?.join(", ") || "Not provided"}
Problems they naturally enjoy solving: ${answers.problems?.join(", ") || "Not provided"}
Activities that make them lose track of time: ${answers.flow?.join(", ") || "Not provided"}
Moments they felt most proud: ${answers.proud?.join(", ") || "Not provided"}
Environments where they thrive: ${answers.environment?.join(", ") || "Not provided"}
What matters most to them: ${answers.values?.join(", ") || "Not provided"}

Generate their Path Identity Profile now. Return ONLY valid JSON.`;

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
        stream: false,
        temperature: 0.88,
        max_tokens: 1800,
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

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content || "";

    // Strip markdown code fences if present
    const cleaned = rawContent.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();

    let profile;
    try {
      profile = JSON.parse(cleaned);
    } catch {
      console.error("JSON parse error, raw:", cleaned.slice(0, 300));
      return new Response(JSON.stringify({ error: "Failed to parse profile. Please retry." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ profile }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("identity-profile error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
