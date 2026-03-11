import type { Tour } from '../data/tours';

export const WP_API_URL = import.meta.env.PUBLIC_WORDPRESS_URL || 'https://admin.vamosjaco.com/wp-json/wp/v2';

// WP Post Interface
export interface WPPost {
    id: number;
    slug: string;
    title: { rendered: string };
    content: { rendered: string };
    acf?: any;
    _embedded?: any;
    status: string;
}

export async function getWPTours(): Promise<Tour[]> {
    try {
        // Fetch 'tour' custom post type
        // Note: You must register CPT 'tour' with 'show_in_rest' => true
        const res = await fetch(`${WP_API_URL}/tour?_embed&per_page=100`);

        if (!res.ok) {
            console.warn('WordPress API not reachable or "tour" endpoint missing. Falling back...');
            return [];
        }

        const posts: WPPost[] = await res.json();

        return posts.map(mapWPPostToTour);

    } catch (error) {
        console.error('Error fetching WP tours:', error);
        return [];
    }
}

export async function getWPTourBySlug(slug: string): Promise<Tour | null> {
    try {
        const res = await fetch(`${WP_API_URL}/tour?slug=${slug}&_embed`);
        if (!res.ok) throw new Error('Failed to fetch tour');

        const posts: WPPost[] = await res.json();
        if (posts.length === 0) return null;

        return mapWPPostToTour(posts[0]);

    } catch (error) {
        console.error('Error fetching WP tour by slug:', error);
        return null;
    }
}

function mapWPPostToTour(post: WPPost): Tour {
    const acf = post.acf || {};

    // Helper to get image URL
    let image_url = '/images/placeholder-tour.jpg'; // Default
    if (post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'][0]) {
        image_url = post._embedded['wp:featuredmedia'][0].source_url;
    }

    return {
        id: post.slug, // Mapping slug to ID
        title: {
            en: post.title.rendered,
            es: acf.title_es || post.title.rendered // Fallback
        },
        price: Number(acf.price) || 0,
        originalPrice: acf.original_price ? Number(acf.original_price) : undefined,
        image_url: image_url,
        location: acf.location || '',
        duration: acf.duration || '',
        description: {
            en: post.content.rendered.replace(/<[^>]*>?/gm, ''), // Strip HTML for summary if needed, or keep it. Current usage in [id].astro might expect plain text or HTML.
            // Actually, description in tours.ts is plain text mostly. 
            // Let's strip tags for now or keep generic.
            // WP content is usually HTML.
            es: acf.description_es || ''
        },
        badge: (acf.badge_text && acf.badge_color) ? {
            text: acf.badge_text,
            color: acf.badge_color // Ensure it matches 'red'|'yellow'|'green' logic or add validation
        } : undefined,
        pricing_options: Array.isArray(acf.pricing_options) ? acf.pricing_options.map((opt: any) => ({
            duration: opt.duration,
            price: Number(opt.price)
        })) : [],
        category: acf.category || 'atv', // Default to ATV if missing
        highlights: {
            en: Array.isArray(acf.highlights_en) ? acf.highlights_en.map((h: any) => h.text) : [],
            es: Array.isArray(acf.highlights_es) ? acf.highlights_es.map((h: any) => h.text) : []
        },
        includes: {
            en: Array.isArray(acf.includes_en) ? acf.includes_en.map((h: any) => h.text) : [],
            es: Array.isArray(acf.includes_es) ? acf.includes_es.map((h: any) => h.text) : []
        }
    };
}
