/**
 * JEDDAW Platform — Master Hybrid AI Engine & Intent Router
 * File: src/lib/hybrid-ai.ts
 *
 * Bridges real conversational LLM (via ai-client.ts) with
 * deterministic JEDDAW execution tools (plan builder, single-stop modifier, places DB).
 */

import { getPlace, places, type Place } from "@/data/jeddah";
import { normalizeInputMessage } from "@/lib/input-normalizer";
import { buildPlanServerSide, modifySingleStopInPlan, type GeneratedPlan } from "@/lib/plan-builder";
import { sendAssistantMessage, type AiChatMessage, type AiStatusState } from "@/lib/ai-client";

export type AssistantIntent =
  | "chat"
  | "create_plan"
  | "modify_plan"
  | "search_places"
  | "ask_place_details"
  | "compare_places"
  | "clarification"
  | "unknown";

export type AssistantResponse =
  | {
      type: "message";
      message: string;
      suggestedReplies?: string[];
      plan: null;
      aiStatus?: AiStatusState;
    }
  | {
      type: "clarification";
      message: string;
      suggestedReplies?: string[];
      plan: null;
      aiStatus?: AiStatusState;
    }
  | {
      type: "place_results";
      message: string;
      places: Place[];
      suggestedReplies?: string[];
      plan: null;
      aiStatus?: AiStatusState;
    }
  | {
      type: "plan";
      message: string;
      suggestedReplies?: string[];
      plan: GeneratedPlan;
      aiStatus?: AiStatusState;
    }
  | {
      type: "plan_update";
      message: string;
      changedStops: string[];
      suggestedReplies?: string[];
      plan: GeneratedPlan;
      aiStatus?: AiStatusState;
    }
  | {
      type: "error";
      message: string;
      plan: null;
      aiStatus?: AiStatusState;
    };

