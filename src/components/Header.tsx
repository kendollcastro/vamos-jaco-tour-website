import React, { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { language, toggleLanguage } from '../store';
import { Globe, Menu, X } from 'lucide-react';
import { clsx } from 'clsx';

export default function Header() {
    const $language = useStore(language);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Prevent scrolling when menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isMobileMenuOpen]);

    const navLinks = [
        { href: '/', label: $language === 'en' ? 'Home' : 'Inicio' },
        { href: '/tours', label: 'Tours' },
        { href: '/about', label: $language === 'en' ? 'About' : 'Nosotros' },
        { href: '/contact', label: $language === 'en' ? 'Contact' : 'Contacto' },
    ];

    return (
        <header
            className={clsx(
                "fixed w-full top-0 z-50 transition-all duration-300",
                (isScrolled || isMobileMenuOpen) ? "bg-dark-soft/90 backdrop-blur-md shadow-sm py-2" : "bg-gradient-to-b from-black/50 to-transparent py-4"
            )}
        >
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between relative z-50">
                <div className="flex items-center gap-2">
                    {/* Logo */}
                    <a href="/" className="flex items-center gap-2 transition-transform hover:scale-105">
                        <img
                            src="/logo.png"
                            alt="Vamos Jacó Tours Logo"
                            className="h-14 md:h-16 w-auto object-contain"
                            onError={(e) => {
                                // Fallback to text if logo.png doesn't exist yet
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.parentElement?.classList.add('text-2xl', 'font-bold', isScrolled || isMobileMenuOpen ? 'text-primary' : 'text-white', 'drop-shadow-md');
                                if (e.currentTarget.parentElement) {
                                    e.currentTarget.parentElement.innerHTML = 'Vamos Jacó';
                                }
                            }}
                        />
                    </a>
                </div>

                {/* Desktop Navigation — Centered Pill */}
                <div className={clsx(
                    "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden lg:flex items-center gap-8 px-8 py-3 rounded-full transition-colors border text-sm font-bold tracking-wide uppercase",
                    isScrolled ? "bg-white/10 border-white/20 text-white" : "bg-white/10 border-white/30 text-white backdrop-blur-sm"
                )}>
                    {navLinks.map((link) => (
                        <a key={link.href} href={link.href} className="hover:text-primary transition-colors">{link.label}</a>
                    ))}
                </div>

                {/* Right Side Controls */}
                <nav className="flex items-center gap-4">
                    <button
                        onClick={toggleLanguage}
                        className={clsx(
                            "flex items-center gap-2 px-4 py-2 rounded-full transition-colors border text-sm font-medium",
                            (isScrolled || isMobileMenuOpen) ? "bg-white/10 hover:bg-white/20 border-white/20 text-white" : "bg-white/10 hover:bg-white/20 border-white/30 text-white backdrop-blur-sm"
                        )}
                    >
                        <Globe className="w-4 h-4" />
                        <span>{$language === 'en' ? 'EN' : 'ES'}</span>
                    </button>

                    {/* Mobile Hamburger Button */}
                    <button
                        className="lg:hidden p-2 text-white transition-colors"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </nav>
            </div>

            {/* Mobile Menu — Fullscreen Overlay */}
            <div className={clsx(
                "fixed inset-0 top-0 left-0 w-full h-screen lg:hidden flex flex-col items-center justify-center pt-20 pb-10 transition-all duration-500 ease-in-out",
                isMobileMenuOpen
                    ? "bg-dark opacity-100 pointer-events-auto z-[45]"
                    : "bg-transparent opacity-0 pointer-events-none -translate-y-full z-[45]"
            )}>
                <div className="flex flex-col items-center gap-8 text-3xl font-black tracking-wider text-white uppercase">
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="hover:text-primary transition-all duration-200 transform hover:scale-110"
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

                {/* WhatsApp CTA in mobile menu */}
                <a
                    href="https://wa.me/50685858462"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-12 inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-8 rounded-full transition-all duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.319 0-4.478-.677-6.309-1.834l-.452-.274-2.645.887.887-2.645-.274-.452A9.955 9.955 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z" /></svg>
                    WhatsApp
                </a>
            </div>
        </header>
    );
}
