-- ─── Migration: Reviews Table for Tours ───

-- Create reviews table
CREATE TABLE IF NOT EXISTS tour_reviews (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tour_id         UUID NOT NULL REFERENCES tours(id) ON DELETE CASCADE,
    author_name     TEXT NOT NULL,
    author_email    TEXT,
    rating          INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title           TEXT,
    text            TEXT NOT NULL,
    is_verified     BOOLEAN DEFAULT FALSE,
    is_published    BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_review_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_review_updated_at
    BEFORE UPDATE ON tour_reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_review_updated_at();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_reviews_tour ON tour_reviews(tour_id);
CREATE INDEX IF NOT EXISTS idx_reviews_published ON tour_reviews(is_published) WHERE is_published = true;

-- RLS
ALTER TABLE tour_reviews ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read published reviews
DROP POLICY IF EXISTS "Anon read published reviews" ON tour_reviews;
CREATE POLICY "Anon read published reviews" ON tour_reviews 
    FOR SELECT USING (is_published = true);

-- Policy: Anyone can insert (for submitting reviews)
DROP POLICY IF EXISTS "Anon insert reviews" ON tour_reviews;
CREATE POLICY "Anon insert reviews" ON tour_reviews 
    FOR INSERT WITH CHECK (true);

-- Policy: Admin can do everything
DROP POLICY IF EXISTS "Admin manage reviews" ON tour_reviews;
CREATE POLICY "Admin manage reviews" ON tour_reviews 
    FOR ALL USING (true);

-- Create function to get average rating for a tour
CREATE OR REPLACE FUNCTION get_tour_rating(tour_id UUID)
RETURNS TABLE (
    average_rating NUMERIC,
    review_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(AVG(rating)::NUMERIC(3,2), 0)::NUMERIC(3,2) as average_rating,
        COUNT(*)::BIGINT as review_count
    FROM tour_reviews
    WHERE tour_id = get_tour_rating.tour_id 
      AND is_published = true;
END;
$$ LANGUAGE plpgsql IMMUTABLE;