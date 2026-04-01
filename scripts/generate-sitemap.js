import fs from 'fs';
import path from 'path';

const SITE_URL = 'https://mercy.vn';
const TODAY = new Date().toISOString().split('T')[0];

const staticPages = [
  { url: '/', priority: '1.0', changefreq: 'daily' },
  { url: '/shop', priority: '0.9', changefreq: 'daily' },
  { url: '/login', priority: '0.3', changefreq: 'monthly' },
  { url: '/register', priority: '0.3', changefreq: 'monthly' },
  { url: '/wishlist', priority: '0.5', changefreq: 'weekly' },
  { url: '/compare', priority: '0.5', changefreq: 'weekly' },
  { url: '/cart', priority: '0.4', changefreq: 'weekly' },
];

// Read product IDs from products.ts
const productsFile = fs.readFileSync(path.resolve('src/data/products.ts'), 'utf-8');
const productIds = [...productsFile.matchAll(/^\s*id:\s*(\d+)/gm)].map(m => m[1]);

const productPages = productIds.map(id => ({
  url: `/product/${id}`,
  priority: '0.8',
  changefreq: 'weekly',
}));

const allPages = [...staticPages, ...productPages];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(p => `  <url>
    <loc>${SITE_URL}${p.url}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

fs.writeFileSync(path.resolve('public/sitemap.xml'), sitemap);
console.log(`✅ Sitemap generated with ${allPages.length} URLs`);
