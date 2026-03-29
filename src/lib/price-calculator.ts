import { supabaseAdmin } from './supabase';

/**
 * Tour pricing data - used as fallback if Supabase is not available.
 * Prices should match what's in the database.
 */
const TOUR_PRICES: Record<string, { adultPrice: number; childPrice: number }> = {
    'jaco-atv-adventure': { adultPrice: 75, childPrice: 45 },
    'side-by-side-tour': { adultPrice: 150, childPrice: 0 },
    'jet-ski-tour': { adultPrice: 135, childPrice: 0 },
    'zipline-canopy': { adultPrice: 65, childPrice: 45 },
    'surf-class': { adultPrice: 75, childPrice: 55 },
    'costa-cat-cruise': { adultPrice: 85, childPrice: 50 },
    'sport-fishing': { adultPrice: 150, childPrice: 100 },
};

interface CalculatePriceParams {
    tourId: string;
    adults: number;
    children: number;
    extraPassengers?: number;
}

interface PriceResult {
    subtotal: number;
    iva: number;
    total: number;
    isValid: boolean;
}

/**
 * Calculate the expected price for a booking on the server side.
 * This prevents price manipulation from the frontend.
 */
export async function calculateServerPrice(params: CalculatePriceParams): Promise<PriceResult> {
    const { tourId, adults, children, extraPassengers = 0 } = params;
    
    let adultPrice = 0;
    let childPrice = 0;
    
    // Try to get prices from Supabase first
    if (supabaseAdmin) {
        try {
            const { data: tour, error } = await supabaseAdmin
                .from('tours')
                .select('price, child_price')
                .eq('slug', tourId)
                .single();
            
            if (!error && tour) {
                adultPrice = tour.price || 0;
                childPrice = tour.child_price || 0;
            }
        } catch (err) {
            console.error('Failed to fetch tour price from DB:', err);
        }
    }
    
    // Fallback to hardcoded prices
    if (adultPrice === 0 && TOUR_PRICES[tourId]) {
        adultPrice = TOUR_PRICES[tourId].adultPrice;
        childPrice = TOUR_PRICES[tourId].childPrice;
    }
    
    // Calculate subtotal
    let subtotal = 0;
    
    // Vehicle tours have different pricing
    const isVehicleTour = ['side-by-side-tour', 'jet-ski-tour', 'jaco-atv-adventure'].includes(tourId);
    
    if (isVehicleTour) {
        // Adults represent number of vehicles, extra passengers cost $20 each
        subtotal = (adults * adultPrice) + (extraPassengers * 20);
    } else {
        subtotal = (adults * adultPrice) + (children * childPrice);
    }
    
    // Calculate IVA (13% tax in Costa Rica)
    const iva = Math.round(subtotal * 0.13 * 100) / 100;
    const total = Math.round((subtotal + iva) * 100) / 100;
    
    return {
        subtotal,
        iva,
        total,
        isValid: adultPrice > 0
    };
}

/**
 * Validate that the provided amount matches the expected price.
 * Returns true if the amounts match (within $0.01 tolerance for rounding).
 */
export function validatePrice(providedAmount: number, expectedTotal: number): boolean {
    const tolerance = 0.01;
    return Math.abs(providedAmount - expectedTotal) <= tolerance;
}
