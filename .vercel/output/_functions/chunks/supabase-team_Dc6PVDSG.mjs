import { s as supabase } from './supabase_oFwH5q6M.mjs';

async function getTeamMembers() {
  if (!supabase) return [];
  const { data, error } = await supabase.from("team_members").select("*").order("display_order", { ascending: true }).order("created_at", { ascending: true });
  if (error) {
    console.error("Error fetching team members:", error);
    return [];
  }
  return data;
}
async function getAllTeamMembersAdmin() {
  if (!supabase) return [];
  const { data, error } = await supabase.from("team_members").select("*").order("display_order", { ascending: true }).order("created_at", { ascending: true });
  if (error) {
    console.error("Error fetching all team members:", error);
    return [];
  }
  return data;
}
async function createTeamMember(member) {
  if (!supabase) return null;
  const { data, error } = await supabase.from("team_members").insert([member]).select().single();
  if (error) {
    console.error("Error creating team member:", error);
    throw error;
  }
  return data;
}
async function updateTeamMember(id, updates) {
  if (!supabase) return null;
  const { data, error } = await supabase.from("team_members").update(updates).eq("id", id).select().single();
  if (error) {
    console.error("Error updating team member:", error);
    throw error;
  }
  return data;
}
async function deleteTeamMember(id) {
  if (!supabase) return false;
  const { error } = await supabase.from("team_members").delete().eq("id", id);
  if (error) {
    console.error("Error deleting team member:", error);
    throw error;
  }
  return true;
}

export { getAllTeamMembersAdmin as a, createTeamMember as c, deleteTeamMember as d, getTeamMembers as g, updateTeamMember as u };
