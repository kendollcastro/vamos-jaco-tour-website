import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/button';
import { Shield, ShieldOff, RefreshCw, Users, X, Save, Search, SlidersHorizontal, Crown, Sparkles, UserCog } from 'lucide-react';
import { Input } from '../ui/input';

const ALL_MODULES = [
    'dashboard', 'tours', 'bookings', 'calendar', 'subscribers',
    'gallery', 'team', 'website', 'emails', 'commissions',
    'auditLog', 'users', 'profile', 'roles',
];

const MODULE_LABELS: Record<string, string> = {
    dashboard: 'Dashboard', tours: 'Tours', bookings: 'Bookings',
    calendar: 'Calendar', subscribers: 'Subscribers', gallery: 'Gallery',
    team: 'Team', website: 'Components', emails: 'Email Tests',
    commissions: 'Commissions', auditLog: 'Audit Log', users: 'Users',
    profile: 'Profile', roles: 'Roles',
};

const MODULE_ICONS: Record<string, string> = {
    dashboard: '📊', tours: '🏔️', bookings: '📋', calendar: '📅',
    subscribers: '📧', gallery: '🖼️', team: '👥', website: '⚙️',
    emails: '📨', commissions: '💰', auditLog: '📜', users: '🛡️',
    profile: '⚙️', roles: '🔐',
};

const AVATAR_GRADIENTS = [
    'from-amber-400 to-orange-500',
    'from-emerald-400 to-teal-500',
    'from-rose-400 to-pink-500',
    'from-sky-400 to-blue-500',
    'from-violet-400 to-purple-500',
    'from-cyan-400 to-blue-500',
    'from-fuchsia-400 to-pink-500',
    'from-lime-400 to-green-500',
];

interface Profile {
    id: string;
    email: string;
    full_name: string;
    role: 'admin' | 'secretary';
    permissions: string[] | null;
    created_at: string;
}

function hashColorIndex(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = ((hash << 5) - hash) + str.charCodeAt(i);
    return Math.abs(hash) % AVATAR_GRADIENTS.length;
}

