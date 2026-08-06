// ============================================================================
// JEDDAW Platform — Supabase Edge Function: Hybrid AI Assistant
// File: supabase/functions/jeddaw-ai-assistant/index.ts
//
// Model: gemini-1.5-flash / gemini-2.0-flash-lite
// Secret: GEMINI_API_KEY (stored safely in Supabase Edge Function Secrets)
// ============================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ============================================================================
// Saudi & Regional Dialect Lexicon Dictionary
// ============================================================================
const DIALECT_DICTIONARY: Record<string, { mood?: string; budgetScope?: string; groupType?: string; indoor?: boolean; kind?: string }> = {
  "رايق": { mood: "calm" },
  "روقان": { mood: "calm" },
  "هدوء": { mood: "calm" },
  "كشخة": { budgetScope: "premium" },
  "فخم": { budgetScope: "premium" },
  "دلع": { budgetScope: "premium" },
  "vip": { budgetScope: "premium" },
  "رخيص": { budgetScope: "economy" },
  "على قد اليد": { budgetScope: "economy" },
  "اقتصادي": { budgetScope: "economy" },
  "عيال": { groupType: "family" },
  "بزارين": { groupType: "family" },
  "أطفال": { groupType: "family" },
  "شباب": { groupType: "friends" },
  "شلة": { groupType: "friends" },
  "بحر": { mood: "sea" },
  "غروب": { mood: "sea" },
  "مكيف": { indoor: true },
  "داخل": { indoor: true },
  "وناسة": { mood: "adventure" },
  "حماس": { mood: "games" },
  "لعب": { mood: "games" },
  "تمشية": { kind: "outdoor" },
  "قهوة": { kind: "cafe", mood: "coffee" },
  "كافيه": { kind: "cafe", mood: "coffee" },
  "حلى": { kind: "cafe", mood: "coffee" },
  "عشا": { kind: "food", mood: "food" },
  "غدا": { kind: "food", mood: "food" },
  "أكل": { kind: "food", mood: "food" },
};

