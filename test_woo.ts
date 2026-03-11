import { fetchWooAPI } from './src/lib/wp.ts';

async function test() {
    console.log("Fetching ATV from woo...");
    const data = await fetchWooAPI('products?slug=atv');
    console.log(JSON.stringify(data[0], null, 2));
}
test();
