import { persistentAtom } from '@nanostores/persistent';

export interface BookingState {
    tourId: string | null;
    tourTitle: string | null;
    date: string | null; // Stored as ISO string
    time: string | null;
    adults: number;
    children: number;
    pricePerAdult: number;
    pricePerChild: number;
    totalPrice: number;
}

const INITIAL_STATE: BookingState = {
    tourId: null,
    tourTitle: null,
    date: null,
    time: null,
    adults: 1,
    children: 0,
    pricePerAdult: 0,
    pricePerChild: 0,
    totalPrice: 0,
};

export const bookingStore = persistentAtom<BookingState>('booking_cart', INITIAL_STATE, {
    encode: JSON.stringify,
    decode: JSON.parse,
});

export function setBookingTour(id: string, title: string, adultPrice: number, childPrice: number = 0) {
    const current = bookingStore.get();
    bookingStore.set({
        ...current,
        tourId: id,
        tourTitle: title,
        pricePerAdult: adultPrice,
        pricePerChild: childPrice,
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

function calculateTotal() {
    const current = bookingStore.get();
    const total = (current.adults * current.pricePerAdult) + (current.children * current.pricePerChild);
    bookingStore.set({
        ...current,
        totalPrice: total,
    });
}
