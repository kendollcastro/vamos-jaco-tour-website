-- Fix RLS infinite recursion: use a SECURITY DEFINER function to check admin role
-- without triggering recursive RLS checks on the profiles table.

-- 1. Create a helper function that bypasses RLS
CREATE OR REPLACE FUNCTION public.is_admin_or_secretary()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid()
        AND role IN ('admin', 'secretary')
    );
$$;

-- 2. Drop all old policies on tables that use the recursive subquery
DROP POLICY IF EXISTS "Admins manage tours" ON tours;
DROP POLICY IF EXISTS "Admins manage bookings" ON bookings;
DROP POLICY IF EXISTS "Admins manage team_members" ON team_members;
DROP POLICY IF EXISTS "Admins manage subscribers" ON subscribers;
DROP POLICY IF EXISTS "Admins manage commissions" ON commissions;
DROP POLICY IF EXISTS "Allow all for authenticated users" ON commissions;

-- 3. Re-create policies using the security definer function
CREATE POLICY "Admins manage tours" ON tours
    FOR ALL USING (public.is_admin_or_secretary());

CREATE POLICY "Admins manage bookings" ON bookings
    FOR ALL USING (public.is_admin_or_secretary());

CREATE POLICY "Admins manage team_members" ON team_members
    FOR ALL USING (public.is_admin_or_secretary());

CREATE POLICY "Admins manage subscribers" ON subscribers
    FOR ALL USING (public.is_admin_or_secretary());

CREATE POLICY "Admins manage commissions" ON commissions
    FOR ALL TO authenticated
    USING (public.is_admin_or_secretary())
    WITH CHECK (public.is_admin_or_secretary());

-- 4. Fix tour_reviews if the table exists
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'tour_reviews') THEN
        DROP POLICY IF EXISTS "Admin manage reviews" ON tour_reviews;
        DROP POLICY IF EXISTS "Admins manage reviews" ON tour_reviews;
        CREATE POLICY "Admins manage reviews" ON tour_reviews
            FOR ALL USING (public.is_admin_or_secretary());
    END IF;
END $$;

-- 5. Fix profiles policy (also needs to avoid recursion)
-- Drop any policy that recursively references profiles
DROP POLICY IF EXISTS "Admins manage profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Re-create minimal, safe policies for profiles
CREATE POLICY "Users view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins manage all profiles" ON profiles
    FOR ALL USING (public.is_admin_or_secretary());

CREATE POLICY "Users update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- 6. Clean up public anon access to commissions
DROP POLICY IF EXISTS "Allow read for anon" ON commissions;
