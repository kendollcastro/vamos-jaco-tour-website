-- Add per-user permission overrides to profiles table
-- NULL means use role defaults; non-NULL overrides role defaults

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS permissions TEXT[] DEFAULT NULL;

-- Update RLS so admins can read the permissions column
-- (Already covered by existing "Admins manage all profiles" policy)
