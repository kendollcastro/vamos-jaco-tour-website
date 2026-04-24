-- Add booking_time column to bookings table

ALTER TABLE IF EXISTS bookings ADD COLUMN IF NOT EXISTS booking_time TEXT;