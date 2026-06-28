import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabase';
import { isVehicleTour, getVehicleCapacity } from '../../../lib/price-calculator';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
    try {
        const body = await request.json();
        const { tourId, date, time, guests } = body;

        if (!tourId || !date || !guests) {
            return new Response(JSON.stringify({ 
                available: false, 
                message: 'Missing required fields' 
            }), { 
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        if (!supabaseAdmin) {
            return new Response(JSON.stringify({ 
                available: true, 
                message: 'Supabase not configured' 
            }), { 
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Get tour capacity
        const { data: tour, error: tourError } = await supabaseAdmin
            .from('tours')
            .select('max_participants, name_en, name_es, slug')
            .eq('id', tourId)
            .single();

        if (tourError || !tour) {
            return new Response(JSON.stringify({ 
                available: false, 
                message: 'Tour not found' 
            }), { 
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const maxParticipants = tour.max_participants || 10;
        const vehicleTour = isVehicleTour(tour.slug || '');

        // Get all bookings for that date and tour (confirmed, paid, pending)
        let query = supabaseAdmin
            .from('bookings')
            .select('adults, children, status, booking_time')
            .eq('tour_id', tourId)
            .eq('booking_date', date)
            .in('status', ['confirmed', 'paid', 'pending']);

        // If time is specified, also filter by time (for time-specific tours)
        if (time) {
            query = query.eq('booking_time', time);
        }

        const { data: existingBookings, error: bookingsError } = await query;

        if (bookingsError) {
            console.error('Error checking bookings:', bookingsError);
            return new Response(JSON.stringify({ 
                available: false, 
                message: 'Error checking availability' 
            }), { 
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // For vehicle tours, count vehicles (passengers / capacity), not total guests
        const totalBooked = (existingBookings || []).reduce((sum, booking) => {
            return vehicleTour
                ? sum + Math.max(1, Math.ceil((booking.adults || 0) / getVehicleCapacity(tour.slug || '')))
                : sum + (booking.adults || 0) + (booking.children || 0);
        }, 0);

        const requestedGuests = parseInt(guests) || 1;
        const requestedVehicles = vehicleTour ? Math.max(1, Math.ceil(requestedGuests / getVehicleCapacity(tour.slug || ''))) : requestedGuests;
        const available = (totalBooked + requestedVehicles) <= maxParticipants;
        const remainingSpots = Math.max(0, maxParticipants - totalBooked);

        return new Response(JSON.stringify({
            available,
            totalBooked,
            maxParticipants,
            remainingSpots,
            requestedGuests,
            message: available 
                ? `Available! ${remainingSpots} spots remaining.`
                : `Overbooked! ${remainingSpots} spots available, but ${requestedGuests} requested.`
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        console.error('Availability check error:', error);
        return new Response(JSON.stringify({ 
            available: false, 
            message: 'Internal server error' 
        }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
