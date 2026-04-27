import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

async function check() {
    console.log("Listing tours in the DB...");
    const { data: tour_data, error } = await supabaseAdmin
        .from('tours')
        .select('*')
        .limit(1);
    
    if (error) {
        console.error("Error:", error.message);
    } else {
        console.log("Schema hint:", Object.keys(tour_data?.[0] || {}));
        
        const { data, error: fetchError } = await supabaseAdmin
            .from('tours')
            .select('id, slug');
        
        if (fetchError) {
            console.error("Fetch Error:", fetchError.message);
        } else {
            console.log(`Found ${data?.length} tours.`);
            data?.forEach(t => {
                console.log(`- slug=${t.slug}, id=${t.id}`);
            });
        }
    }
}

check();
