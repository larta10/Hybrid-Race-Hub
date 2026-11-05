// Rellena alt_text (texto alternativo por slide) a partir del contenido de cada slide, incluidos los datos
// de las gráficas. Solo escribe los alt_text que faltan o están vacíos; los escritos a mano se respetan.
// Uso: node scripts/instagram/fill-alt.mjs [--force]
import { writeFileSync } from "node:fs";
import path from "node:path";
import { POSTS_DIR } from "./lib/config.mjs";
import { loadPosts } from "./lib/posts.mjs";
import { fmt } from "./lib/design.mjs";

const FORCE = process.argv.includes("--force");

const SVG = {
  "sled-push-correcto": "atleta empujando el trineo con el tronco inclinado, la espalda neutra y los brazos extendidos",
  "sled-push-incorrecto": "atleta empujando el trineo con la cadera alta, las piernas casi rectas y la espalda redondeada",
  "sled-pull-correcto": "atleta tirando de la cuerda del trineo con la cadera baja y el tronco ligeramente hacia atrás",
  "sled-pull-incorrecto": "atleta tirando del trineo con las piernas rectas y la espalda redondeada, solo con los brazos",
  "wall-ball-correcto": "atleta en sentadilla profunda con el pecho arriba y el balón pegado al pecho, frente a la diana",
  "wall-ball-incorrecto": "atleta con los talones levantados, el tronco caído hacia delante y el balón lejos del cuerpo",
  "sandbag-lunge-correcto": "zancada con el saco sobre los hombros, tronco vertical y rodilla trasera cerca del suelo",
  "sandbag-lunge-incorrecto": "zancada corta con el saco sobre los hombros y el tronco inclinado hacia delante",
  "farmers-carry-correcto": "atleta caminando erguido con un peso en cada mano, hombros atrás y brazos largos",
  "farmers-carry-incorrecto": "atleta encorvado con los hombros hacia delante cargando un peso en cada mano",
  "burpee-broad-jump-correcto": "aterrizaje del salto con rodillas y cadera flexionadas y brazos hacia delante",
  "burpee-broad-jump-incorrecto": "aterrizaje del salto con las piernas rígidas y el tronco echado hacia atrás",
  "skierg-correcto": "atleta en el SkiErg flexionando la cadera mientras lleva los tiradores hacia abajo",
  "skierg-incorrecto": "atleta en el SkiErg de pie y recto tirando solo con los brazos",
  "remo-correcto": "final de la palada en el remoergómetro con el tronco ligeramente atrás y el mango a la altura de las costillas",
  "remo-incorrecto": "final de la palada con el tronco muy echado atrás y el mango tirado hacia el cuello",
  corredor: "corredor en plena zancada",
  "cuerpo-zonas": "mapa del cuerpo humano visto de frente y de espaldas",
  corazon: "corazón con una línea de pulsaciones",
  "deposito-glucogeno": "depósito de glucógeno dividido en cuatro niveles",
  cronometro: "cronómetro con un tramo de tiempo marcado",
  plato: "plato dividido en tres partes",
  cama: "cama con una persona durmiendo",
  "ocr-muro": "atleta colgado del borde de un muro de obstáculos con un pie apoyado en la pared",
  "ocr-monkey-bars": "atleta colgado de unas monkey bars con los brazos estirados",
  "ocr-cuerda": "atleta trepando una cuerda con la cuerda bloqueada entre los pies",
};

const ZONAS = { gluteos: "glúteos", cuadriceps: "cuádriceps", isquios: "isquiotibiales", gemelos: "gemelos", antebrazos: "antebrazos", manos: "manos", hombros: "hombros", espalda: "espalda", lumbares: "zona lumbar", core: "abdomen", pecho: "pecho", brazos: "brazos", biceps: "bíceps", triceps: "tríceps", rodillas: "rodillas", codos: "codos", cadera: "cadera", "nivel-1": "nivel más bajo", "nivel-2": "segundo nivel", "nivel-3": "tercer nivel", "nivel-4": "nivel más alto", carbohidratos: "carbohidratos", proteina: "proteína", verdura: "verdura" };

const clean = (s) => String(s ?? "").replace(/\*/g, "").replace(/ · /g, ", ").trim();
const join = (...xs) => xs.filter((x) => x && String(x).trim()).map(clean).join(". ").replace(/\.\./g, ".").replace(/\s+/g, " ").trim();
const art = (name, resaltar = []) => {
  if (!name) return "";
  const z = (resaltar || []).map((r) => ZONAS[r] || r);
  return `Ilustración: ${SVG[name] || name}${z.length ? `, con ${z.join(" y ")} resaltados en naranja` : ""}`;
};
const tag = (s) => (s.etiqueta === "estudio" ? "Datos del estudio" : "Ejemplo ilustrativo");
const src = (s) => (s.fuente ? (/^fuente/i.test(s.fuente) ? s.fuente : `Fuente: ${s.fuente}`) : "");

