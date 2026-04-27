import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

// Use the ANON KEY to simulate the app's behavior if service role fails
const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || '';
const supabaseAnon = process.env.PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnon);

async function check() {
    console.log("Testing ANON access to 'tours' table...");
    const { data, error } = await supabase
        .from('tours')
        .select('id, slug')
        .eq('slug', 'surf-class')
        .single();
    
    if (error) {
        console.error("ANON Read Error:", error.message);
    } else {
        console.log("ANON Read Success! Tour ID:", data.id);
    }
}

check();
