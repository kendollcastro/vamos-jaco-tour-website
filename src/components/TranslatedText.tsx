import React, { type ElementType } from 'react';
import { useStore } from '@nanostores/react';
import { language } from '../store';

interface TranslatedTextProps {
    content: { en: string; es: string } | string | undefined | null;
    fallback?: string;
    className?: string;
    as?: ElementType;
}

export default function TranslatedText({ content, fallback = '', className, as: Component = 'span' }: TranslatedTextProps) {
    const $language = useStore(language);
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!content) return <>{fallback}</>;

    let text = fallback;
    if (typeof content === 'string') {
        text = content;
    } else {
        // Hydrate only after mount to prevent hydration mismatch with Astro static SSG
        text = mounted ? (content[$language] || content.en) : content.en;
    }

    if (!text) text = fallback;

    if (Component === 'span' && !className) return <>{text}</>;

    return React.createElement(Component, { className }, text);
}
