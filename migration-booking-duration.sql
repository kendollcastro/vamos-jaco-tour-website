-- Add duration column to bookings table
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS duration TEXT DEFAULT '';
