import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

async function check() {
    const { data, error } = await supabaseAdmin
        .from('bookings')
        .select('id, customer_name, tour_id, tour_name')
        .eq('id', '9d2b2114-81d4-47e9-a0dc-2ccdbf122a92')
        .single();
    
    if (error) {
        console.error("Error:", error.message);
    } else {
        console.log("Existing booking details:");
        console.log(`ID: ${data.id}`);
        console.log(`Name: ${data.customer_name}`);
        console.log(`Tour ID (in DB): ${data.tour_id}`);
        console.log(`Tour Name: ${data.tour_name}`);
    }
}

check();
