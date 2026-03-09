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

    const body = await req.json();
    const { type } = body;

    let systemPrompt = "";
    let userPrompt = "";

    if (type === "reflect") {
      const { experimentTitle, dayTitle, reflection } = body;
      systemPrompt = `You are a thoughtful life coach on the Pathly platform. 
Your role is to help people explore potential paths through small experiments.
When someone shares a reflection after a daily experiment activity, give them a brief, insightful, encouraging response.
Speak directly to them. Use calm, human language. 2-3 sentences maximum. No bullet points, no headings.
Focus on what their reflection reveals about them — their energy, interests, or patterns.
Be honest and grounded. Avoid flattery or generic encouragement.`;

      userPrompt = `The user is running the experiment: "${experimentTitle}"
They just completed the activity: "${dayTitle}"
Their reflection: "${reflection}"

Give a short, insightful coach response about what this reflection reveals about them.`;

    } else if (type === "recommend") {
      const { completedExperiments } = body;
      systemPrompt = `You are a thoughtful life coach on the Pathly platform.
Your role is to suggest meaningful experiment directions based on what someone has already explored.
Use calm, human language. Be specific and personal. No corporate jargon.
Format: 3-4 short paragraphs. Each paragraph suggests one direction with a brief reason.
Keep it under 200 words total. Focus on curiosity and exploration, not career outcomes.`;

      const completedList = completedExperiments?.length > 0
        ? `Experiments they have already completed: ${completedExperiments.join(", ")}`
        : "They haven't completed any experiments yet.";

      userPrompt = `Based on someone who has been exploring on Pathly, suggest 3 meaningful experiments they might want to try next.
${completedList}

If they haven't completed any, suggest experiments that are good starting points for self-discovery.
Suggest experiments that explore different directions — don't just stick to one theme.`;

    } else {
      return new Response(JSON.stringify({ error: "Unknown type" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

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
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit reached. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Usage limit reached. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("experiments-engine error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
