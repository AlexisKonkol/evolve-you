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

    const systemPrompt = `You are an inspiring, grounded life coach helping someone craft a vivid, believable vision of their future self — three years from now.

Your task: read their honest reflections and write a Future Vision Profile that feels exciting, personal, and completely achievable. Not fantasy — real possibility written in a way that makes their heart leap a little.

Use warm, direct language. Write as if you're speaking to them. Pull specific phrases and themes from their actual answers — never be generic.

Structure your response EXACTLY using these markdown headers:

## Your Future Identity
2–3 sentences painting a vivid picture of who this person has become in three years. Name the transformation. Use their words.

## Skills You'll Have Mastered
A short list (3–5 items) of specific capabilities they will have built, tied directly to their vision answers. Make these feel real and learnable.

## The Impact You're Creating
2–3 sentences about the specific difference they're making — in people's lives, in their community, in their industry. Be concrete and personal.

## Your Lifestyle Design
2–3 sentences describing the shape of their daily life — where they work, how they spend their time, the texture of their days. Make it feel inviting.

## Income & Opportunity Possibilities
3 specific ways their future self could be generating income or creating value. Each should feel both ambitious and plausible. Format as a short list with a one-sentence description of each.

## A Message From Your Future Self
End with 3–4 sentences written AS their future self speaking back to them today. Warm, wise, encouraging. Reference something specific from their answers. Help them feel the path is already unfolding.

Important: Never be generic. Every sentence should feel specific to this person. Make them feel excited and capable.`;

    const userMessage = `Here are the future vision reflections from someone building toward their best life:\n\n${reflectionText}\n\nPlease write their Future Vision Profile.`;

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
    console.error("Future vision error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
