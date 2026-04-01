import { useState, useEffect, type ReactNode } from 'react';
import { supabase } from '../../lib/supabase';
import { useStore } from '@nanostores/react';
import { theme, toggleTheme, initTheme } from '../../store';
import AdminLogin from './AdminLogin';

type AdminView = 'dashboard' | 'tours' | 'bookings' | 'subscribers' | 'gallery' | 'team' | 'website' | 'emails';

interface Props {
    children?: ReactNode;
}

const NAV_ITEMS: { id: AdminView; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'tours', label: 'Tours', icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7' },
    { id: 'bookings', label: 'Bookings', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
    { id: 'subscribers', label: 'Subscribers', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { id: 'gallery', label: 'Gallery', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { id: 'team', label: 'Team', icon: 'M17 20h5V4H2v16h5m10 0v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5m10 0H7M12 11a4 4 0 100-8 4 4 0 000 8z' },
    { id: 'website', label: 'Components', icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z' },
    { id: 'emails', label: 'Email Tests', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
];

export default function AdminLayout({ children }: Props) {
    const [authenticated, setAuthenticated] = useState<boolean | null>(null);
    const [currentView, setCurrentView] = useState<AdminView>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('admin_view');
            if (saved && ['dashboard', 'tours', 'bookings', 'subscribers', 'gallery', 'team', 'website', 'emails'].includes(saved)) {
                return saved as AdminView;
            }
        }
        return 'dashboard';
    });
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [toast, setToast] = useState<{message: string, type?: 'info' | 'success'} | null>(null);

    const showToast = (message: string, type: 'info' | 'success' = 'info') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };
    const $theme = useStore(theme);

    useEffect(() => {
        initTheme();
    }, []);

    // Lazy-import view components
    const [DashboardView, setDashboardView] = useState<React.ComponentType | null>(null);
    const [ToursView, setToursView] = useState<React.ComponentType | null>(null);
    const [BookingsView, setBookingsView] = useState<React.ComponentType | null>(null);
    const [SubscribersView, setSubscribersView] = useState<React.ComponentType | null>(null);
    const [GalleryView, setGalleryView] = useState<React.ComponentType | null>(null);
    const [TeamView, setTeamView] = useState<React.ComponentType | null>(null);
    const [WebsiteComponentsView, setWebsiteComponentsView] = useState<React.ComponentType | null>(null);
    const [EmailsView, setEmailsView] = useState<React.ComponentType | null>(null);

    useEffect(() => {
        // If Supabase is not configured, skip auth and show login
        if (!supabase) {
            setAuthenticated(false);
            return;
        }

        supabase.auth.getSession().then(({ data: { session } }) => {
            setAuthenticated(!!session);
            if (session?.user?.email) setUserEmail(session.user.email);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setAuthenticated(!!session);
            if (session?.user?.email) setUserEmail(session.user.email);
        });

        return () => subscription.unsubscribe();
    }, []);

    // Load view components
    useEffect(() => {
        import('./DashboardStats').then((m) => setDashboardView(() => m.default));
        import('./TourList').then((m) => setToursView(() => m.default));
        import('./BookingsTable').then((m) => setBookingsView(() => m.default));
        import('./SubscribersTable').then((m) => setSubscribersView(() => m.default));
        import('./MediaGallery').then((m) => setGalleryView(() => m.default));
        import('./TeamManager').then((m) => setTeamView(() => m.default));
        import('./WebsiteComponents').then((m) => setWebsiteComponentsView(() => m.default));
        import('./EmailTester').then((m) => setEmailsView(() => m.default));
    }, []);

    async function handleLogout() {
        if (supabase) {
            await supabase.auth.signOut();
        }
        setAuthenticated(false);
    }

    if (authenticated === null) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-dark flex items-center justify-center transition-colors duration-300">
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
                : currentView === 'subscribers' ? SubscribersView
                    : currentView === 'team' ? TeamView
                        : currentView === 'website' ? WebsiteComponentsView
                            : currentView === 'emails' ? EmailsView
                                : GalleryView;

    return (
        <div className="min-h-screen font-sans text-gray-900 dark:text-white bg-gray-50 dark:bg-dark flex transition-premium">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-72 bg-white dark:bg-[#0A0A0A] border-r border-gray-200 dark:border-white/5
        transform transition-premium
        ${sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
                {/* Brand */}
                <div className="px-8 py-8 border-b border-gray-200 dark:border-white/5">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-2xl shadow-primary/40 ring-4 ring-primary/10">
                            <span className="text-white font-extrabold text-lg">VJ</span>
                        </div>
                        <div>
                            <h2 className="text-gray-900 dark:text-white font-heading font-extrabold text-lg leading-tight tracking-tight uppercase">Vamos Jacó</h2>
                            <p className="text-primary font-bold text-[10px] uppercase tracking-[0.2em] mt-0.5">Administrator</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    {NAV_ITEMS.filter(item => 
                        item.label.toLowerCase().includes(searchQuery.toLowerCase())
                    ).map((item) => (
                        <button
                            key={item.id}
                            onClick={() => { setCurrentView(item.id); setSidebarOpen(false); localStorage.setItem('admin_view', item.id); }}
                            className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-[14px] text-sm font-medium transition-all duration-300
                ${currentView === item.id
                                    ? 'bg-primary/10 text-primary translate-x-1'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 hover:translate-x-1'
                                }
              `}
                        >
                            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                            </svg>
                            {item.label}
                        </button>
                    ))}
                    {NAV_ITEMS.filter(item => item.label.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                        <div className="px-4 py-2 text-xs text-gray-500 italic">No sections found</div>
                    )}
                </nav>

                {/* Quick Actions & User */}
                <div className="px-4 py-6 border-t border-gray-200 dark:border-white/5">
                    {/* Quick Stats Widget */}
                    <div className="bg-gradient-to-br from-primary/10 to-brand-orange/10 dark:from-primary/20 dark:to-brand-orange/20 rounded-2xl p-4 mb-4 border border-primary/10">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            </div>
                            <span className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">Quick Note</span>
                        </div>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed font-medium">Use the "Create Tour" button above to add new adventures instantly.</p>
                    </div>

                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-orange/20 to-primary/20 flex items-center justify-center text-brand-orange text-sm font-bold shadow-sm border border-brand-orange/10">
                            {userEmail?.charAt(0)?.toUpperCase() || 'A'}
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-gray-900 dark:text-white text-sm font-bold truncate">{userEmail.split('@')[0] || 'Admin'}</span>
                            <span className="text-gray-500 dark:text-gray-500 text-[10px] truncate font-bold uppercase tracking-widest">Administrator</span>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/5 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden transition-colors duration-300 bg-gray-50 dark:bg-[#050505]">
                {/* Top Bar */}
                <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#050505]/95 backdrop-blur-xl border-b border-gray-200 dark:border-white/5 px-6 lg:px-12 py-5 flex items-center justify-between transition-premium">
                    <div className="flex items-center gap-4 flex-1">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        {/* Search Bar */}
                        <div className="hidden md:flex items-center bg-gray-50 dark:bg-[#111111] rounded-full px-5 py-2.5 w-80 border border-gray-200 dark:border-white/5 focus-within:border-primary transition-all duration-300 hover:bg-gray-100 dark:hover:bg-white/5 focus-within:w-96 shadow-sm">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            <input 
                                type="text" 
                                placeholder="Search sections, tours..." 
                                className="bg-transparent border-none outline-none text-sm text-gray-900 dark:text-white ml-3 w-full placeholder-gray-400 dark:placeholder-gray-500 font-bold uppercase tracking-widest text-[10px]" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={() => showToast('You are all caught up! No recent alerts.')} className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-[#111111] border border-gray-200 dark:border-white/5 text-gray-500 dark:text-gray-400 hover:text-primary transition-all" aria-label="Notifications">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                        </button>
                        
                        <button onClick={() => setCurrentView('tours')} className="hidden sm:flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-premium shadow-xl hover:-translate-y-0.5 shadow-primary/20 hover:shadow-primary/40 active:scale-95 leading-none">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                            </svg>
                            Create Tour
                        </button>

                        <div className="w-px h-6 bg-gray-200 dark:bg-white/10 hidden sm:block"></div>

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className={`
                                flex items-center gap-2 p-1.5 pr-3 rounded-full border transition-all duration-300
                                ${$theme === 'dark' 
                                    ? 'bg-primary/20 border-primary/20 text-primary shadow-inner' 
                                    : 'bg-white border-gray-200 text-gray-700 shadow-sm'}
                            `}
                            aria-label="Toggle Theme"
                            title={$theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                        >
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-500 ${$theme === 'dark' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'}`}>
                                {$theme === 'dark' ? (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg> // Moon for Dark mode (current state)
                                ) : (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg> // Sun for Light mode (current state)
                                )}
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest translate-y-[0.5px]">
                                {$theme === 'dark' ? 'Dark' : 'Light'}
                            </span>
                        </button>

                        <a
                            href="/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-gray-500 dark:text-gray-500 hover:text-brand-teal transition flex items-center gap-1 font-medium bg-gray-100 dark:bg-white/5 px-3 py-1.5 rounded-full"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            View Site
                        </a>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 p-4 lg:p-8 overflow-auto">
                    {ActiveView ? (
                        // @ts-ignore: Dynamic views may or may not accept onNavigate/onToast
                        <ActiveView onNavigate={setCurrentView} onToast={showToast} /> 
                    ) : (
                        <div className="flex items-center justify-center h-64">
                            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        </div>
                    )}
                </div>
                
                {/* Global Toast Notification */}
                <div className={`fixed bottom-6 right-6 z-[100] transition-all duration-300 transform ${toast ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0 pointer-events-none'}`}>
                    {toast && (
                        <div className="flex items-center gap-3 px-5 py-4 bg-gray-900 dark:bg-[#111111] border border-gray-700 dark:border-white/10 shadow-2xl rounded-2xl">
                            {toast.type === 'success' ? (
                                <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                </div>
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                            )}
                            <p className="text-white text-sm font-medium tracking-wide">{toast.message}</p>
                            <button onClick={() => setToast(null)} className="ml-2 text-gray-500 hover:text-white transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
