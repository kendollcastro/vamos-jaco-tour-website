import { supabase, supabaseAdmin } from './supabase';

export interface TeamMember {
    id: string;
    name: string;
    position_en: string | null;
    position_es: string | null;
    image_url: string;
    social_instagram: string;
    social_linkedin: string;
    social_twitter: string;
    display_order: number;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
}

export type TeamMemberInput = Omit<TeamMember, 'id' | 'created_at' | 'updated_at'>;

/**
 * Fetch all active team members (Public)
 */
export async function getTeamMembers(): Promise<TeamMember[]> {
    if (!supabase) return [];

    const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Error fetching team members:', error);
        return [];
    }

    return data as TeamMember[];
}

/**
 * Fetch all team members including inactive (Admin)
 */
export async function getAllTeamMembersAdmin(): Promise<TeamMember[]> {
    if (!supabase) return [];

    const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Error fetching all team members:', error);
        return [];
    }

    return data as TeamMember[];
}

/**
 * Create a new team member (Admin)
 */
export async function createTeamMember(member: TeamMemberInput): Promise<TeamMember | null> {
    if (!supabase) return null;

    const { data, error } = await supabase
        .from('team_members')
        .insert([member])
        .select()
        .single();

    if (error) {
        console.error('Error creating team member:', error);
        throw error;
    }

    return data as TeamMember;
}

/**
 * Update a team member (Admin)
 */
export async function updateTeamMember(id: string, updates: Partial<TeamMemberInput>): Promise<TeamMember | null> {
    if (!supabase) return null;

    const { data, error } = await supabase
        .from('team_members')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating team member:', error);
        throw error;
    }

    return data as TeamMember;
}

/**
 * Delete a team member (Admin)
 */
export async function deleteTeamMember(id: string): Promise<boolean> {
    if (!supabase) return false;

    const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting team member:', error);
        throw error;
    }

    return true;
}
