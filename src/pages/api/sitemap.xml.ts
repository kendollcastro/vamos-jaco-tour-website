import type { APIRoute } from 'astro';
import { getAllTours } from '../../data/tours';

export const prerender = false;

const SITE_URL = 'https://vamosjacotoursdev.com';

export const GET: APIRoute = async () => {
  let tours: any[] = [];
  
  try {
    tours = await getAllTours();
  } catch (e) {
    console.error('Failed to fetch tours for sitemap:', e);
  }

  const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'daily' },
    { url: '/tours', priority: '0.9', changefreq: 'daily' },
    { url: '/about', priority: '0.7', changefreq: 'monthly' },
    { url: '/contact', priority: '0.7', changefreq: 'monthly' },
    { url: '/blog', priority: '0.7', changefreq: 'weekly' },
    { url: '/blog/best-time-to-visit-jaco-costa-rica', priority: '0.6', changefreq: 'monthly' },
    { url: '/blog/atv-vs-side-by-side-costa-rica', priority: '0.6', changefreq: 'monthly' },
  ];

  const tourPages = tours.map(tour => ({
    url: `/tours/${tour.slug}`,
    priority: '0.8',
    changefreq: 'weekly',
  }));

  const allPages = [...staticPages, ...tourPages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
};