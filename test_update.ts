import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

async function testUpdate() {
    const bookingId = "870d4456-ec1b-4a50-ac4a-f459b693dd65";
    const params = { test: "value" };
    
    console.log("Updating...");
    const { error } = await supabaseAdmin.from('bookings').update({
        status: 'paid',
        tilopay_order_id: 'test_tpt_123',
        tilopay_response: params
    }).eq('id', bookingId);
    
    console.log("Error? ", error);
}

testUpdate();
