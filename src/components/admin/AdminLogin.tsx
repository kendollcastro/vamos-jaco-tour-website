import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useStore } from '@nanostores/react';
import { language } from '../../store';
import { adminTranslations } from '../../lib/admin-translations';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { AlertCircle, Mail, Eye, EyeOff, Loader2, Play } from 'lucide-react';

export default function AdminLogin({ onAuth }: { onAuth: () => void }) {
    const $language = useStore(language);
    const t = adminTranslations[$language];
    
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);
    const lang = mounted ? $language : 'en';
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [view, setView] = useState<'login' | 'forgot'>('login');
    const [resetSent, setResetSent] = useState(false);

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!supabase) {
            setError('Supabase not configured. Add SUPABASE_URL and ANON_KEY to .env to enable authentication.');
            setLoading(false);
            return;
        }

        const { error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (authError) {
            setError(authError.message);
            setLoading(false);
        } else {
            onAuth();
        }
    }

    async function handleForgotPassword(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!supabase) {
            setError('Supabase not configured.');
            setLoading(false);
            return;
        }

        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/admin`,
        });

        if (resetError) {
            setError(resetError.message);
        } else {
            setResetSent(true);
        }
        setLoading(false);
    }

    const isDemo = !supabase;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark px-4 transition-colors duration-300">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <a href="/" className="inline-block mb-6">
                        <img
                            src="/logo-optimized.png"
                            alt="Vamos Jacó Tours"
                            className="h-16 w-auto mx-auto object-contain"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                            }}
                        />
                    </a>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{lang === 'en' ? 'Admin Panel' : 'Panel de Admin'}</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{lang === 'en' ? 'Sign in to manage your tours' : 'Inicia sesión para gestionar tus tours'}</p>
                </div>

                {/* Login Card */}
                <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-border/40 p-8 space-y-5 shadow-xl transition-colors duration-300">
                    {/* Demo mode banner */}
                    {isDemo && (
                        <div className="bg-brand-teal/10 border border-brand-teal/30 rounded-xl px-4 py-3 text-brand-teal text-sm flex items-start gap-2">
                            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                            <div>
                                <p className="font-semibold">{lang === 'en' ? 'Demo Mode' : 'Modo Demo'}</p>
                                <p className="text-xs text-brand-teal/70 mt-0.5">{lang === 'en' ? 'Supabase not configured. Click "Enter Demo" to explore with sample data.' : 'Supabase no configurado. Haz clic en "Entrar en Demo" para explorar con datos de ejemplo.'}</p>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            {error}
                        </div>
                    )}

                    {resetSent ? (
                        <div className="text-center py-4">
                            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                                <Mail className="w-8 h-8 text-green-500" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{lang === 'en' ? 'Check your email' : 'Revisa tu correo'}</h3>
                            <p className="text-gray-500 text-sm mb-4">{lang === 'en' ? 'We sent a password reset link to' : 'Enviamos un enlace de recuperación a'} <strong className="text-gray-700 dark:text-gray-300">{email}</strong></p>
                            <Button variant="link" onClick={() => { setView('login'); setResetSent(false); setError(''); }} className="text-sm font-bold">
                                {lang === 'en' ? 'Back to Sign In' : 'Volver a Iniciar Sesión'}
                            </Button>
                        </div>
                    ) : view === 'forgot' ? (
                        <form onSubmit={handleForgotPassword} className="space-y-5">
                            <div>
                                <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{lang === 'en' ? 'Email' : 'Correo Electrónico'}</Label>
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="admin@vamosjaco.com"
                                    className="w-full bg-gray-50 dark:bg-black/20 border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 h-auto"
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 rounded-xl shadow-lg shadow-primary/20 gap-2 disabled:opacity-50"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        {lang === 'en' ? 'Sending...' : 'Enviando...'}
                                    </>
                                ) : (
                                    lang === 'en' ? 'Send Reset Link' : 'Enviar Enlace'
                                )}
                            </Button>

                            <Button type="button" variant="link" onClick={() => { setView('login'); setError(''); }} className="w-full text-center text-gray-500 text-sm hover:text-gray-700 dark:hover:text-gray-300 h-auto">
                                {lang === 'en' ? 'Back to Sign In' : 'Volver a Iniciar Sesión'}
                            </Button>
                        </form>
                    ) : !isDemo ? (
                        <form onSubmit={handleLogin} className="space-y-5">
                            <div>
                                <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{lang === 'en' ? 'Email' : 'Correo Electrónico'}</Label>
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="admin@vamosjaco.com"
                                    className="w-full bg-gray-50 dark:bg-black/20 border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 h-auto"
                                />
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">{lang === 'en' ? 'Password' : 'Contraseña'}</Label>
                                    <Button type="button" variant="link" onClick={() => { setView('forgot'); setError(''); }} className="text-xs font-bold h-auto">
                                        {lang === 'en' ? 'Forgot password?' : '¿Olvidaste tu contraseña?'}
                                    </Button>
                                </div>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        placeholder="••••••••"
                                        className="w-full bg-gray-50 dark:bg-black/20 border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 pr-12 h-auto"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 h-auto w-auto"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </Button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 rounded-xl shadow-lg shadow-primary/20 gap-2 disabled:opacity-50"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        {lang === 'en' ? 'Signing in...' : 'Iniciando sesión...'}
                                    </>
                                ) : (
                                    lang === 'en' ? 'Sign In' : 'Iniciar Sesión'
                                )}
                            </Button>
                        </form>
                    ) : (
                        <Button
                            variant="default"
                            onClick={() => onAuth()}
                            className="w-full py-3.5 rounded-xl shadow-lg shadow-primary/20 gap-2"
                        >
                            <Play className="w-5 h-5" />
                            {lang === 'en' ? 'Enter Demo' : 'Entrar en Demo'}
                        </Button>
                    )}
                </div>

                <p className="text-center text-gray-500 dark:text-gray-600 text-xs mt-6">
                    Protected area · Vamos Jacó Tours © {new Date().getFullYear()}
                </p>
            </div>
        </div>
    );
}
