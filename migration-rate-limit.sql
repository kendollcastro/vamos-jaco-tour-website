-- Rate limit tracking table for serverless-compatible rate limiting.
-- Each row tracks requests per IP per time window.
CREATE TABLE IF NOT EXISTS rate_limits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    identifier TEXT NOT NULL,
    window_start TIMESTAMPTZ NOT NULL,
    request_count INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rate_limits_lookup
    ON rate_limits(identifier, window_start);
