import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

async function check() {
    const orderId = 'f0af16c9-e3d1-4fb3-a799-44cadf91703e';
    const tourUuid = '268e3894-e903-468e-aacc-7a8e11f8283e'; // Surf Lessons

    console.log(`Rescuing Order ID: ${orderId} (Attempt 2)...`);
    
    const { error: dbError } = await supabaseAdmin.from('bookings').insert({
        id: orderId,
        customer_name: 'Kendoll Castro',
        customer_email: 'kendollcastrom@gmail.com',
        customer_phone: '50660171996',
        tour_id: tourUuid,
        tour_name: 'Surf Lessons',
        booking_date: '2026-04-28',
        adults: 1,
        children: 0,
        total_amount: 79.1,
        status: 'confirmed', // Corrected status
        tilopay_order_id: 'RESCUED_4849507'
    });

    if (dbError) {
        console.error("Rescue FAILED:", dbError.message);
    } else {
        console.log("Rescue SUCCESSFUL! The booking should now appear in the admin dashboard.");
    }
}

check();
