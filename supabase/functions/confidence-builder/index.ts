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

    const systemPrompt = `You are a deeply empathetic strength coach — warm, perceptive, and honest. Your role is to help people SEE the real capability they already possess but often overlook or underestimate.

Read someone's honest reflections about their past challenges and achievements. Then write a Strength Reflection that reveals the depth of their capability in a way that feels genuinely surprising and moving.

Your tone: supportive, empowering, grounded in their actual words. Not cheerleader-generic — specific and insightful. Write directly to them using "you" language. Reference their exact words and situations.

The goal: when they read this, they should feel: "I didn't realize how capable I actually am."

Structure your response EXACTLY using these markdown headers:

## Your Resilience
2–3 sentences showing specifically how this person has demonstrated resilience. Reference the actual challenges they shared. Name the pattern of strength you see.

## Your Transferable Skills
A list of 4–6 specific skills revealed through their answers — named clearly and described in one sentence each. These should feel like insights, not obvious statements.

## Your Leadership Traits
2–3 sentences identifying the leadership qualities that emerge from how they've handled situations — even if they've never thought of themselves as a leader.

## Your Problem-Solving Ability
2–3 sentences that show the specific way this person thinks through and navigates challenges. Be precise about their style and strengths.

## What You're Capable Of (That You Might Not See)
End with 3–4 sentences of honest, grounded encouragement. Name something specific from their reflections that shows a capability they likely underestimate. Help them connect their past proof points to future possibility.

Important: Be specific. Never use generic phrases like "you are resilient" without showing exactly WHY based on their answers. Every sentence should feel earned and personal.`;

    const userMessage = `Here are the strength reflections from someone building confidence in their capabilities:\n\n${reflectionText}\n\nPlease write their Strength Reflection.`;

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
    console.error("Confidence builder error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
