import { persistentAtom } from '@nanostores/persistent';
import { isVehicleTour, getVehicleCapacity } from '../lib/price-calculator';

const STORAGE_VERSION = 1;

export interface BookingState {
    version: number;
    tourId: string | null;
    tourSlug: string | null;
    tourTitle: string | null;
    date: string | null;
    time: string | null;
    adults: number;
    children: number;
    extraPassengers: number;
    pricePerAdult: number;
    pricePerChild: number;
    variationId: number | null;
    duration: string | null;
    ivaAmount: number;
    totalPrice: number;
}

const INITIAL_STATE: BookingState = {
    version: STORAGE_VERSION,
    tourId: null,
    tourSlug: null,
    tourTitle: null,
    date: null,
    time: null,
    adults: 1,
    children: 0,
    extraPassengers: 0,
    pricePerAdult: 0,
    pricePerChild: 0,
    variationId: null,
    duration: null,
    ivaAmount: 0,
    totalPrice: 0,
};

function deriveSlugFromTitle(title: string | null): string | null {
    if (!title) return null;
    const t = title.toLowerCase();
    if (t.includes('side-by-side') || t.includes('side by side')) return 'side-by-side-tour';
    if (t.includes('jet-ski') || t.includes('jet ski')) return 'jet-ski-tour';
    if (t.includes('atv')) return 'jaco-atv-adventure';
    return null;
}

function isVehicleSlug(slug: string | null): boolean {
    if (!slug) return false;
    return ['side-by-side-tour', 'jet-ski-tour', 'jaco-atv-adventure'].includes(slug);
}

function getVehicleCap(slug: string | null): number {
    if (!slug) return 1;
    const map: Record<string, number> = {
        'side-by-side-tour': 1,
        'jet-ski-tour': 1,
        'jaco-atv-adventure': 1,
    };
    return map[slug] || 1;
}

function recalcPrice(state: BookingState): { ivaAmount: number; totalPrice: number } {
    let total = 0;
    if (isVehicleSlug(state.tourSlug)) {
        const cap = getVehicleCap(state.tourSlug);
        const vehicles = Math.max(1, Math.ceil(state.adults / cap));
        total = (vehicles * state.pricePerAdult) + (state.extraPassengers * 20);
    } else {
        total = (state.adults * state.pricePerAdult) + (state.children * state.pricePerChild);
    }
    const iva = total * 0.13;
    return { ivaAmount: iva, totalPrice: total + iva };
}

function migrateCart(raw: Record<string, unknown>): BookingState {
    let state = { ...INITIAL_STATE, ...raw } as BookingState;
    if (state.version >= STORAGE_VERSION) return state;
    if (!state.tourSlug && state.tourId) {
        state.tourSlug = deriveSlugFromTitle(state.tourTitle);
        if (state.tourSlug) {
            const prices = recalcPrice(state);
            state.ivaAmount = prices.ivaAmount;
            state.totalPrice = prices.totalPrice;
        }
    }
    state.version = STORAGE_VERSION;
    return state;
}

export const bookingStore = persistentAtom<BookingState>('booking_cart', INITIAL_STATE, {
    encode: JSON.stringify,
    decode: (raw: string) => {
        try {
            const parsed = JSON.parse(raw);
            if (parsed && typeof parsed === 'object') return migrateCart(parsed);
        } catch {}
        return { ...INITIAL_STATE };
    },
});

export function setBookingTour(id: string, slug: string, title: string, adultPrice: number, childPrice: number = 0, variationId?: number, duration?: string) {
    const current = bookingStore.get();
    bookingStore.set({
        ...current,
        tourId: id,
        tourSlug: slug,
        tourTitle: title,
        pricePerAdult: adultPrice,
        pricePerChild: childPrice,
        variationId: variationId || null,
        duration: duration || null,
        extraPassengers: 0, // Reset extra passengers when switching tours
    });
    calculateTotal();
}

export function setBookingDate(date: Date) {
    const current = bookingStore.get();
    bookingStore.set({
        ...current,
        date: date.toISOString(),
    });
}

export function setBookingTime(time: string) {
    const current = bookingStore.get();
    bookingStore.set({
        ...current,
        time: time,
    });
}

export function setGuests(adults: number, children: number) {
    const current = bookingStore.get();
    bookingStore.set({
        ...current,
        adults: adults,
        children: children,
    });
    calculateTotal();
}

export function setExtraPassengers(count: number) {
    const current = bookingStore.get();
    bookingStore.set({
        ...current,
        extraPassengers: count,
    });
    calculateTotal();
}

/** Vehicle tours: `machines` = units selected, `extras` = paid additional riders ($20 ea). */
export function setVehicleBooking(machines: number, extras: number) {
    const current = bookingStore.get();
    bookingStore.set({
        ...current,
        adults: machines,
        children: 0,
        extraPassengers: extras,
    });
    calculateTotal();
}

function calculateTotal() {
    const current = bookingStore.get();
    const { tourSlug, adults, children, pricePerAdult, pricePerChild } = current;
    
    let total = 0;
    const totalGuests = adults + children;

    if (isVehicleTour(tourSlug || '')) {
        const capacity = getVehicleCapacity(tourSlug || '');
        const vehicles = Math.max(1, Math.ceil(adults / capacity));
        total = (vehicles * pricePerAdult) + (current.extraPassengers * 20);
    } else {
        // Standard per-person pricing
        total = (adults * pricePerAdult) + (children * pricePerChild);
    }
    
    const subtotal = total;
    const iva = subtotal * 0.13;
    const finalTotal = subtotal + iva;
    
    bookingStore.set({
        ...current,
        ivaAmount: iva,
        totalPrice: finalTotal,
    });
}
