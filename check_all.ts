import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

async function check() {
    console.log("Fetching ALL bookings...");
    const { data: bookings, error } = await supabaseAdmin
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });
    
    if (error) {
        console.error("Error:", error.message);
    } else {
        bookings?.forEach(b => {
            console.log(`- ${b.customer_name}: Status=${b.status}, CreatedAt=${b.created_at}, Date=${b.booking_date}`);
        });
    }
}

check();
