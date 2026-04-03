import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_B59yonV-.mjs';
import { manifest } from './manifest_D672ymal.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/404.astro.mjs');
const _page2 = () => import('./pages/about.astro.mjs');
const _page3 = () => import('./pages/admin.astro.mjs');
const _page4 = () => import('./pages/api/admin/settings.astro.mjs');
const _page5 = () => import('./pages/api/admin/test-email.astro.mjs');
const _page6 = () => import('./pages/api/bookings/create.astro.mjs');
const _page7 = () => import('./pages/api/media.astro.mjs');
const _page8 = () => import('./pages/api/newsletter/subscribe.astro.mjs');
const _page9 = () => import('./pages/api/tilopay/callback.astro.mjs');
const _page10 = () => import('./pages/api/tilopay-webhook.astro.mjs');
const _page11 = () => import('./pages/brief.astro.mjs');
const _page12 = () => import('./pages/checkout.astro.mjs');
const _page13 = () => import('./pages/contact.astro.mjs');
const _page14 = () => import('./pages/design-system.astro.mjs');
const _page15 = () => import('./pages/payment-failure.astro.mjs');
const _page16 = () => import('./pages/payment-success.astro.mjs');
const _page17 = () => import('./pages/tours/_id_.astro.mjs');
const _page18 = () => import('./pages/tours.astro.mjs');
const _page19 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/404.astro", _page1],
    ["src/pages/about.astro", _page2],
    ["src/pages/admin/index.astro", _page3],
    ["src/pages/api/admin/settings.ts", _page4],
    ["src/pages/api/admin/test-email.ts", _page5],
    ["src/pages/api/bookings/create.ts", _page6],
    ["src/pages/api/media.ts", _page7],
    ["src/pages/api/newsletter/subscribe.ts", _page8],
    ["src/pages/api/tilopay/callback.ts", _page9],
    ["src/pages/api/tilopay-webhook.ts", _page10],
    ["src/pages/brief.astro", _page11],
    ["src/pages/checkout.astro", _page12],
    ["src/pages/contact.astro", _page13],
    ["src/pages/design-system.astro", _page14],
    ["src/pages/payment-failure.astro", _page15],
    ["src/pages/payment-success.astro", _page16],
    ["src/pages/tours/[id].astro", _page17],
    ["src/pages/tours.astro", _page18],
    ["src/pages/index.astro", _page19]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "db728972-6397-4c45-9264-4e1fbd5ce093",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
