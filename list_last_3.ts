import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

async function check() {
    console.log("Listing last 3 bookings by created_at...");
    const { data, error } = await supabaseAdmin
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);
    
    if (error) {
        console.error("Error:", error.message);
    } else {
        data?.forEach((b, i) => {
            console.log(`${i+1}. ID: ${b.id}`);
            console.log(`   Customer: ${b.customer_name}`);
            console.log(`   Status: ${b.status}`);
            console.log(`   Created At: ${b.created_at}`);
            console.log(`   Booking Date: ${b.booking_date}`);
            console.log('---');
        });
    }
}

check();
