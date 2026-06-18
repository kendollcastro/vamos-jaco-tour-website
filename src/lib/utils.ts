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
