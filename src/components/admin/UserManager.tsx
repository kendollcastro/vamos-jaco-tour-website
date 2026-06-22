import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/button';
import { Shield, ShieldOff, RefreshCw, User as UserIcon } from 'lucide-react';

interface Profile {
    id: string;
    email: string;
    full_name: string;
    role: 'admin' | 'secretary';
    created_at: string;
}

export default function UserManager() {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState<string>('');

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

        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: true });

        if (!error) setProfiles((data as Profile[]) || []);
        setLoading(false);
    }

    async function toggleRole(profile: Profile) {
        if (!supabase) return;
        const newRole = profile.role === 'admin' ? 'secretary' : 'admin';
        const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', profile.id);
        if (!error) fetchProfiles();
    }

    if (!supabase) {
        return <div className="text-center text-muted-foreground py-12">Connect Supabase to manage users.</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <UserIcon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Users</h2>
                        <p className="text-sm text-muted-foreground">Manage user roles and permissions</p>
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
                        {loading ? 'Loading...' : 'No users found. Profiles are auto-created on first login.'}
                    </div>
                ) : (
                    <div className="divide-y">
                        {profiles.map((profile) => {
                            const isAdmin = profile.role === 'admin';
                            const isSelf = profile.role === userRole;
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
                                            </div>
                                            {profile.full_name && (
                                                <p className="text-xs text-muted-foreground">{profile.full_name}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
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
        </div>
    );
}
