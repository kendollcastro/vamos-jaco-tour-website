export type TourCategory = 'atv' | 'water' | 'nature' | 'extreme' | 'relax';

export interface Tour {
    id: string;
    slug?: string;
    title: { en: string; es: string };
    price: number;
    originalPrice?: number;
    image_url: string;
    location: string;
    duration: string;
    description: { en: string; es: string };
    badge?: { text: string; color: 'yellow' | 'red' | 'green' };
    pricing_options: { duration: string; price: number; variation_id?: number }[];
    category: TourCategory;
    highlights?: { en: string[]; es: string[] };
    includes?: { en: string[]; es: string[] };
    gallery?: string[];
    seo?: {
        title?: string;
        description?: string;
        image?: string;
    };
}

export const tours: Tour[] = [];

import { getAllToursFromSupabase, getTourBySlug as getSupabaseTourBySlug } from '../lib/supabase-tours';

/**
 * Data cascade: Supabase → static data
 */
export async function getAllTours(): Promise<Tour[]> {
    let supabaseTours: Tour[] = [];

    // 1️⃣ Try Supabase first
    try {
        supabaseTours = await getAllToursFromSupabase();
        if (supabaseTours.length > 0) {
            console.log(`✅ Loaded ${supabaseTours.length} tours from Supabase`);
        }
    } catch (e) {
        console.warn("Supabase not available, using fallback...", e);
    }

    return supabaseTours;
}

export async function getTourById(idOrSlug: string): Promise<Tour | undefined> {
    // 1️⃣ Try Supabase
    try {
        const sbTour = await getSupabaseTourBySlug(idOrSlug);
        if (sbTour) return sbTour;
    } catch (e) {
        console.warn("Supabase not available for getTourById:", e);
    }

    // 2️⃣ Static fallback
    return tours.find(t => t.id === idOrSlug);
}

