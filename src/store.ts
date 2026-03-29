import { atom } from 'nanostores';

export type Language = 'en' | 'es';

export const language = atom<Language>('en');

export const toggleLanguage = () => {
    const newLang = language.get() === 'en' ? 'es' : 'en';
    language.set(newLang);
    if (typeof window !== 'undefined') {
        localStorage.setItem('language', newLang);
    }
};

export const setLanguage = (lang: Language) => {
    language.set(lang);
    if (typeof window !== 'undefined') {
        localStorage.setItem('language', lang);
    }
};

export const initLanguage = () => {
    if (typeof window !== 'undefined') {
        const storedLang = localStorage.getItem('language') as Language | null;
        if (storedLang === 'en' || storedLang === 'es') {
            language.set(storedLang);
        }
    }
};

export type Theme = 'dark' | 'light';
export const theme = atom<Theme>('dark');

export const toggleTheme = () => {
    const newTheme = theme.get() === 'dark' ? 'light' : 'dark';
    theme.set(newTheme);
    if (typeof window !== 'undefined') {
        localStorage.setItem('theme', newTheme);
        // Centralized DOM manipulation
        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }
};

export const initTheme = () => {
    if (typeof window !== 'undefined') {
        const storedTheme = localStorage.getItem('theme') as Theme | null;
        const initialTheme = storedTheme || 'dark';
        theme.set(initialTheme);
        
        // Centralized DOM manipulation
        if (initialTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }
};
