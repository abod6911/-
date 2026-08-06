-- ============================================================================
-- JEDDAW Platform — Hybrid AI Engine Database Schema & RPC Functions
-- File: supabase_hybrid_ai_schema.sql
-- ============================================================================

-- 1. Places Indexes for High Performance Hard Filtering
CREATE INDEX IF NOT EXISTS idx_places_district_kind ON public.places (district_id, kind);
CREATE INDEX IF NOT EXISTS idx_places_price ON public.places (price_per_person);
CREATE INDEX IF NOT EXISTS idx_places_verified ON public.places (verified) WHERE verified = TRUE;

-- 2. Security & Usage Rate Limiting Table
CREATE TABLE IF NOT EXISTS public.ai_user_rate_limits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_identifier VARCHAR(128) NOT NULL, -- User UUID or IP hash / Session ID
  request_count INT NOT NULL DEFAULT 1,
  last_request_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_ai_rate_limits_user ON public.ai_user_rate_limits (user_identifier);

-- 3. Conversation Summaries Table (Max 6 messages memory cap)
CREATE TABLE IF NOT EXISTS public.ai_conversation_summaries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id VARCHAR(128) NOT NULL,
  summary_text TEXT NOT NULL,
  extracted_preferences JSONB DEFAULT '{}'::jsonb,
  message_count INT DEFAULT 1,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_conv_session ON public.ai_conversation_summaries (session_id);

-- Enable RLS
ALTER TABLE public.ai_user_rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_conversation_summaries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "System manage rate limits" ON public.ai_user_rate_limits FOR ALL USING (TRUE);
CREATE POLICY "System manage conv summaries" ON public.ai_conversation_summaries FOR ALL USING (TRUE);

-- ============================================================================
-- 4. Server-Side RPC Function: search_places
-- Hard filters: OpensAt, ClosesAt, Budget, GroupType, Mood, District, etc.
-- ============================================================================
CREATE OR REPLACE FUNCTION public.search_places(
  p_kind TEXT DEFAULT NULL,
  p_district_id TEXT DEFAULT NULL,
  p_max_price INT DEFAULT NULL,
  p_mood TEXT DEFAULT NULL,
  p_group_type TEXT DEFAULT NULL,
  p_indoor BOOLEAN DEFAULT NULL,
  p_kids_friendly BOOLEAN DEFAULT NULL,
  p_accessible BOOLEAN DEFAULT NULL,
  p_arrival_hour INT DEFAULT 18,
  p_limit INT DEFAULT 15
)
RETURNS TABLE (
  id TEXT,
  name_ar TEXT,
  name_en TEXT,
  kind TEXT,
  category_ar TEXT,
  sub_category_ar TEXT,
  sub_category_en TEXT,
  district_id TEXT,
  moods TEXT[],
  price_per_person INT,
  duration_min INT,
  indoor BOOLEAN,
  groups TEXT[],
  kids_friendly BOOLEAN,
  reservation BOOLEAN,
  verified BOOLEAN,
  accessible BOOLEAN,
  opens_at INT,
  closes_at INT,
  desc_ar TEXT,
  desc_en TEXT,
  why_ar TEXT,
  parking_ar TEXT,
  rating NUMERIC,
  views_count INT,
  image TEXT
) 
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.nameAr AS name_ar,
    p.nameEn AS name_en,
    p.kind,
    p.categoryAr AS category_ar,
    p.subCategoryAr AS sub_category_ar,
    p.subCategoryEn AS sub_category_en,
    p.districtId AS district_id,
    p.moods,
    p.pricePerPerson AS price_per_person,
    p.durationMin AS duration_min,
    p.indoor,
    p.groups,
    p.kidsFriendly AS kids_friendly,
    p.reservation,
    p.verified,
    p.accessible,
    p.opensAt AS opens_at,
    p.closesAt AS closes_at,
    p.descAr AS desc_ar,
    p.descEn AS desc_en,
    p.whyAr AS why_ar,
    p.parkingAr AS parking_ar,
    p.rating::NUMERIC,
    p.viewsCount AS views_count,
    p.image
  FROM public.places p
  WHERE 
    -- Hard Filter 1: Verified & Reliable Data
    p.verified = TRUE
    -- Hard Filter 2: Kind / Category match if specified
    AND (p_kind IS NULL OR p.kind = p_kind)
    -- Hard Filter 3: District match if specified
    AND (p_district_id IS NULL OR p.districtId = p_district_id)
    -- Hard Filter 4: Budget limit per person
    AND (p_max_price IS NULL OR p.pricePerPerson <= p_max_price)
    -- Hard Filter 5: Group type suitability
    AND (p_group_type IS NULL OR p_group_type = ANY(p.groups))
    -- Hard Filter 6: Mood match
    AND (p_mood IS NULL OR p_mood = ANY(p.moods))
    -- Hard Filter 7: Indoor / Outdoor preference
    AND (p_indoor IS NULL OR p.indoor = p_indoor)
    -- Hard Filter 8: Kids friendly
    AND (p_kids_friendly IS NULL OR p_kids_friendly = FALSE OR p.kidsFriendly = TRUE)
    -- Hard Filter 9: Accessibility
    AND (p_accessible IS NULL OR p_accessible = FALSE OR p.accessible = TRUE)
    -- Hard Filter 10: Open at arrival time check (0-24 hour scale)
    AND (
      p.opensAt <= p.closesAt 
      AND p_arrival_hour >= p.opensAt 
      AND p_arrival_hour < p.closesAt
      OR
      p.opensAt > p.closesAt 
      AND (p_arrival_hour >= p.opensAt OR p_arrival_hour < p.closesAt)
    )
  ORDER BY p.rating DESC, p.viewsCount DESC
  LIMIT p_limit;
END;
$$;
