import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function stripMarkdown(text: string): string {
    return text
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/\*\*(.+?)\*\*/g, '$1')
        .replace(/__(.+?)__/g, '$1')
        .replace(/\*(.+?)\*/g, '$1')
        .replace(/_(.+?)_/g, '$1')
        .replace(/~~(.+?)~~/g, '$1')
        .replace(/`{1,3}(.+?)`{1,3}/g, '$1')
        .replace(/^[#]+[ \t]+/gm, '')
        .replace(/^>[ \t]+/gm, '')
        .replace(/^[\s]*[-*+][ \t]+/gm, '')
        .replace(/^[\s]*\d+\.[ \t]+/gm, '')
        .replace(/\n{2,}/g, ' ')
        .replace(/\n/g, ' ')
        .replace(/[ \t]+/g, ' ')
        .trim();
}

export function getMetaDescription(
    textOrSeo: string | { description?: string } | null | undefined,
    fallback?: string
): string {
    let raw = '';

    if (typeof textOrSeo === 'string') {
        raw = textOrSeo;
    } else if (textOrSeo && typeof textOrSeo.description === 'string') {
        raw = textOrSeo.description;
    } else if (fallback) {
        raw = fallback;
    } else {
        return defaultMetaDescription;
    }

    const cleaned = stripMarkdown(raw);

    if (cleaned.length <= 160) return cleaned;

    const truncated = cleaned.substring(0, 157);
    const lastSpace = truncated.lastIndexOf(' ');
    if (lastSpace >= 140) {
        return cleaned.substring(0, lastSpace) + '...';
    }
    return cleaned.substring(0, 157) + '...';
}

export const defaultMetaDescription =
    'Explore the best adventure tours in Jacó, Costa Rica. ATV rides, jet ski, surfing, flyboard, and more. Book your unforgettable experience today!';
