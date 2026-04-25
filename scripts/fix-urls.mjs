/**
 * Script para corregir las URLs de inscripción de los eventos.
 * Ejecutar con: node scripts/fix-urls.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

const env = readFileSync(".env.local", "utf8");
const serviceKey = env.match(/SUPABASE_SERVICE_KEY=(.+)/)?.[1]?.trim();
const url = "https://ssyljhtganuaanczxeep.supabase.co";

const sb = createClient(url, serviceKey);

// Formato: [nombre_exacto_en_bd, url_correcta]
const FIXES = [
  /* ── SURVIVOR RACE ─────────────────────────────────────────────────────── */
  ["Survivor Race Alicante 2026",  "https://survivor-race.com/carreras/survivor-alicante/"],
  ["Survivor Race Barcelona 2026", "https://survivor-race.com/carreras/survivor-barcelona/"],
  ["Survivor Race Madrid 2026",    "https://survivor-race.com/carreras/survivor-madrid/"],

  /* ── DESAFÍO DE GUERREROS ───────────────────────────────────────────────── */
  ["Desafío de Guerreros Gernika 2026",       "https://www.desafiodeguerreros.com.es/carreras/p/desafio-bizkaia"],
  ["Desafío de Guerreros Pineda de Mar 2026", "https://www.desafiodeguerreros.com.es/carreras/desafio-barcelona"],
  ["Desafío de Guerreros Valencia Jun 2026",  "https://www.desafiodeguerreros.com.es/carreras/p/desafio-valencia"],
  ["Desafío de Guerreros Madrid Sep 2026",    "https://www.desafiodeguerreros.com.es/carreras/p/desafio-madrid"],
  ["Desafío de Guerreros Málaga 2026",        "https://www.desafiodeguerreros.com.es/carreras/p/desafio-malaga"],

  /* ── GLADIATOR RACE ─────────────────────────────────────────────────────── */
  ["Gladiator Race Pontevedra 2026", "https://gladiatorraceoficial.com/pontevedra/"],
  ["Gladiator's Day 2026",           "https://www.gladiatorsday.com/"],

  /* ── FARINATO RACE ──────────────────────────────────────────────────────── */
  ["Farinato Race León 2026",            "https://inscripciones.tucrono.com/inscripcion/farinato-race-leon-2026/"],
  ["Farinato Race Alcobendas 2026",      "https://inscripciones.tucrono.com/inscripcion/farinato-race-alcobendas-2026/"],
  ["Farinato Race Gijón 2026",           "https://inscripciones.tucrono.com/inscripcion/farinato-race-gijon-2026/"],
  ["Farinato Hybrid Medina del Campo 2026", "https://farinatorace.es/"],

  /* ── MEDIEVAL XTREME RACE ───────────────────────────────────────────────── */
  ["Medieval Xtreme Race Torreblanca 2026", "https://medievalxtremrace.com/inscripciones-torreblanca/"],
  ["Medieval Xtreme Race Peñíscola 2026",  "https://medievalxtremrace.com/inscripciones-peniscola/"],
  ["Medieval Xtreme Race Alginet 2026",    "https://medievalxtremrace.com/inscripciones/"],

  /* ── SPARTAN RACE ───────────────────────────────────────────────────────── */
  ["Spartan Race Madrid Sprint 2026",   "https://es.spartan.com/es/races/madrid"],
  ["Spartan Race Barcelona Oct 2026",   "https://es.spartan.com/es/races/barcelona"],
  ["Spartan Race Tenerife Nov 2026",    "https://es.spartan.com/es/races/tenerife"],

  /* ── HYROX ──────────────────────────────────────────────────────────────── */
  ["HYROX Madrid",    "https://hyrox.com/events/"],
  ["HYROX Barcelona", "https://hyrox.es/eventos/hyrox-barcelona-26-27/"],
  ["HYROX Tenerife",  "https://spain.hyrox.com/event/hyrox-tenerife-season-26-27-iv1ecx"],

  /* ── DEKA ───────────────────────────────────────────────────────────────── */
  ["DEKA Barcelona 2026", "https://es.spartan.com/es/races/deka-barcelona"],

  /* ── BERSERKER ──────────────────────────────────────────────────────────── */
  ["Berserker Xtreme Race Tacoronte 2026",
   "https://inscripciones.chronotrackcanarias.com/inscripcion/berserker-xtreme-race-tacoronte-2026/"],

  /* ── OTRAS CON SITIO PROPIO ─────────────────────────────────────────────── */
  ["The Battle Games X Edition 2026",    "https://thebattle.es/"],
  ["The Hybrid Games 3ª Edición Valencia","https://thehybridgames.fit/"],
  ["RNC Hybrid Race 1ª Edición",         "https://rafanadalclub.com/"],
  ["Gijón Throwdown 2026",               "https://gijonthrowdown.es/"],
  ["Farinato Race Gijón 2026",           "https://inscripciones.tucrono.com/inscripcion/farinato-race-gijon-2026/"],
  ["HybridZone 2026",                    "https://hybridzone.es/"],
];

async function run() {
  let ok = 0, fail = 0;
  for (const [nombre, url] of FIXES) {
    const { error } = await sb
      .from("races")
      .update({ url })
      .eq("nombre", nombre);

    if (error) {
      console.error(`✗ ${nombre}: ${error.message}`);
      fail++;
    } else {
      console.log(`✓ ${nombre.substring(0, 50)}`);
      ok++;
    }
  }
  console.log(`\nDone: ${ok} OK, ${fail} errores`);
}

run().catch(console.error);
