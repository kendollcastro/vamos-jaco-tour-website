import { supabase } from './supabase';

export interface WebsiteComponent {
    id: string;
    name: string;
    data: any;
    updated_at?: string;
}

export async function getWebsiteComponent(id: string): Promise<WebsiteComponent | null> {
    if (!supabase) return null;

    const { data, error } = await supabase
        .from('website_components')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        if (error.code !== 'PGRST116') { // Not found error code
            console.error('Error fetching website component:', error);
        }
        return null;
    }

    return data as WebsiteComponent;
}

export async function updateWebsiteComponent(id: string, componentData: any): Promise<boolean> {
    if (!supabase) return false;

    // Check if it exists
    const existing = await getWebsiteComponent(id);

    if (existing) {
        const { error } = await supabase
            .from('website_components')
            .update({ data: componentData, updated_at: new Date().toISOString() })
            .eq('id', id);

        if (error) {
            console.error('Error updating website component:', error);
            return false;
        }
    } else {
        // We shouldn't really hit this as we are inserting the row manually, but just in case
        const { error } = await supabase
            .from('website_components')
            .insert([{ id, name: id.replace('_', ' ').toUpperCase(), data: componentData }]);

        if (error) {
            console.error('Error creating website component:', error);
            return false;
        }
    }

    return true;
}
