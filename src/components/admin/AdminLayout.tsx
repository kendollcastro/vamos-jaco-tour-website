import { useState, useEffect, type ReactNode } from 'react';
import { supabase } from '../../lib/supabase';
import { useStore } from '@nanostores/react';
import { theme, toggleTheme, initTheme, language, setLanguage, initLanguage } from '../../store';
import { adminTranslations } from '../../lib/admin-translations';
import AdminLogin from './AdminLogin';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import {
    Sheet,
    SheetContent,
} from '../ui/sheet';
import {
    LayoutDashboard,
    Mountain,
    Calendar,
    Mail,
    Image,
    Users,
    Code,
    Monitor,
    DollarSign,
    Menu,
    Search,
    Bell,
    Plus,
    Sun,
    Moon,
    Globe,
    ExternalLink,
    LogOut,
    BookOpen,
    History,
    Shield,
    Settings,
} from 'lucide-react';

type AdminView = 'dashboard' | 'tours' | 'bookings' | 'calendar' | 'subscribers' | 'gallery' | 'team' | 'website' | 'emails' | 'commissions' | 'auditLog' | 'users' | 'profile' | 'roles';

interface Props {
    children?: ReactNode;
}

const NAV_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
    dashboard: LayoutDashboard,
    tours: Mountain,
    bookings: BookOpen,
    calendar: Calendar,
    subscribers: Mail,
    gallery: Image,
    team: Users,
    website: Code,
    emails: Monitor,
    commissions: DollarSign,
    auditLog: History,
    users: Shield,
    profile: Settings,
    roles: Shield,
};

const ALL_NAV_ITEMS = (t: typeof adminTranslations.en) => [
    { id: 'dashboard' as AdminView, label: t.nav.dashboard },
    { id: 'tours' as AdminView, label: t.nav.tours },
    { id: 'bookings' as AdminView, label: t.nav.bookings },
    { id: 'calendar' as AdminView, label: 'Calendar' },
    { id: 'subscribers' as AdminView, label: t.nav.subscribers },
    { id: 'gallery' as AdminView, label: t.nav.gallery },
    { id: 'team' as AdminView, label: t.nav.team },
    { id: 'website' as AdminView, label: t.nav.components },
    { id: 'emails' as AdminView, label: t.nav.emailTests },
    { id: 'commissions' as AdminView, label: t.nav.commissions },
    { id: 'auditLog' as AdminView, label: t.nav.auditLog },
    { id: 'users' as AdminView, label: t.nav.users },
    { id: 'profile' as AdminView, label: t.nav.profile },
    { id: 'roles' as AdminView, label: 'Roles' },
];

const VALID_VIEWS = ALL_NAV_ITEMS({ nav: {} } as any).map(i => i.id);

