import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://ddukdjdiqjvfjywuhnpn.supabase.co";
const supabaseAnon = "sb_publishable_KmH_YI-SW3sJg58blZFTEQ_i2vlric5";
function createSafeClient(url, key, options) {
  if (!key) {
    return null;
  }
  return createClient(url, key, options);
}
const supabase = createSafeClient(supabaseUrl, supabaseAnon);
const serviceRoleKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkdWtkamRpcWp2Zmp5d3VobnBuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjQ4MDg3NywiZXhwIjoyMDg4MDU2ODc3fQ.3OB-4S95pqTcGAawXb3XYF4LyFOMHK35Vxt_fBJdtZQ";
const supabaseAdmin = createSafeClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false }
}) ;

export { supabaseAdmin as a, supabase as s };
