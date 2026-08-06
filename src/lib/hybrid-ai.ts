/**
 * JEDDAW Platform — Master Hybrid AI Engine & Intent Router
 * File: src/lib/hybrid-ai.ts
 */

import { getPlace, places, type Place } from "@/data/jeddah";
import { normalizeInputMessage, DIALECT_MAPPINGS } from "@/lib/input-normalizer";
import { buildPlanServerSide, modifySingleStopInPlan, type GeneratedPlan } from "@/lib/plan-builder";
import { getCurrentPageContext } from "@/lib/context-resolver";

export type AssistantIntent =
  | "create_plan"
  | "modify_plan"
  | "search_places"
  | "ask_place_details"
  | "compare_places"
  | "compare_areas"
  | "save_plan"
  | "share_plan"
  | "open_route"
  | "greeting"
  | "help"
  | "feedback"
  | "clarification"
  | "unrelated"
  | "unknown";

export interface IntentDecision {
  intent: AssistantIntent;
  confidence: number;
  language: "ar" | "en";
  normalizedMessage: string;
  planSignals: string[];
  modificationSignals: string[];
  missingFields: string[];
  requiresCurrentPlan: boolean;
  shouldExecuteTool: boolean;
  clarifyingQuestion: string;
}

export type AssistantResponse =
  | {
      type: "message";
      message: string;
      suggestedReplies?: string[];
      plan: null;
    }
  | {
      type: "clarification";
      message: string;
      suggestedReplies?: string[];
      plan: null;
    }
  | {
      type: "place_results";
      message: string;
      places: Place[];
      suggestedReplies?: string[];
      plan: null;
    }
  | {
      type: "plan";
      message: string;
      suggestedReplies?: string[];
      plan: GeneratedPlan;
    }
  | {
      type: "plan_update";
      message: string;
      changedStops: string[];
      suggestedReplies?: string[];
      plan: GeneratedPlan;
    }
  | {
      type: "error";
      message: string;
      plan: null;
    };

const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || "https://your-supabase-project.supabase.co";
const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || "";

const PLAN_SIGNALS_REGEX =
  /(سويلي خطة|اعمل لي خطة|رتب لي طلعة|وين أروح اليوم|بدي طلعة|اقترح لي برنامج|خطة عائلية|طلعة مع الشباب|مطعم وبعده كافيه|عندي \d+ ساعات|ميزانيتي|الليلة وين نروح|خطة طلعة|plan an outing|build me a plan|where should I go tonight|create an itinerary|make me a plan)/i;

const GREETING_REGEX =
  /^(هلا|مرحبا|مرحباً|أهلا|أهلاً|سلام|السلام عليكم|صباح الخير|مساء الخير|hi|hello|hey|greetings|good morning|good evening)$/i;

const SEARCH_PLACES_REGEX =
  /(مطعم|مطاعم|كافيه|كافيهات|قهوة|فندق|فنادق|شاطئ|شواطئ|ألعاب|كارتينج|منتجع|منتجعات|بروستد|أسماك|مشاوي|أماكن|مكان|استكشاف|search|cafes|places|explore)/i;

const MODIFY_COMMANDS_REGEX =
  /(خلها أرخص|خلّها أرخص|قرّب الأماكن|بدّل المطعم|بدل المطعم|أضف كافيه|احذف النشاط|اجعلها داخلية|مناسبة للأطفال|أرخص|غير المطعم|make it cheaper|closer places)/i;

