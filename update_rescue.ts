import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

async function check() {
    const orderId = 'f0af16c9-e3d1-4fb3-a799-44cadf91703e';

    console.log(`Updating Order ID: ${orderId} to confirmed...`);
    
    const { error: dbError } = await supabaseAdmin
        .from('bookings')
        .update({
            status: 'confirmed',
            tilopay_order_id: 'RESCUED_4849507'
        })
        .eq('id', orderId);

    if (dbError) {
        console.error("Update FAILED:", dbError.message);
    } else {
        console.log("Update SUCCESSFUL! The booking should now appear as CONFIRMED in the admin dashboard.");
    }
}

check();
