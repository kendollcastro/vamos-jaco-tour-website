/**
 * Per-slug SEO content overrides for tour detail pages.
 *
 * These take precedence over the Supabase-driven tour data and allow
 * targeted on-page SEO optimization (title, meta, H1, long-form content,
 * FAQs and structured data) without touching the database.
 */

export interface TourFaqEntry {
    question: string;
    answer: string;
}

export interface TourSeoOverride {
    /** <title> tag */
    title: string;
    /** <meta name="description"> */
    metaDescription: string;
    /** H1 heading (bilingual) */
    h1: { en: string; es: string };
    /** Heading shown above the long-form description section */
    sectionHeading: { en: string; es: string };
    /** Long-form description rendered as visible content (markdown) */
    longDescription: { en: string; es: string };
    /** FAQ questions & answers (bilingual) */
    faqs: { en: TourFaqEntry[]; es: TourFaqEntry[] };
    /** Keyword-rich description used in the TouristAttraction JSON-LD */
    schemaDescription: string;
}

export const TOUR_SEO_OVERRIDES: Record<string, TourSeoOverride> = {
    'jet-ski-tour': {
        title: 'Jet Ski Jacó, Costa Rica | Tours & Rentals | Vamos Jacó Tours',
        metaDescription:
            'Ride the Pacific on a jet ski in Jacó Beach. 1-5 hour tours, premium equipment, certified guides. Transportation included. Book online — best price guaranteed.',
        h1: {
            en: 'Jet Ski Jacó — Ride the Pacific Coast of Costa Rica',
            es: 'Jet Ski Jacó — Recorre la Costa Pacífica de Costa Rica',
        },
        sectionHeading: {
            en: 'The Jet Ski Experience in Jacó',
            es: 'La Experiencia de Jet Ski en Jacó',
        },
        longDescription: {
            en: `Jet ski in Jacó is one of the most thrilling ways to experience Costa Rica's Pacific coast, and at Vamos Jacó Tours we make it safe, simple, and unforgettable. From the moment you grip the handlebars you'll feel the power of an open Pacific Ocean ride — rolling swells, warm sea spray on your face, and a coastline view that stretches for miles. Our certified guides lead every session with a complete safety briefing, so first-timers and seasoned riders alike can focus on one thing: having the time of your life.

**Ride from Jacó Beach and Herradura Bay**

We launch from Jacó Beach and nearby Herradura Bay, two of the most spectacular stretches of the Costa Rican Central Pacific. You'll glide past golden sands, rocky headlands, and hidden coves while the green mountains of Puntarenas rise behind you. Watch for sea turtles, manta rays, and the dolphin pods that regularly travel through these waters — a jet ski ride here often turns into a wildlife tour.

**Choose your ride: 1 to 5 hours**

Every jet ski tour in Jacó is fully flexible. A 1-hour ride is the perfect introduction for couples and first-timers. Step up to a 2- or 3-hour tour to explore further along the coast, or go all-in with a 4- to 5-hour adventure for serious mileage and the best ocean conditions of the day. No matter the length, each ride includes a premium jet ski, a life jacket, a bilingual certified guide, and all the safety gear you need.

**Who can ride**

Jet skiing in Jacó is for everyone: couples celebrating a special occasion, groups of friends chasing adrenaline, families sharing an adventure, and solo travelers who just want to feel the speed. There is no experience requirement — our guides teach you everything before you launch, and passengers can ride along with a licensed adult driver.

**More than a jet ski rental**

Vamos Jacó Tours is a full adventure tour company, not just a rental counter. Combine your time on the water with an ATV mountain tour, a zipline canopy, a side-by-side buggy ride, or a surfing lesson — all bookable together. Transportation from hotels in Jacó and Herradura is included, and our team handles every detail so you only have to show up and ride.

Ready to make waves on the Pacific? Book your jet ski tour in Jacó today and discover why it's one of Costa Rica's most popular adventures.`,
            es: `Jet ski en Jacó es una de las formas más emocionantes de vivir la costa Pacífica de Costa Rica, y en Vamos Jacó Tours lo hacemos seguro, sencillo e inolvidable. Desde el momento en que tomas el manubrio sentirás el poder de un recorrido en mar abierto: olas que se balancean, la brisa marina en tu rostro y una vista de la costa que se extiende por kilómetros. Nuestros guías certificados lideran cada sesión con una charla completa de seguridad, para que principiantes y expertos se enfoquen en una sola cosa: pasarla increíble.

**Ride desde Playa Jacó y la Bahía de Herradura**

Salimos desde Playa Jacó y la cercana Bahía de Herradura, dos de los tramos más espectaculares del Pacífico Central de Costa Rica. Pasarás frente a arenas doradas, acantilados rocosos y caletas escondidas, con las verdes montañas de Puntarenas como telón de fondo. Estate atento a las tortugas marinas, las mantarrayas y los grupos de delfines que viajan con frecuencia por estas aguas: un paseo en jet ski aquí muchas veces se convierte en un tour de vida silvestre.

**Elige tu recorrido: de 1 a 5 horas**

Cada tour de jet ski en Jacó es totalmente flexible. Un paseo de 1 hora es la introducción perfecta para parejas y principiantes. Sube a un tour de 2 o 3 horas para explorar más costa, o ve a lo grande con una aventura de 4 a 5 horas para recorrer muchos kilómetros y las mejores condiciones del océano del día. Sin importar la duración, cada paseo incluye un jet ski de primera, chaleco salvavidas, guía bilingüe certificado y todo el equipo de seguridad.

**¿Quiénes pueden montar?**

El jet ski en Jacó es para todos: parejas celebrando una ocasión especial, grupos de amigos buscando adrenalina, familias compartiendo una aventura y viajeros solos que solo quieren sentir la velocidad. No se requiere experiencia: nuestros guías te enseñan todo antes de salir, y los pasajeros pueden ir con un conductor adulto con licencia.

**Más que un alquiler de jet ski**

Vamos Jacó Tours es una empresa de aventura completa, no solo un mostrador de alquiler. Combina tu tiempo en el agua con un tour de ATV por la montaña, un canopy por la selva, un paseo en side-by-side o una clase de surf, todo en una sola reserva. El transporte desde hoteles en Jacó y Herradura está incluido, y nuestro equipo se encarga de todos los detalles para que tú solo llegues y manejes.

¿Listo para hacer olas en el Pacífico? Reserva hoy tu tour de jet ski en Jacó y descubre por qué es una de las aventuras más populares de Costa Rica.`,
        },
        faqs: {
            en: [
                {
                    question: 'Do I need experience to rent a jet ski in Jacó?',
                    answer: 'No experience needed. Our certified guides provide a full safety briefing before every tour.',
                },
                {
                    question: 'How much does a jet ski tour in Jacó cost?',
                    answer: 'Tours start at $120/hour. Transportation from hotels in Jacó and Herradura is included.',
                },
                {
                    question: 'Can I do a jet ski and ATV combo in Jacó?',
                    answer: 'Yes! We offer combo packages combining jet ski with ATV, zipline, and other adventures.',
                },
                {
                    question: 'What is the minimum age for jet ski in Jacó?',
                    answer: 'Riders must be 18+ to drive. Passengers can be younger with adult supervision.',
                },
            ],
            es: [
                {
                    question: '¿Necesito experiencia para alquilar un jet ski en Jacó?',
                    answer: 'No se necesita experiencia. Nuestros guías certificados brindan una charla completa de seguridad antes de cada tour.',
                },
                {
                    question: '¿Cuánto cuesta un tour de jet ski en Jacó?',
                    answer: 'Los tours comienzan en $120/hora. El transporte desde hoteles en Jacó y Herradura está incluido.',
                },
                {
                    question: '¿Puedo hacer un combo de jet ski y ATV en Jacó?',
                    answer: '¡Sí! Ofrecemos paquetes combinados de jet ski con ATV, canopy y otras aventuras.',
                },
                {
                    question: '¿Cuál es la edad mínima para el jet ski en Jacó?',
                    answer: 'Los conductores deben ser mayores de 18 años. Los pasajeros pueden ser menores con supervisión de un adulto.',
                },
            ],
        },
        schemaDescription:
            'Jet ski tours in Jacó, Costa Rica on the open Pacific Ocean. 1-5 hour rides from Jacó Beach and Herradura Bay with certified guides, life jackets and hotel transportation included. Book your jet ski in Jacó today.',
    },
};

export function getTourSeoOverride(slug: string | undefined | null): TourSeoOverride | undefined {
    if (!slug) return undefined;
    return TOUR_SEO_OVERRIDES[slug];
}
