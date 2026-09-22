import type { APIRoute } from 'astro';
import { site } from '../data/site';

// Generated at build time so the sitemap line follows whatever domain the site is deployed on.
export const GET: APIRoute = () =>
  new Response(`User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap-index.xml\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
