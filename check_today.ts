import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

async function check() {
    console.log("Looking for recent bookings...");
    const { data: bookings, error } = await supabaseAdmin
        .from('bookings')
        .select('id, status, customer_name, tilopay_order_id, booking_time, created_at')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });
    
    if (error) {
        console.error("Error:", error.message);
    } else {
        bookings?.forEach((b, i) => {
            console.log(`- ${b.customer_name}: Status=${b.status}, TiloPayID=${b.tilopay_order_id}, Time=${b.booking_time}, Created=${b.created_at}`);
        });
    }
}

check();