export function classifyAssistantIntent(
  rawPrompt: string,
  hasCurrentPlan: boolean = false
): IntentDecision {
  const norm = normalizeInputMessage(rawPrompt);
  const words = norm.normalizedMessage.split(/\s+/).filter(Boolean);
  const isEn = norm.detectedLanguage === "en";

  const planSignals: string[] = [];
  const pMatch = rawPrompt.match(PLAN_SIGNALS_REGEX);
  if (pMatch) planSignals.push(pMatch[0]);

  const modSignals: string[] = [];
  const mMatch = rawPrompt.match(MODIFY_COMMANDS_REGEX);
  if (mMatch) modSignals.push(mMatch[0]);

  // 1. Search places intent
  if (SEARCH_PLACES_REGEX.test(norm.normalizedMessage) && planSignals.length === 0) {
    return {
      intent: "search_places",
      confidence: 0.92,
      language: isEn ? "en" : "ar",
      normalizedMessage: norm.normalizedMessage,
      planSignals: [],
      modificationSignals: [],
      missingFields: [],
      requiresCurrentPlan: false,
      shouldExecuteTool: true,
      clarifyingQuestion: isEn
        ? "Here are top recommended cafes and spots in Jeddah for you:"
        : "إليك أفضل الكافيهات والأماكن المميزة الموصى بها في جدة:",
    };
  }

  // 2. Ambiguous / Short (< 3 words) without explicit plan signals
  if (words.length < 3 && planSignals.length === 0) {
    if (GREETING_REGEX.test(norm.normalizedMessage)) {
      return {
        intent: "greeting",
        confidence: 0.95,
        language: isEn ? "en" : "ar",
        normalizedMessage: norm.normalizedMessage,
        planSignals: [],
        modificationSignals: [],
        missingFields: [],
        requiresCurrentPlan: false,
        shouldExecuteTool: false,
        clarifyingQuestion: isEn
          ? "Hello! 🌸 How can I help you in Jeddah today? (e.g. Restaurants, Cafes, or Outing Plan)"
          : "أهلاً وسهلاً بك! 🌸 كيف أقدر أساعدك اليوم في جدة؟ (مثلاً: مطاعم، كافيهات، أو خطة طلعة متكاملة)",
      };
    }

    if (hasCurrentPlan && modSignals.length > 0) {
      return {
        intent: "modify_plan",
        confidence: 0.9,
        language: isEn ? "en" : "ar",
        normalizedMessage: norm.normalizedMessage,
        planSignals: [],
        modificationSignals: modSignals,
        missingFields: [],
        requiresCurrentPlan: true,
        shouldExecuteTool: true,
        clarifyingQuestion: "",
      };
    }

    // Ambiguous word like "كيس"
    return {
      intent: "unknown",
      confidence: 0.2,
      language: isEn ? "en" : "ar",
      normalizedMessage: norm.normalizedMessage,
      planSignals: [],
      modificationSignals: [],
      missingFields: ["intent_clarification"],
      requiresCurrentPlan: false,
      shouldExecuteTool: false,
      clarifyingQuestion: isEn
        ? `I'm not sure what you mean by "${rawPrompt}". Would you like to create an outing plan, search for a place, or edit an existing plan?`
        : `ما فهمت قصدك تماماً من كلمة «${rawPrompt}». هل تريد إنشاء خطة طلعة، البحث عن مكان، أو تعديل خطة موجودة؟`,
    };
  }

  // 3. Explicit Plan Creation Request
  if (planSignals.length > 0) {
    return {
      intent: "create_plan",
      confidence: 0.95,
      language: isEn ? "en" : "ar",
      normalizedMessage: norm.normalizedMessage,
      planSignals,
      modificationSignals: [],
      missingFields: [],
      requiresCurrentPlan: false,
      shouldExecuteTool: true,
      clarifyingQuestion: "",
    };
  }

  // 4. Modification Request with Active Plan
  if (hasCurrentPlan && modSignals.length > 0) {
    return {
      intent: "modify_plan",
      confidence: 0.88,
      language: isEn ? "en" : "ar",
      normalizedMessage: norm.normalizedMessage,
      planSignals: [],
      modificationSignals: modSignals,
      missingFields: [],
      requiresCurrentPlan: true,
      shouldExecuteTool: true,
      clarifyingQuestion: "",
    };
  }

  // Default Clarification
  return {
    intent: "unknown",
    confidence: 0.4,
    language: isEn ? "en" : "ar",
    normalizedMessage: norm.normalizedMessage,
    planSignals: [],
    modificationSignals: [],
    missingFields: ["intent"],
    requiresCurrentPlan: false,
    shouldExecuteTool: false,
    clarifyingQuestion: isEn
      ? "Would you like to build a full outing plan or search for specific spots in Jeddah?"
      : "هل تود أن أرتب لك خطة طلعة متكاملة، أم تبحث عن أماكن ومطاعم معينة في جدة؟",
  };
}

