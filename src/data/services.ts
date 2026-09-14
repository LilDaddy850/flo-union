import type { L } from '../i18n/routes';

export type Service = {
  id: string;
  slug: L;
  name: L;
  short: L;
  hero: string;
  thumb?: string;
  intro: L;
  included: L[];
  when: L[];
  photos: string[];
  faq: { q: L; a: L }[];
};

export const services: Service[] = [
  {
    id: 'installation',
    slug: { en: 'seamless-gutter-installation', es: 'instalacion-de-canaletas-sin-costura' },
    name: { en: 'Seamless Gutter Installation', es: 'Instalación de canaletas sin costura' },
    short: {
      en: '6-inch seamless aluminum, made on site in one piece per run. Most homes done in a day.',
      es: 'Aluminio sin costura de 6 pulgadas, hecho en el sitio en una sola pieza por tramo. La mayoría de las casas en un día.',
    },
    hero: 'newbuild-04',
    thumb: 'newbuild-03',
    intro: {
      en: 'We run the gutter on your driveway with our own machine, so each side of the house gets one continuous piece. No seams, no joints, nothing to leak. Then we hang it with hidden hangers and screws, set the pitch so the water actually moves, and put the downspouts where the water needs to go.',
      es: 'Hacemos la canaleta en la entrada de su casa con nuestra propia máquina, así que cada lado de la casa recibe una sola pieza continua. Sin costuras, sin juntas, nada que gotee. Luego la montamos con soportes ocultos y tornillos, le damos la inclinación correcta para que el agua corra, y colocamos los bajantes donde el agua debe ir.',
    },
    included: [
      { en: '6-inch seamless aluminum gutters', es: 'Canaletas de aluminio sin costura de 6 pulgadas' },
      { en: 'Hidden hangers, screwed into the fascia. No spikes.', es: 'Soportes ocultos atornillados a la fascia. Sin clavos.' },
      { en: '3x4 downspouts, extensions available', es: 'Bajantes de 3x4, extensiones disponibles' },
      { en: 'White, eggshell, linen, black, bronze, and more', es: 'Blanco, cáscara de huevo, lino, negro, bronce y más' },
      { en: 'Cleanup before we leave', es: 'Limpieza antes de irnos' },
    ],
    when: [
      { en: 'New construction or an addition', es: 'Construcción nueva o una ampliación' },
      { en: 'A house that never had gutters', es: 'Una casa que nunca tuvo canaletas' },
      { en: 'Water pooling at the foundation, washed-out beds, stained walls', es: 'Agua acumulada en los cimientos, jardines lavados, paredes manchadas' },
    ],
    photos: ['newbuild-03', 'newbuild-05', 'siding-01', 'tile-02', 'detail-elbow', 'detail-miter'],
    faq: [
      {
        q: { en: 'How long does an installation take?', es: '¿Cuánto tarda una instalación?' },
        a: { en: 'Most homes are done start to finish in one day. Bigger houses and multi-story homes can take longer, and we tell you that at the estimate.', es: 'La mayoría de las casas se terminan en un día. Las casas grandes o de varios pisos pueden tomar más, y se lo decimos en el estimado.' },
      },
      {
        q: { en: 'Why 6-inch gutters?', es: '¿Por qué canaletas de 6 pulgadas?' },
        a: { en: 'A 6-inch gutter moves almost twice as much water as a 5-inch, and Florida rain comes down hard. It is what we run on every job.', es: 'Una canaleta de 6 pulgadas mueve casi el doble de agua que una de 5, y la lluvia en Florida cae fuerte. Es lo que usamos en cada trabajo.' },
      },
      {
        q: { en: 'Where do the downspouts go?', es: '¿Dónde van los bajantes?' },
        a: { en: 'Where the water needs to end up, not just where it is convenient. We look at the slope of the yard and the foundation and place them there. Extensions carry the water farther out when needed.', es: 'Donde el agua debe terminar, no solo donde es cómodo. Miramos la pendiente del patio y los cimientos y los colocamos ahí. Las extensiones llevan el agua más lejos cuando hace falta.' },
      },
    ],
  },
  {
    id: 'replacement',
    slug: { en: 'gutter-replacement', es: 'reemplazo-de-canaletas' },
    name: { en: 'Gutter Replacement', es: 'Reemplazo de canaletas' },
    short: {
      en: 'Old gutters off and hauled away, new 6-inch seamless on. Same day, included in the price.',
      es: 'Quitamos las canaletas viejas y nos las llevamos, ponemos nuevas de 6 pulgadas sin costura. El mismo día, incluido en el precio.',
    },
    hero: 'brick-02',
    intro: {
      en: 'Sectional gutters leak at the joints. Old gutters sag, pull away from the fascia, and overflow in a normal rain. We take the old ones down, haul them off, and put up new seamless gutters the same day.',
      es: 'Las canaletas por secciones gotean en las juntas. Las viejas se vencen, se separan de la fascia y se desbordan con una lluvia normal. Quitamos las viejas, nos las llevamos y ponemos canaletas nuevas sin costura el mismo día.',
    },
    included: [
      { en: 'Removal and haul-away of the old gutters, included', es: 'Quitar y llevarnos las canaletas viejas, incluido' },
      { en: 'New 6-inch seamless aluminum', es: 'Aluminio nuevo sin costura de 6 pulgadas' },
      { en: 'Hidden hangers and screws', es: 'Soportes ocultos y tornillos' },
      { en: '3x4 downspouts, extensions available', es: 'Bajantes de 3x4, extensiones disponibles' },
      { en: 'Cleanup before we leave', es: 'Limpieza antes de irnos' },
    ],
    when: [
      { en: 'Leaking at the seams', es: 'Goteo en las uniones' },
      { en: 'Sagging or pulling away from the house', es: 'Vencidas o separadas de la casa' },
      { en: 'Rust, holes, or patched sections', es: 'Óxido, huecos o secciones parchadas' },
      { en: 'Overflowing in a normal rain', es: 'Desbordes con una lluvia normal' },
    ],
    photos: ['brick-01', 'brick-03', 'farmhouse-01', 'colonial-01', 'hoa-06', 'detail-corner'],
    faq: [
      {
        q: { en: 'What happens to the old gutters?', es: '¿Qué pasa con las canaletas viejas?' },
        a: { en: 'We take them down and haul them away. It is included in the price.', es: 'Las quitamos y nos las llevamos. Está incluido en el precio.' },
      },
      {
        q: { en: 'Can you replace just one side?', es: '¿Pueden reemplazar solo un lado?' },
        a: { en: 'Yes. We replace full runs so that side gets one seamless piece. We will tell you at the estimate if the other sides are about to go too.', es: 'Sí. Reemplazamos tramos completos para que ese lado quede en una sola pieza. En el estimado le decimos si el resto está por fallar también.' },
      },
      {
        q: { en: 'Do I need to be home?', es: '¿Tengo que estar en casa?' },
        a: { en: 'For the estimate it helps. For the install, no, as long as we can get to the house.', es: 'Para el estimado ayuda. Para la instalación no, siempre que tengamos acceso alrededor de la casa.' },
      },
    ],
  },
  {
    id: 'guards',
    slug: { en: 'gutter-guards', es: 'protectores-de-canaletas' },
    name: { en: 'Gutter Guards', es: 'Protectores de canaletas' },
    short: {
      en: 'Two types of guards, installed on any gutters, including ones we did not put up.',
      es: 'Dos tipos de protectores, instalados en cualquier canaleta, incluso las que no pusimos nosotros.',
    },
    hero: 'detail-guard',
    intro: {
      en: 'If you have trees over the roof, guards keep leaves, pine needles, and oak debris out of the gutters so the water keeps moving. We install two types, and we put them on any gutters, not just ours.',
      es: 'Si tiene árboles sobre el techo, los protectores mantienen las hojas, agujas de pino y hojas de roble fuera de las canaletas para que el agua siga corriendo. Instalamos dos tipos, y los ponemos en cualquier canaleta, no solo las nuestras.',
    },
    included: [
      { en: 'Two guard types to choose from', es: 'Dos tipos de protectores para elegir' },
      { en: 'Fitted to your gutter size', es: 'Ajustados al tamaño de su canaleta' },
      { en: 'Installed on existing gutters or with new ones', es: 'Instalados en canaletas existentes o con canaletas nuevas' },
    ],
    when: [
      { en: 'Trees over the roof', es: 'Árboles sobre el techo' },
      { en: 'You are done climbing a ladder to clean gutters', es: 'Ya no quiere subir la escalera para limpiar canaletas' },
      { en: 'Overflow from clogs', es: 'Desbordes por obstrucciones' },
    ],
    photos: ['detail-guard', 'tile-01', 'detail-tile-eave', 'ranch-pink', 'detail-drip', 'hoa-11'],
    faq: [
      {
        q: { en: 'Do guards mean I never clean the gutters again?', es: '¿Con protectores nunca más limpio las canaletas?' },
        a: { en: 'They cut cleaning way down. They do not make gutters maintenance-free forever, and we would rather tell you that now.', es: 'Reducen mucho la limpieza. No hacen que las canaletas queden sin mantenimiento para siempre, y preferimos decírselo ahora.' },
      },
      {
        q: { en: 'Can you add guards to my current gutters?', es: '¿Pueden poner protectores en mis canaletas actuales?' },
        a: { en: 'Yes, even if we did not install them.', es: 'Sí, aunque no las hayamos instalado nosotros.' },
      },
      {
        q: { en: 'Which type should I get?', es: '¿Qué tipo debo elegir?' },
        a: { en: 'It depends on what is falling on your roof. We look at the trees and tell you at the estimate.', es: 'Depende de lo que cae en su techo. Miramos los árboles y se lo decimos en el estimado.' },
      },
    ],
  },
  {
    id: 'commercial',
    slug: { en: 'commercial-hoa-gutters', es: 'canaletas-comerciales-y-hoa' },
    name: { en: 'Commercial & HOA', es: 'Comercial y HOA' },
    short: {
      en: 'Condos, communities, multi-unit buildings. One crew, one point of contact, done on schedule.',
      es: 'Condominios, comunidades, edificios de varias unidades. Un equipo, un solo contacto, a tiempo.',
    },
    hero: 'condo-01',
    thumb: 'hoa-03',
    intro: {
      en: 'We have done whole communities and four-story buildings. Same seamless gutters, same crew, with the equipment and the scheduling to handle a property, not just a house.',
      es: 'Hemos hecho comunidades completas y edificios de cuatro pisos. Las mismas canaletas sin costura, el mismo equipo, con el equipamiento y la planificación para manejar una propiedad, no solo una casa.',
    },
    included: [
      { en: 'Multi-unit and multi-story buildings', es: 'Edificios de varias unidades y varios pisos' },
      { en: 'Lifts and equipment for tall work', es: 'Plataformas elevadoras y equipo para trabajo en altura' },
      { en: 'One point of contact for the board or the manager', es: 'Un solo contacto para la junta o el administrador' },
      { en: 'Scheduled around your residents', es: 'Horario coordinado para no molestar a sus residentes' },
    ],
    when: [
      { en: 'HOA and condo boards', es: 'Juntas de HOA y condominios' },
      { en: 'Property managers', es: 'Administradores de propiedades' },
      { en: 'Builders and developers', es: 'Constructores y desarrolladores' },
    ],
    photos: ['condo-02', 'hoa-02', 'hoa-03', 'hoa-04', 'hoa-08', 'commercial-01'],
    faq: [
      {
        q: { en: 'Can you do a whole community?', es: '¿Pueden hacer una comunidad completa?' },
        a: { en: 'Yes. We have. Villas, carports, and multi-story buildings in one community, on one schedule.', es: 'Sí. Ya lo hemos hecho. Villas, cocheras y edificios de varios pisos en una misma comunidad, con un solo cronograma.' },
      },
      {
        q: { en: 'How do you work around residents?', es: '¿Cómo trabajan con los residentes?' },
        a: { en: 'We set the schedule with the manager, keep driveways and walkways clear, and clean up every day.', es: 'Fijamos el cronograma con el administrador, mantenemos entradas y pasillos libres, y limpiamos todos los días.' },
      },
      {
        q: { en: 'Are you insured?', es: '¿Tienen seguro?' },
        a: { en: 'Yes. Flo Union is a registered Florida LLC and carries insurance. Certificate of insurance on request.', es: 'Sí. Flo Union es una LLC registrada en Florida y tiene seguro. Certificado de seguro a pedido.' },
      },
    ],
  },
];
