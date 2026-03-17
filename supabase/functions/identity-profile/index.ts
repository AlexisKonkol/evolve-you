import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SYSTEM_PROMPT = `You are NAVO's identity engine. Analyze the user's reflection answers and return ONLY a valid JSON profile with these fields: archetype (name, tagline, description, rarity), coreDrivers (array of 3 with name/description/signal), hiddenStrengths (array of 3 with strength/insight/unlocks), environmentFit (thrive array, drain array, workStyle), pathDirections (array of 3 with title/description/alignment/firstStep/skills array/resources array), mirrorMoment, curiosityThread, identityNarrative, displacementStory. Be specific to their answers. Write like a wise friend not a corporate coach. Rules: - ALWAYS include the displacementStory field. It is the single most important field. Never omit it. - displacementStory must be 2 warm, human sentences that reframe their job loss or career transition as a forced evolution — not a failure. Sound like a wise friend giving a hug.`;

serve(async (req: Request) => {
  // Handle CORS preflight
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

    // Format the user message from answers and optional context
    const userMessage = [
      context ? `Context: ${typeof context === "string" ? context : JSON.stringify(context)}` : null,
      `Answers: ${typeof answers === "string" ? answers : JSON.stringify(answers, null, 2)}`,
    ]
      .filter(Boolean)
      .join("\n\n");

    const anthropicResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-opus-4-5",
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: userMessage,
          },
        ],
      }),
    });

    // Handle rate limiting gracefully
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
        JSON.stringify({
          error: `Anthropic API error: ${anthropicResponse.status}`,
          details: errorBody,
        }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const anthropicData = await anthropicResponse.json();

    // Extract the text content from the response
    const rawContent = anthropicData?.content?.[0]?.text ?? "";

    // Parse the JSON profile from the response
    let profile: unknown;
    try {
      // Strip markdown code fences if present (e.g. ```json ... ```)
      const cleaned = rawContent
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```$/, "")
        .trim();
      profile = JSON.parse(cleaned);
    } catch (parseError) {
      console.error("Failed to parse profile JSON:", parseError, "\nRaw content:", rawContent);
      return new Response(
        JSON.stringify({
          error: "Failed to parse identity profile from AI response",
          raw: rawContent,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ profile }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Unhandled error in identity-profile function:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: String(err) }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
