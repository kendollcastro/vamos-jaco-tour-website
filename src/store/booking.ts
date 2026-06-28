import { persistentAtom } from '@nanostores/persistent';
import { isVehicleTour, getVehicleCapacity } from '../lib/price-calculator';

export interface BookingState {
    tourId: string | null;
    tourTitle: string | null;
    date: string | null; // Stored as ISO string
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
    tourId: null,
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

export const bookingStore = persistentAtom<BookingState>('booking_cart', INITIAL_STATE, {
    encode: JSON.stringify,
    decode: JSON.parse,
});

export function setBookingTour(id: string, title: string, adultPrice: number, childPrice: number = 0, variationId?: number, duration?: string) {
    const current = bookingStore.get();
    bookingStore.set({
        ...current,
        tourId: id,
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

function calculateTotal() {
    const current = bookingStore.get();
    const { tourId, adults, children, pricePerAdult, pricePerChild } = current;
    
    let total = 0;
    const totalGuests = adults + children;

    // Vehicle tours are priced per vehicle, not per passenger
    if (isVehicleTour(tourId || '')) {
        const capacity = getVehicleCapacity(tourId || '');
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
