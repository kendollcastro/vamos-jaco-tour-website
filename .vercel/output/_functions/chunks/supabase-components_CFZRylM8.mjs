import { s as supabase } from './supabase_oFwH5q6M.mjs';

async function getWebsiteComponent(id) {
  if (!supabase) return null;
  const { data, error } = await supabase.from("website_components").select("*").eq("id", id).single();
  if (error) {
    if (error.code !== "PGRST116") {
      console.error("Error fetching website component:", error);
    }
    return null;
  }
  return data;
}
async function updateWebsiteComponent(id, componentData) {
  if (!supabase) return false;
  const existing = await getWebsiteComponent(id);
  if (existing) {
    const { error } = await supabase.from("website_components").update({ data: componentData, updated_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", id);
    if (error) {
      console.error("Error updating website component:", error);
      return false;
    }
  } else {
    const { error } = await supabase.from("website_components").insert([{ id, name: id.replace("_", " ").toUpperCase(), data: componentData }]);
    if (error) {
      console.error("Error creating website component:", error);
      return false;
    }
  }
  return true;
}

export { getWebsiteComponent as g, updateWebsiteComponent as u };
