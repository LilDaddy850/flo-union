import { BASE, type L } from '../i18n/routes';

/** Business facts. Every claim on the site comes from here. Blank strings render nothing. */
export const site = {
  name: 'Flo Union LLC',
  short: 'Flo Union',
  owner: 'Jay Cabrera',
  phone: '689-267-7320',
  phoneE164: '+16892677320',
  email: 'jayflounion@gmail.com',
  hours: { en: '7 days a week', es: 'los 7 días de la semana' } as L,
  license: 'L23000363697', // Florida Division of Corporations (Sunbiz) document number. No contractor license: never say "licensed".
  founded: '2023',
  city: 'Sarasota',
  region: 'FL',
  area: { en: 'Central Florida, Tampa & Sarasota', es: 'Florida Central, Tampa y Sarasota' } as L,
  url: import.meta.env.SITE.replace(/\/$/, '') + BASE, // origin + base path, no trailing slash
  stats: { homes: 500, years: 20 },
  payment: { en: 'cash, card, check, or Zelle', es: 'efectivo, tarjeta, cheque o Zelle' } as L,
  warranty: {
    en: 'Labor is covered for 5 to 10 years depending on the job, and the material carries a 20-year warranty. If anything we installed has a problem because of our work, we come back and fix it. Storm damage, fallen trees, or someone else altering the gutters is not covered.',
    es: 'La mano de obra tiene garantía de 5 a 10 años según el trabajo, y el material tiene garantía de 20 años. Si algo que instalamos tiene un problema por nuestro trabajo, volvemos y lo arreglamos. No cubre daños por tormentas, árboles caídos o cambios hechos por otra persona.',
  } as L,
  sameAs: [] as string[], // TODO_JAY: Google Business Profile, Facebook page, etc.
  colors: [
    { id: 'white', name: { en: 'White', es: 'Blanco' } as L, hex: '#F2F0EB', photo: 'newbuild-06' },
    { id: 'eggshell', name: { en: 'Eggshell', es: 'Cáscara de huevo' } as L, hex: '#EDE6D6', photo: '' },
    { id: 'linen', name: { en: 'Linen', es: 'Lino' } as L, hex: '#E3DAC4', photo: '' },
    { id: 'black', name: { en: 'Black', es: 'Negro' } as L, hex: '#1A1A1A', photo: 'modern-02' },
    { id: 'bronze', name: { en: 'Bronze', es: 'Bronce' } as L, hex: '#3B2A1E', photo: 'bronze-01' },
  ],
};

export const why = [
  {
    label: { en: 'Local', es: 'Locales' } as L,
    title: { en: 'We live here and we work here.', es: 'Vivimos aquí y trabajamos aquí.' } as L,
    body: {
      en: 'Central Florida, Tampa, and Sarasota. We answer our own phone, and the person you talk to is the person who shows up.',
      es: 'Florida Central, Tampa y Sarasota. Contestamos nuestro propio teléfono, y la persona con la que habla es la que llega a su casa.',
    } as L,
  },
  {
    label: { en: 'Personal', es: 'Trato personal' } as L,
    title: { en: 'You deal with the people doing the work.', es: 'Usted trata con la gente que hace el trabajo.' } as L,
    body: {
      en: 'No call center, no salesman, no crew you have never met. We measure, we quote, we install.',
      es: 'Sin centro de llamadas, sin vendedores, sin un equipo que nunca ha visto. Medimos, cotizamos, instalamos.',
    } as L,
  },
  {
    label: { en: 'Fast', es: 'Rápidos' } as L,
    title: { en: 'Same-day estimates. Most homes done in a day.', es: 'Estimados el mismo día. La mayoría de las casas en un día.' } as L,
    body: {
      en: 'We run the gutters on site with our own machine, so there is no waiting on parts. Old gutters come down and go away the same day.',
      es: 'Hacemos las canaletas en el sitio con nuestra propia máquina, así que no se espera por piezas. Las canaletas viejas se quitan y se llevan el mismo día.',
    } as L,
  },
  {
    label: { en: 'We actually care', es: 'Nos importa de verdad' } as L,
    title: { en: 'Hidden hangers, screws, cleanup. Fixed free if our work fails.', es: 'Soportes ocultos, tornillos, limpieza. Arreglo gratis si nuestro trabajo falla.' } as L,
    body: {
      en: 'Screws, not spikes. Hangers you cannot see. The yard cleaner than we found it. Labor warranty of 5 to 10 years, 20 years on materials.',
      es: 'Tornillos, no clavos. Soportes que no se ven. El patio más limpio de lo que lo encontramos. Garantía de mano de obra de 5 a 10 años y de 20 años en materiales.',
    } as L,
  },
];

export const process = [
  { en: 'Call or text. We come out for a free on-site estimate the same day.', es: 'Llame o mande un texto. Vamos a su casa el mismo día para un estimado gratis.' },
  { en: 'We measure, you pick a color, and you get a real price. No pressure.', es: 'Medimos, usted elige el color y recibe un precio real. Sin presión.' },
  { en: 'We run the gutters on site in one piece per side, hang them with hidden hangers and screws, and set the downspouts where the water needs to go.', es: 'Hacemos las canaletas en el sitio en una sola pieza por lado, las montamos con soportes ocultos y tornillos, y colocamos los bajantes donde el agua debe ir.' },
  { en: 'Most homes are done start to finish in one day. Old gutters are hauled away. We clean up before we leave.', es: 'La mayoría de las casas se terminan en un día. Nos llevamos las canaletas viejas. Limpiamos antes de irnos.' },
  { en: 'Pay when it is finished: cash, card, check, or Zelle.', es: 'Pague cuando esté terminado: efectivo, tarjeta, cheque o Zelle.' },
] as L[];
