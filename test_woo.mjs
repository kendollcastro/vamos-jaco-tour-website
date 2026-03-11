import { fetchWooAPI } from './src/lib/wp.js';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
    const data = await fetchWooAPI('products?slug=atv');
    console.log(JSON.stringify(data[0], null, 2));
}
test();
