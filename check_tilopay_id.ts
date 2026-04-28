import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

async function check() {
    console.log("Listing last 2 bookings...");
    const { data, error } = await supabaseAdmin
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(2);
    
    if (error) {
        console.error("Error:", error.message);
    } else {
        data?.forEach((b, i) => {
            console.log(`\n--- BOOKING ${i+1} ---`);
            console.log(`ID: ${b.id}`);
            console.log(`Status: ${b.status}`);
            console.log(`Tilopay Order ID: ${b.tilopay_order_id}`);
            console.log(`Tilopay Response: ${JSON.stringify(b.tilopay_response)}`);
        });
    }
}

check();
