export type Lang = 'en' | 'es';
export type L = Record<Lang, string>;

export const langs: Lang[] = ['en', 'es'];
export const other = (l: Lang): Lang => (l === 'en' ? 'es' : 'en');

export const routes = {
  home: { en: '/', es: '/es/' },
  services: { en: '/services/', es: '/es/servicios/' },
  projects: { en: '/projects/', es: '/es/proyectos/' },
  area: { en: '/service-area/', es: '/es/areas-de-servicio/' },
  about: { en: '/about/', es: '/es/nosotros/' },
  contact: { en: '/contact/', es: '/es/contacto/' },
  faq: { en: '/faq/', es: '/es/preguntas-frecuentes/' },
  privacy: { en: '/privacy/', es: '/es/privacidad/' },
} as const;

export type RouteKey = keyof typeof routes;

/** Base path without trailing slash, e.g. "/flo-union" (or "" at the root). */
export const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Site-relative path ("/services/") -> deployable href ("/flo-union/services/"). */
export const href = (path: string): string => BASE + path;

/** Localized page path (site-relative, always trailing slash). */
export const pageUrl = (key: RouteKey, lang: Lang, slug?: string): string =>
  routes[key][lang] + (slug ? `${slug}/` : '');

/** Absolute URL for canonical / hreflang / schema. */
export const absUrl = (siteUrl: string, path: string): string => siteUrl.replace(/\/$/, '') + path;
