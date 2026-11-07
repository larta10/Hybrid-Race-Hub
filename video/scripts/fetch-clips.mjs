// Busca en Pexels un clip para cada escena sin clip y lo descarga a video/cache/.
// Guarda en el guion id, URL, autor, archivo y tiempo de inicio para que el render sea reproducible.
//
//   node scripts/fetch-clips.mjs <reel_id> [<reel_id>…]   o   --all
//   --cambiar=N   descarta el clip de la escena N (1 = gancho) y elige el siguiente candidato
//
// Después hay que revisar a ojo cada clip (node scripts/frames.mjs clips <reel_id>) y marcar
// "revisado": true en los buenos. Sin esa marca el reel no se publica.
import { loadReel, saveReel, reelIds, clipSlots } from "./lib/common.mjs";
import { searchCandidates, toClip, downloadClip } from "./lib/clips.mjs";

const args = process.argv.slice(2);
const ids = args.includes("--all") ? reelIds() : args.filter((a) => !a.startsWith("--"));
const cambiar = args.find((a) => a.startsWith("--cambiar="))?.split("=")[1];
if (!ids.length) {
  console.log("Uso: node scripts/fetch-clips.mjs <reel_id>… | --all [--cambiar=N]");
  process.exit(1);
}

for (const id of ids) {
  const reel = loadReel(id);
  console.log(`\n${reel.id}`);
  const slots = clipSlots(reel);
  const usados = new Set(slots.map((s) => s.clip.pexels_id).filter(Boolean));
  const descartados = new Set(slots.flatMap((s) => s.clip.descartados || []).map(String));
  for (const [i, s] of slots.entries()) {
    const c = s.clip;
    if (cambiar && Number(cambiar) === i + 1 && c.pexels_id) {
      c.descartados = [...new Set([...(c.descartados || []), c.pexels_id])];
      descartados.add(c.pexels_id);
      usados.delete(c.pexels_id);
      for (const k of ["pexels_id", "url", "autor", "autor_url", "archivo_url", "ancho", "alto", "duracion_clip"]) delete c[k];
      c.revisado = false;
    }
    if (c.sin_clip) {
      console.log(`  ${s.donde}: sin clip a propósito (fondo neutro)`);
      continue;
    }
    if (!c.pexels_id) {
      const minDur = Math.ceil((c.inicio || 1) + s.duracion + 0.5);
      const cands = await searchCandidates(c.query, minDur, new Set([...usados, ...descartados]));
      if (!cands.length) {
        console.log(`  ${s.donde}: sin candidatos para "${c.query}". Cambia la query o pon "sin_clip": true`);
        continue;
      }
      const v = cands[0];
      Object.assign(c, toClip(v, c.query, c), { descartados: c.descartados });
      if (!c.descartados?.length) delete c.descartados;
      usados.add(c.pexels_id);
      console.log(`  ${s.donde}: "${c.query}" → ${c.pexels_id} (${v.orientation}, ${c.ancho}x${c.alto}, ${v.duration} s, ${c.autor})`);
    }
    if (c.archivo_url) {
      await downloadClip(c);
    }
  }
  saveReel(reel);
}
