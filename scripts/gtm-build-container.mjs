// Genera docs/sem/gtm-container-import.json (formato oficial de exportación de GTM, exportFormatVersion 2)
// para "Administrar → Importar contenedor → Combinar". Valida JSON, IDs únicos y referencias.
//   node scripts/gtm-build-container.mjs [G-XXXXXXXXXX]
import { writeFileSync } from "node:fs";

// A 27/10/2026 el contenedor publicado GTM-5D5D2CH9 no contiene ninguna etiqueta ni ID "G-",
// así que se incluye la etiqueta de Google y el ID queda como marcador para sustituir en GTM.
const MEASUREMENT_ID = process.argv[2] || "G-XXXXXXXXXX";
const INCLUDE_GOOGLE_TAG = true;
const ALL_PAGES = "2147479553"; // activador integrado "All Pages"

const ids = { acc: "0", cont: "0" };
const base = { accountId: ids.acc, containerId: ids.cont };
const T = (key, value) => ({ type: "TEMPLATE", key, value });

const variables = [];
const triggers = [];
const tags = [];
let n = 1;

variables.push({ ...base, variableId: String(n++), name: "GA4 Measurement ID", type: "c", parameter: [T("value", MEASUREMENT_ID)] });
const DLV = ["product", "ranking", "position", "race_name", "region", "term", "search_location", "form"];
for (const k of DLV) {
  variables.push({ ...base, variableId: String(n++), name: `DLV - ${k}`, type: "v", parameter: [
    { type: "INTEGER", key: "dataLayerVersion", value: "2" },
    { type: "BOOLEAN", key: "setDefaultValue", value: "false" },
    T("name", k),
  ] });
}

const EVENTS = {
  affiliate_click: ["product", "ranking", "position"],
  race_outbound_click: ["race_name", "region"],
  contact_form_submit: ["form"],
  search_used: ["term", "search_location"],
  region_view: ["region"],
};
const consent = { consentStatus: "NEEDED", consentType: { type: "LIST", list: [{ type: "TEMPLATE", value: "analytics_storage" }] } };

if (INCLUDE_GOOGLE_TAG) {
  tags.push({ ...base, tagId: String(n++), name: "Etiqueta de Google - GA4", type: "googtag",
    parameter: [T("tagId", "{{GA4 Measurement ID}}")],
    firingTriggerId: [ALL_PAGES], tagFiringOption: "ONCE_PER_EVENT", consentSettings: consent });
}
for (const [ev, params] of Object.entries(EVENTS)) {
  const triggerId = String(n++);
  triggers.push({ ...base, triggerId, name: `CE - ${ev}`, type: "CUSTOM_EVENT",
    customEventFilter: [{ type: "EQUALS", parameter: [T("arg0", "{{_event}}"), T("arg1", ev)] }] });
  tags.push({ ...base, tagId: String(n++), name: `GA4 - ${ev}`, type: "gaawe",
    parameter: [
      { type: "BOOLEAN", key: "sendEcommerceData", value: "false" },
      T("eventName", ev),
      T("measurementIdOverride", "{{GA4 Measurement ID}}"),
      { type: "LIST", key: "eventSettingsTable", list: params.map(p => ({ type: "MAP", map: [T("parameter", p), T("parameterValue", `{{DLV - ${p}}}`)] })) },
    ],
    firingTriggerId: [triggerId], tagFiringOption: "ONCE_PER_EVENT", consentSettings: consent });
}

const container = {
  exportFormatVersion: 2,
  exportTime: "2026-10-27 21:00:00",
  containerVersion: {
    path: "accounts/0/containers/0/versions/0", ...base, containerVersionId: "0",
    container: { path: "accounts/0/containers/0", ...base, name: "hybridracehub.com", publicId: "GTM-5D5D2CH9", usageContext: ["WEB"] },
    tag: tags, trigger: triggers, variable: variables,
    builtInVariable: [{ ...base, type: "EVENT", name: "Event" }, { ...base, type: "PAGE_PATH", name: "Page Path" }],
  },
};

// Validación
const errs = [];
const all = [...tags.map(t => t.tagId), ...triggers.map(t => t.triggerId), ...variables.map(v => v.variableId)];
if (new Set(all).size !== all.length) errs.push("IDs repetidos");
const names = [...tags, ...triggers, ...variables].map(x => x.name);
if (new Set(names).size !== names.length) errs.push("Nombres repetidos");
const trigIds = new Set([...triggers.map(t => t.triggerId), ALL_PAGES]);
for (const t of tags) for (const f of t.firingTriggerId) if (!trigIds.has(f)) errs.push(`${t.name}: activador ${f} no existe`);
const varNames = new Set(variables.map(v => v.name));
const refs = JSON.stringify(container).match(/\{\{[^}]+\}\}/g) || [];
for (const r of new Set(refs)) { const v = r.slice(2, -2); if (v !== "_event" && !varNames.has(v)) errs.push(`Variable no definida: ${r}`); }
const json = JSON.stringify(container, null, 2);
JSON.parse(json);
if (errs.length) { console.error(errs.join("\n")); process.exit(1); }
writeFileSync("docs/sem/gtm-container-import.json", json + "\n");
console.log(`OK: ${tags.length} etiquetas, ${triggers.length} activadores, ${variables.length} variables. ID de medición: ${MEASUREMENT_ID}`);
