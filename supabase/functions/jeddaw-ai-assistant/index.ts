// ============================================================================
// JEDDAW Platform — Supabase Edge Function: Real Conversational AI Assistant
// File: supabase/functions/jeddaw-ai-assistant/index.ts
//
// Provider Support: Gemini / OpenAI (configured via server secrets)
// Secrets: GEMINI_API_KEY or OPENAI_API_KEY (stored safely in Supabase Edge Secrets)
// Environment: AI_PROVIDER (default: "gemini"), AI_MODEL (default: "gemini-1.5-flash")
// ============================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface RequestBody {
  prompt: string;
  conversationHistory?: ChatMessage[];
  candidatePlaces?: Array<{
    id: string;
    nameAr: string;
    nameEn: string;
    kind: string;
    area: string;
    budget: number;
    moods: string[];
    kidsFriendly: boolean;
    indoor: boolean;
  }>;
  currentPlanSummary?: string;
}

serve(async (req: Request) => {
  // 1. Handle CORS Preflight Options
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // 2. Health Check Endpoint (GET /?health=1)
  const url = new URL(req.url);
  if (req.method === "GET" || url.searchParams.get("health") === "1") {
    const provider = Deno.env.get("AI_PROVIDER") || "gemini";
    const model = Deno.env.get("AI_MODEL") || "gemini-1.5-flash";
    const geminiKey = Deno.env.get("GEMINI_API_KEY");
    const openaiKey = Deno.env.get("OPENAI_API_KEY");
    const isConfigured = Boolean((provider === "openai" ? openaiKey : geminiKey) || geminiKey || openaiKey);

    return new Response(
      JSON.stringify({
        ok: true,
        providerConfigured: isConfigured,
        provider,
        model,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: { code: "METHOD_NOT_ALLOWED", message: "Only POST requests allowed" } }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body: RequestBody = await req.json();
    const { prompt, conversationHistory = [], candidatePlaces = [], currentPlanSummary = "" } = body;

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return new Response(
        JSON.stringify({ error: { code: "INVALID_PROMPT", message: "Prompt string is required." } }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const provider = Deno.env.get("AI_PROVIDER") || "gemini";
    const modelName = Deno.env.get("AI_MODEL") || (provider === "openai" ? "gpt-4o-mini" : "gemini-1.5-flash");
    const geminiKey = Deno.env.get("GEMINI_API_KEY");
    const openaiKey = Deno.env.get("OPENAI_API_KEY");
    const apiKey = provider === "openai" ? openaiKey : (geminiKey || openaiKey);

    // If server AI secrets are missing, return unconfigured status cleanly
    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: {
            code: "AI_NOT_CONFIGURED",
            message: "JEDDAW AI server secret key is not configured in Supabase environment secrets.",
          },
          providerConfigured: false,
        }),
        {
          status: 503,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // 3. Call LLM Provider Adapter
    let llmResponse: any = null;

    if (provider === "openai") {
      llmResponse = await callOpenAIAdapter(apiKey, modelName, prompt, conversationHistory, candidatePlaces, currentPlanSummary);
    } else {
      llmResponse = await callGeminiAdapter(apiKey, modelName, prompt, conversationHistory, candidatePlaces, currentPlanSummary);
    }

    // 4. Validate & Sanitize Model JSON
    const safeOutput = sanitizeAiOutput(llmResponse, prompt);

    return new Response(JSON.stringify(safeOutput), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("[JEDDAW AI Edge Function Error]:", err?.message || err);

    return new Response(
      JSON.stringify({
        error: {
          code: "AI_PROVIDER_ERROR",
          message: "Unable to complete AI response right now. Please try again.",
        },
      }),
      {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

// ============================================================================
// SYSTEM PROMPT BUILDER
// ============================================================================
function buildJeddawSystemPrompt(candidatePlaces: any[], currentPlanSummary: string): string {
  const placesContext = candidatePlaces.length > 0
    ? JSON.stringify(candidatePlaces.slice(0, 15))
    : "No candidates pre-filtered.";

  return `You are JEDDAW AI (مساعد جِدّاو), an expert conversational outing and leisure assistant specialized exclusively in Jeddah, Saudi Arabia.

YOUR CORE IDENTITY & TONE:
- Natural, warm, helpful, locally aware Jeddah expert.
- ARABIC: Speak natural Arabic using polite Saudi / Jeddah dialect expressions (e.g. "هلا والله", "يا هلا", "عطني ميزانيتك", "ابشر", "طلعة روقان"). Avoid cold robotic formal MSA.
- ENGLISH: Natural, conversational, friendly tone.
- MULTILINGUAL: Match the user's language (Arabic, English, or mixed Arabizi/Bilingual).

FACTUAL & DATA INTEGRITY CONSTRAINTS:
- Never invent or hallucinate fake venue names, prices, or fake Google ratings.
- Use supplied JEDDAW place candidates where possible.
- If information is unverified, say so naturally without false claims.

INTENT DETERMINATION:
Determine user intent from:
1. "chat" -> Greeting ("هلا", "مرحبا"), general chat ("مين انت؟"), casual questions ("طفشان").
2. "search_places" -> Searching for specific places/cafes ("ابي قهوة هادية شمال جدة").
3. "create_plan" -> Wants a full multi-stop outing itinerary ("سويلي خطة 3 ساعات", "معي 150 ريال وش نسوي").
4. "modify_plan" -> Wants to edit an active plan ("خلها ارخص", "بدل المطعم", "شي قريب من البحر").
5. "place_details" -> Asking about specific venue details.
6. "clarification" -> Unclear prompt needing friendly options.

AVAILABLE JEDDAW CANDIDATE PLACES:
${placesContext}

ACTIVE PLAN SUMMARY (IF ANY):
${currentPlanSummary || "None active"}

STRICT JSON OUTPUT FORMAT ONLY:
Return ONLY valid JSON matching this schema:
{
  "intent": "chat" | "search_places" | "create_plan" | "modify_plan" | "place_details" | "clarification",
  "language": "ar" | "en",
  "message": "Friendly response string here",
  "extractedPreferences": {
    "budgetMax": 150,
    "groupType": "couple",
    "moods": ["chill"],
    "area": "corniche",
    "kidsFriendly": true,
    "indoorPreference": true
  },
  "search": {
    "query": "search term",
    "kinds": ["cafe", "food"],
    "area": "north"
  },
  "modification": {
    "action": "cheaper" | "closer" | "swap" | "indoor",
    "targetKind": "food" | "cafe" | "activity"
  },
  "suggestedReplies": ["Suggested quick reply 1", "Suggested quick reply 2"]
}`;
}

// ============================================================================
// GEMINI ADAPTER
// ============================================================================
async function callGeminiAdapter(
  apiKey: string,
  modelName: string,
  prompt: string,
  history: ChatMessage[],
  candidatePlaces: any[],
  currentPlanSummary: string
) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

  const systemInstruction = buildJeddawSystemPrompt(candidatePlaces, currentPlanSummary);

  const formattedHistory = history.slice(-6).map((m) => ({
    role: m.role === "user" ? "user" : "model",
    parts: [{ text: m.content }],
  }));

  const payload = {
    contents: [
      {
        role: "user",
        parts: [{ text: systemInstruction }],
      },
      {
        role: "model",
        parts: [{ text: `{"intent":"chat","language":"ar","message":"أهلاً بك! أنا مساعد جِدّاو، كلي آذان صاغية. كيف أقدر أساعدك؟"}` }],
      },
      ...formattedHistory,
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
    generationConfig: {
      temperature: 0.3,
      responseMimeType: "application/json",
    },
  };

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("[Gemini API Call Failed]:", res.status, errText);
    throw new Error(`Gemini HTTP error ${res.status}`);
  }

  const data = await res.json();
  const textOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!textOutput) throw new Error("Empty response body from Gemini model");

  return JSON.parse(textOutput);
}

// ============================================================================
// OPENAI ADAPTER
// ============================================================================
async function callOpenAIAdapter(
  apiKey: string,
  modelName: string,
  prompt: string,
  history: ChatMessage[],
  candidatePlaces: any[],
  currentPlanSummary: string
) {
  const endpoint = "https://api.openai.com/v1/chat/completions";
  const systemInstruction = buildJeddawSystemPrompt(candidatePlaces, currentPlanSummary);

  const formattedHistory = history.slice(-6).map((m) => ({
    role: m.role === "user" ? "user" : "assistant",
    content: m.content,
  }));

  const payload = {
    model: modelName,
    response_format: { type: "json_object" },
    temperature: 0.3,
    messages: [
      { role: "system", content: systemInstruction },
      ...formattedHistory,
      { role: "user", content: prompt },
    ],
  };

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("[OpenAI API Call Failed]:", res.status, errText);
    throw new Error(`OpenAI HTTP error ${res.status}`);
  }

  const data = await res.json();
  const textOutput = data?.choices?.[0]?.message?.content;
  if (!textOutput) throw new Error("Empty response body from OpenAI model");

  return JSON.parse(textOutput);
}

// ============================================================================
// SANITIZE & FALLBACK UTILITY
// ============================================================================
function sanitizeAiOutput(raw: any, userPrompt: string) {
  if (!raw || typeof raw !== "object") {
    return {
      intent: "chat",
      language: "ar",
      message: "أهلاً بك! كيف أقدر أساعدك اليوم في جدة؟ (كافيهات، مطاعم، أو خطة طلعة)",
      suggestedReplies: ["سويلي خطة 🗓️", "كافيهات رايقة ☕", "مطاعم جدة 🍽️"],
    };
  }

  const intent = ["chat", "search_places", "create_plan", "modify_plan", "place_details", "clarification"].includes(raw.intent)
    ? raw.intent
    : "chat";

  const isEn = raw.language === "en" || (/[a-z]/i.test(userPrompt) && !/[\u0600-\u06FF]/.test(userPrompt));

  return {
    intent,
    language: isEn ? "en" : "ar",
    message: raw.message || (isEn ? "How can I help you explore Jeddah today?" : "أهلاً بك! كيف أقدر أساعدك في طلعة جدة اليوم؟"),
    extractedPreferences: raw.extractedPreferences || {},
    search: raw.search || {},
    modification: raw.modification || {},
    suggestedReplies: Array.isArray(raw.suggestedReplies) && raw.suggestedReplies.length > 0
      ? raw.suggestedReplies.slice(0, 4)
      : isEn
        ? ["Create an outing plan 🗓️", "Search cafes ☕", "Explore Jeddah 🌊"]
        : ["إنشاء خطة طلعة 🗓️", "البحث عن كافيهات ☕", "استكشاف جدة 🌊"],
  };
}
