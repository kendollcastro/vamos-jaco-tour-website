import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

async function check() {
    const orderId = 'f0af16c9-e3d1-4fb3-a799-44cadf91703e';
    console.log(`Checking specifically for Order ID: ${orderId}`);
    const { data, error } = await supabaseAdmin
        .from('bookings')
        .select('*')
        .eq('id', orderId)
        .single();
    
    if (error) {
        console.error("Error:", error.message);
    } else {
        console.log("MATCH FOUND!");
        console.log(`Customer: ${data.customer_name}`);
        console.log(`Status: ${data.status}`);
        console.log(`Tilopay ID: ${data.tilopay_order_id}`);
        console.log(`Created At: ${data.created_at}`);
    }
}

check();
