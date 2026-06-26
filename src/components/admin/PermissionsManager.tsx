import { useState, useEffect } from 'react';
import { Shield, Save, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';

const ROLES = ['admin', 'secretary'] as const;

const MODULES = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'tours', label: 'Tours' },
    { id: 'bookings', label: 'Bookings' },
    { id: 'calendar', label: 'Calendar' },
    { id: 'subscribers', label: 'Subscribers' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'team', label: 'Team' },
    { id: 'website', label: 'Components' },
    { id: 'emails', label: 'Email Tests' },
    { id: 'commissions', label: 'Commissions' },
    { id: 'auditLog', label: 'Audit Log' },
    { id: 'users', label: 'Users' },
    { id: 'profile', label: 'Profile' },
    { id: 'roles', label: 'Roles' },
] as const;

type PermissionMap = Record<string, string[]>; // role -> module[]

export default function PermissionsManager({ onToast }: { onToast?: (msg: string, type?: 'info' | 'success') => void }) {
    const [permissions, setPermissions] = useState<PermissionMap>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchPermissions();
    }, []);

    async function fetchPermissions() {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/permissions');
            const data = await res.json();
            const map: PermissionMap = {};
            for (const role of ROLES) map[role] = [];

            if (data.permissions) {
                for (const p of data.permissions) {
                    if (!map[p.role]) map[p.role] = [];
                    map[p.role].push(p.module);
                }
            }
            setPermissions(map);
        } catch (err) {
            console.error('Failed to load permissions:', err);
        }
        setLoading(false);
    }

    function toggle(role: string, module: string) {
        setPermissions(prev => {
            const current = prev[role] || [];
            const next = current.includes(module)
                ? current.filter(m => m !== module)
                : [...current, module];
            return { ...prev, [role]: next };
        });
    }

    async function save() {
        setSaving(true);
        try {
            const payload: { role: string; module: string }[] = [];
            for (const role of ROLES) {
                for (const module of (permissions[role] || [])) {
                    payload.push({ role, module });
                }
            }

            const res = await fetch('/api/admin/permissions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ permissions: payload }),
            });

            if (!res.ok) throw new Error('Failed to save');

            onToast?.('Permissions saved successfully', 'success');
        } catch (err) {
            console.error('Save failed:', err);
            onToast?.('Failed to save permissions', 'info');
        }
        setSaving(false);
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Roles & Permissions</h2>
                        <p className="text-sm text-muted-foreground">
                            Control which modules each role can access
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={fetchPermissions} disabled={loading}>
                        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                    <Button size="sm" onClick={save} disabled={saving}>
                        <Save className={`w-4 h-4 mr-2 ${saving ? 'animate-spin' : ''}`} />
                        {saving ? 'Saving...' : 'Save'}
                    </Button>
                </div>
            </div>

            <div className="grid gap-6">
                {ROLES.map(role => (
                    <div key={role} className="bg-card border rounded-2xl overflow-hidden">
                        <div className="px-6 py-4 border-b bg-muted/30">
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                                    role === 'admin'
                                        ? 'bg-amber-500/10 text-amber-600'
                                        : 'bg-blue-500/10 text-blue-600'
                                }`}>
                                    {role === 'admin' ? 'A' : 'S'}
                                </div>
                                <div>
                                    <h3 className="font-semibold capitalize">{role}</h3>
                                    <p className="text-xs text-muted-foreground">
                                        {role === 'admin' ? 'Full access to all modules' : 'Limited access'}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                {MODULES.map(mod => {
                                    const enabled = (permissions[role] || []).includes(mod.id);
                                    return (
                                        <button
                                            key={mod.id}
                                            onClick={() => toggle(role, mod.id)}
                                            className={`relative flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${
                                                enabled
                                                    ? 'bg-primary/5 border-primary/30 text-foreground shadow-sm'
                                                    : 'bg-transparent border-border text-muted-foreground hover:border-muted-foreground/30'
                                            }`}
                                        >
                                            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
                                                enabled
                                                    ? 'bg-primary border-primary'
                                                    : 'border-muted-foreground/40'
                                            }`}>
                                                {enabled && (
                                                    <svg className="w-3 h-3 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </div>
                                            <span className="text-sm font-medium">{mod.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
