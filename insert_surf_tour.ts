import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '.env') });

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

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

async function insertTour() {
    // Check if it already exists
    const { data: existing } = await supabase.from('tours').select('id').eq('slug', surfTour.slug).single();

    if (existing) {
        console.log('Tour already exists, updating...');
        const { error } = await supabase.from('tours').update(surfTour).eq('id', existing.id);
        if (error) console.error('Error updating:', error);
        else console.log('Successfully updated Surf tour!');
    } else {
        console.log('Inserting new tour...');
        const { error } = await supabase.from('tours').insert([surfTour]);
        if (error) console.error('Error inserting:', error);
        else console.log('Successfully inserted Surf tour!');
    }
}

insertTour();
