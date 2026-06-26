-- Fix RLS policies: restrict admin operations to users with admin/secretary role in profiles table.
-- Previously used auth.role() = 'authenticated' which matches ANY logged-in user.

-- 1. Tours - Admins manage tours (was: auth.role() = 'authenticated')
DROP POLICY IF EXISTS "Admins manage tours" ON tours;
CREATE POLICY "Admins manage tours" ON tours
    FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'secretary'))
    );

-- 2. Bookings - Admins manage bookings (was: auth.role() = 'authenticated')
DROP POLICY IF EXISTS "Admins manage bookings" ON bookings;
CREATE POLICY "Admins manage bookings" ON bookings
    FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'secretary'))
    );

-- 3. Team members - Admins manage team_members (was: auth.role() = 'authenticated')
DROP POLICY IF EXISTS "Admins manage team_members" ON team_members;
CREATE POLICY "Admins manage team_members" ON team_members
    FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'secretary'))
    );

-- 4. Subscribers - Admins manage subscribers (was: auth.role() = 'authenticated')
DROP POLICY IF EXISTS "Admins manage subscribers" ON subscribers;
CREATE POLICY "Admins manage subscribers" ON subscribers
    FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'secretary'))
    );

-- 5. Commissions - Authenticated users CRUD (was: TO authenticated USING (true) WITH CHECK (true))
DROP POLICY IF EXISTS "Allow all for authenticated users" ON commissions;
CREATE POLICY "Admins manage commissions" ON commissions
    FOR ALL TO authenticated USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'secretary'))
    ) WITH CHECK (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'secretary'))
    );

-- 6. Commissions - Remove public read access (was exposing customer PII and financial data)
DROP POLICY IF EXISTS "Allow read for anon" ON commissions;

-- 7. Reviews - Admin manage reviews (was: FOR ALL USING (true) — anyone could delete/modify)
DROP POLICY IF EXISTS "Admin manage reviews" ON tour_reviews;
CREATE POLICY "Admin manage reviews" ON tour_reviews
    FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'secretary'))
    );
