-- ============================================================
-- Vamos Jacó Tours — Profiles & Audit Log Migration
-- Run this in your Supabase SQL Editor
-- ============================================================

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

-- Users can read their own profile
CREATE POLICY "Users read own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

-- Admins can manage all profiles
CREATE POLICY "Admins manage profiles" ON profiles
    FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Any authenticated user can create their own profile (first login)
CREATE POLICY "Users insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- ─── Audit Log ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS audit_log (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_email  TEXT DEFAULT '',
    action      TEXT NOT NULL,         -- 'create' | 'update' | 'delete'
    table_name  TEXT NOT NULL,         -- 'tours' | 'bookings' | 'commissions' | etc.
    record_id   TEXT,                  -- UUID or identifier of the affected record
    summary     TEXT DEFAULT '',        -- Human-readable description (e.g. "Updated tour 'ATV Adventure'")
    changes     JSONB,                 -- For updates: { old: {...}, new: {...} }
    created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_log_created ON audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_user   ON audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_table  ON audit_log(table_name);

ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Admins can read audit log
CREATE POLICY "Admins read audit log" ON audit_log
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Secretaries can read their own audit entries
CREATE POLICY "Secretaries read own audit" ON audit_log
    FOR SELECT USING (auth.uid() = user_id);

-- Authenticated users can insert audit entries
CREATE POLICY "Auth users insert audit log" ON audit_log
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Enable Realtime for audit log
ALTER PUBLICATION supabase_realtime ADD TABLE audit_log;

-- ─── Add updated_at to commissions ──────────────────────────
ALTER TABLE commissions ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

CREATE TRIGGER IF NOT EXISTS commissions_updated_at
  BEFORE UPDATE ON commissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
