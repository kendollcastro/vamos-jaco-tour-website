-- Role-based module permissions for admin panel.
-- Each row grants a role access to a specific module.

CREATE TABLE IF NOT EXISTS role_permissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    role TEXT NOT NULL CHECK (role IN ('admin', 'secretary')),
    module TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (role, module)
);

ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;

-- Only admins manage permissions
CREATE POLICY "Admins manage role_permissions" ON role_permissions
    FOR ALL USING (public.is_admin_or_secretary());

-- Seed default permissions: admin gets everything, secretary gets limited modules
INSERT INTO role_permissions (role, module) VALUES
    -- Admin: all modules
    ('admin', 'dashboard'),
    ('admin', 'tours'),
    ('admin', 'bookings'),
    ('admin', 'calendar'),
    ('admin', 'subscribers'),
    ('admin', 'gallery'),
    ('admin', 'team'),
    ('admin', 'website'),
    ('admin', 'emails'),
    ('admin', 'commissions'),
    ('admin', 'auditLog'),
    ('admin', 'users'),
    ('admin', 'profile'),
    ('admin', 'roles'),
    -- Secretary: limited access
    ('secretary', 'dashboard'),
    ('secretary', 'bookings'),
    ('secretary', 'calendar'),
    ('secretary', 'commissions'),
    ('secretary', 'profile')
ON CONFLICT (role, module) DO NOTHING;