// Hardcoded verified Places database snapshot for Edge Function rule-based engine & fallback
const DATABASE_PLACES = [
  {
    id: "r1",
    nameAr: "مطعم البيك (فرع الزهراء وطريق الملك)",
    nameEn: "Albaik (Al Zahra & King Road)",
    kind: "food",
    categoryAr: "مطاعم",
    districtId: "zahra",
    moods: ["food"],
    pricePerPerson: 22,
    durationMin: 40,
    indoor: true,
    groups: ["family", "friends", "solo", "kids"],
    kidsFriendly: true,
    reservation: false,
    verified: true,
    accessible: true,
    opensAt: 10,
    closesAt: 26,
    rating: 4.9,
    viewsCount: 28500,
    image: "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "r2",
    nameAr: "مطعم خيال للمشاوي الشامية (الأندلس)",
    nameEn: "Khayal Levantine Grill (Al Andalus)",
    kind: "food",
    categoryAr: "مطاعم",
    districtId: "central",
    moods: ["food", "calm"],
    pricePerPerson: 95,
    durationMin: 80,
    indoor: true,
    groups: ["family", "friends", "couple", "coworkers"],
    kidsFriendly: true,
    reservation: true,
    verified: true,
    accessible: true,
    opensAt: 12,
    closesAt: 25,
    rating: 4.9,
    viewsCount: 22400,
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "r3",
    nameAr: "مطعم قدورة للأسماك البحرية (الحمراء)",
    nameEn: "Gaddoura Seafood (Al Hamra)",
    kind: "food",
    categoryAr: "مطاعم",
    districtId: "hamra",
    moods: ["food", "sea"],
    pricePerPerson: 130,
    durationMin: 90,
    indoor: true,
    groups: ["family", "friends", "couple", "tourist"],
    kidsFriendly: true,
    reservation: true,
    verified: true,
    accessible: true,
    opensAt: 13,
    closesAt: 25,
    rating: 4.8,
    viewsCount: 19800,
    image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "c1",
    nameAr: "كافيه برو 92 للقهوة المختصة (الخالدية)",
    nameEn: "Brew 92 Specialty Coffee (Al Khalidiya)",
    kind: "cafe",
    categoryAr: "كافيهات",
    districtId: "central",
    moods: ["coffee", "calm"],
    pricePerPerson: 40,
    durationMin: 60,
    indoor: true,
    groups: ["solo", "friends", "couple", "coworkers"],
    kidsFriendly: true,
    reservation: false,
    verified: true,
    accessible: true,
    opensAt: 6,
    closesAt: 25,
    rating: 4.9,
    viewsCount: 24100,
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "c2",
    nameAr: "مقهى ومحمصة ميدد التراثي (جدة التاريخية)",
    nameEn: "Medd Coffee & Roastery (Historic Balad)",
    kind: "cafe",
    categoryAr: "كافيهات",
    districtId: "balad",
    moods: ["coffee", "culture", "calm"],
    pricePerPerson: 35,
    durationMin: 60,
    indoor: true,
    groups: ["solo", "friends", "couple", "tourist"],
    kidsFriendly: true,
    reservation: false,
    verified: true,
    accessible: false,
    opensAt: 7,
    closesAt: 24,
    rating: 4.9,
    viewsCount: 18900,
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "c3",
    nameAr: "كافيه أفرست أوفردوز البحر (الكورنيش الشمالي)",
    nameEn: "Overdose Coffee (North Corniche)",
    kind: "cafe",
    categoryAr: "كافيهات",
    districtId: "corniche",
    moods: ["coffee", "sea"],
    pricePerPerson: 38,
    durationMin: 50,
    indoor: true,
    groups: ["friends", "couple", "solo", "tourist"],
    kidsFriendly: true,
    reservation: false,
    verified: true,
    accessible: true,
    opensAt: 6,
    closesAt: 26,
    rating: 4.8,
    viewsCount: 21500,
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "p1",
    nameAr: "حلبة إن-نايت كارتينج وأركيد (الروضة)",
    nameEn: "In10so Karting & Arcade (Al Rawdah)",
    kind: "activity",
    categoryAr: "ألعاب ومغامرات",
    districtId: "rawdah",
    moods: ["games", "adventure"],
    pricePerPerson: 120,
    durationMin: 90,
    indoor: true,
    groups: ["friends", "coworkers", "family", "kids"],
    kidsFriendly: true,
    reservation: false,
    verified: true,
    accessible: true,
    opensAt: 16,
    closesAt: 25,
    rating: 4.8,
    viewsCount: 23100,
    image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "p2",
    nameAr: "مركز الغوص السعودي - بحر أبحر",
    nameEn: "Red Sea Diving Center (Obhur)",
    kind: "outdoor",
    categoryAr: "بحر ومغامرة",
    districtId: "obhur",
    moods: ["sea", "adventure"],
    pricePerPerson: 280,
    durationMin: 150,
    indoor: false,
    groups: ["friends", "couple", "tourist", "solo"],
    kidsFriendly: false,
    reservation: true,
    verified: true,
    accessible: false,
    opensAt: 8,
    closesAt: 18,
    rating: 4.9,
    viewsCount: 27400,
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "p3",
    nameAr: "منطقة البلد التاريخية وبيت ناصيف",
    nameEn: "Historic Al Balad & Nasseef House",
    kind: "culture",
    categoryAr: "ثقافة وتاريخ",
    districtId: "balad",
    moods: ["culture", "calm"],
    pricePerPerson: 0,
    durationMin: 120,
    indoor: false,
    groups: ["family", "friends", "couple", "tourist", "solo"],
    kidsFriendly: true,
    reservation: false,
    verified: true,
    accessible: false,
    opensAt: 9,
    closesAt: 24,
    rating: 4.9,
    viewsCount: 35200,
    image: "https://images.unsplash.com/photo-1578895210405-907db48a7111?auto=format&fit=crop&w=800&q=80",
  },
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { prompt, conversationHistory = [], intentDecision = {} } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return new Response(
        JSON.stringify({ error: "Missing prompt parameter" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const isEn = intentDecision.language === "en";

    // Server Protection Gate: Can ONLY build plan if create_plan OR modify_plan
    const canBuildPlan =
      (intentDecision.intent === "create_plan" && intentDecision.confidence >= 0.78 && intentDecision.shouldBuildPlan && intentDecision.planSignals?.length > 0) ||
      (intentDecision.intent === "modify_plan");

    if (!canBuildPlan) {
      const clarificationResponse = {
        type: "clarification",
        message:
          intentDecision.clarifyingQuestion ||
          (isEn
            ? `I'm not sure what you mean by "${prompt}". Would you like to create an outing plan, search for a place, or edit an existing plan?`
            : `ما فهمت قصدك تماماً من كلمة «${prompt}». هل تريد إنشاء خطة طلعة، البحث عن مكان، أو تعديل خطة موجودة؟`),
        suggestedReplies: isEn
          ? ["Create a plan 🗓️", "Search cafes ☕", "Explore Jeddah 🌊"]
          : ["إنشاء خطة جديدة 🗓️", "البحث عن كافيهات وأماكن ☕", "استكشاف جدة 🌊"],
        plan: null,
      };

      return new Response(JSON.stringify(clarificationResponse), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 1. Dialect Pre-Processing & Intent Enrichment
    const enrichedParams = parseDialectKeywords(prompt, {});

    // 2. Try Gemini API Request with Fallback Protection
    const apiKey = Deno.env.get("GEMINI_API_KEY");
    let geminiResponse: any = null;
    let isFallback = false;

    if (apiKey) {
      try {
        geminiResponse = await callGeminiFlashApi(apiKey, prompt, conversationHistory, enrichedParams);
      } catch (err) {
        console.warn("[Hybrid AI] Gemini API call failed or quota exceeded. Switching to Rule-Based Engine Fallback.", err);
        isFallback = true;
      }
    } else {
      isFallback = true;
    }

    // 3. If Gemini failed or no API Key, execute Deterministic Rule-Based Engine
    let finalResult: any = null;
    if (isFallback || !geminiResponse) {
      finalResult = executeDeterministicFallback(prompt, enrichedParams);
    } else {
      finalResult = geminiResponse;
    }

    // 4. Validation Layer: Re-validate placeIds & prices against database
    const validatedResult = validateAndSanitizeResult(finalResult);

    return new Response(JSON.stringify(validatedResult), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("[Hybrid AI Edge Error]:", err);

    const isEn = /[a-z]/i.test(req.url);
    return new Response(
      JSON.stringify({
        type: "clarification",
        message: isEn
          ? "I could not understand your request clearly. Would you like to create a plan, search for places, or modify a plan?"
          : "ما فهمت طلبك تماماً. هل تريد إنشاء خطة، البحث عن مكان، أو تعديل خطة موجودة؟",
        plan: null,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

// ============================================================================
// Helper Functions: Dialect Parser, Scoring, Fallback & Gemini Call
// ============================================================================

function parseDialectKeywords(text: string, params: any) {
  const lower = text.toLowerCase();
  const res = { ...params };
  const moods: string[] = res.moods || [];

  for (const [key, val] of Object.entries(DIALECT_DICTIONARY)) {
    if (lower.includes(key)) {
      if (val.mood && !moods.includes(val.mood)) moods.push(val.mood);
      if (val.budgetScope && !res.budgetScope) res.budgetScope = val.budgetScope;
      if (val.groupType && !res.groupType) res.groupType = val.groupType;
      if (val.indoor !== undefined) res.indoorPreference = val.indoor;
    }
  }

  res.moods = moods;
  return res;
}

async function callGeminiFlashApi(apiKey: string, prompt: string, history: any[], params: any) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  // Limit conversation history to last 6 messages max for token optimization
  const recentHistory = history.slice(-6).map((m: any) => ({
    role: m.sender === "user" ? "user" : "model",
    parts: [{ text: m.text }],
  }));

  const systemInstruction = `
You are JEDDAW's Hybrid AI Assistant for Jeddah Outing Planner.
Target Language: Detect Arabic or English.
Strict Rule: Recommend ONLY valid place IDs from Jeddah database. NEVER invent fake places or prices.
Return a structured JSON with:
{
  "assistantMessage": "Friendly concise Arabic/English response",
  "missingFields": ["Any missing key preference like budget if not clear"],
  "plan": {
    "titleAr": "Plan Title",
    "titleEn": "Plan Title",
    "totalDurationMinutes": 180,
    "estimatedCostMin": 50,
    "estimatedCostMax": 150,
    "stops": [
      {
        "placeId": "r1",
        "arrivalTime": "18:00",
        "visitDurationMinutes": 40,
        "travelFromPreviousMinutes": 15,
        "reasonAr": "سبب اختيار المكان",
        "reasonEn": "Reason for spot selection"
      }
    ]
  }
}
`;

  const payload = {
    contents: [
      ...recentHistory,
      {
        role: "user",
        parts: [{ text: `${systemInstruction}\n\nUser Prompt: ${prompt}` }],
      },
    ],
    generationConfig: {
      temperature: 0.2, // Low temperature to prevent hallucination
      responseMimeType: "application/json",
    },
  };

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Gemini API returned status ${res.status}`);
  }

  const data = await res.json();
  const textOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!textOutput) throw new Error("Empty output from Gemini");

  return JSON.parse(textOutput);
}

// 100-Point Scoring Engine & Deterministic Rule-Based Fallback
function executeDeterministicFallback(prompt: string, params: any) {
  const lower = prompt.toLowerCase();
  const isEn = /[a-z]/i.test(prompt) && !/[\u0600-\u06FF]/.test(prompt);

  // Score places deterministically
  const scoredPlaces = DATABASE_PLACES.map((place) => {
    let score = 50; // base score

    // Mood Match (25 pts)
    if (params.moods && params.moods.some((m: string) => place.moods.includes(m as any))) score += 25;
    // Budget Fit (20 pts)
    if (params.budgetScope === "economy" && place.pricePerPerson <= 40) score += 20;
    if (params.budgetScope === "premium" && place.pricePerPerson >= 100) score += 20;
    // Group Suitability (15 pts)
    if (params.groupType && place.groups.includes(params.groupType as any)) score += 15;
    // Rating (10 pts)
    score += Math.round(place.rating * 2);
    // Data Freshness & Verification (10 pts)
    if (place.verified) score += 10;

    // Small deterministic jitter for variety among close scores
    score += (place.nameAr.length % 5);

    return { place, score };
  }).sort((a, b) => b.score - a.score);

  // Pick top 3 distinct places (1 activity/culture, 1 food, 1 cafe)
  const selectedFood = scoredPlaces.find((p) => p.place.kind === "food")?.place || DATABASE_PLACES[0];
  const selectedCafe = scoredPlaces.find((p) => p.place.kind === "cafe")?.place || DATABASE_PLACES[3];
  const selectedActivity = scoredPlaces.find((p) => p.place.kind === "activity" || p.place.kind === "culture" || p.place.kind === "outdoor")?.place || DATABASE_PLACES[6];

  const totalMin = selectedFood.pricePerPerson + selectedCafe.pricePerPerson + selectedActivity.pricePerPerson;
  const totalDuration = selectedFood.durationMin + selectedCafe.durationMin + selectedActivity.durationMin + 30; // + travel

  return {
    isFallback: true,
    assistantMessage: isEn
      ? "Here is an optimized itinerary created directly from JEDDAW's verified database based on your preferences!"
      : "إليك خطة طلعة مميزة ومحسوبة مباشرة من قاعدة بيانات جِدّاو المعتمدة حسب تفضيلاتك!",
    extractedPreferences: params,
    missingFields: [],
    plan: {
      titleAr: "طلعة جدة الموزونة 🌊",
      titleEn: "Custom Jeddah Outing 🌊",
      totalDurationMinutes: totalDuration,
      estimatedCostMin: totalMin,
      estimatedCostMax: Math.round(totalMin * 1.3),
      stops: [
        {
          placeId: selectedActivity.id,
          arrivalTime: "17:00",
          visitDurationMinutes: selectedActivity.durationMin,
          travelFromPreviousMinutes: 0,
          reasonAr: `بداية حماسية وممتعة في ${selectedActivity.nameAr}`,
          reasonEn: `Fun activity start at ${selectedActivity.nameEn}`,
        },
        {
          placeId: selectedFood.id,
          arrivalTime: "19:00",
          visitDurationMinutes: selectedFood.durationMin,
          travelFromPreviousMinutes: 15,
          reasonAr: `وجبة عشاء طازجة وممتازة في ${selectedFood.nameAr}`,
          reasonEn: `Fresh dinner experience at ${selectedFood.nameEn}`,
        },
        {
          placeId: selectedCafe.id,
          arrivalTime: "20:45",
          visitDurationMinutes: selectedCafe.durationMin,
          travelFromPreviousMinutes: 15,
          reasonAr: `تحلية وروقان مع القهوة المختصة في ${selectedCafe.nameAr}`,
          reasonEn: `Specialty coffee & chill at ${selectedCafe.nameEn}`,
        },
      ],
    },
  };
}

// Zod-like Deterministic Sanitize & Validation Layer
function validateAndSanitizeResult(result: any) {
  if (!result || !result.plan || !Array.isArray(result.plan.stops)) {
    return executeDeterministicFallback("fallback", {});
  }

  // Filter out any placeId not present in DATABASE_PLACES
  const validStops = result.plan.stops.filter((stop: any) =>
    DATABASE_PLACES.some((dbPlace) => dbPlace.id === stop.placeId)
  );

  if (validStops.length === 0) {
    return executeDeterministicFallback("fallback", {});
  }

  // Re-calculate price and duration strictly from DB values
  let calcMinCost = 0;
  let calcDuration = 0;

  validStops.forEach((stop: any) => {
    const dbPlace = DATABASE_PLACES.find((p) => p.id === stop.placeId);
    if (dbPlace) {
      stop.visitDurationMinutes = dbPlace.durationMin;
      calcMinCost += dbPlace.pricePerPerson;
      calcDuration += dbPlace.durationMin + (stop.travelFromPreviousMinutes || 15);
    }
  });

  result.plan.stops = validStops;
  result.plan.estimatedCostMin = calcMinCost;
  result.plan.estimatedCostMax = Math.round(calcMinCost * 1.3);
  result.plan.totalDurationMinutes = calcDuration;

  return result;
}
