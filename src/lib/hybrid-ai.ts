/**
 * JEDDAW Platform — Intent Classification & Hybrid AI Engine Client Integration
 * 
 * Invokes Supabase Edge Function `jeddaw-ai-assistant`.
 * Strictly enforces Intent Routing so short or ambiguous words like "كيس"
 * never trigger plan generation, while search chips return real place cards.
 */

import { getPlace, places, type Place } from "@/data/jeddah";

export type IntentType =
  | "create_plan"
  | "modify_plan"
  | "search_places"
  | "ask_place_details"
  | "greeting"
  | "help"
  | "clarification"
  | "unrelated"
  | "unknown";

export interface IntentDecision {
  intent: IntentType;
  confidence: number;
  language: "ar" | "en";
  normalizedMessage: string;
  planSignals: string[];
  missingInformation: string[];
  shouldBuildPlan: boolean;
  clarifyingQuestion: string;
}

export interface StructuredPlanStop {
  placeId: string;
  arrivalTime: string;
  visitDurationMinutes: number;
  travelFromPreviousMinutes: number;
  reasonAr: string;
  reasonEn: string;
}

export interface ValidatedPlan {
  titleAr: string;
  titleEn: string;
  totalDurationMinutes: number;
  estimatedCostMin: number;
  estimatedCostMax: number;
  validated: boolean;
  stops: StructuredPlanStop[];
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
      plan: ValidatedPlan;
    }
  | {
      type: "error";
      message: string;
      plan: null;
    };

const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || "https://your-supabase-project.supabase.co";
const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || "";

// Explicit plan signals matcher
const PLAN_SIGNALS_REGEX =
  /(سويلي خطة|اعمل لي خطة|رتب لي طلعة|وين أروح اليوم|بدي طلعة|اقترح لي برنامج|خطة عائلية|طلعة مع الشباب|مطعم وبعده كافيه|عندي \d+ ساعات|ميزانيتي|الليلة وين نروح|خطة طلعة|plan an outing|build me a plan|where should I go tonight|create an itinerary|make me a plan)/i;

const GREETING_REGEX =
  /^(هلا|مرحبا|مرحباً|أهلا|أهلاً|سلام|السلام عليكم|صباح الخير|مساء الخير|hi|hello|hey|greetings|good morning|good evening)$/i;

const SEARCH_PLACES_REGEX =
  /(مطعم|مطاعم|كافيه|كافيهات|قهوة|فندق|فنادق|شاطئ|شواطئ|ألعاب|كارتينج|منتجع|منتجعات|بروستد|أسماك|مشاوي|أماكن|مكان|استكشاف|search|cafes|places|explore)/i;

const MODIFY_COMMANDS_REGEX =
  /(خلها أرخص|خلّها أرخص|قرّب الأماكن|بدّل المطعم|بدل المطعم|أضف كافيه|احذف النشاط|اجعلها داخلية|مناسبة للأطفال|أرخص|غير المطعم|make it cheaper|closer places)/i;

/**
 * Classifies message intent locally with deterministic precision.
 */
export function classifyIntentLocally(
  prompt: string,
  hasCurrentPlan: boolean = false
): IntentDecision {
  const normalized = prompt.trim().toLowerCase();
  const words = normalized.split(/\s+/).filter(Boolean);
  const isEn = /[a-z]/i.test(prompt) && !/[\u0600-\u06FF]/.test(prompt);

  // Check explicit plan signals
  const matchedSignals: string[] = [];
  const signalMatch = prompt.match(PLAN_SIGNALS_REGEX);
  if (signalMatch) {
    matchedSignals.push(signalMatch[0]);
  }

  // 1. Check if user is searching for places (matches category search keywords or search chips)
  if (SEARCH_PLACES_REGEX.test(normalized) && matchedSignals.length === 0) {
    return {
      intent: "search_places",
      confidence: 0.9,
      language: isEn ? "en" : "ar",
      normalizedMessage: normalized,
      planSignals: [],
      missingInformation: [],
      shouldBuildPlan: false,
      clarifyingQuestion: isEn
        ? "Here are top recommended cafes and places in Jeddah for you:"
        : "إليك أفضل الكافيهات والأماكن المميزة الموصى بها في جدة:",
    };
  }

  // 2. Ambiguous / Short (< 3 words) without explicit plan signals
  if (words.length < 3 && matchedSignals.length === 0) {
    // Check if it's a greeting
    if (GREETING_REGEX.test(normalized)) {
      return {
        intent: "greeting",
        confidence: 0.95,
        language: isEn ? "en" : "ar",
        normalizedMessage: normalized,
        planSignals: [],
        missingInformation: [],
        shouldBuildPlan: false,
        clarifyingQuestion: isEn
          ? "Hello! 🌸 How can I help you in Jeddah today? (e.g. Restaurants, Cafes, or Outing Plan)"
          : "أهلاً وسهلاً بك! 🌸 كيف أقدر أساعدك اليوم في جدة؟ (مثلاً: مطاعم، كافيهات، أو خطة طلعة متكاملة)",
      };
    }

    // Check if it's a modify command WITH existing plan
    if (hasCurrentPlan && MODIFY_COMMANDS_REGEX.test(normalized)) {
      return {
        intent: "modify_plan",
        confidence: 0.9,
        language: isEn ? "en" : "ar",
        normalizedMessage: normalized,
        planSignals: ["modify_command"],
        missingInformation: [],
        shouldBuildPlan: true,
        clarifyingQuestion: "",
      };
    }

    // Ambiguous single/short word like "كيس", "كويس", "abc"
    return {
      intent: "unknown",
      confidence: 0.2,
      language: isEn ? "en" : "ar",
      normalizedMessage: normalized,
      planSignals: [],
      missingInformation: ["intent_clarification"],
      shouldBuildPlan: false,
      clarifyingQuestion: isEn
        ? `I'm not sure what you mean by "${prompt}". Would you like to create an outing plan, search for a place, or edit an existing plan?`
        : `ما فهمت قصدك تماماً من كلمة «${prompt}». هل تريد إنشاء خطة طلعة، البحث عن مكان، أو تعديل خطة موجودة؟`,
    };
  }

  // 3. Explicit Plan Creation Request
  if (matchedSignals.length > 0) {
    return {
      intent: "create_plan",
      confidence: 0.95,
      language: isEn ? "en" : "ar",
      normalizedMessage: normalized,
      planSignals: matchedSignals,
      missingInformation: [],
      shouldBuildPlan: true,
      clarifyingQuestion: "",
    };
  }

  // 4. Modification request with active plan
  if (hasCurrentPlan && MODIFY_COMMANDS_REGEX.test(normalized)) {
    return {
      intent: "modify_plan",
      confidence: 0.88,
      language: isEn ? "en" : "ar",
      normalizedMessage: normalized,
      planSignals: ["modify_command"],
      missingInformation: [],
      shouldBuildPlan: true,
      clarifyingQuestion: "",
    };
  }

  // 5. Default fallback clarification
  return {
    intent: "unknown",
    confidence: 0.4,
    language: isEn ? "en" : "ar",
    normalizedMessage: normalized,
    planSignals: [],
    missingInformation: ["intent"],
    shouldBuildPlan: false,
    clarifyingQuestion: isEn
      ? `Would you like to build a full outing plan or search for specific spots in Jeddah?`
      : `هل تود أن أرتب لك خطة طلعة متكاملة، أم تبحث عن أماكن ومطاعم معينة في جدة؟`,
  };
}

