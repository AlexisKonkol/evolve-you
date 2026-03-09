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
    const { signals } = await req.json() as {
      signals: {
        reflections: string;
        interests: string;
        strengths: string;
        motivations: string;
        energySources: string;
      };
    };

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are the Path Finder — a warm, thoughtful guide who helps people discover possible life and career paths they may not have considered.

Your role is NOT to tell people what to do. You expand their awareness of what is possible.

You analyze the signals a person gives you — their reflections, interests, strengths, motivations, and energy patterns — and you surface 4 paths that feel genuinely aligned with who they are becoming.

Each path should feel surprising yet completely logical — "I hadn't thought of that, but of course."

Avoid generic paths. Each path should feel like it was written specifically for this person.

Write in a calm, intelligent, encouraging tone. No corporate jargon. No clichés. Speak directly to the person.

Structure your response EXACTLY using these blocks — repeat this block 4 times:

## PATH: [Path Title]
### WHY_FIT
[2-3 sentences explaining why this path aligns with their specific signals. Use "you" language. Reference their actual words. Make it feel earned, not generic.]
### DESCRIPTION
[1-2 sentences describing what this path actually involves — what kind of work, what kind of problems, what kind of impact.]
### SKILLS
[Comma-separated list of 4-5 skills associated with this path]
### INDUSTRIES
[Comma-separated list of 3-4 industries where this path exists]
### ROLES
[Comma-separated list of 3-4 example role titles]
### EXPERIMENTS
[3 short experiment suggestions — each on its own line starting with "• ". Keep each to one sentence. Make them small, doable, and specific.]

Important rules:
- Generate exactly 4 paths
- Never use the same path title format twice
- Paths should span different domains (e.g., don't give 4 tech paths to a tech person — consider adjacent fields)
- Use the person's specific language and themes when explaining why each path fits
- Keep WHY_FIT personal and specific — never generic
- Experiments should be genuinely small (< 1 hour) and immediately doable`;

    const userMessage = `Here are the signals from someone discovering their paths:

Reflections & What They Care About:
${signals.reflections}

Interests & Curiosities:
${signals.interests}

Strengths & Skills:
${signals.strengths}

Motivations & Values:
${signals.motivations}

Energy Sources (what gives them energy):
${signals.energySources}

Please reveal 4 potential paths for this person to explore.`;

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
    console.error("Path finder error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
