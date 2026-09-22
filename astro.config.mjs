import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// SITE_URL = where the built site is served from, e.g. https://flounion.com or https://lildaddy850.github.io/flo-union
// (set as a repository variable in GitHub Actions; unset = the GitHub Pages trial address).
const siteUrl = new URL(process.env.SITE_URL || 'https://lildaddy850.github.io/flo-union');
const base = siteUrl.pathname.replace(/\/$/, '') || '/';
const customDomain = !siteUrl.hostname.endsWith('.github.io');

export default defineConfig({
  site: siteUrl.origin,
  base,
  trailingSlash: 'always',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    sitemap({ filter: (page) => !page.includes('/intro-lab/') }),
    {
      // GitHub Pages reads the custom domain from a CNAME file at the root of the deployed site.
      name: 'cname',
      hooks: {
        'astro:build:done': ({ dir }) => {
          if (customDomain) writeFileSync(fileURLToPath(new URL('CNAME', dir)), siteUrl.hostname + '\n');
        },
      },
    },
  ],
});
