import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

async function check() {
    console.log("Checking table columns...");
    const { data: columns, error } = await supabaseAdmin
        .rpc('get_table_columns', { table_name: 'bookings' });
    
    // If RPC doesn't exist, try fetching one row and see keys
    if (error) {
        console.log("RPC failed, fetching one row...");
        const { data, error: fetchError } = await supabaseAdmin.from('bookings').select('*').limit(1).single();
        if (fetchError) {
            console.error("Fetch error:", fetchError.message);
        } else {
            console.log("Columns:", Object.keys(data));
        }
    } else {
        console.log("Columns:", columns);
    }
}

check();
