import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

async function check() {
    console.log("Searching for ANY booking with created_at >= 2026-04-27T00:00:00Z");
    const { data: bookings, error } = await supabaseAdmin
        .from('bookings')
        .select('*')
        .gte('created_at', '2026-04-27T00:00:00Z')
        .order('created_at', { ascending: false });
    
    if (error) {
        console.error("Error:", error.message);
    } else {
        console.log(`Found ${bookings?.length} bookings.`);
        bookings?.forEach(b => {
            console.log(`- ID: ${b.id}, Name: ${b.customer_name}, Status: ${b.status}, Created: ${b.created_at}`);
        });
    }
}

check();
