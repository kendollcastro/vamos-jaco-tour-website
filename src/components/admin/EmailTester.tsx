import React, { useState } from 'react';
import { Mail, Send, AlertCircle, CheckCircle } from 'lucide-react';

export default function EmailTester() {
    const [email, setEmail] = useState('');
    const [logoUrl, setLogoUrl] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSendTest = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');
        try {
            const response = await fetch('/api/admin/test-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, logoOverride: logoUrl || undefined })
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

            <form onSubmit={handleSendTest} className="space-y-4">
                <div>
                    <label htmlFor="testEmail" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                        Recipient Email Address
                    </label>
                    <div className="flex gap-3">
                        <input
                            type="email"
                            id="testEmail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="e.g. your-resend-email@gmail.com"
                            className="flex-1 px-4 py-3 border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all shadow-sm"
                            required
                            disabled={status === 'loading'}
                        />
                        <button
                            type="submit"
                            disabled={status === 'loading' || !email}
                            className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-xl font-bold transition-all disabled:opacity-50"
                        >
                            {status === 'loading' ? (
                                <span className="animate-pulse">Sending...</span>
                            ) : (
                                <>
                                    <Send className="w-4 h-4" />
                                    Send Test
                                </>
                            )}
                        </button>
                    </div>
                </div>

                <div className="pt-2">
                    <label htmlFor="logoUrl" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                        Brand Logo Override URL (Optional)
                    </label>
                    <input
                        type="url"
                        id="logoUrl"
                        value={logoUrl}
                        onChange={(e) => setLogoUrl(e.target.value)}
                        placeholder="https://example.com/custom-logo.png"
                        className="w-full px-4 py-3 border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all shadow-sm"
                        disabled={status === 'loading'}
                    />
                    <p className="text-xs text-gray-500 mt-2 font-medium">Leave blank to use the default Vamos Jacó Tours brand logo.</p>
                </div>
                
                {status === 'success' && (
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm font-medium animate-fade-in">
                        <CheckCircle className="w-4 h-4" />
                        {message}
                    </div>
                )}
                
                {status === 'error' && (
                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm font-medium animate-fade-in">
                        <AlertCircle className="w-4 h-4" />
                        {message}
                    </div>
                )}
            </form>
        </div>
    );
}
