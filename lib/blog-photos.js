/**
 * Fotos del blog con licencia libre (11/2026). Los archivos están en public/blog/ y los genera
 * scripts/blog-photos.mjs a partir de `source` (Wikimedia Commons o Pixabay), recortados a 1600 × 840.
 *
 * Licencias (comprobadas en la página de cada archivo el 11-11-2026):
 *   - Dominio público: fotos del ejército de EE. UU. de dos competiciones HYROX internas. No hace falta citar,
 *     pero se cita igual. Su uso no implica respaldo del ejército ni del Departamento de Defensa.
 *   - CC BY 4.0: obliga a citar al autor y la licencia y a indicar que se ha recortado.
 *   - CC0 y licencia de Pixabay: uso libre sin atribución; también se cita.
 * Si añades una foto, apunta aquí autor, licencia y enlace: sin eso no se publica.
 */
const OLD_GUARD = n => ({
  credit: "Foto: U.S. Army, 3d U.S. Infantry Regiment (The Old Guard). Dominio público, vía Wikimedia Commons.",
  href: `https://commons.wikimedia.org/wiki/File:U.S._Soldiers_and_Navy_SEALs_participate_in_a_HYROX_fitness_competition_at_the_Fort_Myer_Fitness_Center_on_Joint_Base_Myer_Henderson-Hall,_Arlington,_Va.,_Jan_15,_2026_-_${n}.jpg`,
  source: { commons: `File:U.S. Soldiers and Navy SEALs participate in a HYROX fitness competition at the Fort Myer Fitness Center on Joint Base Myer Henderson-Hall, Arlington, Va., Jan 15, 2026 - ${n}.jpg` },
});
const DRAGOON = id => ({
  credit: "Foto: U.S. Army Reserve, Staff Sgt. Vontrae Hampton. Dominio público, vía Wikimedia Commons.",
  href: `https://commons.wikimedia.org/wiki/File:2nd_Cavalry_Regiment_Soldiers_compete_in_HYROX_competition_during_Dragoon_Week_(${id}).jpg`,
  source: { commons: `File:2nd Cavalry Regiment Soldiers compete in HYROX competition during Dragoon Week (${id}).jpg` },
});
const HYBRIDFITTY = (file, href) => ({
  credit: "Foto: HybridFitty, CC BY 4.0, vía Wikimedia Commons (recortada).",
  href, source: { commons: file },
});

export const PHOTOS = {
  "hyrox-remo-campeonato": HYBRIDFITTY("File:Lauren Rowing 2021 World Championships.jpg", "https://commons.wikimedia.org/wiki/File:Lauren_Rowing_2021_World_Championships.jpg"),
  "hyrox-zancadas-saco": HYBRIDFITTY("File:Stockholm HYROX lunges.jpg", "https://commons.wikimedia.org/wiki/File:Stockholm_HYROX_lunges.jpg"),
  "hyrox-meta-estambul-2026": {
    credit: "Foto: Amenallah tayarii, CC0, vía Wikimedia Commons.",
    href: "https://commons.wikimedia.org/wiki/File:HYROX_Istanbul_2026_Pro_Men_Division.jpg%E2%81%A0.jpg",
    source: { commons: "File:HYROX Istanbul 2026 Pro Men Division.jpg⁠.jpg" },
  },
  "hyrox-wall-balls": OLD_GUARD(5),
  "hyrox-trineo-empuje": OLD_GUARD(9),
  "hyrox-trineo-empuje-lateral": OLD_GUARD(10),
  "hyrox-skierg": OLD_GUARD(11),
  "hyrox-trineo-arrastre": OLD_GUARD(12),
  "hyrox-saco-pista": OLD_GUARD(16),
  "hyrox-farmers-carry": OLD_GUARD(18),
  "hyrox-burpee-broad-jump": OLD_GUARD(24),
  "hyrox-trineo-frontal": OLD_GUARD(30),
  "hyrox-carrera-tramo": OLD_GUARD(31),
  "hyrox-carrera-pareja": OLD_GUARD(32),
  "hyrox-skierg-jueces": OLD_GUARD(34),
  "hyrox-briefing": OLD_GUARD(35),
  "hyrox-dobles-animo": DRAGOON(9716551),
  "hyrox-farmers-carry-exterior": DRAGOON(9716566),
  "ocr-red-de-carga": { credit: "Foto: Queven, licencia de Pixabay.", href: "https://pixabay.com/photos/id-4801160/", source: { pixabay: 4801160 } },
  "ocr-barro": { credit: "Foto: hamperium, licencia de Pixabay.", href: "https://pixabay.com/photos/id-2175843/", source: { pixabay: 2175843 } },
};
for (const [key, p] of Object.entries(PHOTOS)) p.src = `/blog/${key}.webp`;