export default function AdminLayout({ children }: Props) {
    const [authenticated, setAuthenticated] = useState<boolean | null>(null);
    const [currentView, setCurrentView] = useState<AdminView>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('admin_view');
            if (saved && (VALID_VIEWS as string[]).includes(saved)) {
                return saved as AdminView;
            }
        }
        return 'dashboard';
    });
    const [userEmail, setUserEmail] = useState('');
    const [userName, setUserName] = useState(() => {
        if (typeof window !== 'undefined') return localStorage.getItem('user_full_name') || '';
        return '';
    });
    const [userRole, setUserRole] = useState<string>('secretary');
    const [userPermissions, setUserPermissions] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [toast, setToast] = useState<{ message: string; type?: 'info' | 'success' } | null>(null);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    const showToast = (message: string, type: 'info' | 'success' = 'info') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const $theme = useStore(theme);
    const $language = useStore(language);
    const t = adminTranslations[$language];
    
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);
    const lang = mounted ? $language : 'en';

    useEffect(() => {
        initTheme();
        initLanguage();
    }, []);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') return;

            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
                searchInput?.focus();
            }
            if (e.key === 'Escape') setSearchQuery('');
            if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
                e.preventDefault();
                setMobileSidebarOpen(prev => !prev);
            }

            const keyMap: Record<string, AdminView> = {
                g: 'dashboard', t: 'tours', r: 'bookings',
                c: 'calendar', s: 'subscribers', m: 'commissions',
            };
            if (e.key in keyMap && !e.metaKey && !e.ctrlKey) {
                e.preventDefault();
                setCurrentView(keyMap[e.key]);
            }
            if (e.key === 'g' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setCurrentView('gallery');
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Track current user ID to detect user switches
    const [userId, setUserId] = useState<string | null>(null);

    // Auth + track userId
    useEffect(() => {
        if (!supabase) {
            setAuthenticated(false);
            return;
        }
        const savedRole = localStorage.getItem('user_role');
        if (savedRole === 'admin' || savedRole === 'secretary') setUserRole(savedRole);

        supabase.auth.getSession().then(({ data: { session } }) => {
            setAuthenticated(!!session);
            if (session?.user?.email) setUserEmail(session.user.email);
            if (session?.user?.user_metadata?.full_name) setUserName(session.user.user_metadata.full_name);
            if (session?.user?.id) setUserId(session.user.id);
        });
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setAuthenticated(!!session);
            if (session?.user?.email) setUserEmail(session.user.email);
            if (session?.user?.user_metadata?.full_name) setUserName(session.user.user_metadata.full_name);
            if (session?.user?.id) setUserId(session.user.id);
            if (!session) {
                // User logged out — reset stale state
                setUserRole('secretary');
                setUserPermissions([]);
                setUserName('');
                setUserEmail('');
                setUserId(null);
                localStorage.removeItem('user_role');
                localStorage.removeItem('user_full_name');
            }
        });
        return () => subscription.unsubscribe();
    }, []);

    // Fetch role and merged permissions from server (runs on mount AND on user switch)
    useEffect(() => {
        if (!supabase || !userId) {
            if (!userId) setUserRole('admin');
            return;
        }
        let cancelled = false;

        async function loadSession() {
            let token: string | undefined;
            try {
                const raw = localStorage.getItem('sb-ddukdjdiqjvfjywuhnpn-auth-token');
                if (raw) {
                    const parsed = JSON.parse(raw);
                    token = parsed.access_token;
                }
            } catch {}

            const headers: Record<string, string> = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            try {
                const meRes = await fetch('/api/admin/me', { headers });
                const meData = await meRes.json();
                if (cancelled) return;
                if (meData.authenticated && meData.role) {
                    setUserRole(meData.role);
                    setUserName(meData.name || '');
                    setUserPermissions(meData.permissions || []);
                    localStorage.setItem('user_role', meData.role);
                    localStorage.setItem('user_full_name', meData.name || '');
                } else {
                    setUserRole('secretary');
                    setUserPermissions([]);
                }
            } catch (err) {
                console.error('Failed to fetch admin role:', err);
            }
        }

        loadSession();
        return () => { cancelled = true; };
    }, [userId]);

    // Lazy-import view components
    const [DashboardView, setDashboardView] = useState<React.ComponentType | null>(null);
    const [ToursView, setToursView] = useState<React.ComponentType | null>(null);
    const [BookingsView, setBookingsView] = useState<React.ComponentType | null>(null);
    const [CalendarView, setCalendarView] = useState<React.ComponentType | null>(null);
    const [SubscribersView, setSubscribersView] = useState<React.ComponentType | null>(null);
    const [GalleryView, setGalleryView] = useState<React.ComponentType | null>(null);
    const [TeamView, setTeamView] = useState<React.ComponentType | null>(null);
    const [WebsiteComponentsView, setWebsiteComponentsView] = useState<React.ComponentType | null>(null);
    const [EmailsView, setEmailsView] = useState<React.ComponentType | null>(null);
    const [CommissionsView, setCommissionsView] = useState<React.ComponentType | null>(null);
    const [AuditLogView, setAuditLogView] = useState<React.ComponentType | null>(null);
    const [UserManagerView, setUserManagerView] = useState<React.ComponentType | null>(null);
    const [ProfileSettingsView, setProfileSettingsView] = useState<React.ComponentType | null>(null);
    const [PermissionsView, setPermissionsView] = useState<React.ComponentType | null>(null);

    useEffect(() => {
        import('./DashboardStats').then((m) => setDashboardView(() => m.default));
        import('./TourList').then((m) => setToursView(() => m.default));
        import('./BookingsTable').then((m) => setBookingsView(() => m.default));
        import('./CalendarView').then((m) => setCalendarView(() => m.default));
        import('./SubscribersTable').then((m) => setSubscribersView(() => m.default));
        import('./MediaGallery').then((m) => setGalleryView(() => m.default));
        import('./TeamManager').then((m) => setTeamView(() => m.default));
        import('./WebsiteComponents').then((m) => setWebsiteComponentsView(() => m.default));
        import('./EmailTester').then((m) => setEmailsView(() => m.default));
        import('./CommissionsTable').then((m) => setCommissionsView(() => m.default));
        import('./AuditLogView').then((m) => setAuditLogView(() => m.default));
        import('./UserManager').then((m) => setUserManagerView(() => m.default));
        import('./ProfileSettings').then((m) => setProfileSettingsView(() => m.default));
        import('./PermissionsManager').then((m) => setPermissionsView(() => m.default));
    }, []);

    async function handleLogout() {
        if (supabase) await supabase.auth.signOut();
        setAuthenticated(false);
        setUserRole('secretary');
        setUserPermissions([]);
        setUserName('');
        setUserEmail('');
        setUserId(null);
        localStorage.removeItem('user_role');
        localStorage.removeItem('user_full_name');
    }

    if (authenticated === null) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!authenticated) {
        return <AdminLogin onAuth={() => setAuthenticated(true)} />;
    }

    const ActiveView = currentView === 'dashboard' ? DashboardView
        : currentView === 'tours' ? ToursView
            : currentView === 'bookings' ? BookingsView
                : currentView === 'calendar' ? CalendarView
                    : currentView === 'subscribers' ? SubscribersView
                        : currentView === 'team' ? TeamView
                            : currentView === 'website' ? WebsiteComponentsView
                                : currentView === 'emails' ? EmailsView
                                    : currentView === 'commissions' ? CommissionsView
                                        : currentView === 'auditLog' ? AuditLogView
                                            : currentView === 'users' ? UserManagerView
                                                : currentView === 'profile' ? ProfileSettingsView
                                                    : currentView === 'gallery' ? GalleryView
                                                        : currentView === 'roles' ? PermissionsView
                                                            : DashboardView;

    const navItems = ALL_NAV_ITEMS(t as any).filter(item =>
        userPermissions.includes(item.id) || userRole === 'admin'
    ).filter(item =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const NavContent = ({ onNavigate }: { onNavigate?: (view: AdminView) => void }) => (
        <>
            {/* Brand */}
            <div className="px-6 py-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                    <span className="text-primary-foreground font-extrabold text-sm">VJ</span>
                </div>
                <div className="flex flex-col">
                    <h2 className="font-bold text-sm leading-tight text-foreground uppercase">Vamos Jacó</h2>
                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Administrator</p>
                </div>
            </div>

            <Separator />

            {/* Search */}
            <div className="px-4 py-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder={t.common.search}
                        className="pl-9 h-9 text-xs"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setIsSearchFocused(false)}
                    />
                </div>
            </div>

            {/* Navigation */}
            <ScrollArea className="flex-1 px-3">
                <div className="space-y-1 pb-4">
                    {navItems.map((item) => {
                        const Icon = NAV_ICONS[item.id];
                        const isActive = currentView === item.id;
                        return (
                            <Button
                                key={item.id}
                                variant="ghost"
                                size="sm"
                                className={cn(
                                    'w-full justify-start gap-3 h-10 text-sm font-medium',
                                    isActive
                                        ? 'bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-accent',
                                )}
                                onClick={() => {
                                    setCurrentView(item.id);
                                    localStorage.setItem('admin_view', item.id);
                                    onNavigate?.(item.id);
                                }}
                            >
                                {Icon && <Icon className="h-4 w-4 shrink-0" />}
                                {item.label}
                            </Button>
                        );
                    })}
                    {navItems.length === 0 && (
                        <p className="px-4 py-2 text-xs text-muted-foreground italic">
                            {t.common.noData}
                        </p>
                    )}
                </div>
            </ScrollArea>

            <Separator />

            {/* User */}
            <div className="p-4 space-y-3">
                <div className="flex items-center gap-3 px-2">
                    <Avatar className="h-9 w-9 rounded-lg">
                        <AvatarFallback className="rounded-lg bg-gradient-to-br from-orange-500/20 to-primary/20 text-orange-600 text-xs font-bold">
                            {userEmail?.charAt(0)?.toUpperCase() || 'A'}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col min-w-0">
                        <span className="text-sm font-bold text-foreground truncate">
                            {userName || userEmail.split('@')[0] || 'Admin'}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                            {userRole === 'admin' ? 'Admin' : 'Secretary'}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={toggleTheme}
                        className="flex-1 gap-2 h-9 text-xs font-medium"
                    >
                        {$theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                        {$theme === 'dark' ? 'Light' : 'Dark'}
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setLanguage(lang === 'en' ? 'es' : 'en')}
                        className="flex-1 gap-2 h-9 text-xs font-medium"
                    >
                        <Globe className="h-4 w-4" />
                        {lang === 'en' ? 'ES' : 'EN'}
                    </Button>
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="w-full gap-2 h-9 text-xs font-medium text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20"
                >
                    <LogOut className="h-4 w-4" />
                    {t.sidebar.logout || 'Logout'}
                </Button>
            </div>
        </>
    );

    return (
        <div className="min-h-screen bg-background text-foreground flex">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex lg:flex-col lg:w-64 border-r border-muted-foreground/15 bg-card">
                <NavContent />
            </aside>

            {/* Mobile Sidebar */}
            <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
                <SheetContent side="left" className="w-72 p-0">
                    <NavContent onNavigate={() => setMobileSidebarOpen(false)} />
                </SheetContent>
            </Sheet>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Top Bar */}
                <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-xl border-b border-muted-foreground/15 px-4 lg:px-8 py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                        <Button variant="ghost" size="icon" onClick={() => setMobileSidebarOpen(true)} className="lg:hidden">
                            <Menu className="h-5 w-5" />
                        </Button>

                        <div className="hidden md:flex relative w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder={t.common.search}
                                className="pl-9 h-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setIsSearchFocused(true)}
                                onBlur={() => setIsSearchFocused(false)}
                            />
                            <kbd className={cn(
                                'absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-muted text-muted-foreground text-[10px] font-medium transition-opacity',
                                isSearchFocused ? 'opacity-0' : 'opacity-100',
                            )}>
                                ⌘K
                            </kbd>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => showToast(t.notifications.noAlerts)} className="hidden sm:flex">
                            <Bell className="h-4 w-4" />
                        </Button>

                        <Button
                            size="sm"
                            onClick={() => setCurrentView('tours')}
                            className="hidden sm:inline-flex gap-2 h-9 text-xs font-bold uppercase tracking-widest"
                        >
                            <Plus className="h-4 w-4" strokeWidth={3} />
                            {t.common.createTour}
                        </Button>

                        <div className="h-5 w-px bg-border hidden sm:block" />

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={toggleTheme}
                            className="hidden sm:inline-flex gap-2 h-9 px-3 text-xs font-medium"
                        >
                            <div className={cn(
                                'w-7 h-7 rounded-full flex items-center justify-center transition-all',
                                $theme === 'dark' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
                            )}>
                                {$theme === 'dark' ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest">
                                {$theme === 'dark' ? 'Dark' : 'Light'}
                            </span>
                        </Button>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setLanguage(lang === 'en' ? 'es' : 'en')}
                            className="hidden sm:inline-flex gap-1.5 h-9 px-3 text-xs font-bold uppercase tracking-widest"
                        >
                            <Globe className="h-3.5 w-3.5" />
                            {lang === 'en' ? 'EN' : 'ES'}
                        </Button>

                        <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex gap-1.5 h-9 px-3 text-xs font-medium">
                            <a href="/" target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3.5 w-3.5" />
                                {t.common.viewSite}
                            </a>
                        </Button>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 p-4 lg:px-6 lg:py-8 overflow-auto">
                    {ActiveView ? (
                        <div className="mx-auto w-full">
                            <ActiveView onNavigate={setCurrentView} onToast={showToast} />
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-64">
                            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        </div>
                    )}
                </div>

                {/* Global Toast */}
                <div className={cn(
                    'fixed bottom-6 right-6 z-[100] transition-all duration-300',
                    toast ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0 pointer-events-none',
                )}>
                    {toast && (
                        <div className="flex items-center gap-3 px-5 py-4 rounded-lg border border-border/20 bg-card text-card-foreground shadow-2xl">
                            <div className={cn(
                                'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
                                toast.type === 'success' ? 'bg-emerald-500/10' : 'bg-blue-500/10',
                            )}>
                                <svg className={cn(
                                    'w-4 h-4',
                                    toast.type === 'success' ? 'text-emerald-500' : 'text-blue-500',
                                )} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d={toast.type === 'success' ? 'M5 13l4 4L19 7' : 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'} />
                                </svg>
                            </div>
                            <p className="text-sm font-medium">{toast.message}</p>
                            <Button variant="ghost" size="icon" onClick={() => setToast(null)} className="ml-2 h-8 w-8">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </Button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
