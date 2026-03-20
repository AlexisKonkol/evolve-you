import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const ANTHROPIC_MODEL = "claude-haiku-4-5-20251001";
const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

const SYSTEM_PROMPT = `You are NAVO's identity engine — a behavioral psychologist, narrative therapist, and life strategist combined.

Analyze the user's reflection answers and return ONLY valid JSON. No markdown, no explanation, no code fences.

Return this EXACT JSON structure with ALL fields included:
{
  "archetype": { "name": "The [name]", "tagline": "one poetic line", "description": "2-3 sentences", "rarity": "Top X% of profiles" },
  "coreDrivers": [3 objects with name/description/signal],
  "hiddenStrengths": [3 objects with strength/insight/unlocks],
  "environmentFit": { "thrive": [3-4 items], "drain": [3-4 items], "workStyle": "one sentence" },
  "pathDirections": [3 objects with title/description/alignment/firstStep/skills array/resources array],
  "mirrorMoment": "the most powerful insight — make them want to screenshot this",
  "curiosityThread": "the underlying theme connecting all answers",
  "identityNarrative": "3-4 sentences written directly to them using you/your",
  "displacementStory": "MANDATORY — exactly 2 warm sentences reframing their career transition or job loss as a forced evolution not a failure — sound like a wise friend giving a hug, e.g. 'What felt like the floor falling out was actually a clearing. You were never going to find your real path inside the old one.'"
}

CRITICAL RULES:
- Return ONLY the JSON object. Nothing before it, nothing after it. No markdown fences.
- ALL 9 fields are required. Never skip any field.
- displacementStory is NON-NEGOTIABLE. It must always be present. It must always be exactly 2 sentences. It must reframe a career transition or job loss as forced evolution, not failure. If the user has not mentioned a job loss, still write it — frame it as the courage it takes to question the path they were on.
- Be specific to their actual answers.
- Write like a wise, warm friend — never a corporate coach.`;

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
    if (!ANTHROPIC_API_KEY) {
      return new Response(
        JSON.stringify({ error: "ANTHROPIC_API_KEY is not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const { answers, context } = body;

    if (!answers) {
      return new Response(
        JSON.stringify({ error: "Missing required field: answers" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userMessage = [
      context ? `Context: ${typeof context === "string" ? context : JSON.stringify(context)}` : null,
      `Answers: ${typeof answers === "string" ? answers : JSON.stringify(answers, null, 2)}`,
    ]
      .filter(Boolean)
      .join("\n\n");

    const anthropicResponse = await fetch(ANTHROPIC_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: ANTHROPIC_MODEL,
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    if (anthropicResponse.status === 429) {
      const retryAfter = anthropicResponse.headers.get("retry-after");
      return new Response(
        JSON.stringify({
          error: "Rate limit reached. Please try again shortly.",
          retryAfter: retryAfter ? parseInt(retryAfter, 10) : 60,
        }),
        {
          status: 429,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
            ...(retryAfter ? { "Retry-After": retryAfter } : {}),
          },
        }
      );
    }

    if (!anthropicResponse.ok) {
      const errorBody = await anthropicResponse.text();
      console.error("Anthropic API error:", anthropicResponse.status, errorBody);
      return new Response(
        JSON.stringify({ error: `Anthropic API error: ${anthropicResponse.status}`, details: errorBody }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const anthropicData = await anthropicResponse.json();
    const rawContent = anthropicData?.content?.[0]?.text ?? "";

    let profile: Record<string, unknown>;
    try {
      // Strip any accidental markdown fences the model may add
      const cleaned = rawContent
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```\s*$/i, "")
        .trim();
      profile = JSON.parse(cleaned);
    } catch (parseError) {
      console.error("Failed to parse profile JSON:", parseError, "\nRaw content:", rawContent);
      return new Response(
        JSON.stringify({ error: "Failed to parse identity profile from AI response", raw: rawContent }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ── Safety net: guarantee displacementStory is always present ────
    if (!profile.displacementStory || typeof profile.displacementStory !== "string" || profile.displacementStory.trim() === "") {
      profile.displacementStory =
        "What felt like the floor falling out was actually a clearing — the old path simply ran out of room for who you're becoming. You were never going to find your real direction inside a story that was written for someone else.";
    }

    return new Response(
      JSON.stringify({ profile }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Unhandled error in identity-profile function:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