/** Portada de cada artículo que no tenía foto: { photo, alt } (el alt describe lo que se ve, sin nombres propios). */
export const COVERS = {
  "que-es-hyrox": { photo: "hyrox-remo-campeonato", alt: "Una atleta rema en la estación de remo de un campeonato HYROX, con público y jueces detrás de las vallas" },
  "plan-entrenamiento-hyrox-12-semanas": { photo: "hyrox-zancadas-saco", alt: "Una atleta hace zancadas con el saco sobre los hombros en una carrera HYROX en pabellón" },
  "mejores-eventos-ocr-hyrox-espana-2026": { photo: "hyrox-meta-estambul-2026", alt: "Un atleta entra en la meta de HYROX Estambul 2026 con una bandera en alto" },
  "hyrox-vs-ocr-diferencias": { photo: "hyrox-trineo-frontal", alt: "Un participante empuja un trineo cargado de discos sobre césped artificial en una competición HYROX" },
  "diferencia-ocr-carreras-hibridas-crosstraining": { photo: "hyrox-wall-balls", alt: "Un participante hace wall balls con un balón medicinal mientras un juez cuenta las repeticiones" },
  "como-saber-si-puedo-superar-la-carrera": { photo: "hyrox-burpee-broad-jump", alt: "Un participante salta en la estación de burpee broad jumps de una competición HYROX" },
  "formato-individual-parejas-mixtas-equipo": { photo: "hyrox-dobles-animo", alt: "Dos compañeras de dobles chocan la mano durante una competición HYROX al aire libre" },
  "que-carrera-se-adapta-a-mi-perfil": { photo: "hyrox-briefing", alt: "Un grupo de participantes escucha las instrucciones antes de empezar una competición HYROX en un gimnasio" },
  "zapatillas-hyrox-running-hibrido-2026": { photo: "hyrox-carrera-tramo", alt: "Dos participantes corren uno de los tramos de un kilómetro de una competición HYROX" },
  "gadgets-tecnologia-atleta-hibrido-2026": { photo: "hyrox-skierg", alt: "Un participante con reloj deportivo tira del SkiErg durante una competición HYROX" },
  "carreras-hibridas-principiantes-primera-prueba": { photo: "hyrox-carrera-pareja", alt: "Dos participantes corren juntos por un camino durante una competición HYROX" },
  "material-hyrox-carreras-obstaculos": { photo: "hyrox-farmers-carry", alt: "Un participante camina con una kettlebell en cada mano en la estación de farmers carry" },
  "mejores-podcasts-hyrox-deporte-hibrido": { photo: "hyrox-skierg-jueces", alt: "Varios participantes trabajan a la vez en los SkiErg mientras los jueces apuntan los tiempos" },
  "que-es-el-hyatlon": { photo: "hyrox-saco-pista", alt: "Un participante corre por una pista cubierta con un saco sobre los hombros en una competición híbrida" },
  "que-es-hurbax": { photo: "hyrox-farmers-carry-exterior", alt: "Dos participantes hacen el farmers carry con kettlebells sobre hierba en una competición híbrida al aire libre" },
  "primera-carrera-obstaculos-guia": { photo: "ocr-red-de-carga", alt: "Participantes de una carrera de obstáculos suben y bajan por una red de carga" },
  "equipamiento-ocr-guia-compra-2026": { photo: "ocr-barro", alt: "Una corredora con dorsal sale de una zona de barro en una carrera de obstáculos" },
};

/** Añade la portada a los artículos que no tienen una propia. */
export function withCovers(posts) {
  for (const p of posts) {
    const c = COVERS[p.slug];
    if (!c || p.cover) continue;
    const photo = PHOTOS[c.photo];
    p.cover = photo.src;
    p.imageAlt = c.alt;
    p.coverCredit = { text: photo.credit, href: photo.href };
  }
  return posts;
}
