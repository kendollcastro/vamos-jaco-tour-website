// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.vamosjacotours.com',
  output: 'server',
  adapter: vercel(),
  trailingSlash: 'ignore',

  integrations: [
    react(),
    sitemap({
      filter: (page) => !page.includes('/admin') && !page.includes('/api'),
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en', es: 'es' },
      },
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
    ssr: {
      external: ['@supabase/supabase-js'],
    },
  }
});
