/**
 * Strip HTML tags and dangerous content from user input.
 * Keeps text content safe before storing in DB.
 */
export function sanitize(input: string, maxLength = 1000): string {
    return input
        .trim()
        .replace(/<[^>]*>/g, '')  // strip HTML tags
        .replace(/[<>]/g, '')      // remove any remaining angle brackets
        .slice(0, maxLength);
}

/**
 * Sanitize an email address: lowercase, trim, strip HTML.
 */
export function sanitizeEmail(input: string): string {
    return input
        .trim()
        .toLowerCase()
        .replace(/<[^>]*>/g, '')
        .slice(0, 254);
}

/**
 * Sanitize a phone number: strip non-digit characters except +, -, (, ).
 */
export function sanitizePhone(input: string): string {
    return input
        .trim()
        .replace(/<[^>]*>/g, '')
        .replace(/[^\d\s\+\(\)\-]/g, '')
        .slice(0, 20);
}
