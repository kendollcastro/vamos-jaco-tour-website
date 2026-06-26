import React from 'react';
import { useStore } from '@nanostores/react';
import { language } from '../store';
import { marked } from 'marked';

interface TranslatedMarkdownProps {
    content: { en: string; es: string } | string | undefined | null;
    fallback?: string;
    className?: string;
    inline?: boolean;
}

export default function TranslatedMarkdown({ content, fallback = '', className, inline = false }: TranslatedMarkdownProps) {
    const $language = useStore(language);
    const [mounted, setMounted] = React.useState(false);
    const [safeHtml, setSafeHtml] = React.useState('');

    React.useEffect(() => {
        setMounted(true);
    }, []);

    React.useEffect(() => {
        if (!mounted) return;

        let text = fallback;
        if (content) {
            if (typeof content === 'string') {
                text = content;
            } else {
                text = content[$language] || content.en;
            }
        }
        if (!text) text = fallback;
        if (!text) return;

        const rawHtml = (inline ? marked.parseInline(text) : marked.parse(text)) as string;

        import('dompurify').then((mod) => {
            setSafeHtml(mod.default.sanitize(rawHtml, { ADD_ATTR: ['target', 'rel'] }));
        });
    }, [mounted, $language, content, fallback, inline]);

    // During SSR / initial render, render raw markdown (no XSS risk from server content)
    if (!mounted) {
        if (!content) return null;
        let text = fallback;
        if (typeof content === 'string') {
            text = content;
        } else {
            text = content.en;
        }
        if (!text) text = fallback;
        if (!text) return null;

        const html = (inline ? marked.parseInline(text) : marked.parse(text)) as string;
        if (inline) {
            return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />;
        }
        return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />;
    }

    if (inline) {
        return <span className={className} dangerouslySetInnerHTML={{ __html: safeHtml }} />;
    }

    return (
        <div 
            className={className} 
            dangerouslySetInnerHTML={{ __html: safeHtml }} 
        />
    );
}
