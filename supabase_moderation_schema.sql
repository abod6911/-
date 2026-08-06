-- ============================================================================
-- JEDDAW Platform — Enterprise Content Moderation System (Supabase SQL Schema)
-- Table: moderation_terms & moderation_logs
-- ============================================================================

-- 1. Create Moderation Terms Table
CREATE TABLE IF NOT EXISTS public.moderation_terms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  term TEXT NOT NULL,
  normalized_term TEXT NOT NULL,
  language VARCHAR(10) NOT NULL DEFAULT 'ar', -- 'ar', 'en', 'arabizi', 'dialects'
  category VARCHAR(50) NOT NULL DEFAULT 'profanity', -- 'profanity', 'hate_speech', 'harassment', 'spam', 'explicit'
  severity VARCHAR(20) NOT NULL DEFAULT 'high', -- 'low', 'medium', 'high', 'critical'
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for ultra-fast normalized matching
CREATE INDEX IF NOT EXISTS idx_moderation_terms_normalized ON public.moderation_terms (normalized_term) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_moderation_terms_lang ON public.moderation_terms (language) WHERE is_active = TRUE;

-- 2. Create Moderation Security Audit Logs Table
CREATE TABLE IF NOT EXISTS public.moderation_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  input_hash VARCHAR(64) NOT NULL,
  detected_language VARCHAR(10) NOT NULL,
  decision VARCHAR(20) NOT NULL, -- 'allowed', 'review_required', 'blocked'
  category VARCHAR(50),
  severity VARCHAR(20),
  ip_address VARCHAR(45),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_moderation_logs_decision ON public.moderation_logs (decision);
CREATE INDEX IF NOT EXISTS idx_moderation_logs_created ON public.moderation_logs (created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.moderation_terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moderation_logs ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active moderation terms for client/server runtime verification
CREATE POLICY "Allow public read active terms" ON public.moderation_terms
  FOR SELECT USING (is_active = TRUE);

-- Only authenticated admins can modify terms or read moderation logs
CREATE POLICY "Admin write access moderation terms" ON public.moderation_terms
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin read moderation logs" ON public.moderation_logs
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow system insert moderation logs" ON public.moderation_logs
  FOR INSERT WITH CHECK (TRUE);
