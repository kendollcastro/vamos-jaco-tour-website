-- ─── Commissions ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS commissions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date            DATE NOT NULL,
    tour_name       TEXT NOT NULL,
    customer_name   TEXT NOT NULL,
    time            TEXT DEFAULT '',
    machines        INTEGER DEFAULT 0,
    pax             INTEGER DEFAULT 1,
    discount        NUMERIC DEFAULT 0,
    price           NUMERIC DEFAULT 0,
    guide_name      TEXT DEFAULT '',
    commission_10   NUMERIC DEFAULT 0,
    location        TEXT DEFAULT '',
    provider_name   TEXT DEFAULT '',
    commission_20   NUMERIC DEFAULT 0,
    tax             NUMERIC DEFAULT 0,
    payment_method  TEXT DEFAULT 'Cash',
    created_at      TIMESTAMPTZ DEFAULT now()
);

-- Enable Row-Level Security
ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;

-- Allow all operations for authenticated admins
CREATE POLICY "Allow all for authenticated users"
    ON commissions
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Allow public read access (for demo / basic views)
CREATE POLICY "Allow read for anon"
    ON commissions
    FOR SELECT
    TO anon
    USING (true);