export default function UserManager() {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState('');
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

        const token = getAccessToken();
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        try {
            const res = await fetch('/api/admin/users/permissions', { headers });
            const data = await res.json();
            if (data.users) setProfiles(data.users);
        } catch {
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
        if (user.permissions && Array.isArray(user.permissions) && user.permissions.length > 0) {
            setEditModules(user.permissions);
        } else {
            const savedRole = user.role;
            const token = getAccessToken();
            const headers: Record<string, string> = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;
            fetch('/api/admin/permissions', { headers })
                .then(r => r.json())
                .then(data => {
                    const roleDefaults = (data.permissions || [])
                        .filter((p: any) => p.role === savedRole)
                        .map((p: any) => p.module);
                    setEditModules(roleDefaults);
                })
                .catch(() => setEditModules([]));
        }
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
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
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
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        fetch('/api/admin/users/permissions', {
            method: 'PUT',
            headers,
            body: JSON.stringify({ userId: user.id, permissions: null }),
        }).then(() => fetchProfiles()).catch(console.error);
    }

    const filteredProfiles = useMemo(() =>
        profiles.filter(p =>
            p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (p.full_name || '').toLowerCase().includes(searchQuery.toLowerCase())
        ),
        [profiles, searchQuery]
    );

    if (!supabase) {
        return <div className="text-center text-muted-foreground py-12">Connect Supabase to manage users.</div>;
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400/20 to-orange-500/20 flex items-center justify-center ring-1 ring-amber-500/20">
                        <Users className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Usuarios</h2>
                        <p className="text-sm text-muted-foreground">Gestiona roles y permisos por módulo</p>
                    </div>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchProfiles}
                    disabled={loading}
                    className="gap-2 h-9 text-xs font-medium"
                >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                    Refrescar
                </Button>
            </div>

            {/* Search */}
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Buscar por nombre o email..."
                    className="pl-9 h-10 text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Users Grid */}
            {profiles.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400/10 to-orange-500/10 flex items-center justify-center ring-1 ring-amber-500/10 mb-4">
                        <Users className="w-8 h-8 text-amber-500/50" />
                    </div>
                    <p className="text-lg font-semibold text-muted-foreground">
                        {loading ? 'Cargando usuarios...' : 'No se encontraron usuarios'}
                    </p>
                    <p className="text-sm text-muted-foreground/60 mt-1">
                        {loading ? 'Obteniendo lista de usuarios registrados' : 'Espera a que nuevos usuarios se registren'}
                    </p>
                </div>
            ) : (
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {filteredProfiles.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-3">
                                <Search className="w-6 h-6 text-muted-foreground/50" />
                            </div>
                            <p className="text-sm font-medium text-muted-foreground">Sin resultados</p>
                            <p className="text-xs text-muted-foreground/60 mt-0.5">Prueba con otro término de búsqueda</p>
                        </div>
                    )}
                    {filteredProfiles.map((profile, index) => {
                        const isAdmin = profile.role === 'admin';
                        const isSelf = profile.role === userRole;
                        const hasCustomPerms = profile.permissions && profile.permissions.length > 0;
                        const colorIdx = hashColorIndex(profile.id);
                        return (
                            <div
                                key={profile.id}
                                className="group relative bg-card border border-border/40 rounded-2xl p-5 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/5 hover:border-amber-500/20 hover:-translate-y-0.5"
                                style={{ animationDelay: `${index * 40}ms` }}
                            >
                                {/* Accent bar */}
                                <div className={`absolute top-0 left-6 right-6 h-0.5 rounded-full bg-gradient-to-r ${isAdmin ? 'from-amber-400 to-orange-500' : 'from-emerald-400 to-teal-500'} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                                <div className="flex items-start justify-between gap-4">
                                    {/* Avatar + Info */}
                                    <div className="flex items-center gap-4 min-w-0">
                                        <div className={`relative w-12 h-12 rounded-2xl bg-gradient-to-br ${AVATAR_GRADIENTS[colorIdx]} flex items-center justify-center text-white text-lg font-bold shrink-0 shadow-lg ${isAdmin ? 'ring-2 ring-amber-400/40' : ''}`}>
                                            {(profile.full_name || profile.email).charAt(0).toUpperCase()}
                                            {isAdmin && (
                                                <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center shadow-sm">
                                                    <Crown className="w-3 h-3 text-amber-900" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                {profile.full_name ? (
                                                    <span className="text-sm font-bold truncate max-w-[180px]">{profile.full_name}</span>
                                                ) : null}
                                            </div>
                                            <p className={`text-xs truncate max-w-[200px] ${profile.full_name ? 'text-muted-foreground' : 'text-sm font-semibold'}`}>
                                                {profile.email}
                                            </p>
                                            <div className="flex items-center gap-1.5 mt-1.5">
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                    isAdmin
                                                        ? 'bg-amber-500/10 text-amber-600'
                                                        : 'bg-emerald-500/10 text-emerald-600'
                                                }`}>
                                                    {isAdmin ? <Crown className="w-2.5 h-2.5" /> : <UserCog className="w-2.5 h-2.5" />}
                                                    {isAdmin ? 'Admin' : 'Secretario'}
                                                </span>
                                                {hasCustomPerms && (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-violet-500/10 text-violet-600">
                                                        <Sparkles className="w-2.5 h-2.5" />
                                                        Personalizado
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Role toggle */}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => toggleRole(profile)}
                                        disabled={userRole !== 'admin'}
                                        className={`shrink-0 h-8 px-2.5 rounded-xl text-xs gap-1.5 transition-all ${
                                            isAdmin
                                                ? 'text-rose-500 hover:text-rose-600 hover:bg-rose-500/10'
                                                : 'text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10'
                                        }`}
                                        title={userRole !== 'admin' ? 'Solo admins pueden cambiar roles' : `Cambiar a ${isAdmin ? 'Secretario' : 'Admin'}`}
                                    >
                                        {isAdmin ? <ShieldOff className="w-3.5 h-3.5" /> : <Shield className="w-3.5 h-3.5" />}
                                    </Button>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/50">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => openPermissions(profile)}
                                        disabled={userRole !== 'admin'}
                                        className="flex-1 h-8 rounded-xl text-xs gap-1.5 font-medium"
                                    >
                                        <SlidersHorizontal className="w-3.5 h-3.5" />
                                        Módulos
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => toggleRole(profile)}
                                        disabled={userRole !== 'admin'}
                                        className={`flex-1 h-8 rounded-xl text-xs gap-1.5 font-medium ${
                                            isAdmin
                                                ? 'text-rose-600 border-rose-200 dark:border-rose-900 hover:bg-rose-500/10 hover:border-rose-300'
                                                : 'text-emerald-600 border-emerald-200 dark:border-emerald-900 hover:bg-emerald-500/10 hover:border-emerald-300'
                                        }`}
                                    >
                                        {isAdmin ? <ShieldOff className="w-3.5 h-3.5" /> : <Shield className="w-3.5 h-3.5" />}
                                        {isAdmin ? 'Degradar' : 'Ascender'}
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Permissions Modal */}
            {editUser && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setEditUser(null)}>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                    </div>
                    <div className="relative bg-white dark:bg-[#0A0A0A] rounded-3xl shadow-2xl w-full max-w-lg mx-auto overflow-hidden animate-in zoom-in-95 fade-in duration-200 border border-border/50">
                        {/* Modal header */}
                        <div className="relative px-7 pt-7 pb-4 border-b border-border/40">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${AVATAR_GRADIENTS[hashColorIndex(editUser.id)]} flex items-center justify-center text-white text-base font-bold shadow-md`}>
                                        {(editUser.full_name || editUser.email).charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold">Permisos por Módulo</h3>
                                        <p className="text-sm text-muted-foreground mt-0.5">{editUser.email}</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setEditUser(null)} className="rounded-xl h-9 w-9">
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                            <div className="flex items-center gap-2 mt-3">
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                    editUser.role === 'admin'
                                        ? 'bg-amber-500/10 text-amber-600'
                                        : 'bg-emerald-500/10 text-emerald-600'
                                }`}>
                                    {editUser.role === 'admin' ? <Crown className="w-2.5 h-2.5" /> : <UserCog className="w-2.5 h-2.5" />}
                                    {editUser.role === 'admin' ? 'Admin' : 'Secretario'}
                                </span>
                                <span className="text-[10px] text-muted-foreground">
                                    {editModules.length} de {ALL_MODULES.length} módulos activos
                                </span>
                            </div>
                        </div>

                        {/* Module toggles */}
                        <div className="px-4 py-5 max-h-80 overflow-y-auto">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {ALL_MODULES.map((mod) => {
                                    const on = editModules.includes(mod);
                                    return (
                                        <button
                                            key={mod}
                                            onClick={() => toggleModule(mod)}
                                            className={`relative flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all duration-200 ${
                                                on
                                                    ? 'bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/25 shadow-sm'
                                                    : 'bg-transparent border border-transparent hover:bg-accent/50 hover:border-border/40'
                                            }`}
                                        >
                                            <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${
                                                on
                                                    ? 'bg-primary border-primary shadow-sm shadow-primary/20'
                                                    : 'border-muted-foreground/30'
                                            }`}>
                                                {on && (
                                                    <svg className="w-3 h-3 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 min-w-0">
                                                <span className="text-sm">{MODULE_ICONS[mod]}</span>
                                                <span className={`text-sm font-medium transition-colors ${on ? 'text-foreground' : 'text-muted-foreground'}`}>
                                                    {MODULE_LABELS[mod]}
                                                </span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-7 py-4 border-t border-border/40 bg-muted/20 flex items-center gap-3">
                            <Button
                                variant="ghost"
                                onClick={() => clearPermissions(editUser)}
                                className="flex-1 h-10 rounded-xl text-xs font-bold border border-border/50 hover:bg-accent"
                                disabled={saving}
                            >
                                Restaurar Defaults
                            </Button>
                            <Button
                                onClick={savePermissions}
                                className="flex-1 h-10 rounded-xl text-xs font-bold gap-2"
                                disabled={saving}
                            >
                                {saving ? (
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Save className="w-4 h-4" />
                                )}
                                {saving ? 'Guardando...' : 'Guardar'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}