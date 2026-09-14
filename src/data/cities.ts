import type { L } from '../i18n/routes';

export type City = { slug: string; name: string; county: string; lines: L[]; photos: string[] };

export const cities: City[] = [
  { slug: 'orlando', name: 'Orlando', county: 'Orange', lines: [
    { en: 'Orlando has every kind of roof: tile, shingle, metal, flat commercial. We have done all of them.', es: 'Orlando tiene todo tipo de techos: teja, shingle, metal, comercial plano. Los hemos hecho todos.' },
    { en: 'Afternoon storms all summer. Gutters that move water fast matter here.', es: 'Tormentas por la tarde todo el verano. Aquí importan las canaletas que mueven el agua rápido.' },
  ], photos: ['newbuild-04', 'tile-02', 'hoa-02', 'bronze-03', 'condo-01', 'detail-miter'] },
  { slug: 'winter-park', name: 'Winter Park', county: 'Orange', lines: [
    { en: 'Winter Park has older homes and big oaks. Guards are worth talking about here.', es: 'Winter Park tiene casas antiguas y robles grandes. Aquí vale la pena hablar de protectores.' },
    { en: 'We work carefully around mature landscaping and leave it the way we found it.', es: 'Trabajamos con cuidado alrededor de jardines maduros y los dejamos como los encontramos.' },
  ], photos: ['farmhouse-01', 'colonial-01', 'detail-guard', 'siding-02', 'ranch-pink', 'detail-elbow'] },
  { slug: 'kissimmee', name: 'Kissimmee', county: 'Osceola', lines: [
    { en: 'A lot of Kissimmee subdivisions went up without gutters at all.', es: 'Muchas urbanizaciones de Kissimmee se construyeron sin canaletas.' },
    { en: 'Adding them protects the slab, the paint, and the landscaping.', es: 'Ponerlas protege la losa, la pintura y el jardín.' },
  ], photos: ['newbuild-03', 'tile-03', 'siding-01', 'hoa-10', 'detail-downspout', 'brick-02'] },
  { slug: 'sanford', name: 'Sanford', county: 'Seminole', lines: [
    { en: 'Sanford mixes historic downtown homes with newer neighborhoods. Seamless gutters fit either one.', es: 'Sanford mezcla casas históricas del centro con vecindarios nuevos. Las canaletas sin costura van con cualquiera.' },
    { en: 'We match the color to the trim so they disappear into the house.', es: 'Igualamos el color a las molduras para que se pierdan en la casa.' },
  ], photos: ['colonial-03', 'farmhouse-02', 'newbuild-05', 'bronze-05', 'detail-corner', 'siding-01'] },
  { slug: 'apopka', name: 'Apopka', county: 'Orange', lines: [
    { en: 'Apopka homes sit under a lot of trees. Guards keep the gutters moving between cleanings.', es: 'Las casas de Apopka están bajo muchos árboles. Los protectores mantienen el agua corriendo entre limpiezas.' },
    { en: 'Same-day estimates, most homes done in a day.', es: 'Estimados el mismo día, la mayoría de las casas en un día.' },
  ], photos: ['detail-guard', 'ranch-pink', 'brick-01', 'newbuild-07', 'detail-drip', 'hoa-05'] },
  { slug: 'oviedo', name: 'Oviedo', county: 'Seminole', lines: [
    { en: 'Oviedo has fast-growing neighborhoods and heavy tree cover. Both are good reasons to call.', es: 'Oviedo tiene vecindarios que crecen rápido y mucha cobertura de árboles. Las dos son buenas razones para llamar.' },
    { en: 'New builds get gutters that fit the house. Older homes get seamless replacements.', es: 'Las casas nuevas reciben canaletas a la medida. Las antiguas reciben reemplazos sin costura.' },
  ], photos: ['newbuild-06', 'siding-02', 'tile-04', 'detail-run', 'colonial-02', 'brick-03'] },
  { slug: 'lake-mary', name: 'Lake Mary', county: 'Seminole', lines: [
    { en: 'Lake Mary homes tend to be larger with long roof runs. Seamless means no joints on those runs.', es: 'Las casas de Lake Mary suelen ser grandes con tramos de techo largos. Sin costura significa sin juntas en esos tramos.' },
    { en: 'Bronze and black gutters are popular here on lighter stucco.', es: 'Las canaletas bronce y negras son populares aquí sobre estuco claro.' },
  ], photos: ['bronze-01', 'modern-01', 'tile-02', 'newbuild-04', 'hoa-03', 'detail-tile-eave'] },
  { slug: 'altamonte-springs', name: 'Altamonte Springs', county: 'Seminole', lines: [
    { en: 'Established neighborhoods, mature trees, plenty of rain.', es: 'Vecindarios establecidos, árboles maduros, mucha lluvia.' },
    { en: 'A lot of what we do here is replacing old sectional gutters that leak at the joints.', es: 'Mucho de lo que hacemos aquí es reemplazar canaletas viejas por secciones que gotean en las juntas.' },
  ], photos: ['brick-04', 'colonial-01', 'siding-01', 'detail-box', 'ranch-palm', 'newbuild-08'] },
  { slug: 'winter-garden', name: 'Winter Garden', county: 'Orange', lines: [
    { en: 'Winter Garden has the new builds out west and the old downtown. Both need water going where it should.', es: 'Winter Garden tiene las casas nuevas al oeste y el centro antiguo. Los dos necesitan que el agua vaya a donde debe.' },
    { en: 'We fit gutters to tile roofs properly, which not everyone does.', es: 'Ajustamos las canaletas a los techos de teja como debe ser, cosa que no todos hacen.' },
  ], photos: ['tile-01', 'tile-03', 'newbuild-03', 'hoa-12', 'detail-tile-eave', 'bronze-04'] },
  { slug: 'clermont', name: 'Clermont', county: 'Lake', lines: [
    { en: 'Clermont has hills, which is rare in Florida. Water moves fast off roofs and yards, so downspout placement matters.', es: 'Clermont tiene colinas, algo raro en Florida. El agua baja rápido de techos y patios, así que la ubicación de los bajantes importa.' },
    { en: 'Extensions carry the water away from the foundation.', es: 'Las extensiones alejan el agua de los cimientos.' },
  ], photos: ['detail-downspout', 'newbuild-05', 'siding-02', 'brick-01', 'tile-04', 'hoa-07'] },
  { slug: 'st-cloud', name: 'St. Cloud', county: 'Osceola', lines: [
    { en: 'St. Cloud is mostly single-story homes on open lots. Most are done start to finish in one day.', es: 'St. Cloud es mayormente casas de un piso en lotes abiertos. La mayoría se terminan en un día.' },
    { en: 'Extensions keep the water off the slab and out of the beds.', es: 'Las extensiones mantienen el agua lejos de la losa y de los jardines.' },
  ], photos: ['ranch-palm', 'siding-01', 'newbuild-04', 'brick-02', 'detail-elbow', 'colonial-03'] },
  { slug: 'lake-nona', name: 'Lake Nona', county: 'Orange', lines: [
    { en: 'Lake Nona is almost all new construction, a lot of it with tile roofs.', es: 'Lake Nona es casi toda construcción nueva, mucha con techos de teja.' },
    { en: 'We install gutters on tile the right way, and we match the color to the house.', es: 'Instalamos canaletas en teja de la forma correcta, e igualamos el color a la casa.' },
  ], photos: ['tile-02', 'tile-01', 'newbuild-06', 'hoa-09', 'modern-02', 'detail-tile-eave'] },
  { slug: 'daytona-beach', name: 'Daytona Beach', county: 'Volusia', lines: [
    { en: 'Salt air near the coast is hard on cheap metal. Aluminum holds up.', es: 'El aire salado de la costa castiga el metal barato. El aluminio aguanta.' },
    { en: 'We come out to Daytona for estimates the same as anywhere else.', es: 'Vamos a Daytona para estimados igual que a cualquier otro lugar.' },
  ], photos: ['bronze-02', 'siding-02', 'condo-02', 'newbuild-07', 'detail-run', 'ranch-pink'] },
  { slug: 'deltona', name: 'Deltona', county: 'Volusia', lines: [
    { en: 'Deltona homes are mostly single-story, which means most jobs are done in a day.', es: 'Las casas de Deltona son mayormente de un piso, así que la mayoría de los trabajos se terminan en un día.' },
    { en: 'Same-day estimates, real prices, and old gutters hauled away.', es: 'Estimados el mismo día, precios reales, y las canaletas viejas nos las llevamos.' },
  ], photos: ['siding-01', 'brick-03', 'ranch-palm', 'newbuild-08', 'detail-corner', 'colonial-02'] },
  { slug: 'lakeland', name: 'Lakeland', county: 'Polk', lines: [
    { en: 'Lakeland gets the full summer storm season. Gutters that do not overflow are the whole point.', es: 'Lakeland recibe toda la temporada de tormentas de verano. Aquí lo que importa es que las canaletas no se desborden.' },
    { en: 'Six-inch seamless moves almost twice as much water as the five-inch most houses came with.', es: 'Las de 6 pulgadas sin costura mueven casi el doble de agua que las de 5 con las que vienen la mayoría de las casas.' },
  ], photos: ['newbuild-04', 'brick-04', 'siding-02', 'hoa-04', 'detail-downspout', 'tile-03'] },
  { slug: 'the-villages', name: 'The Villages', county: 'Sumter', lines: [
    { en: 'The Villages has newer homes and clear standards. We match colors and keep the job clean.', es: 'The Villages tiene casas nuevas y estándares claros. Igualamos colores y mantenemos el trabajo limpio.' },
    { en: 'One day, in and out, and the yard the way we found it.', es: 'Un día, entramos y salimos, y el patio como lo encontramos.' },
  ], photos: ['tile-03', 'ranch-palm', 'newbuild-05', 'siding-01', 'hoa-10', 'detail-elbow'] },
  { slug: 'melbourne', name: 'Melbourne', county: 'Brevard', lines: [
    { en: 'Coastal weather and older neighborhoods. Both call for aluminum seamless gutters.', es: 'Clima costero y vecindarios antiguos. Los dos piden canaletas de aluminio sin costura.' },
    { en: 'Salt air is hard on cheap gutters. Ours hold up.', es: 'El aire salado castiga las canaletas baratas. Las nuestras aguantan.' },
  ], photos: ['bronze-03', 'condo-01', 'siding-02', 'brick-01', 'detail-roof-edge', 'newbuild-03'] },
  { slug: 'tampa', name: 'Tampa', county: 'Hillsborough', lines: [
    { en: 'Tampa summers mean a storm almost every afternoon and a lot of water coming off the roof at once.', es: 'Los veranos en Tampa traen tormentas casi todas las tardes y mucha agua bajando del techo de golpe.' },
    { en: 'We come out to Tampa for homes and for HOA and commercial work.', es: 'Vamos a Tampa para casas y para trabajo de HOA y comercial.' },
  ], photos: ['hoa-02', 'condo-02', 'newbuild-04', 'bronze-01', 'tile-02', 'commercial-01'] },
];