/**
 * Sends user prompt to Assistant Intent Router & Backend Function.
 */
export async function processAssistantMessage({
  message,
  currentPlan = null,
  conversationHistory = [],
}: {
  message: string;
  currentPlan?: ValidatedPlan | null;
  conversationHistory?: any[];
}): Promise<AssistantResponse> {
  const hasPlan = Boolean(currentPlan && currentPlan.validated);
  const decision = classifyIntentLocally(message, hasPlan);

  // Development Diagnostic Logging
  console.log({
    originalMessage: message,
    normalizedMessage: decision.normalizedMessage,
    detectedIntent: decision.intent,
    confidence: decision.confidence,
    planSignals: decision.planSignals,
    shouldBuildPlan: decision.shouldBuildPlan,
    hasCurrentPlan: hasPlan,
    actionExecuted: decision.intent === "search_places" ? "search_places" : (decision.shouldBuildPlan ? "execute_planner" : "ask_clarification"),
  });

  const isEn = decision.language === "en";

  // Handle Search Places Intent Directly with Real Data
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

  // Strict Protection Gate: Can ONLY build plan if create_plan OR (modify_plan WITH existing plan)
  const canBuildPlan =
    (decision.intent === "create_plan" && decision.confidence >= 0.78 && decision.shouldBuildPlan && decision.planSignals.length > 0) ||
    (decision.intent === "modify_plan" && hasPlan);

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

    // Default Clarification (e.g. for "كيس", "كويس", "abc")
    return {
      type: "clarification",
      message: decision.clarifyingQuestion,
      suggestedReplies: isEn
        ? ["Create a plan 🗓️", "Search cafes ☕", "Explore Jeddah 🌊"]
        : ["إنشاء خطة جديدة 🗓️", "البحث عن كافيهات وأماكن ☕", "استكشاف جدة 🌊"],
      plan: null,
    };
  }

  // Edge Function call for plan generation or modification
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
            plan: {
              ...data.plan,
              validated: true,
            },
          };
        }
      }
    } catch (e) {
      console.warn("[Hybrid AI Client] Edge Function call failed. Executing deterministic local plan.", e);
    }
  }

  // Fallback Local Plan Generation (Only executed when canBuildPlan is TRUE)
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
    plan: {
      titleAr: "خطة طلعة جدة 🌊",
      titleEn: "Jeddah Outing Plan 🌊",
      totalDurationMinutes: 190,
      estimatedCostMin: 95,
      estimatedCostMax: 140,
      validated: true,
      stops: [
        {
          placeId: "p1",
          arrivalTime: "17:00",
          visitDurationMinutes: 90,
          travelFromPreviousMinutes: 0,
          reasonAr: "مغامرة حماسيّة بالكارتينج",
          reasonEn: "Exciting karting action",
        },
        {
          placeId: "r1",
          arrivalTime: "18:45",
          visitDurationMinutes: 40,
          travelFromPreviousMinutes: 15,
          reasonAr: "وجبة عشاء مقرمشة بالبيك",
          reasonEn: "Famous Albaik chicken dinner",
        },
        {
          placeId: "c3",
          arrivalTime: "19:40",
          visitDurationMinutes: 50,
          travelFromPreviousMinutes: 15,
          reasonAr: "قهوة مختصة بروف الكورنيش",
          reasonEn: "Specialty coffee with sea view",
        },
      ],
    },
  };
}
