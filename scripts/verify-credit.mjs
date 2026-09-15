import { readFileSync } from 'node:fs';

const footerPath = 'src/components/Footer.tsx';

const requiredMarkers = [
    ['crédito Siwakode en footer', 'Siwakode'],
    ['enlace al sitio de Siwakode', 'creditLink'],
    ['marca de autoría en código', 'Siwakode: created this site'],
];

try {
    const source = readFileSync(footerPath, 'utf-8');
    for (const [label, marker] of requiredMarkers) {
        if (!source.includes(marker)) {
            console.error(`\n🚫 ERROR LICENCIA: falta el ${label} en ${footerPath}.`);
            console.error('   La atribución a Siwakode es parte del acuerdo de desarrollo.');
            console.error('   Restaura el crédito para poder compilar el sitio.\n');
            process.exit(1);
        }
    }
    console.log('✅ Licencia Siwakode verificada: crédito presente en el footer.');
} catch (err) {
    console.error(`\n🚫 ERROR LICENCIA: no se pudo verificar la atribución (${err.message}).\n`);
    process.exit(1);
}