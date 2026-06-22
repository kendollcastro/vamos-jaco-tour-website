-- ============================================================
-- Vamos Jacó Tours — Supabase Schema
-- Run this in your Supabase SQL Editor to create the tables
-- ============================================================

-- ─── Tours ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tours (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug       TEXT UNIQUE NOT NULL,
  name_en    TEXT NOT NULL,
  name_es    TEXT NOT NULL,
  description_en TEXT DEFAULT '',
  description_es TEXT DEFAULT '',
  price_base     NUMERIC NOT NULL DEFAULT 0,
  original_price NUMERIC,
  image_url      TEXT DEFAULT '',
  location       TEXT DEFAULT 'Jacó, Costa Rica',
  duration       TEXT DEFAULT '',
  category       TEXT DEFAULT 'nature' CHECK (category IN ('atv','water','nature','extreme','relax')),
  badge_text     TEXT,
  badge_color    TEXT DEFAULT 'yellow' CHECK (badge_color IN ('yellow','red','green')),
  highlights_en  TEXT[] DEFAULT '{}',
  highlights_es  TEXT[] DEFAULT '{}',
  includes_en    TEXT[] DEFAULT '{}',
  includes_es    TEXT[] DEFAULT '{}',
  pricing_options JSONB DEFAULT '[]'::jsonb,
  gallery        TEXT[] DEFAULT '{}',
  is_active      BOOLEAN DEFAULT true,
  created_at     TIMESTAMPTZ DEFAULT now(),
  updated_at     TIMESTAMPTZ DEFAULT now()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tours_updated_at
  BEFORE UPDATE ON tours
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── Bookings ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bookings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_id         UUID REFERENCES tours(id) ON DELETE SET NULL,
  tour_name       TEXT NOT NULL,
  customer_name   TEXT NOT NULL,
  customer_email  TEXT NOT NULL,
  customer_phone  TEXT DEFAULT '',
  booking_date    DATE NOT NULL,
  adults          INTEGER DEFAULT 1,
  children        INTEGER DEFAULT 0,
  total_amount    NUMERIC NOT NULL DEFAULT 0,
  status          TEXT DEFAULT 'pending' CHECK (status IN ('pending','confirmed','cancelled')),
  tilopay_order_id  TEXT,
  tilopay_response  JSONB,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── Indexes for performance ─────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_tours_slug      ON tours(slug);
CREATE INDEX IF NOT EXISTS idx_tours_active    ON tours(is_active);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_date   ON bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_tour   ON bookings(tour_id);

-- ─── Row Level Security ──────────────────────────────────────
ALTER TABLE tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Public can read active tours
CREATE POLICY "Public read tours" ON tours
  FOR SELECT USING (is_active = true);

-- Authenticated users can do everything with tours
CREATE POLICY "Admins manage tours" ON tours
  FOR ALL USING (auth.role() = 'authenticated');

-- Authenticated users can manage bookings
CREATE POLICY "Admins manage bookings" ON bookings
  FOR ALL USING (auth.role() = 'authenticated');

-- Allow inserts to bookings from anon (checkout creates bookings)
CREATE POLICY "Anon insert bookings" ON bookings
  FOR INSERT WITH CHECK (true);

-- ─── Enable Realtime ─────────────────────────────────────────
ALTER PUBLICATION supabase_realtime ADD TABLE bookings;

-- ─── Team Members ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS team_members (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  position_en     TEXT,
  position_es     TEXT,
  image_url       TEXT DEFAULT '',
  social_instagram TEXT DEFAULT '',
  social_linkedin  TEXT DEFAULT '',
  social_twitter   TEXT DEFAULT '',
  display_order   INTEGER DEFAULT 0,
  is_active       BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER team_members_updated_at
  BEFORE UPDATE ON team_members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX IF NOT EXISTS idx_team_members_active ON team_members(is_active);
CREATE INDEX IF NOT EXISTS idx_team_members_order ON team_members(display_order);

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read team_members" ON team_members
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins manage team_members" ON team_members
  FOR ALL USING (auth.role() = 'authenticated');

-- ─── Newsletter Subscribers ───────────────────────────────
CREATE TABLE IF NOT EXISTS subscribers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email           TEXT UNIQUE NOT NULL,
  is_active       BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER subscribers_updated_at
  BEFORE UPDATE ON subscribers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);

ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can insert subscribers" ON subscribers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins manage subscribers" ON subscribers
  FOR ALL USING (auth.role() = 'authenticated');

-- ─── Profiles ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
    id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email       TEXT NOT NULL,
    full_name   TEXT DEFAULT '',
    role        TEXT NOT NULL DEFAULT 'secretary'
                CHECK (role IN ('admin', 'secretary')),
    created_at  TIMESTAMPTZ DEFAULT now(),
    updated_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins manage profiles" ON profiles
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ─── Audit Log ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS audit_log (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_email  TEXT DEFAULT '',
    action      TEXT NOT NULL,
    table_name  TEXT NOT NULL,
    record_id   TEXT,
    summary     TEXT DEFAULT '',
    changes     JSONB,
    created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_log_created ON audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_user   ON audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_table  ON audit_log(table_name);

ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read audit log" ON audit_log
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Secretaries read own audit" ON audit_log
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Auth users insert audit log" ON audit_log
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

ALTER PUBLICATION supabase_realtime ADD TABLE audit_log;
