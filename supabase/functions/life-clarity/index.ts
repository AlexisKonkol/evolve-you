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

    const systemPrompt = `You are a deeply empathetic life clarity guide — a wise, warm mentor who helps people understand themselves better than they ever have before.

Your task is to read someone's honest reflections and write a Life Clarity Summary that feels deeply personal, insightful, and encouraging.

The summary should feel like it was written by someone who truly understands the person — not generic, not corporate, not clinical.

Use warm, human language. Write as if you're speaking directly to them. Be specific and use their actual words and themes from their answers.

Structure your response EXACTLY as follows using these markdown headers:

## Your Core Motivations
2–3 sentences about what truly drives them, based on their answers. Use "You" language.

## Your Natural Strengths  
2–3 sentences describing the natural abilities and ways of thinking that emerged from their reflections.

## What You Value Most
A short paragraph about their core values revealed through their answers. Be specific and genuine.

## Your Ideal Work Environment
2–3 sentences about the environment where they would flourish — be specific to their answers.

## Possible Life Directions
3 specific possible paths or directions that would align with who they are. Format as a short list with a brief description of each. These should feel exciting and achievable.

## A Personal Note
End with 2–3 sentences of genuine encouragement. Reference something specific from their answers. Help them feel seen and capable.

Important: Never be generic. Every sentence should feel specific to this person's actual answers.`;

    const userMessage = `Here are the reflection answers from someone seeking life clarity:\n\n${reflectionText}\n\nPlease write their Life Clarity Summary.`;

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
    console.error("Life clarity error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
