import type { Lang } from './routes';

const en = {
  'lang.switch': 'Español',
  'lang.switchShort': 'ES',
  'nav.services': 'Services',
  'nav.projects': 'Projects',
  'nav.area': 'Areas',
  'nav.about': 'About',
  'nav.faq': 'FAQ',
  'nav.contact': 'Contact',
  'nav.menu': 'Menu',
  'nav.close': 'Close',
  'skip': 'Skip to content',

  'cta.call': 'Call',
  'cta.callNumber': 'Call 689-267-7320',
  'cta.text': 'Text us',
  'cta.email': 'Email',
  'cta.estimate': 'Get a free estimate',
  'cta.tapCall': 'Call',
  'cta.tapText': 'Text',

  'hero.eyebrow': 'Seamless gutters · Central Florida & Tampa',
  'hero.h1': 'Seamless gutters, made on site, fit to your house.',
  'hero.sub': 'Licensed and insured. Free same-day estimates. Over 500 homes done.',
  'hero.videoLabel': 'Our crew installing seamless gutters',

  'stats.homes': 'homes done',
  'stats.years': 'years combined experience',
  'stats.licensed': 'Licensed & insured',
  'stats.licensedSub': 'Florida',
  'stats.free': 'Free estimates',
  'stats.freeSub': 'Same day',

  'services.eyebrow': 'What we do',
  'services.title': 'Seamless gutters, start to finish.',
  'services.all': 'All services',
  'services.more': 'See details',

  'projects.eyebrow': 'Our work',
  'projects.title': 'Real jobs. No stock photos.',
  'projects.all': 'See all projects',
  'projects.details': 'The details',
  'projects.detailsSub': 'Miters, downspouts, guards. The parts that separate a pro from a handyman.',

  'why.eyebrow': 'Why Flo Union',
  'why.title': 'Local. Personal. Fast. We actually care.',

  'colors.eyebrow': 'Colors',
  'colors.title': 'Match the house, not just the trim.',
  'colors.more': 'and more',
  'colors.sub': 'Ask about other colors on your estimate.',

  'area.eyebrow': 'Where we work',
  'area.title': 'Central Florida and Tampa.',
  'area.sub': 'Pick your city.',
  'area.county': 'County',

  'faq.eyebrow': 'Questions',
  'faq.title': 'Straight answers.',
  'faq.all': 'All questions',

  'cta.bandTitle': 'Get a free estimate.',
  'cta.bandSub': 'Call or text. We come out the same day.',

  'footer.hours': 'Open 7 days a week',
  'footer.spanish': 'Hablamos español',
  'footer.license': 'License',
  'footer.services': 'Services',
  'footer.cities': 'Cities',
  'footer.company': 'Company',
  'footer.privacy': 'Privacy',
  'footer.rights': 'All rights reserved.',

  'process.eyebrow': 'How it goes',
  'process.title': 'Call to cleanup.',

  'included.title': "What's included",
  'when.title': 'When you need it',
  'service.faqTitle': 'Questions about this',
  'service.photos': 'From the job',

  'city.h1': 'Seamless gutters in {city}, FL',
  'city.eyebrow': 'Serving {city}',
  'city.intro': 'Free on-site estimates the same day. Most homes done in one day. Licensed and insured.',
  'city.photosTitle': 'Recent work',
  'city.back': 'All service areas',

  'about.eyebrow': 'About',
  'contact.eyebrow': 'Contact',
  'contact.title': 'Call, text, or email.',
  'contact.sub': 'Same-day estimates. Hablamos español.',
  'contact.phone': 'Phone',
  'contact.email': 'Email',
  'contact.hours': 'Hours',
  'contact.area': 'Service area',

  'notfound.title': 'That page is not here.',
  'notfound.sub': 'The gutters are, though.',
  'notfound.home': 'Back home',
} as const;

export type UiKey = keyof typeof en;

