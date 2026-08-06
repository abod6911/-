export interface SecuritySanitizeResult {
  safe: boolean;
  cleanText: string;
  blockedReasonAr?: string;
  blockedReasonEn?: string;
}

const PROMPT_INJECTION_KEYWORDS = [
  "ignore previous instructions",
  "ignore all previous",
  "disregard system prompt",
  "system prompt",
  "show your instructions",
  "output your prompt",
  "print prompt",
  "تجاهل التعليمات السابقة",
  "تجاهل النظام",
  "اعطني البرومبت الداخلي",
  "اطبع البرومبت",
  "عرض التعليمات",
  "كشف الأوامر",
  "drop table",
  "union select",
  "<script>",
  "javascript:",
];

/**
 * Sanitizes user chat text, protects against Prompt Injection, XSS, and SQLi
 */
export function sanitizeUserInput(input: string, maxLen: number = 300): SecuritySanitizeResult {
  if (!input || typeof input !== "string") {
    return { safe: true, cleanText: "" };
  }

  // 1. Enforce length limit
  let trimmed = input.trim();
  if (trimmed.length > maxLen) {
    trimmed = trimmed.substring(0, maxLen);
  }

  // 2. Check for Prompt Injection & Malicious System Commands
  const lower = trimmed.toLowerCase();
  for (const keyword of PROMPT_INJECTION_KEYWORDS) {
    if (lower.includes(keyword)) {
      return {
        safe: false,
        cleanText: "",
        blockedReasonAr: "تم منع الطلب: يمنع استخدام نصوص تتداخل مع تعليمات أمان خادم جِدّاو 🛡️",
        blockedReasonEn: "Request blocked: Input violates JEDDAW security policy 🛡️",
      };
    }
  }

  // 3. XSS HTML & Script Tag Neutralization
  const cleanText = trimmed
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/["']/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+=/gi, "");

  return {
    safe: true,
    cleanText,
  };
}

/**
 * Rate Limiting Defender (Token Bucket Pattern)
 */
class RateLimiter {
  private requests: Map<string, number[]> = new Map();

  public isAllowed(clientId: string, maxPerMin: number = 30): boolean {
    const now = Date.now();
    const windowStart = now - 60000;

    const userLog = this.requests.get(clientId) || [];
    const validLog = userLog.filter((t) => t > windowStart);

    if (validLog.length >= maxPerMin) {
      return false;
    }

    validLog.push(now);
    this.requests.set(clientId, validLog);
    return true;
  }
}

export const rateLimiter = new RateLimiter();

/**
 * Admin Audit Logger
 */
export interface AdminAuditLog {
  timestamp: string;
  adminUser: string;
  action: string;
  targetId?: string;
  ipAddress: string;
}

export const adminAuditLogs: AdminAuditLog[] = [];

export function logAdminAction(adminUser: string, action: string, targetId?: string, ipAddress: string = "127.0.0.1") {
  const entry: AdminAuditLog = {
    timestamp: new Date().toISOString(),
    adminUser,
    action,
    targetId,
    ipAddress,
  };
  adminAuditLogs.push(entry);
  console.log("🔒 [SECURITY AUDIT LOG]:", entry);
}
