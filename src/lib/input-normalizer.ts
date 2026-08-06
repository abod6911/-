/**
 * JEDDAW Platform — Input Normalizer & Dialect Dictionary
 * File: src/lib/input-normalizer.ts
 */

export interface NormalizedInputResult {
  originalMessage: string;
  normalizedMessage: string;
  detectedLanguage: "ar" | "en";
  detectedDialect: "saudi" | "gulf" | "levantine" | "standard";
  possibleCorrections: { original: string; corrected: string; confidence: number }[];
  correctionConfidence: number;
}

// Saudi & Regional Arabic Dialect Lexicon
export const DIALECT_MAPPINGS: Record<string, { synonyms: string[]; category?: string; mood?: string; budgetScope?: string; groupType?: string; indoor?: boolean; kind?: string }> = {
  "رايق": { synonyms: ["هادئ", "جلسات هادئة"], mood: "calm" },
  "روقان": { synonyms: ["هادئ", "جلسات هادئة"], mood: "calm" },
  "هدوء": { synonyms: ["هادئ"], mood: "calm" },
  "كشخة": { synonyms: ["فاخر", "راقي"], budgetScope: "premium" },
  "فخم": { synonyms: ["فاخر"], budgetScope: "premium" },
  "vip": { synonyms: ["فاخر"], budgetScope: "premium" },
  "دلع": { synonyms: ["فاخر"], budgetScope: "premium" },
  "رخيص": { synonyms: ["اقتصادي"], budgetScope: "economy" },
  "على قد اليد": { synonyms: ["اقتصادي"], budgetScope: "economy" },
  "مو غالي": { synonyms: ["اقتصادي", "متوسط"], budgetScope: "economy" },
  "بلاش": { synonyms: ["مجاني"], budgetScope: "economy" },
  "بدون صرف": { synonyms: ["مجاني"], budgetScope: "economy" },
  "عيال": { synonyms: ["أطفال", "عائلة"], groupType: "family" },
  "بزارين": { synonyms: ["أطفال"], groupType: "family" },
  "شباب": { synonyms: ["أصدقاء"], groupType: "friends" },
  "شلة": { synonyms: ["أصدقاء"], groupType: "friends" },
  "بحر": { synonyms: ["شاطئي", "واجهة بحرية"], mood: "sea" },
  "غروب": { synonyms: ["واجهة بحرية"], mood: "sea" },
  "مكيف": { synonyms: ["داخلي"], indoor: true },
  "داخل": { synonyms: ["داخلي"], indoor: true },
  "وناسة": { synonyms: ["ترفيه", "حماسي"], mood: "adventure" },
  "حماس": { synonyms: ["حماسي"], mood: "games" },
  "لعب": { synonyms: ["حماسي"], mood: "games" },
  "تمشية": { synonyms: ["ممشى", "منطقة مفتوحة"], kind: "outdoor" },
  "قهوة": { synonyms: ["كافيه"], kind: "cafe", mood: "coffee" },
  "كافيه": { synonyms: ["كافيه"], kind: "cafe", mood: "coffee" },
  "حلى": { synonyms: ["كافيه"], kind: "cafe", mood: "coffee" },
  "عشا": { synonyms: ["مطعم مسائي"], kind: "food", mood: "food" },
  "غدا": { synonyms: ["مطعم"], kind: "food", mood: "food" },
  "أكل": { synonyms: ["مطعم"], kind: "food", mood: "food" },
  "نبي نسهر": { synonyms: ["أماكن مفتوحة متأخرًا"] },
  "بعد الدوام": { synonyms: ["خطة مسائية خفيفة"] },
  "ما نبي نتعب": { synonyms: ["قليل التنقل"] },
  "نبي شي يحمس": { synonyms: ["حماسي"] },
};

// Safe common typo corrections (applied ONLY if confidence >= 0.90)
const SAFE_TYPO_CORRECTIONS: Record<string, { corrected: string; confidence: number }> = {
  "كفيه": { corrected: "كافيه", confidence: 0.95 },
  "كفيات": { corrected: "كافيهات", confidence: 0.95 },
  "مطاعم": { corrected: "مطاعم", confidence: 1.0 },
  "خطه": { corrected: "خطة", confidence: 0.95 },
  "طلعه": { corrected: "طلعة", confidence: 0.95 },
};

export function normalizeInputMessage(rawMessage: string): NormalizedInputResult {
  const original = rawMessage.trim();
  let text = original.toLowerCase();

  // Determine Language
  const isEn = /[a-z]/i.test(original) && !/[\u0600-\u06FF]/.test(original);
  const detectedLanguage: "ar" | "en" = isEn ? "en" : "ar";

  // Remove Extra Whitespace
  text = text.replace(/\s+/g, " ");

  // Arabic Character Normalization
  text = text.replace(/[\u064B-\u0652\u0670]/g, ""); // Tashkeel
  text = text.replace(/\u0640/g, ""); // Tatweel
  text = text.replace(/[\u0622\u0623\u0625\u0671]/g, "ا"); // Alef variants
  text = text.replace(/\u0649/g, "ي"); // Alef maksura -> yeh

  // Normalize digits (Western & Eastern Arabic numerals)
  text = text
    .replace(/[٠0]/g, "0")
    .replace(/[١1]/g, "1")
    .replace(/[٢2]/g, "2")
    .replace(/[٣3]/g, "3")
    .replace(/[٤4]/g, "4")
    .replace(/[٥5]/g, "5")
    .replace(/[٦6]/g, "6")
    .replace(/[٧7]/g, "7")
    .replace(/[٨8]/g, "8")
    .replace(/[٩9]/g, "9");

  // Typo checks & Safe Corrections
  const words = text.split(/\s+/);
  const possibleCorrections: { original: string; corrected: string; confidence: number }[] = [];

  const correctedWords = words.map((w) => {
    if (SAFE_TYPO_CORRECTIONS[w]) {
      const fix = SAFE_TYPO_CORRECTIONS[w];
      possibleCorrections.push({ original: w, corrected: fix.corrected, confidence: fix.confidence });
      return fix.corrected;
    }
    return w;
  });

  const normalizedMessage = correctedWords.join(" ");

  return {
    originalMessage: original,
    normalizedMessage,
    detectedLanguage,
    detectedDialect: isEn ? "standard" : "saudi",
    possibleCorrections,
    correctionConfidence: possibleCorrections.length > 0 ? 0.95 : 1.0,
  };
}
