import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { User, Save, Loader2 } from 'lucide-react';

interface Props {
    onNavigate?: (view: string) => void;
    onToast?: (message: string, type?: 'info' | 'success') => void;
}

export default function ProfileSettings({ onToast }: Props) {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadProfile();
    }, []);

    async function loadProfile() {
        if (!supabase) { setLoading(false); return; }
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setLoading(false); return; }
        setEmail(user.email || '');
        setFullName(user.user_metadata?.full_name || '');
        setLoading(false);
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        if (!supabase) return;
        setSaving(true);

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setSaving(false); return; }

        const { error } = await supabase.auth.updateUser({
            data: { full_name: fullName.trim() },
        });

        if (error) {
            onToast?.(`Error: ${error.message}`, 'info');
        } else {
            localStorage.setItem('user_full_name', fullName.trim());
            onToast?.('Profile updated', 'success');
        }
        setSaving(false);
    }

    if (!supabase) {
        return <div className="text-center text-muted-foreground py-12">Connect Supabase to edit your profile.</div>;
    }

    return (
        <div className="max-w-lg mx-auto space-y-6">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                    <h2 className="text-xl font-bold">Profile</h2>
                    <p className="text-sm text-muted-foreground">Manage your display name</p>
                </div>
            </div>

            <div className="bg-card border border-border/40 rounded-2xl p-6 space-y-6">
                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    <form onSubmit={handleSave} className="space-y-5">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Email</Label>
                            <Input value={email} disabled className="bg-muted/50" />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Full Name</Label>
                            <Input
                                value={fullName}
                                onChange={e => setFullName(e.target.value)}
                                placeholder="Your display name"
                                className="bg-background"
                            />
                            <p className="text-[10px] text-muted-foreground">
                                This name will appear in the sidebar instead of your email.
                            </p>
                        </div>

                        <Button type="submit" disabled={saving || !fullName.trim()} className="w-full gap-2">
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {saving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </form>
                )}
            </div>
        </div>
    );
}
