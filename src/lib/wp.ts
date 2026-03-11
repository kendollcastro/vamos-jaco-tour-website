// WordPress API Client

// We assume these variables are present in the .env file.
const WP_URL = import.meta.env.PUBLIC_WP_URL || 'https://api.vamosjacotours.com/wp-json';


/**
 * Fetch from standard WordPress REST API (e.g., posts, pages, custom post types)
 * Typically used for public readable data.
 */
export async function fetchWPAPI<T = any>(endpoint: string): Promise<T | null> {
    try {
        const res = await fetch(`${WP_URL}/wp/v2/${endpoint}`);
        if (!res.ok) {
            console.error(`Error fetching WP API [${endpoint}]:`, res.statusText);
            return null;
        }
        return await res.json();
    } catch (error) {
        console.error(`Fetch exception WP API [${endpoint}]:`, error);
        return null;
    }
}

