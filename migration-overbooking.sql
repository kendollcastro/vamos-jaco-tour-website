-- Add 'overbooked' and other new statuses to bookings table
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_status_check;
ALTER TABLE bookings ADD CONSTRAINT bookings_status_check 
    CHECK (status IN ('pending', 'paid', 'office', 'confirmed', 'completed', 'cancelled', 'failed', 'overbooked'));

-- Add comment for documentation
COMMENT ON COLUMN bookings.status IS 'Booking status: pending, paid, office, confirmed, completed, cancelled, failed, overbooked';
