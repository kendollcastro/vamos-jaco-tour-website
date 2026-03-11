import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envFile = fs.readFileSync(resolve(__dirname, '.env'), 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) env[match[1].trim()] = match[2].trim();
});

const url = env.PUBLIC_SUPABASE_URL + '/rest/v1/tours';
const key = env.PUBLIC_SUPABASE_ANON_KEY;

const surfTour = {
    slug: 'surf-class',
    name_en: 'Surf Lessons',
    name_es: 'Clases de Surf',
    description_en: 'Lessons for beginners, intermediates & advanced! Our certified instructors will get you standing on the board in no time. Security deposit: It is not required! Transportation from the Herradura or Jaco area can be included free of charge. If it is a specific and long distance, there will be an extra charge for the tour.\n\nWhat to bring? T-shirt to surf, towel, Sun Protector.',
    description_es: '¡Lecciones para principiantes, intermedios y avanzados! Nuestros instructores certificados te ayudarán a ponerte de pie en la tabla en poco tiempo. Depósito de seguridad: ¡No se requiere! El transporte desde el área de Herradura o Jacó se puede incluir sin cargo. Si es una distancia específica y larga, habrá un cargo extra por el tour.\n\n¿Qué traer? Camiseta para surfear, toalla, protector solar.',
    price_base: 70,
    image_url: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?q=80&w=2070&auto=format&fit=crop',
    location: 'Jacó Beach',
    duration: '90 Min',
    category: 'water',
    badge_text: 'Popular',
    badge_color: 'yellow',
    highlights_en: [
        'Lessons for beginners, intermediates & advanced',
        'Private and group classes available',
        'No security deposit required',
        'Transportation from Herradura/Jaco included'
    ],
    highlights_es: [
        'Lecciones para principiantes, intermedios y avanzados',
        'Clases privadas y grupales disponibles',
        'No se requiere depósito de seguridad',
        'Transporte desde Herradura/Jacó incluido'
    ],
    includes_en: [
        'Surfboard & rash guard',
        'Certified instructor',
        'Transportation (local area)'
    ],
    includes_es: [
        'Tabla de surf y lycra',
        'Instructor certificado',
        'Transporte (área local)'
    ],
    pricing_options: [
        { duration: "Group Class (90min)", price: 70 },
        { duration: "Private Class (90min)", price: 100 }
    ],
    gallery: [
        'https://images.unsplash.com/photo-1502680390469-be75c86b636f?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1516480572848-1215b244799b?q=80&w=2070&auto=format&fit=crop'
    ],
    is_active: true
};

async function run() {
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'apikey': key,
            'Authorization': 'Bearer ' + key,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        },
        body: JSON.stringify(surfTour)
    });

    if (!res.ok) {
        console.error('Failed to insert. Status:', res.status, await res.text());
    } else {
        const data = await res.json();
        console.log('Successfully inserted Surf Class:', data[0].slug);
    }
}
run();
