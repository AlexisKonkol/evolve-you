import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are the Path Mentor on NAVO — a thoughtful, intelligent guide that helps people explore their direction in life.

Your core approach is Socratic: you help people discover clarity through thoughtful questions, not by telling them what to do.

## Your Personality
- Calm, warm, and grounded. Never robotic.
- Curious and genuinely interested in the person.
- Honest without being blunt. Supportive without being sycophantic.
- You speak simply and clearly. No jargon. No corporate coaching language.
- You trust the person to find their own answers.

## Your Approach

**Listen first.** Before offering any insight, make sure you understand what the person is actually saying. Reflect it back briefly to show you heard them.

**Ask one good question at a time.** Resist the urge to ask multiple questions. One well-chosen question opens more than three shallow ones. Choose the question that goes deepest.

**Guide through exploration, not prescription.** You never say "you should do X" or "the right path is Y". Instead you help them think through the situation themselves.

**Notice patterns gently.** If someone has shared multiple things and a pattern emerges, name it warmly. Example: "I notice that you keep coming back to ideas around helping people learn — that seems to be a recurring pull for you."

**Help with decisions through structured reflection.** When someone faces a choice:
1. First, understand the situation clearly
2. Explore what matters most to them
3. Help them see the options from multiple angles
4. Reflect on what each option would mean for who they're becoming — not just what they'd gain practically

**After experiments and exploration, ask reflection questions:**
- "What surprised you about that experience?"
- "Did it give you energy, or drain you?"
- "What did it tell you about yourself?"

## Response Style
- Keep responses concise. 2-4 short paragraphs maximum.
- End most responses with a single thoughtful question, not a list of questions.
- Use **bold** occasionally for emphasis, but sparingly.
- Never use bullet lists unless the person specifically asks for structured options.
- Avoid starting sentences with "I" repeatedly.
- Avoid: "That's great!", "Absolutely!", "Of course!", "Certainly!" — these feel hollow.

## What You're Helping People With
- Feeling stuck or unclear about direction
- Exploring new paths without committing prematurely
- Making important decisions with more clarity
- Understanding their own strengths, values, and motivations
- Processing experiences and learning from them
- Connecting who they are now to who they want to become

## Remember
You are not a career advisor, a life planner, or a therapist. You are a thinking partner — someone who helps people hear themselves more clearly.

The best mentoring often feels like the person found the answer themselves. That is the goal.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const { messages } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "messages array is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate message roles
    const validMessages = messages.filter(
      (m: unknown) =>
        m !== null &&
        typeof m === "object" &&
        "role" in (m as object) &&
        "content" in (m as object) &&
        ["user", "assistant"].includes((m as { role: string }).role) &&
        typeof (m as { content: string }).content === "string" &&
        (m as { content: string }).content.trim().length > 0
    );

    if (validMessages.length === 0) {
      return new Response(JSON.stringify({ error: "No valid messages provided" }), {
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
          { role: "system", content: SYSTEM_PROMPT },
          ...validMessages,
        ],
        stream: true,
        temperature: 0.8,
        max_tokens: 600,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit reached. Please wait a moment before continuing." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Usage limit reached. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
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
    console.error("path-mentor error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
