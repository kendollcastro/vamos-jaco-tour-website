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

export interface TourSeoSection {
    heading: { en: string; es: string };
    content: { en: string; es: string };
}

export interface TourComparisonRow {
    feature: { en: string; es: string };
    vamos: { en: string; es: string };
    others: { en: string; es: string };
}

export interface TourComparison {
    heading: { en: string; es: string };
    columns: {
        feature: { en: string; es: string };
        vamos: { en: string; es: string };
        others: { en: string; es: string };
    };
    rows: TourComparisonRow[];
}

export interface TourSeoOverride {
    /** <title> tag */
    title: string;
    /** <meta name="description"> */
    metaDescription: string;
    /** H1 heading (bilingual) */
    h1: { en: string; es: string };
    /** Heading shown above the long-form description section (overrides "About This Tour") */
    sectionHeading?: { en: string; es: string };
    /** Long-form description rendered as visible content (markdown). When present,
     *  replaces the Supabase description + accordion on the tour page. */
    longDescription?: { en: string; es: string };
    /** FAQ questions & answers (bilingual) */
    faqs: { en: TourFaqEntry[]; es: TourFaqEntry[] };
    /** FAQ section heading (bilingual) */
    faqHeading: { en: string; es: string };
    /** Keyword-rich description used in the TouristAttraction JSON-LD */
    schemaDescription: string;
    /** Long-tail keyword H2 sections */
    sections?: TourSeoSection[];
    /** "Why book with us" comparison table */
    comparison?: TourComparison;
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
        faqHeading: {
            en: 'Jet Ski in Jacó — FAQ',
            es: 'Jet Ski en Jacó — Preguntas Frecuentes',
        },
    },

    'jaco-atv-adventure': {
        title: 'ATV Tour Jacó Costa Rica | Jungle & Waterfall Off-Road Adventure',
        metaDescription:
            'Ride jungle trails, rivers and waterfalls on an ATV tour in Jacó, Costa Rica. Beginners welcome, certified guides, free hotel pickup. Book online — best price guaranteed.',
        h1: {
            en: 'ATV Tours in Jacó, Costa Rica — Jungle Trails & Waterfall Rides',
            es: 'Tours de ATV en Jacó, Costa Rica — Senderos de Selva y Rutas a Cataratas',
        },
        faqs: {
            en: [
                {
                    question: 'Is the ATV tour in Jacó good for beginners?',
                    answer: 'Absolutely. No prior experience needed. Our certified guides provide a full safety briefing, teach you the controls, and adapt the trail to your pace.',
                },
                {
                    question: 'How much does an ATV tour in Jacó cost?',
                    answer: 'Tours start at $60 per person for 1 hour. Longer options include 2 hours for $90, 3 hours for $125, 4 hours for $150, and an all-day expedition.',
                },
                {
                    question: 'Can I combine the ATV tour with other activities in Jacó?',
                    answer: 'Yes! We offer combo packages combining ATV with jet ski, zipline, side-by-side buggies, and surfing — all in one booking.',
                },
                {
                    question: 'Is transportation included in the ATV tour from Jacó?',
                    answer: 'Yes, free round-trip pickup from hotels in Jacó and Herradura is included with every ATV tour.',
                },
                {
                    question: 'What is the minimum age for ATV tours in Jacó?',
                    answer: 'Drivers must be 18+ with a valid license. Passengers of all ages are welcome as riders.',
                },
            ],
            es: [
                {
                    question: '¿El tour de ATV en Jacó es bueno para principiantes?',
                    answer: 'Absolutamente. No se necesita experiencia previa. Nuestros guías certificados dan una charla completa de seguridad, enseñan los controles y adaptan el camino a tu ritmo.',
                },
                {
                    question: '¿Cuánto cuesta un tour de ATV en Jacó?',
                    answer: 'Los tours comienzan en $60 por persona por 1 hora. Opciones más largas incluyen 2 horas por $90, 3 horas por $125, 4 horas por $150 y una expedición de día completo.',
                },
                {
                    question: '¿Puedo combinar el tour de ATV con otras actividades en Jacó?',
                    answer: '¡Sí! Ofrecemos paquetes combinados de ATV con jet ski, canopy, side-by-side y surf, todo en una sola reserva.',
                },
                {
                    question: '¿El transporte está incluido en el tour de ATV desde Jacó?',
                    answer: 'Sí, incluimos recogida y regreso gratuitos desde hoteles en Jacó y Herradura con cada tour de ATV.',
                },
                {
                    question: '¿Cuál es la edad mínima para los tours de ATV en Jacó?',
                    answer: 'Los conductores deben ser mayores de 18 años con licencia válida. Los pasajeros de todas las edades pueden ir como acompañantes.',
                },
            ],
        },
        faqHeading: {
            en: 'ATV Tours in Jacó — FAQ',
            es: 'Tours de ATV en Jacó — Preguntas Frecuentes',
        },
        schemaDescription:
            'ATV tours in Jacó, Costa Rica on jungle trails, rivers and waterfalls. 1-hour to all-day rides from Jacó and Herradura with certified bilingual guides, safety gear and free hotel transportation. Book your ATV tour in Jacó today.',
        sections: [
            {
                heading: {
                    en: 'ATV Tours for Beginners in Jacó',
                    es: 'Tours de ATV para Principiantes en Jacó',
                },
                content: {
                    en: `No prior ATV experience? No problem. Our ATV tour in Jacó is built for first-time riders: certified guides walk you through the controls, a full safety briefing, and trail conditions before you even start the engine. We start on open trails and work up to river crossings and jungle climbs at your own pace. Beginners ride on well-maintained machines with helmet and safety gear included, and a guide stays within sight the entire trip. If you can drive a car, you can ride an ATV in Jacó with us — thousands of first-timers do it every year.`,
                    es: `¿Sin experiencia previa en ATV? No hay problema. Nuestro tour de ATV en Jacó está pensado para conductores primerizos: los guías certificados te explican los controles, una charla completa de seguridad y las condiciones del camino antes de encender el motor. Empezamos en senderos abiertos y avanzamos a cruces de ríos y subidas en la selva a tu ritmo. Los principiantes usan máquinas en perfecto estado con casco y equipo de seguridad incluidos, y un guía se mantiene a la vista todo el recorrido. Si sabes manejar un carro, puedes manejar un ATV en Jacó con nosotros — miles de primerizos lo hacen cada año.`,
                },
            },
            {
                heading: {
                    en: 'ATV & Zipline Combo Tour Jacó',
                    es: 'Tour Combo de ATV y Canopy en Jacó',
                },
                content: {
                    en: `Maximize your adventure day with our ATV and zipline combo in Jacó. Spend the morning tearing through muddy jungle trails on an ATV, then soar above the rainforest canopy on a zipline — all in one action-packed tour. Combining activities saves you time and money compared to booking separately, and our guides coordinate all the logistics so you never wait around. Combo packages also pair ATV with jet ski, side-by-side buggies, and surfing. Want to see the jungle from the dirt and the sky in a single day? Book the ATV and zipline combo and do both.`,
                    es: `Aprovecha tu día de aventura al máximo con nuestro combo de ATV y canopy en Jacó. Pasa la mañana recorriendo senderos selváticos embarrados en ATV y luego vuela sobre el dosel de la selva en un canopy, todo en un mismo tour lleno de acción. Combinar actividades te ahorra tiempo y dinero en comparación con reservar por separado, y nuestros guías coordinan toda la logística para que nunca esperes. Los paquetes combinados también unen ATV con jet ski, side-by-side y surf. ¿Quieres ver la selva desde la tierra y desde el cielo en un solo día? Reserva el combo de ATV y canopy y haz ambas cosas.`,
                },
            },
            {
                heading: {
                    en: 'ATV Herradura & Los Sueños Area',
                    es: 'Zona de ATV en Herradura y Los Sueños',
                },
                content: {
                    en: `Staying in Herradura or at the Los Sueños Marina Resort? Our ATV tours pick you up free of charge and take you straight into the best off-road terrain outside Herradura Bay. The area around Herradura offers a unique mix of coastal trails, river crossings, and panoramic viewpoints over the Pacific that you won't find in town. We know every trail around Los Sueños and Playa Herradura, so you'll ride with a local guide who picks routes based on your experience and the day's conditions. Round-trip transportation from your Herradura hotel is always included.`,
                    es: `¿Te hospedas en Herradura o en el Los Sueños Marina Resort? Nuestros tours de ATV te recogen sin costo y te llevan directo al mejor terreno off-road fuera de la Bahía de Herradura. La zona alrededor de Herradura ofrece una combinación única de senderos costeros, cruces de ríos y miradores panorámicos sobre el Pacífico que no encontrarás en el pueblo. Conocemos cada camino alrededor de Los Sueños y Playa Herradura, así que manejarás con un guía local que elige la ruta según tu experiencia y las condiciones del día. El transporte de regreso desde tu hotel en Herradura siempre está incluido.`,
                },
            },
            {
                heading: {
                    en: 'How Much Does an ATV Tour in Jacó Cost?',
                    es: '¿Cuánto Cuesta un Tour de ATV en Jacó?',
                },
                content: {
                    en: `An ATV tour in Jacó starts at $60 per person for a 1-hour ride, with longer options available: 2 hours for $90, 3 hours for $125, and 4 hours for $150. Want the full experience? Our all-day off-road expedition covers the most terrain. Prices include the ATV rental, helmet, safety gear, a certified bilingual guide, and free round-trip transportation from Jacó and Herradura hotels. There are no hidden fees — the price you see is the price you pay. Book online for instant confirmation and the best available rate.`,
                    es: `Un tour de ATV en Jacó comienza en $60 por persona por un paseo de 1 hora, con opciones más largas disponibles: 2 horas por $90, 3 horas por $125 y 4 horas por $150. ¿Quieres la experiencia completa? Nuestra expedición de día completo cubre la mayor cantidad de terreno. Los precios incluyen el alquiler del ATV, casco, equipo de seguridad, un guía bilingüe certificado y transporte de ida y vuelta gratuito desde hoteles en Jacó y Herradura. Sin cargos ocultos: el precio que ves es el precio que pagas. Reserva en línea para confirmación instantánea y la mejor tarifa disponible.`,
                },
            },
        ],
        comparison: {
            heading: {
                en: 'Why Book With Vamos Jacó vs Other ATV Companies',
                es: 'Por Qué Reservar con Vamos Jacó vs Otras Compañías de ATV',
            },
            columns: {
                feature: { en: 'Feature', es: 'Característica' },
                vamos: { en: 'Vamos Jacó Tours', es: 'Vamos Jacó Tours' },
                others: { en: 'Others', es: 'Otros' },
            },
            rows: [
                {
                    feature: { en: 'Transportation included', es: 'Transporte incluido' },
                    vamos: { en: '✅ Free from Jacó/Herradura', es: '✅ Gratis desde Jacó/Herradura' },
                    others: { en: 'Extra charge', es: 'Cargo extra' },
                },
                {
                    feature: { en: 'Booking', es: 'Reserva' },
                    vamos: { en: '✅ Online instant', es: '✅ En línea e instantánea' },
                    others: { en: 'Phone only', es: 'Solo por teléfono' },
                },
                {
                    feature: { en: 'Group size', es: 'Tamaño de grupo' },
                    vamos: { en: '✅ Private & group', es: '✅ Privado y grupal' },
                    others: { en: 'Group only', es: 'Solo grupal' },
                },
                {
                    feature: { en: 'Languages', es: 'Idiomas' },
                    vamos: { en: '✅ English & Spanish', es: '✅ Inglés y español' },
                    others: { en: 'English only', es: 'Solo inglés' },
                },
                {
                    feature: { en: 'Combo tours', es: 'Tours combinados' },
                    vamos: { en: '✅ ATV + Jet Ski + Zipline', es: '✅ ATV + Jet Ski + Canopy' },
                    others: { en: 'Separate bookings', es: 'Reservas por separado' },
                },
            ],
        },
    },

    'atv-herradura-costa-rica': {
        title: 'ATV Tour Herradura, Costa Rica | Los Sueños Adventure Rides',
        metaDescription:
            'ATV tours in Herradura, Costa Rica with free pickup from Los Sueños and Playa Herradura hotels. Jungle trails, river crossings, 1h to all-day. Book online.',
        h1: {
            en: 'ATV Tours in Herradura, Costa Rica — Los Sueños & Jungle Rides',
            es: 'Tours de ATV en Herradura, Costa Rica — Aventuras en Los Sueños y la Selva',
        },
        sectionHeading: {
            en: 'ATV Tours in Herradura & Los Sueños',
            es: 'Tours de ATV en Herradura y Los Sueños',
        },
        longDescription: {
            en: `If you're staying in Herradura, one of the best ways to see the surrounding jungle and coastline is an ATV tour. Herradura sits on the Central Pacific coast of Costa Rica, minutes from Jacó and right next to the famous Los Sueños Marina Resort — and the trails around it are some of the best off-road riding in the country.

**ATV tours right from Herradura**

With Vamos Jacó Tours, you don't need to worry about getting to the starting point. We offer free round-trip pickup from your hotel or vacation rental anywhere in Herradura, including the Los Sueños area and Playa Herradura. From there it's a short ride to trails that wind through rainforest, cross rivers, and climb to viewpoints overlooking Herradura Bay and the Pacific Ocean.

**Ride the Los Sueños area**

The terrain around Los Sueños and the Herradura hills is exactly what ATV riders dream about: muddy jungle paths, steep climbs, stream crossings, and open farm roads with sweeping coastal views. Because we're a local company based between Jacó and Herradura, our guides ride these trails year-round and know the best routes for every weather and skill level. Whether you want a gentle introduction or a full adrenaline day, we adapt the ride to you.

**Flexible tours from 1 hour to all day**

Herradura ATV tours run from 1 hour up to a full day. A 1-hour ride is perfect if you want a taste of the jungle between activities. For deeper exploration, choose 2, 3, or 4 hours. And for serious off-roaders, our all-day expedition covers the most terrain Herradura has to offer. Every tour includes your ATV, helmet, safety gear, a certified bilingual guide, and hotel pickup and drop-off.

**Combine your Herradura adventure**

Staying near the marina means you can easily combine your ATV ride with other activities. Pair it with a jet ski tour from the nearby beaches, a zipline over the rainforest, or a side-by-side buggy adventure — we bundle them into combo packages so you save time and money.

**Beginner-friendly and family-friendly**

No experience is needed. Drivers must be 18+ with a valid license; passengers of all ages are welcome as riders. Our guides provide a full safety briefing and ride with you the entire time.

Ready to explore Herradura the fun way? Book your ATV tour in Herradura, Costa Rica today and discover the wild side of the Central Pacific.`,
            es: `Si te hospedas en Herradura, una de las mejores formas de ver la selva y la costa que la rodean es un tour de ATV. Herradura está en la costa del Pacífico Central de Costa Rica, a minutos de Jacó y justo al lado del famoso Los Sueños Marina Resort — y los caminos a su alrededor son algunos de los mejores para off-road en el país.

**Tours de ATV directo desde Herradura**

Con Vamos Jacó Tours, no tienes que preocuparte por llegar al punto de partida. Ofrecemos recogida y regreso gratuitos desde tu hotel o alquiler vacacional en cualquier punto de Herradura, incluyendo la zona de Los Sueños y Playa Herradura. Desde allí es un corto recorrido hasta senderos que atraviesan la selva, cruzan ríos y suben a miradores con vista a la Bahía de Herradura y el océano Pacífico.

**Recorre la zona de Los Sueños**

El terreno alrededor de Los Sueños y las colinas de Herradura es exactamente lo que los amantes del ATV sueñan: caminos selváticos embarrados, subidas empinadas, cruces de arroyos y caminos de finca abiertos con vistas costeras espectaculares. Como somos una empresa local con base entre Jacó y Herradura, nuestros guías recorren estos senderos todo el año y conocen las mejores rutas para cada clima y nivel. Ya sea que quieras una introducción tranquila o un día lleno de adrenalina, adaptamos el paseo a ti.

**Tours flexibles de 1 hora a día completo**

Los tours de ATV en Herradura van desde 1 hora hasta un día completo. Un paseo de 1 hora es perfecto si quieres probar la selva entre actividades. Para explorar más, elige 2, 3 o 4 horas. Y para los más rudos, nuestra expedición de día completo cubre el mayor terreno que Herradura tiene para ofrecer. Cada tour incluye tu ATV, casco, equipo de seguridad, un guía bilingüe certificado y transporte de hotel de ida y vuelta.

**Combina tu aventura en Herradura**

Hospedarte cerca de la marina facilita combinar tu paseo en ATV con otras actividades. Combínalo con un tour de jet ski en las playas cercanas, un canopy sobre la selva o un paseo en side-by-side: los incluimos en paquetes combinados para que ahorres tiempo y dinero.

**Amigable para principiantes y familias**

No se requiere experiencia. Los conductores deben ser mayores de 18 años con licencia válida; los pasajeros de todas las edades pueden ir como acompañantes. Nuestros guías dan una charla completa de seguridad y te acompañan durante todo el recorrido.

¿Listo para explorar Herradura de la forma divertida? Reserva hoy tu tour de ATV en Herradura, Costa Rica y descubre el lado salvaje del Pacífico Central.`,
        },
        faqs: {
            en: [
                {
                    question: 'Is the ATV tour in Herradura good for beginners?',
                    answer: 'Absolutely. No prior experience needed. Our certified guides provide a full safety briefing and adapt the trail to your pace.',
                },
                {
                    question: 'How much does an ATV tour in Herradura cost?',
                    answer: 'Tours start at $60 per person for 1 hour, with 2, 3, 4-hour and all-day options available.',
                },
                {
                    question: 'Does the ATV tour pick up from Los Sueños in Herradura?',
                    answer: 'Yes. Free round-trip pickup is included from hotels and rentals in Herradura, including the Los Sueños Marina Resort area.',
                },
                {
                    question: 'Can I combine the Herradura ATV tour with other activities?',
                    answer: 'Yes! We offer combo packages combining ATV with jet ski, zipline, and other adventures.',
                },
                {
                    question: 'What is the minimum age for ATV tours in Herradura?',
                    answer: 'Drivers must be 18+ with a valid license. Passengers of all ages are welcome as riders.',
                },
            ],
            es: [
                {
                    question: '¿El tour de ATV en Herradura es bueno para principiantes?',
                    answer: 'Absolutamente. No se necesita experiencia previa. Nuestros guías certificados dan una charla completa de seguridad y adaptan el camino a tu ritmo.',
                },
                {
                    question: '¿Cuánto cuesta un tour de ATV en Herradura?',
                    answer: 'Los tours comienzan en $60 por persona por 1 hora, con opciones de 2, 3, 4 horas y día completo.',
                },
                {
                    question: '¿El tour de ATV recoge en Los Sueños en Herradura?',
                    answer: 'Sí. La recogida y regreso gratuitos están incluidos desde hoteles y alquileres en Herradura, incluyendo la zona del Los Sueños Marina Resort.',
                },
                {
                    question: '¿Puedo combinar el tour de ATV en Herradura con otras actividades?',
                    answer: '¡Sí! Ofrecemos paquetes combinados de ATV con jet ski, canopy y otras aventuras.',
                },
                {
                    question: '¿Cuál es la edad mínima para los tours de ATV en Herradura?',
                    answer: 'Los conductores deben ser mayores de 18 años con licencia válida. Los pasajeros de todas las edades pueden ir como acompañantes.',
                },
            ],
        },
        faqHeading: {
            en: 'ATV Tours in Herradura — FAQ',
            es: 'Tours de ATV en Herradura — Preguntas Frecuentes',
        },
        schemaDescription:
            'ATV tours in Herradura, Costa Rica with free pickup from Los Sueños and Playa Herradura hotels. Jungle trails, river crossings and Pacific viewpoints with certified bilingual guides. Book online.',
    },
};

export function getTourSeoOverride(slug: string | undefined | null): TourSeoOverride | undefined {
    if (!slug) return undefined;
    return TOUR_SEO_OVERRIDES[slug];
}
