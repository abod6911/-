/**
 * JEDDAW Platform — Frontend AI Client Service
 * File: src/lib/ai-client.ts
 *
 * Dedicated transport & status service for JEDDAW AI.
 * Handles AbortController timeouts (25s), HTTP error states,
 * health status checks, and clean JSON validation.
 */

export type AiStatusState = "configured" | "unconfigured" | "offline" | "provider_error";

export interface AiChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AiClientRequest {
  prompt: string;
  conversationHistory?: AiChatMessage[];
  candidatePlaces?: any[];
  currentPlanSummary?: string;
}

export interface AiClientResponse {
  ok: boolean;
  statusState: AiStatusState;
  intent?: "chat" | "search_places" | "create_plan" | "modify_plan" | "place_details" | "clarification";
  language?: "ar" | "en";
  message?: string;
  extractedPreferences?: Record<string, any>;
  search?: Record<string, any>;
  modification?: Record<string, any>;
  suggestedReplies?: string[];
  errorMessage?: string;
}

const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || "https://your-supabase-project.supabase.co";
const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || "";

/**
 * Check if the AI backend Edge Function is configured & healthy.
 */
export async function checkAiHealth(): Promise<{ ok: boolean; statusState: AiStatusState; provider?: string }> {
  if (!SUPABASE_ANON_KEY || SUPABASE_URL.includes("your-supabase-project")) {
    return { ok: false, statusState: "unconfigured" };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/jeddaw-ai-assistant?health=1`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.providerConfigured) {
        return { ok: true, statusState: "configured", provider: data.provider };
      }
      return { ok: false, statusState: "unconfigured" };
    }

    return { ok: false, statusState: "provider_error" };
  } catch (err: any) {
    clearTimeout(timeoutId);
    return { ok: false, statusState: "offline" };
  }
}

/**
 * Send user message to JEDDAW AI Edge Function with 25s timeout guard.
 */
export async function sendAssistantMessage(req: AiClientRequest): Promise<AiClientResponse> {
  if (!SUPABASE_ANON_KEY || SUPABASE_URL.includes("your-supabase-project")) {
    return {
      ok: false,
      statusState: "unconfigured",
      errorMessage: "JEDDAW AI service is not connected to a backend project yet.",
    };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 25000); // 25 seconds timeout

  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/jeddaw-ai-assistant`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify(req),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (res.status === 503) {
      const errData = await res.json().catch(() => ({}));
      return {
        ok: false,
        statusState: "unconfigured",
        errorMessage: errData?.error?.message || "AI backend server secret is missing.",
      };
    }

    if (!res.ok) {
      return {
        ok: false,
        statusState: "provider_error",
        errorMessage: `AI server responded with status ${res.status}.`,
      };
    }

    const data = await res.json();

    return {
      ok: true,
      statusState: "configured",
      intent: data.intent || "chat",
      language: data.language || "ar",
      message: data.message || "أهلاً بك!",
      extractedPreferences: data.extractedPreferences || {},
      search: data.search || {},
      modification: data.modification || {},
      suggestedReplies: data.suggestedReplies || [],
    };
  } catch (err: any) {
    clearTimeout(timeoutId);

    if (err.name === "AbortError") {
      return {
        ok: false,
        statusState: "offline",
        errorMessage: "TIMEOUT",
      };
    }

    return {
      ok: false,
      statusState: "offline",
      errorMessage: err.message || "Network connection error.",
    };
  }
}
