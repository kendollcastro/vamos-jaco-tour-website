-- Add max_participants column to tours table for overbooking prevention
ALTER TABLE tours ADD COLUMN IF NOT EXISTS max_participants INTEGER DEFAULT 10;

-- Add comment for documentation
COMMENT ON COLUMN tours.max_participants IS 'Maximum number of participants allowed per time slot (for overbooking prevention)';

-- Update existing tours to have a default capacity if null
UPDATE tours SET max_participants = 10 WHERE max_participants IS NULL;

-- Add booking_time column to bookings table if not exists (for time slot checking)
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS booking_time TEXT;

-- Add comment for booking_time
COMMENT ON COLUMN bookings.booking_time IS 'Time slot for the booking (e.g., 10:00, 14:00)';
