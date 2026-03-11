import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load .env manually
const envPath = resolve('.env');
const envContent = readFileSync(envPath, 'utf8');
envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
        process.env[match[1]] = match[2];
    }
});

// Since tours.ts uses import.meta.env, we must mock it BEFORE importing tours.ts
(global as any).import = { meta: { env: process.env } };

// Use dynamic import so `import.meta.env` gets evaluated at runtime when available
import('./src/data/tours.ts').then(m => {
    m.getAllTours().then(tours => {
        const atv = tours.find((t: any) => t.id === 'atv');
        console.log("ATV Tour Data:", JSON.stringify(atv, null, 2));
    }).catch(console.error);
}).catch(console.error);
