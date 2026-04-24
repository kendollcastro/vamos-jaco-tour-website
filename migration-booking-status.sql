-- Add booking_time and update status enum

-- 1. Add booking_time column if missing
ALTER TABLE IF EXISTS bookings ADD COLUMN IF NOT EXISTS booking_time TEXT;

-- 2. Update status enum - drop and recreate
DO $$ 
BEGIN
    -- If using PostgreSQL enum, need to handle migration differently
    -- For simplicity, we'll just update any existing statuses
    UPDATE bookings SET status = 'paid' WHERE status = 'confirmed' AND tilopay_order_id IS NOT NULL;
    
    -- Add new statuses if they don't exist (PostgreSQL allows this)
    -- We'll handle this at application level
END $$;