-- Set a user as admin by email
-- Run this in your Supabase SQL Editor

DO $$
DECLARE
    user_id UUID;
BEGIN
    -- Find the user by email in auth.users
    SELECT id INTO user_id FROM auth.users WHERE email = 'vamosjacotoursdev@gmail.com';

    IF user_id IS NULL THEN
        RAISE NOTICE 'User with email vamosjacotoursdev@gmail.com not found in auth.users';
        RETURN;
    END IF;

    -- Upsert profile with admin role
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (user_id, 'vamosjacotoursdev@gmail.com', 'Admin', 'admin')
    ON CONFLICT (id)
    DO UPDATE SET role = 'admin', full_name = 'Admin';

    RAISE NOTICE 'Profile set to admin for user %', user_id;
END $$;
