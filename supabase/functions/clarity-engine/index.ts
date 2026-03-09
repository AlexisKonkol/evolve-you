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
    const { answers } = await req.json() as {
      answers: { question: string; answer: string }[];
    };

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const reflectionText = answers
      .map((a, i) => `Question ${i + 1}: ${a.question}\nAnswer: ${a.answer}`)
      .join("\n\n");

    const systemPrompt = `You are a thoughtful, warm clarity guide — someone who listens deeply and helps people understand themselves more clearly.

Your job is to read someone's honest reflections and write a Clarity Profile that feels personal, grounded, and gently illuminating.

The person you're writing for is feeling uncertain or stuck. They need to feel: "I understand myself better than I did before."

Write with warmth, precision, and humanity. Use their actual words and themes. Every sentence must feel specific to *this person*.

Avoid generic life-coaching language. No buzzwords. No clichés. Speak directly to them, as if you know them.

Structure your response EXACTLY using these markdown headers — nothing else:

## Core Motivations
2–3 sentences about what genuinely drives this person at a deep level. What do they care about beyond success or achievement? Use "You" language. Be specific to their answers.

## Energy Sources
2–3 sentences describing what activities, environments, and kinds of work give them energy — the things that light them up rather than drain them. Be precise and personal.

## Natural Strengths
2–3 sentences about the natural abilities, patterns of thinking, and ways of being that emerged from their answers — things they may not have labelled as "strengths" before. Help them see themselves.

## Meaningful Directions
3 specific directions, roles, or paths that align authentically with who they are. Not generic career titles — describe each one as a way of living and working that fits their identity. Format as a short list: each direction on its own line starting with "• ", followed by 1 sentence of description.

## A Grounding Note
End with 2–3 sentences of quiet, genuine encouragement. Reference something specific from their reflections. Help them feel clear, not overwhelmed. Remind them that clarity is a beginning, not a destination.

Important rules:
- Never be generic. Every sentence must feel earned and specific.
- Don't use phrases like "your unique journey" or "limitless potential" — be real.
- The tone should feel like a wise mentor, not a motivational poster.
- Keep the total length under 400 words.`;

    const userMessage = `Here are the Clarity Engine reflections from someone seeking clarity:\n\n${reflectionText}\n\nPlease write their Clarity Profile.`;

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
    console.error("Clarity engine error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