function alt(s, post) {
  const u = s.sufijo || "";
  switch (s.tipo) {
    case "portada":
      return join(`Portada: ${clean(s.titulo)}`, s.subtitulo, s.cifra && `${s.cifra} ${s.cifra_texto || ""}`, art(s.svg, s.resaltar));
    case "contexto":
      return join(s.titulo, s.texto, art(s.svg, s.resaltar));
    case "grafica_linea":
    case "grafica_area":
      return join(
        `Gráfica de ${s.tipo === "grafica_area" ? "área" : "líneas"} (${tag(s)}): ${clean(s.titulo)}`,
        s.texto,
        ...(s.series || []).map((se) => `${se.nombre}: ${se.valores.map((v, i) => `${s.x[i]}, ${fmt(v)}${s.y?.sufijo || ""}`).join("; ")}`),
        s.lectura,
        src(s),
      );
    case "grafica_barras":
      return join(`Gráfica de barras (${tag(s)}): ${clean(s.titulo)}`, s.texto, (s.barras || []).map((b) => `${b.etiqueta}: ${fmt(b.valor)}${u}`).join("; "), s.lectura, src(s));
    case "barras_agrupadas":
      return join(`Gráfica de barras agrupadas (${tag(s)}): ${clean(s.titulo)}`, s.texto, (s.grupos || []).map((g) => `${g.etiqueta}: ${s.series.map((n, k) => `${n} ${fmt(g.valores[k])}${u}`).join(", ")}`).join("; "), s.lectura, src(s));
    case "comparativa":
      return join(`Comparativa (${tag(s)}): ${clean(s.titulo)}`, s.texto, `${s.a.etiqueta}: ${fmt(s.a.valor)} ${s.a.unidad || ""}${s.a.nota ? ` (${s.a.nota})` : ""}`, `${s.b.etiqueta}: ${fmt(s.b.valor)} ${s.b.unidad || ""}${s.b.nota ? ` (${s.b.nota})` : ""}`, s.diferencia && `Diferencia: ${s.diferencia}`, s.lectura, src(s));
    case "donut":
    case "porcentaje":
      return join(`Gráfico circular (${tag(s)}): ${clean(s.titulo)}`, s.texto, `${fmt(s.valor)} % ${s.etiqueta_centro || ""}`, s.lectura, src(s));
    case "linea_temporal":
      return join(`Línea temporal (${tag(s)}): ${clean(s.titulo)}`, s.texto, (s.fases || []).map((f) => `${f.etiqueta}: ${f.titulo}${f.texto ? `, ${f.texto}` : ""}`).join("; "), s.lectura, src(s));
    case "tabla":
      return join(`Tabla (${tag(s)}): ${clean(s.titulo)}`, s.texto, `Columnas: ${s.columnas.join(", ")}`, (s.filas || []).map((r) => r.join(", ")).join("; "), s.lectura, src(s));
    case "dato_grande":
      return join(`Dato destacado (${tag(s)}): ${clean(s.titulo)}`, `${s.cifra} ${s.unidad || ""}`, s.texto, src(s));
    case "conclusion":
      return join(`Conclusión: ${(s.lineas || []).map(clean).join(" ")}`, s.texto);
    case "aplicacion":
      return join(clean(s.titulo || "Qué hacer en tu entreno"), ...(s.puntos || []).map((p, i) => `${i + 1}: ${clean(p)}`));
    case "ilustracion":
      return join(s.titulo, art(s.svg, s.resaltar), s.texto);
    case "correcto_incorrecto":
      return join(s.titulo, `Así: ${art(s.correcto?.svg, s.correcto?.resaltar).replace("Ilustración: ", "")}. ${clean(s.correcto?.texto)}`, `Así no: ${art(s.incorrecto?.svg, s.incorrecto?.resaltar).replace("Ilustración: ", "")}. ${clean(s.incorrecto?.texto)}`);
    case "referencias":
      return join("Fuentes", ...(post.fuentes || []).map((f) => `${f.autores} (${f.anio}). ${f.titulo}. ${f.revista}`));
    case "cta":
      return join(`Cierre: ${clean(s.titulo)}`, s.texto);
    default:
      return clean(s.titulo || s.texto || s.tipo);
  }
}

let changed = 0;
for (const post of loadPosts()) {
  const prev = Array.isArray(post.alt_text) ? post.alt_text : [];
  const next = post.slides.map((s, i) => (!FORCE && prev[i] && prev.length === post.slides.length ? prev[i] : alt(s, post).slice(0, 1000)));
  if (JSON.stringify(prev) === JSON.stringify(next)) continue;
  const { __file, ...data } = post;
  data.alt_text = next;
  // alt_text siempre después de slides para que el JSON sea fácil de leer
  const ordered = {};
  for (const k of Object.keys(data)) if (k !== "alt_text") ordered[k] = data[k];
  const out = {};
  for (const [k, v] of Object.entries(ordered)) {
    out[k] = v;
    if (k === "slides") out.alt_text = next;
  }
  writeFileSync(path.join(POSTS_DIR, __file), JSON.stringify(out, null, 2) + "\n");
  changed++;
}
console.log(`alt_text actualizado en ${changed} post(s)`);
