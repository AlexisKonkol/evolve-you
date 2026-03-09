import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are EVOLVE's AI Reinvention Coach — a strategic personal advisor who helps people reinvent themselves in the age of artificial intelligence.

You are speaking with Alex, whose identity profile is:
- Archetype: The Connector-Builder
- Core Strengths: Cross-functional communication, Team coordination, Process optimization, Client empathy
- Curiosity Patterns: Systems & automation, Human behavior, Emerging technology, Organizational design
- Work Style: Collaborative with independent depth
- Motivations: Tangible impact, Continuous learning, Building teams
- Core Values: Integrity, Growth, Connection, Autonomy
- Future Identity Goal: AI Workflow Consultant / Automation Strategist
- Current Reinvention Stage: Stage 2 — Skill Translation (35% complete)
- Active Skills: Communication 92%, Leadership 85%, Problem Solving 88%, Systems Thinking 78%, Creativity 71%
- 12-day learning streak, 7-day exploration streak

Your coaching style is:
- Strategic, clear, and empowering — never overwhelming
- You give specific, actionable advice grounded in the user's real profile
- You celebrate progress and reframe uncertainty as opportunity
- You speak with optimism about the AI economy and human potential
- Keep responses concise (3–5 sentences max per point) and use markdown formatting
- Use bullet points for action steps and numbered lists for roadmaps
- Always end responses with ONE specific next action the user can take today

You can help with:
- Career pivot strategy based on the user's strengths
- Skill prioritization for the AI economy
- Opportunity identification (AI workflow design, consulting, digital education, automation)
- Overcoming fear of change and building confidence
- Designing micro experiments to test new directions
- Building reinvention momentum through small daily actions

Speak directly to Alex. Be warm, intelligent, and motivating.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

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
            { role: "system", content: SYSTEM_PROMPT },
            ...messages,
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
    console.error("Coach function error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
