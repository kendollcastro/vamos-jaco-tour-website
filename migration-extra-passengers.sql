-- Persist paid additional riders ($20 ea) for vehicle tours
-- (jet ski 2nd rider, side-by-side 3rd/4th pax).
-- bookings.adults stores the number of machines selected;
-- total people = adults + extra_passengers.

ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS extra_passengers INTEGER NOT NULL DEFAULT 0;
