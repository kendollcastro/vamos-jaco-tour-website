import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { sanitize, sanitizeEmail } from '../../lib/sanitize';

export const prerender = false;

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export const GET: APIRoute = async ({ url }) => {
    const tourId = url.searchParams.get('tour_id');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    try {
        let query = supabase
            .from('tour_reviews')
            .select('*')
            .eq('is_published', true)
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (tourId) {
            query = query.eq('tour_id', tourId);
        }

        const { data: reviews, error } = await query;

        if (error) {
            return new Response(JSON.stringify({ error: error.message }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Get rating stats
        let statsQuery = supabase
            .from('tour_reviews')
            .select('rating', { count: 'exact' })
            .eq('is_published', true);

        if (tourId) {
            statsQuery = statsQuery.eq('tour_id', tourId);
        }

        const { data: allRatings, count } = await statsQuery;
        
        const avgRating = allRatings?.length 
            ? allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length 
            : 0;

        return new Response(JSON.stringify({
            reviews: reviews || [],
            stats: {
                average: Math.round(avgRating * 10) / 10,
                count: count || 0
            }
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (e) {
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

export const POST: APIRoute = async ({ request }) => {
    try {
        const body = await request.json();
        const { tour_id, author_name, author_email, rating, title, text } = body;

        if (!tour_id || !author_name || !rating || !text) {
            return new Response(JSON.stringify({ 
                error: 'Missing required fields: tour_id, author_name, rating, text' 
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        if (rating < 1 || rating > 5) {
            return new Response(JSON.stringify({ 
                error: 'Rating must be between 1 and 5' 
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Sanitize all user inputs
        const sanitizedName = sanitize(author_name, 100);
        const sanitizedEmail = author_email ? sanitizeEmail(author_email) : null;
        const sanitizedTitle = title ? sanitize(title, 200) : null;
        const sanitizedText = sanitize(text, 5000);

        if (!sanitizedName) {
            return new Response(JSON.stringify({ 
                error: 'Author name is required' 
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const { data, error } = await supabase
            .from('tour_reviews')
            .insert({
                tour_id,
                author_name: sanitizedName,
                author_email: sanitizedEmail,
                rating,
                title: sanitizedTitle,
                text: sanitizedText,
                is_verified: false,
                is_published: false,
            })
            .select()
            .single();

        if (error) {
            return new Response(JSON.stringify({ error: error.message }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify({
            message: 'Review submitted successfully! It will be published after moderation.',
            review: data
        }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (e) {
        return new Response(JSON.stringify({ error: 'Invalid request body' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}