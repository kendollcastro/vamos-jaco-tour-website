-- Set machine inventory counts as max_participants for vehicle tours
-- ATV: 23 machines, Jet Ski: 15, Side by Side: 8

UPDATE tours SET max_participants = 23 WHERE slug = 'jaco-atv-adventure';
UPDATE tours SET max_participants = 15 WHERE slug = 'jet-ski-tour';
UPDATE tours SET max_participants = 8 WHERE slug = 'side-by-side-tour';
