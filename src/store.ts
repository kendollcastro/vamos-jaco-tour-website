import { atom } from 'nanostores';

export type Language = 'en' | 'es';

export const language = atom<Language>('en');

export const toggleLanguage = () => {
    language.set(language.get() === 'en' ? 'es' : 'en');
};

export const setLanguage = (lang: Language) => {
    language.set(lang);
};
