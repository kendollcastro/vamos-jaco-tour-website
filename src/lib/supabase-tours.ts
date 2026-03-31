import { supabase, supabaseAdmin } from './supabase';
import type { Tour, TourCategory } from '../data/tours';

/* ─── DB Row shape ─────────────────────────────────────────── */
export interface TourRow {
    id: string;
    slug: string;
    name_en: string;
    name_es: string;
    description_en: string;
    description_es: string;
    price_base: number;
    original_price: number | null;
    image_url: string;
    location: string;
    duration: string;
    category: string;
    badge_text: string | null;
    badge_color: string | null;
    highlights_en: string[];
    highlights_es: string[];
    includes_en: string[];
    includes_es: string[];
    pricing_options: { duration: string; price: number }[];
    gallery: string[];
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

/* ─── Row → Tour mapper ───────────────────────────────────── */
function mapRowToTour(row: TourRow): Tour {
    const validCategories: TourCategory[] = ['atv', 'water', 'nature', 'extreme', 'relax', 'canopy', 'combos'];
    const category = validCategories.includes(row.category as TourCategory)
        ? (row.category as TourCategory)
        : 'nature';

    return {
        id: row.id,
        slug: row.slug,
        title: { en: row.name_en, es: row.name_es },
        price: Number(row.price_base),
        originalPrice: row.original_price ? Number(row.original_price) : undefined,
        image_url: row.image_url || '',
        location: row.location,
        duration: row.duration,
        description: { en: row.description_en, es: row.description_es },
        badge: row.badge_text
            ? { text: row.badge_text, color: (row.badge_color as 'yellow' | 'red' | 'green') || 'yellow' }
            : undefined,
        pricing_options: Array.isArray(row.pricing_options) ? row.pricing_options : [],
        category,
        highlights: { en: row.highlights_en || [], es: row.highlights_es || [] },
        includes: { en: row.includes_en || [], es: row.includes_es || [] },
        gallery: row.gallery || [],
    };
}

/* ─── READ ─────────────────────────────────────────────────── */

export async function getAllToursFromSupabase(): Promise<Tour[]> {
    if (!supabase) return [];

    // Select only fields needed for tour cards and listings (reduces payload)
    const { data, error } = await supabase
        .from('tours')
        .select('id, slug, name_en, name_es, price_base, original_price, image_url, location, duration, category, badge_text, badge_color, is_active, created_at')
        .eq('is_active', true)
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Supabase getAllTours error:', error.message);
        return [];
    }
    return (data as TourRow[]).map(mapRowToTour);
}

export async function getTourBySlug(slug: string): Promise<Tour | null> {
    try {
        if (!supabase) {
            console.warn('Supabase client not initialized');
            return null;
        }

        const { data, error } = await supabase
            .from('tours')
            .select('*')
            .eq('slug', slug)
            .single();

        if (error) {
            console.error('Supabase getTourBySlug error:', error.message, error.code);
            return null;
        }

        if (!data) {
            console.warn('No tour found for slug:', slug);
            return null;
        }

        return mapRowToTour(data as TourRow);
    } catch (err) {
        console.error('getTourBySlug exception:', err);
        return null;
    }
}

/* ─── LISTING: Minimal fields for tour cards ─────────────────── */

export async function getTourListingFields(): Promise<Tour[]> {
    if (!supabase) return [];

    const { data, error } = await supabase
        .from('tours')
        .select('id, slug, name_en, name_es, price_base, original_price, image_url, location, duration, category, badge_text, badge_color, is_active')
        .eq('is_active', true)
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Supabase getTourListingFields error:', error.message);
        return [];
    }
    return (data as TourRow[]).map(mapRowToTour);
}

/* ─── ADMIN: full list (including inactive) ────────────────── */

export async function getAllToursAdmin(): Promise<TourRow[]> {
    if (!supabaseAdmin) return [];

    const { data, error } = await supabaseAdmin
        .from('tours')
        .select('*')
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Supabase getAllToursAdmin error:', error.message);
        return [];
    }
    return data as TourRow[];
}

/* ─── CREATE ───────────────────────────────────────────────── */

export async function createTour(tour: Partial<TourRow>): Promise<TourRow | null> {
    if (!supabaseAdmin) return null;

    const { data, error } = await supabaseAdmin
        .from('tours')
        .insert(tour)
        .select()
        .single();

    if (error) {
        console.error('Supabase createTour error:', error.message);
        return null;
    }
    return data as TourRow;
}

/* ─── UPDATE ───────────────────────────────────────────────── */

export async function updateTour(id: string, updates: Partial<TourRow>): Promise<TourRow | null> {
    if (!supabaseAdmin) return null;

    const { data, error } = await supabaseAdmin
        .from('tours')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Supabase updateTour error:', error.message);
        return null;
    }
    return data as TourRow;
}

/* ─── DELETE ───────────────────────────────────────────────── */

export async function deleteTour(id: string): Promise<boolean> {
    if (!supabaseAdmin) return false;

    const { error } = await supabaseAdmin
        .from('tours')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Supabase deleteTour error:', error.message);
        return false;
    }
    return true;
}
