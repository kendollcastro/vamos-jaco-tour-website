/**
 * SEO Structured Data (JSON-LD) generators for Vamos Jacó Tours
 * @see https://schema.org
 */

export interface BreadcrumbItem {
    name: string;
    url: string;
}

export interface TourSEO {
    name: string;
    description: string;
    image: string;
    price: number;
    currency?: string;
    duration?: string;
    location?: string;
    url: string;
    category?: string;
    rating?: number;
    reviewCount?: number;
}

export interface FAQItem {
    question: string;
    answer: string;
}

const SITE_URL = 'https://vamosjacotoursdev.com';
const BUSINESS_NAME = 'Vamos Jacó Tours';
const BUSINESS_PHONE = '+506 8774-7250';
const BUSINESS_EMAIL = 'info@vamosjaco.com';
const BUSINESS_ADDRESS = {
    streetAddress: 'Avenida Pastor Díaz',
    addressLocality: 'Jacó',
    addressRegion: 'Puntarenas',
    postalCode: '61101',
    addressCountry: 'CR',
};

/**
 * Organization schema — appears on every page
 */
export function getOrganizationSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'TravelAgency',
        name: BUSINESS_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/favicon.svg`,
        image: `${SITE_URL}/images/contact-hero.png`,
        description: 'Adventure tour operator in Jacó, Costa Rica. ATV tours, jet ski, surfing, flyboard, zipline and more.',
        telephone: BUSINESS_PHONE,
        email: BUSINESS_EMAIL,
        address: {
            '@type': 'PostalAddress',
            ...BUSINESS_ADDRESS,
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: 9.6151,
            longitude: -84.6368,
        },
        openingHoursSpecification: [
            {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                opens: '07:00',
                closes: '18:00',
            },
        ],
        sameAs: [
            'https://www.instagram.com/vamosjacotours',
            'https://www.facebook.com/vamosjacotours',
        ],
        priceRange: '$60 - $350',
    };
}

/**
 * LocalBusiness schema for Contact page
 */
export function getLocalBusinessSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        '@id': `${SITE_URL}/#business`,
        name: BUSINESS_NAME,
        url: SITE_URL,
        telephone: BUSINESS_PHONE,
        email: BUSINESS_EMAIL,
        address: {
            '@type': 'PostalAddress',
            ...BUSINESS_ADDRESS,
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: 9.6151,
            longitude: -84.6368,
        },
        openingHoursSpecification: [
            {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                opens: '07:00',
                closes: '18:00',
            },
        ],
        priceRange: '$60 - $350',
        image: `${SITE_URL}/images/contact-hero.png`,
    };
}

/**
 * Tour/Product schema for individual tour pages
 */
export function getTourSchema(tour: TourSEO) {
    const schema: Record<string, any> = {
        '@context': 'https://schema.org',
        '@type': 'TouristTrip',
        name: tour.name,
        description: tour.description,
        image: tour.image,
        url: tour.url,
        touristType: tour.category || 'Adventure',
        provider: {
            '@type': 'TravelAgency',
            name: BUSINESS_NAME,
            url: SITE_URL,
        },
        offers: {
            '@type': 'Offer',
            price: tour.price,
            priceCurrency: tour.currency || 'USD',
            availability: 'https://schema.org/InStock',
            validFrom: new Date().toISOString().split('T')[0],
        },
    };

    if (tour.rating && tour.reviewCount) {
        schema.aggregateRating = {
            '@type': 'AggregateRating',
            ratingValue: tour.rating,
            bestRating: 5,
            worstRating: 1,
            ratingCount: tour.reviewCount,
        };
    }

    if (tour.duration) {
        schema.itinerary = {
            '@type': 'ItemList',
            description: `Duration: ${tour.duration}`,
        };
    }

    if (tour.location) {
        schema.contentLocation = {
            '@type': 'Place',
            name: tour.location,
            address: {
                '@type': 'PostalAddress',
                addressLocality: 'Jacó',
                addressRegion: 'Puntarenas',
                addressCountry: 'CR',
            },
        };
    }

    return schema;
}

/**
 * Breadcrumb schema for navigation
 */
export function getBreadcrumbSchema(items: BreadcrumbItem[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: item.name,
            item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
        })),
    };
}

/**
 * FAQ schema for pages with Q&A content
 */
export function getFAQSchema(faqs: FAQItem[]) {
    if (!faqs || faqs.length === 0) return null;

    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
            },
        })),
    };
}

/**
 * WebSite schema with SearchAction (for sitelinks search box)
 */
export function getWebsiteSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: BUSINESS_NAME,
        url: SITE_URL,
        potentialAction: {
            '@type': 'SearchAction',
            target: `${SITE_URL}/tours?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
        },
    };
}

/**
 * AggregateRating schema for tours with reviews
 */
export function getAggregateRatingSchema(rating: number, reviewCount: number, bestRating: number = 5) {
    return {
        '@context': 'https://schema.org',
        '@type': 'AggregateRating',
        ratingValue: rating,
        bestRating: bestRating,
        worstRating: 1,
        ratingCount: reviewCount,
    };
}

/**
 * Review schema for individual reviews
 */
export interface ReviewItem {
    author: string;
    rating: number;
    date: string;
    title?: string;
    text: string;
}

export function getReviewSchema(review: ReviewItem) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Review',
        reviewRating: {
            '@type': 'Rating',
            ratingValue: review.rating,
            bestRating: 5,
        },
        author: {
            '@type': 'Person',
            name: review.author,
        },
        datePublished: review.date,
        headline: review.title || undefined,
        reviewBody: review.text,
    };
}

/**
 * Event schema for tour dates/special events
 */
export interface TourEvent {
    name: string;
    startDate: string;
    endDate?: string;
    location: string;
    price?: number;
}

export function getEventSchema(event: TourEvent) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Event',
        name: event.name,
        startDate: event.startDate,
        ...(event.endDate && { endDate: event.endDate }),
        eventLocation: {
            '@type': 'Place',
            address: {
                '@type': 'PostalAddress',
                addressLocality: 'Jacó',
                addressRegion: 'Puntarenas',
                addressCountry: 'CR',
            },
        },
        ...(event.price && {
            offers: {
                '@type': 'Offer',
                price: event.price,
                priceCurrency: 'USD',
            },
        }),
    };
}
