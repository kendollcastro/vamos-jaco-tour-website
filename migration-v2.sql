-- ─── Migration: Safe Update for existing Bookings ─────────────────
-- This script safely adds missing columns and creates the newsletter table.

-- 0. Ensure the helper function exists
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1. Ensure 'bookings' table has current required columns
DO $$ 
BEGIN 
    -- Add tour_id if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='tour_id') THEN
        ALTER TABLE bookings ADD COLUMN tour_id UUID REFERENCES tours(id) ON DELETE SET NULL;
    END IF;

    -- Rename tour_date to booking_date if necessary
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='tour_date') THEN
        ALTER TABLE bookings RENAME COLUMN tour_date TO booking_date;
    END IF;

    -- Add tilopay_order_id if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='tilopay_order_id') THEN
        ALTER TABLE bookings ADD COLUMN tilopay_order_id TEXT;
    END IF;

    -- Add tilopay_response if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='tilopay_response') THEN
        ALTER TABLE bookings ADD COLUMN tilopay_response JSONB;
    END IF;
END $$;

-- 2. Create missing Indexes for Bookings
CREATE INDEX IF NOT EXISTS idx_bookings_tour   ON bookings(tour_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_date   ON bookings(booking_date);

-- 3. Update RLS for Bookings
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anon insert bookings" ON bookings;
CREATE POLICY "Anon insert bookings" ON bookings FOR INSERT WITH CHECK (true);

-- 4. Create Newsletter Subscribers Table
CREATE TABLE IF NOT EXISTS subscribers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email           TEXT UNIQUE NOT NULL,
  is_active       BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- 5. Add Newsletter Trigger (if it doesn't exist)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname='subscribers_updated_at') THEN
        CREATE TRIGGER subscribers_updated_at
          BEFORE UPDATE ON subscribers
          FOR EACH ROW EXECUTE FUNCTION update_updated_at();
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);

-- 6. RLS for Newsletter
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can insert subscribers" ON subscribers;
CREATE POLICY "Public can insert subscribers" ON subscribers FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Admins manage subscribers" ON subscribers;
CREATE POLICY "Admins manage subscribers" ON subscribers FOR ALL USING (auth.role() = 'authenticated');
