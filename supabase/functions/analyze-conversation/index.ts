import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { transcript, scenarioType, avatarPersonality, fillerWordsCount } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const contextLabel =
      scenarioType === "interview" ? "job interview" :
      scenarioType === "date" ? "first date conversation" :
      scenarioType === "meeting" ? "professional meeting" :
      "casual hangout";

    const structureGuidance = scenarioType === "interview"
      ? `For "Response Structure", specifically evaluate whether the user's answers follow the STAR method (Situation, Task, Action, Result) or similar structured formats. Deduct points for rambling or unstructured answers.`
      : `For "Response Structure", evaluate whether the user's responses have logical flow, appropriate length, and are well-organized for a ${contextLabel}.`;

    const systemPrompt = `You are an expert AI Communication Analysis Engine. Your job is to deeply analyze a ${contextLabel} transcript and produce a comprehensive performance report.

The AI partner's personality was: "${avatarPersonality || "neutral"}".
The user used ${fillerWordsCount || 0} filler words (um, uh, like, you know, etc.) during the session.

Analyze the USER's responses only (not the AI partner's). Evaluate:

1. **Communication Clarity** — Are responses clear, structured, and easy to understand?
2. **Answer Quality** — Are responses relevant, complete, and thoughtful?
3. **Confidence Level** — Based on response length, assertiveness, hedging language, and directness.
4. **Filler Words** — Score inversely based on filler word count (${fillerWordsCount || 0} detected). More fillers = lower score.
5. **Response Structure** — ${structureGuidance}
6. **Conversation Flow** — Did the conversation feel natural? Did the user engage well, ask questions, and maintain good rhythm?

Return ONLY valid JSON (no markdown, no code fences) in this EXACT format:
{
  "overall": "3-4 sentence comprehensive assessment of the user's communication performance",
  "scores": [
    {"label": "Communication Clarity", "score": 75, "feedback": "2-3 sentences of specific feedback with examples from the conversation"},
    {"label": "Answer Quality", "score": 70, "feedback": "2-3 sentences"},
    {"label": "Confidence Level", "score": 65, "feedback": "2-3 sentences"},
    {"label": "Response Structure", "score": 60, "feedback": "2-3 sentences"},
    {"label": "Conversation Flow", "score": 80, "feedback": "2-3 sentences"},
    {"label": "Filler Words", "score": 85, "feedback": "2-3 sentences"}
  ],
  "strengths": [
    "Specific strength 1 with example",
    "Specific strength 2 with example",
    "Specific strength 3 with example"
  ],
  "improvements": [
    "Specific area for improvement 1 with actionable advice",
    "Specific area for improvement 2 with actionable advice",
    "Specific area for improvement 3 with actionable advice"
  ],
  "betterResponses": [
    {
      "original": "What the user actually said (quote or paraphrase)",
      "improved": "A better version of that response showing how they could have answered",
      "explanation": "Why the improved version is better"
    },
    {
      "original": "Another user response",
      "improved": "Better version",
      "explanation": "Why it's better"
    }
  ]
}

Scores must be 0-100. Be specific, constructive, and reference actual things from the transcript. For betterResponses, pick the 2-3 weakest user responses and show how they could be improved.`;

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
          { role: "user", content: transcript },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Usage credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content || "";

    // Try to parse JSON, stripping markdown fences if present
    let cleaned = content.trim();
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "");
    }

    const parsed = JSON.parse(cleaned);

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
