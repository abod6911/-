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

  // 6. Intelligent Local AI Engine (When Edge Function is Unconfigured or Network is Offline)
  // Provides seamless, zero-lag, zero-error AI interactions in Arabic Dialect & English
  const lowMsg = message.toLowerCase().trim();

  // A. Greeting & Platform Capability Intent
  const isGreeting = /^(مرحبا|أهلا|اهين|هلا|سلام|سلام عليكم|hi|hello|hey|good morning|good evening|من انت|مين انت|who are you|what can you do|وش تقدر تسوي)/i.test(lowMsg);
  if (isGreeting) {
    return {
      type: "message",
      message: isEn
        ? "Hello! 🌊 I'm JEDDAW AI. Tell me what you're in the mood for — whether it's a specialty cafe, sea view dining, Al-Balad heritage, or a full custom outing plan!"
        : "يا هادئ! 🌊 أنا مساعد جِدّاو الذكي. قول لي وش جوّك اليوم — كافيهات روّاق، عشاء على بحر الكورنيش، جولة بالبلد، أو ترطيب طلعة كاملة على ميزانيتك!",
      suggestedReplies: isEn
        ? ["Build family plan 🏛️", "Cafes in Rawdah ☕", "Seafood Corniche 🌊", "Outing under 100 SAR 💰"]
        : ["خطة عائلية 🏛️", "كافيهات الروضة ☕", "مطاعم الكورنيش 🌊", "جدة بأقل من 100 💰"],
      plan: null,
      aiStatus: aiResult.statusState,
    };
  }

  // B. Plan Modification Intent
  const isModify = /(بدل|غير|أرخص|أفخم|بدّل|تغيير|swap|cheaper|change|modify)/i.test(lowMsg);
  if (isModify && currentPlan && currentPlan.validated) {
    const isCheaper = /(أرخص|ارخص|رخيص|cheaper)/i.test(lowMsg);
    const targetKind = /(كافيه|قهوة|cafe)/i.test(lowMsg) ? "cafe" : "food";
    const modResult = modifySingleStopInPlan(currentPlan, targetKind as any, isCheaper ? "make_cheaper" : "swap");

    return {
      type: "plan_update",
      message: isEn ? modResult.changeSummaryEn : modResult.changeSummaryAr,
      changedStops: ["stop-2"],
      suggestedReplies: isEn
        ? ["Make it cheaper 💰", "Swap cafe ☕", "Share plan 📲"]
        : ["خلّها أرخص 💰", "بدّل القهوة ☕", "شارك الخطة 📲"],
      plan: modResult.newPlan,
      aiStatus: aiResult.statusState,
    };
  }

  // C. Plan Building Intent
  const isPlanReq = /(خطة|طلعة|سويلي|سوي|اعمل|رتب|ميزانيتي|برنامج|جدول|plan|outing|itinerary|schedule|trip|weekend|ويكند)/i.test(lowMsg);
  if (isPlanReq) {
    let budgetScope: "economy" | "balanced" | "premium" | undefined;
    if (/(أرخص|رخيص|100|economy|cheap)/i.test(lowMsg)) budgetScope = "economy";
    if (/(فاخر|فخم|ممتاز|premium|luxury)/i.test(lowMsg)) budgetScope = "premium";

    let area: string | undefined;
    if (/(بلد|البلد|balad)/i.test(lowMsg)) area = "balad";
    if (/(روضة|الروضة|rawdah)/i.test(lowMsg)) area = "rawdah";
    if (/(كورنيش|الكورنيش|corniche)/i.test(lowMsg)) area = "corniche";
    if (/(أبحر|ابحر|obhur)/i.test(lowMsg)) area = "obhur_north";

    const localPlan = buildPlanServerSide({ budgetScope, area });

    return {
      type: "plan",
      message: isEn
        ? `I built a custom plan tailored for your outing in Jeddah (${localPlan.totalDurationMinutes} min)!`
        : `رتبت لك خطة جداوية متكاملة مدتها ${localPlan.totalDurationMinutes} دقيقة بحسب الأماكن الأعلى تقييماً!`,
      suggestedReplies: isEn
        ? ["Make it cheaper 💰", "Swap restaurant 🍽️", "Show map 🗺️"]
        : ["خلّها أرخص 💰", "بدّل المطعم 🍽️", "شاهد الخريطة 🗺️"],
      plan: localPlan,
      aiStatus: aiResult.statusState,
    };
  }

  // D. Dynamic Place Search Intent (Cafes, Restaurants, Hotels, Resorts, Activities, Districts)
  const isSearch = /(مطعم|مطاعم|كافيه|كافيهات|قهوة|أماكن|فندق|فنادق|منتجع|منتجعات|شاطئ|بحر|ألعاب|كارتينج|عشاء|غداء|فطور|search|cafe|restaurant|hotel|resort|beach|food|coffee)/i.test(lowMsg);

  let matchedPlaces = places.filter((p) => {
    const textAr = (p.nameAr + " " + p.descAr + " " + p.categoryAr + " " + (p.subCategoryAr || "")).toLowerCase();
    const textEn = (p.nameEn + " " + p.descEn + " " + p.categoryAr).toLowerCase();

    if (/(كافيه|قهوة|cafe|coffee)/i.test(lowMsg) && p.kind === "cafe") return true;
    if (/(مطعم|مطاعم|أكل|غداء|عشاء|food|restaurant|dining)/i.test(lowMsg) && p.kind === "food") return true;
    if (/(فندق|فنادق|hotel)/i.test(lowMsg) && p.kind === "hotel") return true;
    if (/(منتجع|منتجعات|شاطئ|resort|beach)/i.test(lowMsg) && (p.kind === "resort" || p.districtId === "obhur_north")) return true;
    if (/(ألعاب|كارتينج|سينما|نشاط|activity|action)/i.test(lowMsg) && (p.kind === "activity" || p.kind === "outdoor")) return true;

    if (/(بلد|البلد|balad)/i.test(lowMsg) && p.districtId === "balad") return true;
    if (/(روضة|الروضة|rawdah)/i.test(lowMsg) && p.districtId === "rawdah") return true;
    if (/(كورنيش|الكورنيش|corniche)/i.test(lowMsg) && (p.districtId === "corniche" || p.districtId === "waterfront")) return true;

    const words = lowMsg.split(/\s+/).filter((w) => w.length > 2);
    return words.some((w) => textAr.includes(w) || textEn.includes(w));
  });

  if (matchedPlaces.length === 0) {
    matchedPlaces = places.slice(0, 4);
  }

  if (isSearch || matchedPlaces.length > 0) {
    return {
      type: "place_results",
      message: isEn
        ? `Here are top recommended spots matching "${message}":`
        : `إليك أفضل الأماكن المميزة في جدة لتجربتك:`,
      places: matchedPlaces.slice(0, 6),
      suggestedReplies: isEn
        ? ["Build plan 🗓️", "More cafes ☕", "Sea view spots 🌊"]
        : ["سوّ لي خطة 🗓️", "كافيهات زيادة ☕", "أماكن على البحر 🌊"],
      plan: null,
      aiStatus: aiResult.statusState,
    };
  }

  // E. Fallback General Assistance (Always returns helpful recommendations)
  return {
    type: "message",
    message: isEn
      ? "I can help you explore Jeddah! Try asking for cafes in Al-Rawdah, seafood on the Corniche, or click below to build a full outing plan."
      : "أنا هنا في خدمتك لاكتشاف جدة! أقدر أرتب لك خطة طلعة كاملة، أو أبحث لك عن كافيهات ومطاعم وأماكن ترفيه مميزة.",
    suggestedReplies: isEn
      ? ["Build plan 🗓️", "Explore cafes ☕", "Seafood dining 🐟"]
      : ["إنشاء خطة 🗓️", "استكشاف كافيهات ☕", "مطاعم بحرية 🐟"],
    plan: null,
    aiStatus: aiResult.statusState,
  };
}
