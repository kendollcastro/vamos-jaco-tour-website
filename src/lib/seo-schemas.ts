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
    telephone?: string;
}

export interface FAQItem {
    question: string;
    answer: string;
}

const SITE_URL = 'https://www.vamosjacotours.com';
const BUSINESS_NAME = 'Vamos Jacó Tours';
const BUSINESS_PHONE = '+50687747250';
const BUSINESS_EMAIL = 'info@vamosjacotours.com';
const BUSINESS_ADDRESS = {
    streetAddress: 'Jacó',
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
 * LocalBusiness + TouristInformationCenter schema (included on every page)
 */
export function getLocalBusinessSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': ['LocalBusiness', 'TouristInformationCenter'],
        name: BUSINESS_NAME,
        url: SITE_URL,
        telephone: BUSINESS_PHONE,
        email: BUSINESS_EMAIL,
        address: {
            '@type': 'PostalAddress',
            streetAddress: 'Jacó',
            addressLocality: 'Jacó',
            addressRegion: 'Puntarenas',
            addressCountry: 'CR',
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: 9.6151,
            longitude: -84.6368,
        },
        openingHours: 'Mo-Su 08:00-17:00',
        priceRange: '$$',
        currenciesAccepted: 'USD',
        paymentAccepted: 'Cash, Credit Card, PayPal',
        sameAs: [
            'https://www.instagram.com/vamosjacotours',
            'https://www.facebook.com/vamosjacotours',
        ],
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: 4.5,
            bestRating: 5,
            ratingCount: 50,
            reviewCount: 50,
        },
    };
}

/**
 * TouristAttraction + Offer schema for individual tour pages
 */
export function getTourSchema(tour: TourSEO) {
    const telephone = tour.telephone || BUSINESS_PHONE.replace(/[\s-]/g, '');

    const schema: Record<string, any> = {
        '@context': 'https://schema.org',
        '@type': 'TouristAttraction',
        name: tour.name,
        description: tour.description,
        url: tour.url,
        touristType: tour.category || 'Adventure',
        location: {
            '@type': 'Place',
            name: 'Jacó, Costa Rica',
            geo: {
                '@type': 'GeoCoordinates',
                latitude: 9.6151,
                longitude: -84.6368,
            },
        },
        offers: {
            '@type': 'Offer',
            price: tour.price,
            priceCurrency: tour.currency || 'USD',
            availability: 'https://schema.org/InStock',
        },
        provider: {
            '@type': 'LocalBusiness',
            name: BUSINESS_NAME,
            telephone,
            url: SITE_URL,
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