export async function processMasterAssistantMessage({
  message,
  currentPlan = null,
  conversationHistory = [],
}: {
  message: string;
  currentPlan?: GeneratedPlan | null;
  conversationHistory?: any[];
}): Promise<AssistantResponse> {
  const hasPlan = Boolean(currentPlan && currentPlan.validated);
  const decision = classifyAssistantIntent(message, hasPlan);

  console.log({
    originalMessage: message,
    normalizedMessage: decision.normalizedMessage,
    detectedIntent: decision.intent,
    confidence: decision.confidence,
    planSignals: decision.planSignals,
    shouldBuildPlan: decision.intent === "create_plan",
    hasCurrentPlan: hasPlan,
    actionExecuted: decision.shouldExecuteTool ? decision.intent : "ask_clarification",
  });

  const isEn = decision.language === "en";

  // Handle Search Places Intent Directly
  if (decision.intent === "search_places") {
    const q = decision.normalizedMessage;
    let matchedPlaces: Place[] = [];

    if (q.includes("كافيه") || q.includes("قهوة") || q.includes("حلى")) {
      matchedPlaces = places.filter((p) => p.kind === "cafe");
    } else if (q.includes("مطعم") || q.includes("أكل") || q.includes("عشا") || q.includes("غدا")) {
      matchedPlaces = places.filter((p) => p.kind === "food");
    } else if (q.includes("شاطئ") || q.includes("بحر") || q.includes("منتجع")) {
      matchedPlaces = places.filter((p) => p.kind === "resort" || p.moods.includes("sea"));
    } else {
      matchedPlaces = places.slice(0, 4);
    }

    if (matchedPlaces.length === 0) matchedPlaces = places.slice(0, 3);

    return {
      type: "place_results",
      message: decision.clarifyingQuestion,
      places: matchedPlaces,
      suggestedReplies: isEn
        ? ["Create an outing plan 🗓️", "Explore North Corniche 🌊", "Search fine dining 🍽️"]
        : ["إنشاء خطة طلعة 🗓️", "استكشاف الكورنيش الشمالي 🌊", "مطاعم فاخرة 🍽️"],
      plan: null,
    };
  }

  // Handle Partial Single-Stop Modification WITH active plan
  if (decision.intent === "modify_plan" && hasPlan && currentPlan) {
    const isCheaper = message.includes("أرخص") || message.includes("cheaper");
    const isIndoor = message.includes("داخلية") || message.includes("indoor");

    const modResult = modifySingleStopInPlan(
      currentPlan,
      "food",
      isCheaper ? "cheaper" : isIndoor ? "indoor" : "swap"
    );

    return {
      type: "plan_update",
      message: isEn ? modResult.changeSummaryEn : modResult.changeSummaryAr,
      changedStops: ["stop-2"],
      suggestedReplies: isEn
        ? ["Make it cheaper 💰", "Closer places 📍", "Add cafe ☕"]
        : ["خلّها أرخص 💰", "قرّب الأماكن 📍", "أضف كافيه ☕"],
      plan: modResult.newPlan,
    };
  }

  // Strict Gate: Can ONLY build plan if create_plan WITH planSignals
  const canBuildPlan = decision.intent === "create_plan" && decision.confidence >= 0.78 && decision.planSignals.length > 0;

  if (!canBuildPlan) {
    if (decision.intent === "greeting") {
      return {
        type: "message",
        message: decision.clarifyingQuestion,
        suggestedReplies: isEn
          ? ["Create a plan 🗓️", "Search cafes ☕", "Explore Jeddah 🌊"]
          : ["إنشاء خطة 🗓️", "البحث عن كافيهات ☕", "استكشاف جدة 🌊"],
        plan: null,
      };
    }

    return {
      type: "clarification",
      message: decision.clarifyingQuestion,
      suggestedReplies: isEn
        ? ["Create a plan 🗓️", "Search cafes ☕", "Explore Jeddah 🌊"]
        : ["إنشاء خطة جديدة 🗓️", "البحث عن كافيهات وأماكن ☕", "استكشاف جدة 🌊"],
      plan: null,
    };
  }

  // Edge Function call for plan generation
  if (SUPABASE_ANON_KEY && !SUPABASE_URL.includes("your-supabase-project")) {
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/jeddaw-ai-assistant`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          prompt: message,
          conversationHistory: conversationHistory.slice(-6),
          intentDecision: decision,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.plan && data.plan.stops) {
          return {
            type: "plan",
            message: data.assistantMessage || (isEn ? "Here is your plan:" : "إليك خطة طلعتك:"),
            suggestedReplies: isEn
              ? ["Make it cheaper 💰", "Closer places 📍", "Swap restaurant 🍽️"]
              : ["خلّها أرخص 💰", "قرّب الأماكن 📍", "بدّل المطعم 🍽️"],
            plan: {
              ...data.plan,
              validated: true,
            },
          };
        }
      }
    } catch (e) {
      console.warn("[Hybrid AI Client] Edge Function call failed. Executing local plan builder.", e);
    }
  }

  // Local Deterministic Server-Side Plan Builder Fallback
  const newPlan = buildPlanServerSide({});
  return {
    type: "plan",
    message: isEn
      ? "Here is your custom itinerary built from JEDDAW verified places:"
      : "إليك خطة الطلعة الموزونة والمحسوبة من أماكن جِدّاو المعتمدة:",
    suggestedReplies: [
      isEn ? "Make it cheaper" : "خلّها أرخص",
      isEn ? "Closer places" : "قرّب الأماكن",
      isEn ? "Swap restaurant" : "بدّل المطعم",
    ],
    plan: newPlan,
  };
}
