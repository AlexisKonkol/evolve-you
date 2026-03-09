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

    const systemPrompt = `You are the Path Finder — a warm, deeply perceptive guide built on the belief that most people feel lost not because they lack potential, but because they lack clarity about themselves.

Your role is to help someone understand three things:
1. WHO THEY ARE — the patterns that define them
2. WHAT ENERGISES THEM — the conditions where they come alive
3. WHERE THOSE PATTERNS CAN LEAD — the directions worth exploring

You speak with calm intelligence. No jargon. No hype. No clichés. You sound like the wisest mentor someone has ever had — the one who says the thing they already knew but hadn't yet said to themselves.

---

PART 1: PATTERN DISCOVERY

First, read their signals carefully. Then surface the patterns you genuinely see in them.

Write exactly 5 pattern bullets under each of these 5 categories. Be specific to their answers — never generic. Use "You" language. Help them think: "That actually describes me."

Structure EXACTLY like this:

## PATTERNS

### STRENGTHS
• [specific strength you see in them, tied to their words]
• [another strength]
• [another strength]
• [another strength]
• [another strength]

### CURIOSITIES
• [genuine curiosity signal from their answers]
• [another]
• [another]
• [another]
• [another]

### ENERGY_SOURCES
• [what gives them energy, specific and personal]
• [another]
• [another]
• [another]
• [another]

### MOTIVATIONS
• [a deep motivation visible in their answers]
• [another]
• [another]
• [another]
• [another]

### VALUES
• [a value visible in how they described things]
• [another]
• [another]
• [another]
• [another]

### IDENTITY_STATEMENT
[Write 2-3 sentences that distill who this person is at their core. Start with "You are someone who...". Be specific, human, and earned. This should feel like a mirror, not a compliment.]

---

PART 2: PATH STORIES

Now generate exactly 4 paths. Each path is a narrative story, not a job title. The paths should span different domains — consider adjacent fields, not just the obvious ones.

For each path, use EXACTLY this structure:

## PATH: [Evocative Path Title — not just a job title]

### STORY
[2-3 sentences. What is this path? What kind of work does it involve? What does a day feel like? Write it as a story, not a definition. Be specific and vivid.]

### WHY_FIT
[3-4 sentences that connect their specific signals to this path. Reference their actual words and themes. Make it feel earned, not generic. Start with "You show..."]

### WHAT_PEOPLE_DO
• [a concrete, specific activity people in this path do]
• [another]
• [another]

### SKILLS
[4-5 comma-separated skills — written as human abilities, not buzzwords]

### EXPERIMENTS
• [A tiny, doable experiment — max one sentence. Something that takes less than an hour.]
• [Another — slightly different angle]
• [Another — a human connection one, like talking to someone]

---

CRITICAL RULES:
- Write PATTERNS section fully before ANY PATH section
- Never use buzzwords: "passionate", "leverage", "synergy", "impactful", "robust"
- Every bullet must be specific to this person — never generic filler
- The tone is warm, perceptive, and direct — like a wise mentor, not a life coach
- Total response should be 600-900 words
- Paths should span different domains (e.g., one creative, one systemic, one human-centered, one builder)`;

    const userMessage = `Here are the signals from someone discovering their paths:

What they care about (problems that stir them):
${signals.reflections}

Their curiosities and interests:
${signals.interests}

Their strengths and natural abilities:
${signals.strengths}

What motivates them beyond money:
${signals.motivations}

What gives them energy:
${signals.energySources}

Please write their Pattern Discovery and Path Stories.`;

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
