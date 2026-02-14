export type TourCategory = 'atv' | 'water' | 'nature' | 'extreme' | 'relax';

export interface Tour {
    id: string;
    title: { en: string; es: string };
    price: number;
    originalPrice?: number;
    image_url: string;
    location: string;
    duration: string;
    description: { en: string; es: string };
    badge?: { text: string; color: 'yellow' | 'red' | 'green' };
    pricing_options: { duration: string; price: number }[];
    category: TourCategory;
    highlights?: { en: string[]; es: string[] };
    includes?: { en: string[]; es: string[] };
}

export const tours: Tour[] = [
    {
        id: 'atv-tours',
        title: {
            en: "ATV Mountain Adventure",
            es: "Aventura en Cuadra (ATV)"
        },
        price: 60,
        image_url: "/images/activities/atv-adventure.png",
        location: "Jacó Mountains",
        duration: "1 - 5 Hours",
        description: {
            en: "Enjoy stunning landscapes, water and mud trails with our powerful ATVs. Ride through the lush Costa Rican jungle, cross rivers, and reach breathtaking mountain viewpoints overlooking the Pacific Ocean.",
            es: "Disfruta de paisajes impresionantes y senderos de agua y barro con nuestras potentes cuadras. Recorre la exuberante jungla costarricense, cruza ríos y alcanza impresionantes miradores de montaña con vista al Océano Pacífico."
        },
        badge: {
            text: "Best Seller",
            color: "red"
        },
        pricing_options: [
            { duration: "1 Hour", price: 60 },
            { duration: "2 Hours", price: 90 },
            { duration: "3 Hours", price: 125 },
            { duration: "4 Hours", price: 150 },
            { duration: "All Day", price: 180 },
        ],
        category: 'atv',
        highlights: {
            en: [
                "Ride through jungle trails & river crossings",
                "Mountain viewpoints with Pacific Ocean views",
                "Professional guide included",
                "Suitable for beginners & experienced riders",
                "Helmets & safety gear provided"
            ],
            es: [
                "Recorre senderos de jungla y cruces de ríos",
                "Miradores de montaña con vista al Pacífico",
                "Guía profesional incluido",
                "Apto para principiantes y experimentados",
                "Cascos y equipo de seguridad incluidos"
            ]
        },
        includes: {
            en: ["ATV rental", "Helmet & goggles", "Professional bilingual guide", "Water & snacks", "Insurance"],
            es: ["Alquiler de ATV", "Casco y gafas", "Guía profesional bilingüe", "Agua y snacks", "Seguro"]
        }
    },
    {
        id: 'side-by-side',
        title: {
            en: "Side by Side Buggy Tour",
            es: "Tour en Buggy Side by Side"
        },
        price: 150,
        image_url: "https://images.unsplash.com/photo-1534068598738-33519183cc15?q=80&w=2070&auto=format&fit=crop",
        location: "Jacó Trails",
        duration: "1 - 5 Hours",
        description: {
            en: "The perfect adventure for groups and families. Ride a powerful Side by Side buggy through the best trails in Jacó. No experience needed — just buckle up and enjoy the adrenaline!",
            es: "La aventura perfecta para grupos y familias. Conduce un potente buggy Side by Side por los mejores senderos de Jacó. No necesitas experiencia — ¡solo abróchate el cinturón y disfruta la adrenalina!"
        },
        badge: {
            text: "Popular",
            color: "yellow"
        },
        pricing_options: [
            { duration: "1 Hour", price: 150 },
            { duration: "2 Hours", price: 230 },
            { duration: "3 Hours", price: 300 },
            { duration: "4 Hours", price: 380 },
            { duration: "5 Hours", price: 450 },
        ],
        category: 'atv',
        highlights: {
            en: [
                "Fits 2 passengers per vehicle",
                "Powerful 1000cc engine",
                "Jungle & mountain trails",
                "No driving experience needed",
                "Full safety briefing included"
            ],
            es: [
                "Capacidad para 2 pasajeros por vehículo",
                "Potente motor de 1000cc",
                "Senderos de jungla y montaña",
                "No se necesita experiencia de conducción",
                "Charla de seguridad incluida"
            ]
        },
        includes: {
            en: ["Side by Side rental", "Helmet & seatbelt", "Professional guide", "Water", "Insurance"],
            es: ["Alquiler de Side by Side", "Casco y cinturón", "Guía profesional", "Agua", "Seguro"]
        }
    },
    {
        id: 'jet-ski',
        title: {
            en: "Jet Ski Ocean Thrill",
            es: "Emoción en Jet Ski"
        },
        price: 120,
        image_url: "https://images.unsplash.com/photo-1582650082728-1c4b14647347?q=80&w=2070&auto=format&fit=crop",
        location: "Jacó Beach / Herradura",
        duration: "1 - 5 Hours",
        description: {
            en: "Explore the ocean and enjoy a fun adventure on the water! Race across the Pacific waves, explore hidden coves, and feel the salt spray on your face.",
            es: "¡Explora el océano y disfruta de una divertida aventura en el agua! Corre por las olas del Pacífico, explora calas escondidas y siente la brisa marina en tu rostro."
        },
        pricing_options: [
            { duration: "1 Hour", price: 120 },
            { duration: "2 Hours", price: 200 },
            { duration: "3 Hours", price: 280 },
            { duration: "4 Hours", price: 350 },
            { duration: "5 Hours", price: 420 },
        ],
        category: 'water',
        highlights: {
            en: [
                "Ride along the Pacific coastline",
                "Explore hidden beaches & coves",
                "Modern Yamaha jet skis",
                "Solo or tandem riding",
                "Life jacket & safety briefing"
            ],
            es: [
                "Recorre la costa del Pacífico",
                "Explora playas escondidas y calas",
                "Jet skis Yamaha modernos",
                "Conducción individual o en pareja",
                "Chaleco salvavidas y charla de seguridad"
            ]
        },
        includes: {
            en: ["Jet Ski rental", "Life jacket", "Fuel", "Safety briefing", "Insurance"],
            es: ["Alquiler de Jet Ski", "Chaleco salvavidas", "Combustible", "Charla de seguridad", "Seguro"]
        }
    },
    {
        id: 'slingshot',
        title: {
            en: "Slingshot Rental",
            es: "Alquiler de Slingshot"
        },
        price: 350,
        image_url: "https://images.unsplash.com/photo-1563853153579-dd89d6e8736a?q=80&w=2070&auto=format&fit=crop",
        location: "Jacó Area",
        duration: "All Day",
        description: {
            en: "Enjoy our extreme Slingshot ride and experience pure adrenaline. Cruise the coastal roads of Jacó in this head-turning three-wheeled beast.",
            es: "Disfruta de nuestro paseo extremo en Slingshot y experimenta pura adrenalina. Recorre las carreteras costeras de Jacó en esta bestia de tres ruedas."
        },
        badge: {
            text: "Exclusive",
            color: "green"
        },
        pricing_options: [
            { duration: "All Day", price: 350 },
        ],
        category: 'extreme',
        highlights: {
            en: [
                "Polaris Slingshot — 3-wheel roadster",
                "Full day rental",
                "Cruise the coastal highway",
                "Bluetooth speakers built-in",
                "Valid driver's license required"
            ],
            es: [
                "Polaris Slingshot — roadster de 3 ruedas",
                "Alquiler por día completo",
                "Recorre la carretera costera",
                "Altavoces Bluetooth integrados",
                "Se requiere licencia de conducir válida"
            ]
        },
        includes: {
            en: ["Slingshot rental", "Helmet", "Full tank of gas", "Insurance", "Free delivery to hotel"],
            es: ["Alquiler de Slingshot", "Casco", "Tanque lleno", "Seguro", "Entrega gratis al hotel"]
        }
    },
    {
        id: 'surf-class',
        title: {
            en: "Surf Lessons",
            es: "Clases de Surf"
        },
        price: 70,
        image_url: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?q=80&w=2070&auto=format&fit=crop",
        location: "Jacó Beach",
        duration: "90 Min",
        description: {
            en: "Lessons for beginners, intermediate and advanced! Private and Group classes available. Our certified instructors will get you standing on the board in no time.",
            es: "¡Lecciones para principiantes, intermedios y avanzados! Clases privadas y grupales disponibles. Nuestros instructores certificados te pondrán de pie en la tabla en poco tiempo."
        },
        pricing_options: [
            { duration: "Group Class (90min)", price: 70 },
            { duration: "Private Class (90min)", price: 100 },
        ],
        category: 'water',
        highlights: {
            en: [
                "ISA-certified instructors",
                "All levels welcome",
                "Warm Pacific waters year-round",
                "Small group sizes (max 4)",
                "Photo & video package available"
            ],
            es: [
                "Instructores certificados ISA",
                "Todos los niveles bienvenidos",
                "Aguas cálidas del Pacífico todo el año",
                "Grupos pequeños (máx. 4)",
                "Paquete de fotos y video disponible"
            ]
        },
        includes: {
            en: ["Surfboard & rash guard", "Certified instructor", "Beach area setup", "Water", "Insurance"],
            es: ["Tabla de surf y lycra", "Instructor certificado", "Área de playa", "Agua", "Seguro"]
        }
    },
    {
        id: 'flyboard',
        title: {
            en: "Flyboard Experience",
            es: "Experiencia en Flyboard"
        },
        price: 50,
        image_url: "https://images.unsplash.com/photo-1544552866-d3ed42536efd?q=80&w=2070&auto=format&fit=crop",
        location: "Herradura Bay",
        duration: "15 - 60 Min",
        description: {
            en: "Fly above the water like a superhero! The Flyboard uses water jet propulsion to launch you into the air. An unforgettable, jaw-dropping experience.",
            es: "¡Vuela sobre el agua como un superhéroe! El Flyboard usa propulsión de agua para lanzarte al aire. Una experiencia inolvidable e impresionante."
        },
        pricing_options: [
            { duration: "15 Min", price: 50 },
            { duration: "30 Min", price: 80 },
            { duration: "1 Hour", price: 150 },
        ],
        category: 'extreme',
        highlights: {
            en: [
                "No experience needed",
                "Certified instructor in the water with you",
                "Fly up to 15 meters high",
                "Calm bay waters — safe & fun",
                "GoPro footage available"
            ],
            es: [
                "No se necesita experiencia",
                "Instructor certificado en el agua contigo",
                "Vuela hasta 15 metros de altura",
                "Aguas tranquilas de la bahía — seguro y divertido",
                "Video con GoPro disponible"
            ]
        },
        includes: {
            en: ["Flyboard equipment", "Life jacket", "Instructor", "Boat & driver", "Insurance"],
            es: ["Equipo de Flyboard", "Chaleco salvavidas", "Instructor", "Bote y conductor", "Seguro"]
        }
    },
    {
        id: 'tube',
        title: {
            en: "Tubing Adventure",
            es: "Aventura en Tubing"
        },
        price: 30,
        image_url: "https://images.unsplash.com/photo-1622306354602-550e5eb1e4eb?q=80&w=2070&auto=format&fit=crop",
        location: "Herradura Bay",
        duration: "15 - 30 Min",
        description: {
            en: "Fun water tubing for the whole family. Get pulled at high speed on an inflatable tube behind a speedboat. Laughs guaranteed!",
            es: "Divertido tubing en el agua para toda la familia. ¡Déjate llevar a alta velocidad en un tubo inflable detrás de una lancha rápida. Risas garantizadas!"
        },
        pricing_options: [
            { duration: "15 Min", price: 30 },
            { duration: "30 Min", price: 50 },
        ],
        category: 'water',
        highlights: {
            en: [
                "Great for families & kids",
                "Fits up to 3 riders",
                "Multiple speed options",
                "Safe & supervised",
                "Calm bay waters"
            ],
            es: [
                "Ideal para familias y niños",
                "Hasta 3 pasajeros",
                "Múltiples opciones de velocidad",
                "Seguro y supervisado",
                "Aguas tranquilas de la bahía"
            ]
        },
        includes: {
            en: ["Tube rental", "Life jacket", "Speedboat & driver", "Safety briefing", "Insurance"],
            es: ["Alquiler de tubo", "Chaleco salvavidas", "Lancha y conductor", "Charla de seguridad", "Seguro"]
        }
    },
    {
        id: 'banana',
        title: {
            en: "Banana Boat Ride",
            es: "Paseo en Banana Boat"
        },
        price: 30,
        image_url: "https://images.unsplash.com/photo-1571775765956-6554de0179a6?q=80&w=2070&auto=format&fit=crop",
        location: "Jacó Beach",
        duration: "15 - 30 Min",
        description: {
            en: "Hold on tight! The classic beach fun ride. Ride on an inflatable banana boat pulled by a speedboat — see who can hold on the longest!",
            es: "¡Agárrate fuerte! El clásico paseo divertido en la playa. Monta un banana boat inflable jalado por una lancha — ¡ve quién aguanta más!"
        },
        pricing_options: [
            { duration: "15 Min", price: 30 },
            { duration: "30 Min", price: 50 },
        ],
        category: 'water',
        highlights: {
            en: [
                "Fits up to 6 riders",
                "Classic beach party activity",
                "Great for groups & bachelor parties",
                "Safe for all ages (5+)",
                "Unlimited laughs included"
            ],
            es: [
                "Hasta 6 pasajeros",
                "Actividad clásica de playa",
                "Ideal para grupos y despedidas de soltero",
                "Seguro para todas las edades (5+)",
                "Risas ilimitadas incluidas"
            ]
        },
        includes: {
            en: ["Banana boat", "Life jacket", "Speedboat & driver", "Safety briefing", "Insurance"],
            es: ["Banana boat", "Chaleco salvavidas", "Lancha y conductor", "Charla de seguridad", "Seguro"]
        }
    }
];
