import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/button';
import { Shield, ShieldOff, RefreshCw, User as UserIcon, X, Save } from 'lucide-react';

const ALL_MODULES = [
    'dashboard', 'tours', 'bookings', 'calendar', 'subscribers',
    'gallery', 'team', 'website', 'emails', 'commissions',
    'auditLog', 'users', 'profile', 'roles',
];

interface Profile {
    id: string;
    email: string;
    full_name: string;
    role: 'admin' | 'secretary';
    permissions: string[] | null;
    created_at: string;
}

export default function UserManager() {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState<string>('');
    const [editUser, setEditUser] = useState<Profile | null>(null);
    const [editModules, setEditModules] = useState<string[]>([]);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchProfiles();
        fetchMyRole();
    }, []);

    async function fetchMyRole() {
        if (!supabase) return;
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        if (data) setUserRole((data as any).role);
    }

    async function fetchProfiles() {
        setLoading(true);
        if (!supabase) { setLoading(false); return; }

        // Fetch from the new API endpoint (includes permissions)
        const token = getAccessToken();
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        try {
            const res = await fetch('/api/admin/users/permissions', { headers });
            const data = await res.json();
            if (data.users) setProfiles(data.users);
        } catch {
            // Fallback: query profiles directly (no permissions column)
            const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: true });
            if (!error) setProfiles((data as Profile[]) || []);
        }
        setLoading(false);
    }

    function getAccessToken(): string | undefined {
        try {
            const raw = localStorage.getItem('sb-ddukdjdiqjvfjywuhnpn-auth-token');
            if (raw) return JSON.parse(raw).access_token;
        } catch {}
    }

    async function toggleRole(profile: Profile) {
        if (!supabase) return;
        const newRole = profile.role === 'admin' ? 'secretary' : 'admin';
        const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', profile.id);
        if (!error) fetchProfiles();
    }

    function openPermissions(user: Profile) {
        setEditUser(user);
        setEditModules(user.permissions || []);
    }

    function toggleModule(mod: string) {
        setEditModules(prev =>
            prev.includes(mod) ? prev.filter(m => m !== mod) : [...prev, mod]
        );
    }

    async function savePermissions() {
        if (!editUser) return;
        setSaving(true);
        const token = getAccessToken();
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        try {
            await fetch('/api/admin/users/permissions', {
                method: 'PUT',
                headers,
                body: JSON.stringify({ userId: editUser.id, permissions: editModules }),
            });
            setEditUser(null);
            fetchProfiles();
        } catch (e) {
            console.error('Failed to save permissions', e);
        }
        setSaving(false);
    }

    function clearPermissions(user: Profile) {
        if (!supabase) return;
        setEditUser(null);
        const token = getAccessToken();
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        fetch('/api/admin/users/permissions', {
            method: 'PUT',
            headers,
            body: JSON.stringify({ userId: user.id, permissions: null }),
        }).then(() => fetchProfiles()).catch(console.error);
    }

    if (!supabase) {
        return <div className="text-center text-muted-foreground py-12">Connect Supabase to manage users.</div>;
    }

    const label = (mod: string) => mod.charAt(0).toUpperCase() + mod.slice(1);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <UserIcon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Users</h2>
                        <p className="text-sm text-muted-foreground">Manage user roles and per-user module permissions</p>
                    </div>
                </div>
                <Button variant="outline" size="sm" onClick={fetchProfiles} disabled={loading}>
                    <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            <div className="bg-card border rounded-2xl overflow-hidden">
                {profiles.length === 0 ? (
                    <div className="text-center text-muted-foreground py-16">
                        {loading ? 'Loading...' : 'No users found.'}
                    </div>
                ) : (
                    <div className="divide-y">
                        {profiles.map((profile) => {
                            const isAdmin = profile.role === 'admin';
                            const isSelf = profile.role === userRole;
                            const hasCustomPerms = profile.permissions && profile.permissions.length > 0;
                            return (
                                <div key={profile.id} className="p-4 flex items-center justify-between hover:bg-accent/50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${isAdmin ? 'bg-amber-500/10 text-amber-600' : 'bg-blue-500/10 text-blue-600'}`}>
                                            {profile.email.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-semibold">{profile.email}</span>
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${isAdmin ? 'bg-amber-500/10 text-amber-600' : 'bg-blue-500/10 text-blue-600'}`}>
                                                    {isAdmin ? 'Admin' : 'Secretary'}
                                                </span>
                                                {hasCustomPerms && (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-600">
                                                        Custom
                                                    </span>
                                                )}
                                            </div>
                                            {profile.full_name && (
                                                <p className="text-xs text-muted-foreground">{profile.full_name}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => openPermissions(profile)}
                                            className="text-xs gap-1.5"
                                            disabled={userRole !== 'admin'}
                                            title={userRole !== 'admin' ? 'Only admins can manage permissions' : 'Manage module permissions'}
                                        >
                                            Modules
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => toggleRole(profile)}
                                            className="text-xs gap-1.5"
                                            disabled={userRole !== 'admin'}
                                            title={userRole !== 'admin' ? 'Only admins can change roles' : `Switch to ${isAdmin ? 'Secretary' : 'Admin'}`}
                                        >
                                            {isAdmin ? <ShieldOff className="w-3.5 h-3.5" /> : <Shield className="w-3.5 h-3.5" />}
                                            {isAdmin ? 'Demote' : 'Promote'}
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Permissions Modal */}
            {editUser && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setEditUser(null)} />
                    <div className="relative bg-white dark:bg-[#0A0A0A] rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                        Module Permissions
                                    </h3>
                                    <p className="text-sm text-gray-500">{editUser.email}</p>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setEditUser(null)} className="rounded-lg">
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>

                            <div className="space-y-1 mb-6 max-h-72 overflow-y-auto">
                                {ALL_MODULES.map((mod) => {
                                    const on = editModules.includes(mod);
                                    return (
                                        <label
                                            key={mod}
                                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={on}
                                                onChange={() => toggleModule(mod)}
                                                className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary"
                                            />
                                            <span className="text-sm font-medium text-gray-900 dark:text-white">{label(mod)}</span>
                                        </label>
                                    );
                                })}
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    variant="ghost"
                                    onClick={() => clearPermissions(editUser)}
                                    className="flex-1 px-4 py-3 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-white/10 h-auto text-xs"
                                    disabled={saving}
                                >
                                    Reset to Role Defaults
                                </Button>
                                <Button
                                    onClick={savePermissions}
                                    className="flex-1 px-4 py-3 font-bold rounded-xl h-auto gap-2"
                                    disabled={saving}
                                >
                                    {saving ? 'Saving...' : <Save className="w-4 h-4" />}
                                    Save
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}