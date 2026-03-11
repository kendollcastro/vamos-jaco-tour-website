import { useState, useEffect, type ReactNode } from 'react';
import { supabase } from '../../lib/supabase';
import { useStore } from '@nanostores/react';
import { theme, toggleTheme, initTheme } from '../../store';
import AdminLogin from './AdminLogin';

type AdminView = 'dashboard' | 'tours' | 'bookings' | 'gallery' | 'team' | 'website';

interface Props {
    children?: ReactNode;
}

const NAV_ITEMS: { id: AdminView; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'tours', label: 'Tours', icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7' },
    { id: 'bookings', label: 'Bookings', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
    { id: 'gallery', label: 'Gallery', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { id: 'team', label: 'Team', icon: 'M17 20h5V4H2v16h5m10 0v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5m10 0H7M12 11a4 4 0 100-8 4 4 0 000 8z' },
    { id: 'website', label: 'Components', icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z' },
];

export default function AdminLayout({ children }: Props) {
    const [authenticated, setAuthenticated] = useState<boolean | null>(null);
    const [currentView, setCurrentView] = useState<AdminView>('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const $theme = useStore(theme);

    useEffect(() => {
        initTheme();
    }, []);

    // Lazy-import view components
    const [DashboardView, setDashboardView] = useState<React.ComponentType | null>(null);
    const [ToursView, setToursView] = useState<React.ComponentType | null>(null);
    const [BookingsView, setBookingsView] = useState<React.ComponentType | null>(null);
    const [GalleryView, setGalleryView] = useState<React.ComponentType | null>(null);
    const [TeamView, setTeamView] = useState<React.ComponentType | null>(null);
    const [WebsiteComponentsView, setWebsiteComponentsView] = useState<React.ComponentType | null>(null);

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
        import('./MediaGallery').then((m) => setGalleryView(() => m.default));
        import('./TeamManager').then((m) => setTeamView(() => m.default));
        import('./WebsiteComponents').then((m) => setWebsiteComponentsView(() => m.default));
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
                : currentView === 'team' ? TeamView
                    : currentView === 'website' ? WebsiteComponentsView
                        : GalleryView;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark flex transition-colors duration-300">
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
        w-64 bg-white dark:bg-dark-soft border-r border-gray-200 dark:border-white/5
        transform transition-transform duration-300 ease-out
        ${sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
                {/* Brand */}
                <div className="px-6 py-6 border-b border-gray-200 dark:border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                            <span className="text-white font-black text-sm">VJ</span>
                        </div>
                        <div>
                            <h2 className="text-gray-900 dark:text-white font-bold text-sm leading-tight">Vamos Jacó</h2>
                            <p className="text-gray-500 dark:text-gray-500 text-[11px]">Admin Panel</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-2">
                    {NAV_ITEMS.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => { setCurrentView(item.id); setSidebarOpen(false); }}
                            className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-[14px] text-sm font-medium transition-all
                ${currentView === item.id
                                    ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
                                }
              `}
                        >
                            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                            </svg>
                            {item.label}
                        </button>
                    ))}
                </nav>

                {/* Storage & User */}
                <div className="px-4 py-6 border-t border-gray-200 dark:border-white/5">
                    {/* Storage Indicator */}
                    <div className="bg-gray-50 dark:bg-black/20 rounded-2xl p-4 mb-4 border border-gray-100 dark:border-white/5">
                        <div className="flex justify-between items-center text-xs mb-2">
                            <span className="text-gray-500 dark:text-gray-400 font-medium">Storage</span>
                            <span className="text-gray-900 dark:text-white font-bold">68%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-white/10 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-brand-teal h-1.5 rounded-full" style={{ width: '68%' }}></div>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-2">17GB of 25GB Used</p>
                    </div>

                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="w-10 h-10 rounded-full bg-brand-orange/20 flex items-center justify-center text-brand-orange text-sm font-bold shadow-sm">
                            {userEmail?.charAt(0)?.toUpperCase() || 'A'}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-gray-900 dark:text-white text-sm font-bold truncate">Admin User</span>
                            <span className="text-gray-500 dark:text-gray-500 text-xs truncate font-medium">Manager</span>
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
            <main className="flex-1 flex flex-col h-screen overflow-hidden transition-colors duration-300">
                {/* Top Bar */}
                <header className="sticky top-0 z-30 bg-white/80 dark:bg-dark/80 backdrop-blur-md border-b border-gray-200 dark:border-white/5 px-4 lg:px-8 py-4 flex items-center justify-between transition-colors duration-300">
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
                        <div className="hidden md:flex items-center bg-gray-50 dark:bg-dark-soft rounded-full px-5 py-2.5 w-80 border border-gray-200 dark:border-white/5 focus-within:border-primary transition-colors hover:bg-gray-100 dark:hover:bg-white/5">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            <input type="text" placeholder="Search tours, bookings, customers..." className="bg-transparent border-none outline-none text-sm text-gray-900 dark:text-white ml-3 w-full placeholder-gray-500" />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="hidden sm:flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 active:scale-95">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                            </svg>
                            Create Tour
                        </button>

                        <div className="w-px h-6 bg-gray-200 dark:bg-white/10 hidden sm:block"></div>

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2.5 rounded-xl bg-gray-50 dark:bg-dark-soft border border-gray-200 dark:border-white/5 text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-all shadow-sm"
                            aria-label="Toggle Theme"
                            title="Toggle Theme"
                        >
                            {$theme === 'dark' ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg> // Sun
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg> // Moon
                            )}
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
                    {ActiveView ? <ActiveView /> : (
                        <div className="flex items-center justify-center h-64">
                            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
