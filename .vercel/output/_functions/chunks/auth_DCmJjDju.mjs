import { s as supabase } from './supabase_oFwH5q6M.mjs';

async function verifyAdmin(request) {
  if (!supabase) {
    return { authorized: false, error: "Supabase not configured" };
  }
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { authorized: false, error: "Missing or invalid Authorization header" };
  }
  const token = authHeader.replace("Bearer ", "");
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return { authorized: false, error: "Invalid or expired token" };
    }
    return { authorized: true, userId: user.id };
  } catch (err) {
    return { authorized: false, error: "Token verification failed" };
  }
}

export { verifyAdmin as v };