export async function processMasterAssistantMessage({
  message,
  currentPlan = null,
  conversationHistory = [],
}: {
  message: string;
  currentPlan?: GeneratedPlan | null;
  conversationHistory?: Array<{ sender: "user" | "bot"; text: string }>;
}): Promise<AssistantResponse> {
  const norm = normalizeInputMessage(message);
  const isEn = norm.detectedLanguage === "en";

  // 1. Format clean conversation history for AI client
  const formattedHistory: AiChatMessage[] = conversationHistory
    .slice(-6)
    .filter((m) => m && m.text)
    .map((m) => ({
      role: m.sender === "user" ? "user" : "assistant",
      content: m.text,
    }));

  // 2. Build compact candidate places list (max 15 places)
  const candidatePlaces = places.slice(0, 15).map((p) => ({
    id: p.id,
    nameAr: p.nameAr,
    nameEn: p.nameEn,
    kind: p.kind,
    area: p.districtId,
    budget: p.pricePerPerson,
    moods: p.moods,
    kidsFriendly: p.kidsFriendly,
    indoor: p.indoor,
  }));

  // 3. Compact current plan summary
  const currentPlanSummary = currentPlan && currentPlan.validated
    ? `Title: ${currentPlan.titleAr}, Stops: ${currentPlan.stops.map((s) => s.place.nameAr).join(" -> ")}, Cost: ${currentPlan.estimatedCostMin} SAR`
    : "";

  // 4. Call Real Server-Side AI Backend
  const aiResult = await sendAssistantMessage({
    prompt: message,
    conversationHistory: formattedHistory,
    candidatePlaces,
    currentPlanSummary,
  });

  // Handle Timeout
  if (!aiResult.ok && aiResult.errorMessage === "TIMEOUT") {
    return {
      type: "error",
      message: isEn
        ? "The response is taking longer than expected. Please try again."
        : "تأخر الرد أكثر من المتوقع. جرّب مرة ثانية.",
      plan: null,
      aiStatus: "offline",
    };
  }

  // 5. IF AI Call Succeeded -> Route LLM Intent to JEDDAW Execution Tools
  if (aiResult.ok && aiResult.message) {
    const intent = aiResult.intent || "chat";

    // Intent A: Search Places
    if (intent === "search_places") {
      const searchKinds = aiResult.search?.kinds || [];
      const searchQuery = (aiResult.search?.query || message).toLowerCase();

      let matched = places.filter((p) => {
        if (searchKinds.length > 0 && searchKinds.includes(p.kind)) return true;
        if (p.nameAr.includes(searchQuery) || p.nameEn.toLowerCase().includes(searchQuery)) return true;
        return false;
      });

      if (matched.length === 0) matched = places.slice(0, 4);

      return {
        type: "place_results",
        message: aiResult.message,
        places: matched.slice(0, 6),
        suggestedReplies: aiResult.suggestedReplies || [
          isEn ? "Create plan 🗓️" : "سويلي خطة 🗓️",
          isEn ? "Search cafes ☕" : "كافيهات رايقة ☕",
        ],
        plan: null,
        aiStatus: "configured",
      };
    }

    // Intent B: Create Plan -> Execute Deterministic JEDDAW Plan Builder
    if (intent === "create_plan") {
      const prefs = aiResult.extractedPreferences || {};
      const newPlan = buildPlanServerSide({
        groupType: prefs.groupType,
        budgetScope: prefs.budgetMax ? (prefs.budgetMax <= 60 ? "economy" : prefs.budgetMax >= 150 ? "premium" : "balanced") : undefined,
        area: prefs.area,
        moods: prefs.moods,
      });

      return {
        type: "plan",
        message: aiResult.message,
        suggestedReplies: aiResult.suggestedReplies || [
          isEn ? "Make it cheaper 💰" : "خلّها أرخص 💰",
          isEn ? "Swap restaurant 🍽️" : "بدّل المطعم 🍽️",
        ],
        plan: newPlan,
        aiStatus: "configured",
      };
    }

    // Intent C: Modify Active Plan -> Execute JEDDAW Single Stop Modifier
    if (intent === "modify_plan" && currentPlan && currentPlan.validated) {
      const mod = aiResult.modification || {};
      const action = mod.action || "swap";
      const targetKind = mod.targetKind || "food";

      const modResult = modifySingleStopInPlan(currentPlan, targetKind as any, action as any);

      return {
        type: "plan_update",
        message: aiResult.message || (isEn ? modResult.changeSummaryEn : modResult.changeSummaryAr),
        changedStops: ["stop-2"],
        suggestedReplies: aiResult.suggestedReplies || [
          isEn ? "Make it cheaper 💰" : "خلّها أرخص 💰",
          isEn ? "Add cafe ☕" : "أضف كافيه ☕",
        ],
        plan: modResult.newPlan,
        aiStatus: "configured",
      };
    }

    // Intent D: Conversational Chat / Greeting / Clarification
    return {
      type: intent === "clarification" ? "clarification" : "message",
      message: aiResult.message,
      suggestedReplies: aiResult.suggestedReplies || [
        isEn ? "Create plan 🗓️" : "سويلي خطة 🗓️",
        isEn ? "Explore places 🌊" : "استكشف أماكن جدة 🌊",
      ],
      plan: null,
      aiStatus: "configured",
    };
  }

  // 6. Local Fallback Execution (When Edge Function is Unconfigured or Offline)
  // Transparently inform the user without claiming fake LLM verification
  const isUnconfigured = aiResult.statusState === "unconfigured";

  // Simple local intent classification for fallback
  const isSearch = /(مطعم|مطاعم|كافيه|كافيهات|قهوة|أماكن|search|cafe)/i.test(message);
  const isPlanReq = /(خطة|طلعة|سويلي|اعمل|ميزانيتي|plan|outing)/i.test(message);

  if (isSearch) {
    const matched = places.slice(0, 4);
    return {
      type: "place_results",
      message: isEn
        ? "Here are top spots listed in JEDDAW:"
        : "إليك أبرز الأماكن المتاحة في جِدّاو:",
      places: matched,
      suggestedReplies: [isEn ? "Build plan 🗓️" : "سوّ لي خطة 🗓️"],
      plan: null,
      aiStatus: aiResult.statusState,
    };
  }

  if (isPlanReq) {
    const fallbackPlan = buildPlanServerSide({});
    return {
      type: "plan",
      message: isEn
        ? "I built a plan using the places currently available in JEDDAW."
        : "جهّزت لك خطة باستخدام أماكن جِدّاو المتاحة حالياً.",
      suggestedReplies: [isEn ? "Make it cheaper" : "خلّها أرخص"],
      plan: fallbackPlan,
      aiStatus: aiResult.statusState,
    };
  }

  return {
    type: "message",
    message: isUnconfigured
      ? isEn
        ? "JEDDAW AI service is not connected to a server key yet. I can still help you search places and build local plans!"
        : "مساعد جِدّاو الذكي غير مربوط بخدمة الذكاء الاصطناعي بعد. لكن أقدر أساعدك في البحث عن أماكن وتجهيز خطط طلباتك محلياً!"
      : isEn
      ? "I couldn't reach the AI service right now. Would you like to search places or build a local plan?"
      : "عذراً، لم أتمكن من الاتصال بخدمة الذكاء الاصطناعي حالياً. هل تريد البحث عن أماكن أو إنشاء خطة محلياً؟",
    suggestedReplies: [
      isEn ? "Build plan 🗓️" : "إنشاء خطة 🗓️",
      isEn ? "Explore places 🌊" : "استكشاف جدة 🌊",
    ],
    plan: null,
    aiStatus: aiResult.statusState,
  };
}
