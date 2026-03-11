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

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!content) return null;

    let text = fallback;
    if (typeof content === 'string') {
        text = content;
    } else {
        text = mounted ? (content[$language] || content.en) : content.en;
    }

    if (!text) text = fallback;
    if (!text) return null;

    const html = inline ? marked.parseInline(text) : marked.parse(text);

    if (inline) {
        return <span className={className} dangerouslySetInnerHTML={{ __html: html as string }} />;
    }

    return (
        <div 
            className={className} 
            dangerouslySetInnerHTML={{ __html: html as string }} 
        />
    );
}
