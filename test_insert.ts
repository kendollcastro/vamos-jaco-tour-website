import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

async function check() {
    console.log("Attempting to insert a TEST booking...");
    const testId = 'test-' + Date.now();
    const { data, error } = await supabaseAdmin.from('bookings').insert({
        id: 'f0af16c9-e3d1-4fb3-a799-44cadf91703e', // Use the one that failed
        customer_name: 'TEST KENDOLL TEST (RESURRECTED)',
        customer_email: 'kendollcastrom@gmail.com',
        tour_name: 'Resurrected Tour',
        booking_date: '2026-04-28',
        total_amount: 79.1,
        status: 'pending'
    });
    
    if (error) {
        console.error("Insert Error:", error.message);
        console.error("Full error:", error);
    } else {
        console.log("Insert Success!");
    }
}

check();
