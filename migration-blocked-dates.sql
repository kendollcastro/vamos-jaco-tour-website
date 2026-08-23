-- Blocked dates: closures (vacations, holidays, maintenance).
-- Public sites read this to disable days in the booking date picker;
-- booking APIs reject requests falling inside any range.

CREATE TABLE IF NOT EXISTS blocked_dates (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  start_date  DATE NOT NULL,
  end_date    DATE NOT NULL,
  reason      TEXT DEFAULT '',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT blocked_dates_valid_range CHECK (end_date >= start_date)
);

ALTER TABLE blocked_dates ENABLE ROW LEVEL SECURITY;

-- Public can read (needed by the booking date picker)
CREATE POLICY "Public read blocked_dates" ON blocked_dates
  FOR SELECT USING (true);

-- Authenticated admins manage ranges
CREATE POLICY "Admins manage blocked_dates" ON blocked_dates
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Seed: agency vacation Sep 1-15, back on Sep 16
INSERT INTO blocked_dates (start_date, end_date, reason)
VALUES ('2026-09-01', '2026-09-15', 'Vacaciones')
ON CONFLICT DO NOTHING;
