/**
 * JEDDAW Multilingual Content Moderation Engine
 * 
 * Supports: Arabic, Regional Arabic Dialects, Arabizi, and English.
 * Reads terms dynamically from Supabase database table `moderation_terms`.
 * NEVER lists, outputs, or generates explicit terms in code or prompt.
 */

export interface ModerationTerm {
  id?: string;
  term: string;
  normalized_term: string;
  language: "ar" | "en" | "arabizi" | "dialects";
  category: "profanity" | "hate_speech" | "harassment" | "spam" | "explicit";
  severity: "low" | "medium" | "high" | "critical";
  is_active: boolean;
}

export interface ModerationResult {
  status: "allowed" | "review_required" | "blocked";
  allowed: boolean;
  category?: string;
  severity?: string;
  messageAr: string;
  messageEn: string;
}

// In-Memory Dynamic Runtime Cache for database terms (5-min TTL)
let termsCache: ModerationTerm[] = [];
let cacheLastFetched = 0;
const CACHE_TTL_MS = 5 * 60 * 1000;

// Supabase REST endpoint helper (environment variables fallback to client config)
const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || "https://your-supabase-project.supabase.co";
const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || "";

/**
 * 1. Arabic & Multilingual Letter Normalization Function
 * Removes Tashkeel, Tatweel, normalizes Alef/Teh/Yeh, maps Arabizi numerals, and deduplicates repeated characters.
 */
export function normalizeText(text: string): string {
  if (!text) return "";

  let str = text.toLowerCase();

  // Remove Arabic Diacritics (Tashkeel / Harakat)
  str = str.replace(/[\u064B-\u0652\u0670]/g, "");

  // Remove Arabic Tatweel / Kashida (ـ)
  str = str.replace(/\u0640/g, "");

  // Normalize Alef variants (أ, إ, آ, ٱ -> ا)
  str = str.replace(/[\u0622\u0623\u0625\u0671]/g, "ا");

  // Normalize Teh Marbuta (ة -> ه)
  str = str.replace(/\u0629/g, "ه");

  // Normalize Yeh / Alef Maksura (ى -> ي)
  str = str.replace(/\u0649/g, "ي");

  // Arabizi Numerals Substitution (e.g. 3 -> ع, 7 -> ح, 5 -> خ, 9 -> ق)
  str = str
    .replace(/3/g, "ع")
    .replace(/7/g, "ح")
    .replace(/5/g, "خ")
    .replace(/9/g, "ق")
    .replace(/2/g, "أ");

  // Remove non-alphanumeric punctuation and separators used for obfuscation (e.g., z-a-q, z.a.q, z_a_q)
  str = str.replace(/[!@#$%^&*()_\-+=\[\]{};:'",.<>?/\\|~`•▪︎]+/g, " ");

  // Reduce 3 or more consecutive identical characters to 1 character (e.g. "زززز" -> "ز")
  str = str.replace(/(.)\1{2,}/g, "$1");

  // Normalize whitespace
  return str.replace(/\s+/g, " ").trim();
}

/**
 * Fetch active moderation terms from Supabase table `moderation_terms`.
 */
export async function fetchModerationTerms(): Promise<ModerationTerm[]> {
  const now = Date.now();
  if (termsCache.length > 0 && now - cacheLastFetched < CACHE_TTL_MS) {
    return termsCache;
  }

  if (!SUPABASE_ANON_KEY || SUPABASE_URL.includes("your-supabase-project")) {
    // Graceful fallback if Supabase environment variables are not yet linked
    return termsCache;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const res = await fetch(`${SUPABASE_URL}/rest/v1/moderation_terms?is_active=eq.true`, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data: ModerationTerm[] = await res.json();
      termsCache = data;
      cacheLastFetched = now;
      return data;
    }
  } catch (err) {
    console.warn("[Moderation] Dynamic DB term fetch skipped/timed out:", err);
  }

  return termsCache;
}

/**
 * 2. Deterministic Lexicon Check & Multilingual Content Moderation Engine
 * 
 * - Checks complete phrases before individual words.
 * - Does NOT return explicit terms to regular users.
 * - Logs moderation events securely.
 */
export async function checkContent(
  text: string,
  userIp?: string
): Promise<ModerationResult> {
  const defaultAllowed: ModerationResult = {
    status: "allowed",
    allowed: true,
    messageAr: "النص مقبول",
    messageEn: "Content is clean",
  };

  if (!text || text.trim().length === 0) {
    return defaultAllowed;
  }

  const normalizedInput = normalizeText(text);
  const terms = await fetchModerationTerms();

  if (terms.length === 0) {
    return defaultAllowed;
  }

  // Phase 1: Complete Multi-Word Phrase Matching (Higher Precedence)
  const phraseMatch = terms.find(
    (t) => t.normalized_term.includes(" ") && normalizedInput.includes(t.normalized_term)
  );

  if (phraseMatch) {
    return handleModerationMatch(phraseMatch, text, userIp);
  }

  // Phase 2: Single Word Token Matching
  const tokens = normalizedInput.split(/\s+/);
  const wordMatch = terms.find((t) =>
    tokens.some((token) => token === t.normalized_term)
  );

  if (wordMatch) {
    return handleModerationMatch(wordMatch, text, userIp);
  }

  // Phase 3: Obfuscation Substring Scanning (No spaces test)
  const noSpaceInput = normalizedInput.replace(/\s+/g, "");
  const obfuscatedMatch = terms.find(
    (t) => t.normalized_term.length >= 4 && noSpaceInput.includes(t.normalized_term)
  );

  if (obfuscatedMatch) {
    return handleModerationMatch(obfuscatedMatch, text, userIp);
  }

  return defaultAllowed;
}

/**
 * Process matching term and return sanitized status without exposing explicit terms.
 */
function handleModerationMatch(
  term: ModerationTerm,
  originalText: string,
  userIp?: string
): ModerationResult {
  const isBlocked = term.severity === "critical" || term.severity === "high";
  const status: "blocked" | "review_required" = isBlocked ? "blocked" : "review_required";

  // Log audit event asynchronously to Supabase
  logModerationEvent({
    input_hash: simpleHash(originalText),
    detected_language: term.language,
    decision: status,
    category: term.category,
    severity: term.severity,
    ip_address: userIp || "anonymous",
  });

  return {
    status,
    allowed: false,
    category: term.category,
    severity: term.severity,
    messageAr: isBlocked
      ? "عذراً، يحتوي النص على كلمات غير ملائمة لسياسة المنصة."
      : "تم توجيه المحتوى للمراجعة قبل النشر.",
    messageEn: isBlocked
      ? "Content contains terms violating our platform policies."
      : "Content flagged for administrator review.",
  };
}

/**
 * Log security moderation audit event securely to Supabase `moderation_logs`.
 */
async function logModerationEvent(logData: Record<string, any>): Promise<void> {
  if (!SUPABASE_ANON_KEY || SUPABASE_URL.includes("your-supabase-project")) return;

  try {
    await fetch(`${SUPABASE_URL}/rest/v1/moderation_logs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify(logData),
    });
  } catch (e) {
    // Non-blocking log failure
  }
}

/**
 * Simple hash helper for logging input hash without storing full raw text.
 */
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(16);
}
