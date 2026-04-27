import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

async function check() {
    console.log("Checking for bookings created today (2026-04-27)...");
    const { data, error } = await supabaseAdmin
        .from('bookings')
        .select('*')
        .gte('created_at', '2026-04-27T00:00:00')
        .order('created_at', { ascending: false });
    
    if (error) {
        console.error("Error:", error.message);
    } else {
        console.log(`Found ${data?.length} bookings for today.`);
        data?.forEach(b => {
            console.log(`- ${b.customer_name}: ID=${b.id}, Status=${b.status}, TilopayID=${b.tilopay_order_id}, CreatedAt=${b.created_at}`);
        });
    }
}

check();
