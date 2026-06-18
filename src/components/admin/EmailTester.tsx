import React, { useState, useEffect } from 'react';
import { Mail, Send, AlertCircle, CheckCircle, Save } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export default function EmailTester() {
    const [email, setEmail] = useState('');
    const [logoUrl, setLogoUrl] = useState('');
    const [selectedLang, setSelectedLang] = useState<'en' | 'es'>('en');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetch('/api/admin/settings')
            .then(res => res.json())
            .then(data => {
                if (data.success && data.settings?.email_logo_url) {
                    setLogoUrl(data.settings.email_logo_url);
                }
            })
            .catch(err => console.error('Error fetching settings:', err));
    }, []);

    const handleSaveGlobalLogo = async () => {
        if (!logoUrl) return;
        setStatus('loading');
        try {
            const response = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: 'email_logo_url', value: logoUrl })
            });

            const data = await response.json();
            if (response.ok && data.success) {
                setStatus('success');
                setMessage('Global email logo updated successfully!');
                setTimeout(() => setStatus('idle'), 5000);
            } else {
                throw new Error(data.message || 'Failed to save setting');
            }
        } catch (error: any) {
            console.error(error);
            setStatus('error');
            setMessage(error.message || 'Failed to save global logo. Ensure the settings table exists.');
        }
    };

    const handleSendTest = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');
        try {
            const response = await fetch('/api/admin/test-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    email, 
                    logoOverride: logoUrl || undefined,
                    language: selectedLang
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setStatus('success');
                setMessage('Test emails sent successfully! Check your inbox.');
                setTimeout(() => setStatus('idle'), 5000);
            } else {
                throw new Error(data.message || 'Failed to send emails');
            }
        } catch (error: any) {
            console.error(error);
            setStatus('error');
            setMessage(error.message || 'An unexpected error occurred (Check Resend verify domain rules).');
        }
    };

    return (
        <div className="bg-white dark:bg-dark-soft rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Mail className="w-5 h-5" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Email Tester</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Send the premium booking confirmation and newsletter welcome templates to any email address.
                    </p>
                </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700/50 rounded-xl p-4 mb-6 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-800 dark:text-yellow-400">
                    <strong>Resend Free Tier Limitation:</strong> If you have not verified your domain in Resend, you can <em>only</em> send test emails to the exact email address you used to register the Resend account.
                </div>
            </div>

            <form onSubmit={handleSendTest} className="space-y-5">
                <div className="space-y-2">
                    <Label htmlFor="testEmail">Recipient Email Address</Label>
                    <div className="flex gap-3">
                        <Input
                            type="email"
                            id="testEmail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="e.g. your-resend-email@gmail.com"
                            required
                            disabled={status === 'loading'}
                            className="flex-1 h-10"
                        />
                        <Button
                            type="submit"
                            disabled={status === 'loading' || !email}
                        >
                            {status === 'loading' ? (
                                <span className="animate-pulse">Sending...</span>
                            ) : (
                                <>
                                    <Send className="w-4 h-4" />
                                    Send Test
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="logoUrl">Brand Logo Override URL (Optional)</Label>
                    <div className="flex gap-3">
                        <Input
                            type="url"
                            id="logoUrl"
                            value={logoUrl}
                            onChange={(e) => setLogoUrl(e.target.value)}
                            placeholder="https://example.com/custom-logo.png"
                            disabled={status === 'loading'}
                            className="flex-1 h-10"
                        />
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleSaveGlobalLogo}
                            disabled={status === 'loading' || !logoUrl}
                        >
                            {status === 'loading' ? (
                                'Saving...'
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Save as Default
                                </>
                            )}
                        </Button>
                    </div>
                    <p className="text-xs text-gray-500 font-medium">Leave blank to use the default Vamos Jacó Tours brand logo.</p>
                </div>

                <div className="space-y-2">
                    <Label>Email Language</Label>
                    <Select
                        value={selectedLang}
                        onValueChange={(v: 'en' | 'es') => setSelectedLang(v)}
                    >
                        <SelectTrigger className="w-40">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                
                {status === 'success' && (
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm font-medium">
                        <CheckCircle className="w-4 h-4" />
                        {message}
                    </div>
                )}
                
                {status === 'error' && (
                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm font-medium">
                        <AlertCircle className="w-4 h-4" />
                        {message}
                    </div>
                )}
            </form>
        </div>
    );
}
