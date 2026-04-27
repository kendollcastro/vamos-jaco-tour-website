import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

// Manual env reading to avoid Astro import.meta issue
const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

async function check() {
    console.log("Checking DB manually...");
    const { data: booking, error } = await supabaseAdmin
        .from('bookings')
        .select('*')
        .eq('customer_name', 'TEST KENDOLL TEST')
        .single();
    
    if (error) {
        console.error("Error fetching booking:", error.message);
    } else {
        console.log("Booking found:", {
            id: booking.id,
            status: booking.status,
            tilopay_order_id: booking.tilopay_order_id,
            created_at: booking.created_at
        });
    }

    const { count } = await supabaseAdmin.from('bookings').select('*', { count: 'exact', head: true });
    console.log("Total bookings:", count);
}

check();
