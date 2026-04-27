import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

async function simulateInitiate() {
    const tourId = 'surf-class'; // verified slug
    const orderId = 'f0af16c9-e3d1-4fb3-a799-44cadf91703e'; // the one from the success page

    console.log("Simulating initiate logic...");
    
    // Step 4: Resolve tour UUID
    let tourUuid = tourId;
    if (supabaseAdmin && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(tourId)) {
        const { data: tourData, error: tourError } = await supabaseAdmin
            .from('tours')
            .select('id')
            .eq('slug', tourId)
            .single();
        if (tourData) {
            tourUuid = tourData.id;
            console.log("Resolved tourUuid:", tourUuid);
        } else {
            console.warn("Failed to resolve tourUuid:", tourError?.message);
        }
    }

    // Step 5: Create PENDING booking
    console.log("Inserting into bookings...");
    const { error: dbError } = await supabaseAdmin.from('bookings').insert({
        id: orderId,
        customer_name: 'TEST KENDOLL TEST',
        customer_email: 'kendollcastrom@gmail.com',
        customer_phone: '50660171996',
        tour_id: tourUuid,
        tour_name: 'Surf Lessons',
        booking_date: '2026-04-28',
        adults: 1,
        children: 0,
        total_amount: 79.1,
        status: 'pending',
        language: 'en'
    });

    if (dbError) {
        console.error("FAILED TO INSERT:", dbError.message);
        console.error("Full error:", dbError);
    } else {
        console.log("SUCCESSFULLY INSERTED!");
    }
}

simulateInitiate();