const es: Record<UiKey, string> = {
  'lang.switch': 'English',
  'lang.switchShort': 'EN',
  'nav.services': 'Servicios',
  'nav.projects': 'Proyectos',
  'nav.area': 'Áreas',
  'nav.about': 'Nosotros',
  'nav.faq': 'Preguntas',
  'nav.contact': 'Contacto',
  'nav.menu': 'Menú',
  'nav.close': 'Cerrar',
  'skip': 'Ir al contenido',

  'cta.call': 'Llamar',
  'cta.callNumber': 'Llame al 689-267-7320',
  'cta.text': 'Mándenos un texto',
  'cta.email': 'Correo',
  'cta.estimate': 'Pida su estimado gratis',
  'cta.tapCall': 'Llamar',
  'cta.tapText': 'Texto',

  'hero.eyebrow': 'Canaletas sin costura · Florida Central y Tampa',
  'hero.h1': 'Canaletas sin costura, hechas en el sitio, a la medida de su casa.',
  'hero.sub': 'Licencia y seguro. Estimados gratis el mismo día. Más de 500 casas terminadas.',
  'hero.videoLabel': 'Nuestro equipo instalando canaletas sin costura',

  'stats.homes': 'casas terminadas',
  'stats.years': 'años de experiencia combinada',
  'stats.licensed': 'Licencia y seguro',
  'stats.licensedSub': 'Florida',
  'stats.free': 'Estimados gratis',
  'stats.freeSub': 'El mismo día',

  'services.eyebrow': 'Lo que hacemos',
  'services.title': 'Canaletas sin costura, de principio a fin.',
  'services.all': 'Todos los servicios',
  'services.more': 'Ver detalles',

  'projects.eyebrow': 'Nuestro trabajo',
  'projects.title': 'Trabajos reales. Sin fotos de archivo.',
  'projects.all': 'Ver todos los proyectos',
  'projects.details': 'Los detalles',
  'projects.detailsSub': 'Esquinas, bajantes, protectores. Lo que separa a un profesional de un improvisado.',

  'why.eyebrow': 'Por qué Flo Union',
  'why.title': 'Locales. Personales. Rápidos. Nos importa de verdad.',

  'colors.eyebrow': 'Colores',
  'colors.title': 'Que combine con la casa, no solo con el borde.',
  'colors.more': 'y más',
  'colors.sub': 'Pregunte por otros colores en su estimado.',

  'area.eyebrow': 'Dónde trabajamos',
  'area.title': 'Florida Central y Tampa.',
  'area.sub': 'Elija su ciudad.',
  'area.county': 'Condado',

  'faq.eyebrow': 'Preguntas',
  'faq.title': 'Respuestas directas.',
  'faq.all': 'Todas las preguntas',

  'cta.bandTitle': 'Pida su estimado gratis.',
  'cta.bandSub': 'Llame o mande un texto. Vamos el mismo día.',

  'footer.hours': 'Abierto los 7 días de la semana',
  'footer.spanish': 'Hablamos español',
  'footer.license': 'Licencia',
  'footer.services': 'Servicios',
  'footer.cities': 'Ciudades',
  'footer.company': 'Empresa',
  'footer.privacy': 'Privacidad',
  'footer.rights': 'Todos los derechos reservados.',

  'process.eyebrow': 'Cómo funciona',
  'process.title': 'De la llamada a la limpieza.',

  'included.title': 'Qué incluye',
  'when.title': 'Cuándo lo necesita',
  'service.faqTitle': 'Preguntas sobre esto',
  'service.photos': 'Del trabajo',

  'city.h1': 'Canaletas sin costura en {city}, FL',
  'city.eyebrow': 'Servicio en {city}',
  'city.intro': 'Estimados gratis en su casa el mismo día. La mayoría de las casas en un día. Con licencia y seguro.',
  'city.photosTitle': 'Trabajos recientes',
  'city.back': 'Todas las áreas de servicio',

  'about.eyebrow': 'Nosotros',
  'contact.eyebrow': 'Contacto',
  'contact.title': 'Llame, mande un texto o escriba.',
  'contact.sub': 'Estimados el mismo día. Hablamos español.',
  'contact.phone': 'Teléfono',
  'contact.email': 'Correo',
  'contact.hours': 'Horario',
  'contact.area': 'Área de servicio',

  'notfound.title': 'Esa página no está aquí.',
  'notfound.sub': 'Las canaletas sí.',
  'notfound.home': 'Volver al inicio',
};

export const ui: Record<Lang, Record<UiKey, string>> = { en, es };

export const t = (lang: Lang, key: UiKey, vars?: Record<string, string>): string => {
  let s: string = ui[lang][key];
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.replace(`{${k}}`, v);
  return s;
};
