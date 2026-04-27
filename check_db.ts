import { supabaseAdmin } from './src/lib/supabase';
import 'dotenv/config';

async function check() {
    if (!supabaseAdmin) {
        console.log("No supabase admin client");
        return;
    }
    const { data, count, error } = await supabaseAdmin
        .from('bookings')
        .select('*', { count: 'exact' });
    
    if (error) {
        console.error("Error:", error);
    } else {
        console.log(`Total bookings in DB: ${count}`);
        console.log("Recent bookings:", data?.slice(0, 5).map(b => ({id: b.id, name: b.customer_name, status: b.status})));
    }
}

check();
