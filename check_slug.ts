import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

async function check() {
    console.log("Checking tour_id column type...");
    const { data, error } = await supabaseAdmin
        .rpc('get_table_columns_info', { table_name: 'bookings' });
    
    if (error) {
        // Fallback: This is harder without a helper function.
        // I'll try to insert a row with a SLUG as tour_id and see if it fails.
        console.log("Attempting to insert with slug as tour_id...");
        const { error: slugError } = await supabaseAdmin.from('bookings').insert({
            id: crypto.randomUUID(),
            customer_name: 'TEST SLUG',
            customer_email: 'test@slug.com',
            tour_id: 'surf-lessons', // SLUG
            tour_name: 'Surf Lessons',
            booking_date: '2026-04-28',
            total_amount: 79.1,
            status: 'pending'
        });
        
        if (slugError) {
            console.error("Insert with SLUG failed:", slugError.message);
        } else {
            console.log("Insert with SLUG SUCCEEDED! So tour_id is a string/text.");
        }
    }
}

check();
