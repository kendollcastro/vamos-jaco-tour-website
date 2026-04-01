// src/lib/tilopay.ts
// Handles authentication and payment session creation for the Tilopay Gateway

const TILOPAY_API_URL = import.meta.env.TILOPAY_API_URL || 'https://app.tilopay.com/api/v1';
const TILOPAY_API_USER = import.meta.env.TILOPAY_API_USER;
const TILOPAY_API_PASSWORD = import.meta.env.TILOPAY_API_PASSWORD;
const TILOPAY_API_KEY = import.meta.env.TILOPAY_API_KEY;

// Production domain for TiloPay redirect URLs
const PUBLIC_DOMAIN = 'https://vamos-jaco-tour-website.vercel.app';

interface TilopayCustomerInfo {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
}

interface TilopayPaymentParams {
    amount: number;
    orderNumber: string;
    customer: TilopayCustomerInfo;
    language?: 'en' | 'es';
}

/**
 * Authenticate with Tilopay to get a temporary Bearer access token.
 */
async function getAccessToken(): Promise<string> {
    if (!TILOPAY_API_USER || !TILOPAY_API_PASSWORD) {
        throw new Error("Tilopay credentials (USER/PASSWORD) are missing in environment variables.");
    }

    try {
        const response = await fetch(`${TILOPAY_API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                apiuser: TILOPAY_API_USER,
                password: TILOPAY_API_PASSWORD
            })
        });

        if (!response.ok) {
            const errData = await response.text();
            throw new Error(`Tilopay Auth Error: ${response.status} - ${errData}`);
        }

        const data = await response.json();
        if (!data.access_token) {
            throw new Error("Invalid response from Tilopay: Missing access_token.");
        }

        return data.access_token;
    } catch (error) {
        console.error("Error authenticating with Tilopay:", error);
        throw error;
    }
}

/**
 * Creates a unique payment session and returns the secure checkout URL.
 * The customer is redirected to this URL to complete payment on Tilopay's servers.
 */
export async function createPaymentSession(params: TilopayPaymentParams): Promise<string> {
    if (!TILOPAY_API_KEY) {
        throw new Error("Tilopay API Key is missing in environment variables.");
    }

    const token = await getAccessToken();

    // Setup redirect URL back to our application upon payment completion/failure
    const lang = params.language || 'en';
    const redirectUrl = `${PUBLIC_DOMAIN}/api/tilopay/callback?order=${params.orderNumber}&lang=${lang}`;

    // Map internal booking details to Tilopay's expected schema
    const payload = {
        redirect: redirectUrl,
        key: TILOPAY_API_KEY,
        amount: params.amount.toFixed(2).toString(),
        currency: "USD",
        billToFirstName: params.customer.firstName || "Customer",
        billToLastName: params.customer.lastName || "VamosJaco",
        billToEmail: params.customer.email,
        billToTelephone: params.customer.phone || "00000000",
        // Fallbacks for generic required fields if our checkout doesn't ask for them
        billToAddress: "Vamos Jacó",
        billToAddress2: "N/A",
        billToCity: "Jacó",
        billToState: "Puntarenas",
        billToZipPostCode: "61101",
        billToCountry: "CR",
        orderNumber: params.orderNumber,
        capture: "1", // Capture immediately (Sale)
        subscription: "0",
        platform: "api",
        hashVersion: "V2"
    };

    try {
        const response = await fetch(`${TILOPAY_API_URL}/processPayment`, {
            method: 'POST',
            headers: {
                'Authorization': `bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errData = await response.text();
            throw new Error(`Tilopay Payment Creation Error: ${response.status} - ${errData}`);
        }

        const data = await response.json();
        
        // Tilopay normally returns { url: "https://secure.tilopay.com/..." }
        if (!data.url) {
            console.error("Tilopay Response missing redirect URL:", data);
            throw new Error("Tilopay failed to generate a checkout URL.");
        }

        return data.url;
    } catch (error) {
        console.error("Error creating Tilopay payment session:", error);
        throw error;
    }
}
