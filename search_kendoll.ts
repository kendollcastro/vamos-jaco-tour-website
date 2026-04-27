import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

async function check() {
    const { data: bookings, error } = await supabaseAdmin
        .from('bookings')
        .select('*')
        .ilike('customer_name', '%KENDOLL%');
    
    if (error) {
        console.error("Error:", error.message);
    } else {
        console.log(`Found ${bookings?.length} bookings matching KENDOLL`);
        bookings?.forEach(b => {
            console.log(`- ${b.customer_name}: Status=${b.status}, CreatedAt=${b.created_at}, Date=${b.booking_date}`);
        });
    }
}

check();
