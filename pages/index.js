import { useState, useEffect, useCallback } from "react";
import Head from "next/head";

const SUPABASE_URL = "https://ssyljhtganuaanczxeep.supabase.co";
const ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzeWxqaHRnYW51YWFuY3p4ZWVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5MzA2MDcsImV4cCI6MjA5MjUwNjYwN30.kY5rw5BFXqdMze0IMQmbDQNfh5uXhaI35e4LfMYNOjE";

// Dynamic date boundaries — recomputed at runtime
const NOW = new Date();
const TODAY_YEAR  = NOW.getFullYear();
const TODAY_MONTH = NOW.getMonth(); // 0-based
const TODAY_ISO   = `${TODAY_YEAR}-${String(TODAY_MONTH + 1).padStart(2, "0")}-${String(NOW.getDate()).padStart(2, "0")}`;
const MAX_YEAR    = TODAY_YEAR + 1; // always Dec 31 of next year

// ── Niche: only OCR + HYROX/Functional ───────────────────────────────────────
const NICHE_PARENTS = ["ocr", "funcional"];

const MODALITIES = [
  {
    id: "ocr", label: "OCR", icon: "⚡",
    color: "#FB923C", bg: "#1C0D04",
    subs: [
      { id: "ocr-spartan", label: "Spartan Race" },
      { id: "ocr-mudder",  label: "Tough Mudder" },
      { id: "ocr-general", label: "OCR General" },
    ],
  },
  {
    id: "funcional", label: "HYROX / Funcional", icon: "🏋️",
    color: "#FACC15", bg: "#18120A",
    subs: [
      { id: "func-hyrox",   label: "HYROX" },
      { id: "func-crossfit",label: "CrossFit" },
      { id: "func-fitness", label: "Fitness Funcional" },
    ],
  },
];

const SUB_COLOR = {};
const SUB_BG    = {};
MODALITIES.forEach(m => m.subs.forEach(s => { SUB_COLOR[s.id] = m.color; SUB_BG[s.id] = m.bg; }));

const CCAA = [
  "Andalucía","Aragón","Asturias","Baleares","Canarias","Cantabria",
  "Castilla-La Mancha","Castilla y León","Cataluña","Ceuta",
  "Comunidad Valenciana","Extremadura","Galicia","La Rioja",
  "Madrid","Melilla","Murcia","Navarra","País Vasco",
];

const FORMATS = [
  { id: "individual", label: "Individual" },
  { id: "pairs",      label: "Parejas" },
  { id: "team",       label: "Equipos" },
  { id: "elite",      label: "Pro / Elite" },
];

const MONTH_NAMES = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

const C = {
  bg:        "#0A0B0F",
  card:      "#12131A",
  card2:     "#191A24",
  border:    "rgba(255,255,255,0.07)",
  border2:   "rgba(255,255,255,0.15)",
  text:      "#F0F0F5",
  muted:     "#6B6D7A",
  hint:      "#22233A",
  accent:    "#7C6FFF",
  accentBg:  "#17153A",
  accentMid: "#A89CFF",
};

function toggle(arr, setArr, val) {
  setArr(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);
}

// ── MonthRangePicker ──────────────────────────────────────────────────────────
function MonthRangePicker({ from, to, onChange }) {
  const [viewYear, setViewYear] = useState(TODAY_YEAR);

  function ymInt(year, month) { return year * 12 + month; }

  function isDisabled(year, month) {
    const ym    = ymInt(year, month);
    const minYM = ymInt(TODAY_YEAR, TODAY_MONTH);
    const maxYM = ymInt(MAX_YEAR, 11);
    return ym < minYM || ym > maxYM;
  }

  function getStatus(year, month) {
    if (!from) return "none";
    const ym     = ymInt(year, month);
    const fromYM = ymInt(from.year, from.month);
    const toYM   = to ? ymInt(to.year, to.month) : null;
    if (ym === fromYM) return "from";
    if (toYM !== null && ym === toYM) return "to";
    if (toYM !== null && ym > fromYM && ym < toYM) return "range";
    return "none";
  }

  function handleClick(month) {
    if (isDisabled(viewYear, month)) return;
    const clicked = { year: viewYear, month };
    if (!from || (from && to)) {
      onChange({ from: clicked, to: null });
    } else {
      const clickedYM = ymInt(viewYear, month);
      const fromYM    = ymInt(from.year, from.month);
      if (clickedYM === fromYM) {
        onChange({ from: null, to: null });
      } else if (clickedYM < fromYM) {
        onChange({ from: clicked, to: from });
      } else {
        onChange({ from, to: clicked });
      }
    }
  }

  const canPrev = viewYear > TODAY_YEAR;
  const canNext = viewYear < MAX_YEAR;

  const navBtn = (label, active, onClick) => (
    <button
      onClick={onClick}
      style={{
        width: 28, height: 28, borderRadius: 7,
        border: `0.5px solid ${active ? C.border2 : C.border}`,
        background: active ? C.card2 : "transparent",
        color: active ? C.text : C.hint,
        cursor: active ? "pointer" : "not-allowed",
        fontSize: 16, lineHeight: 1,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      {label}
    </button>
  );

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        {navBtn("‹", canPrev, () => canPrev && setViewYear(y => y - 1))}
        <span style={{ fontSize: 13, fontWeight: 600, color: C.text, letterSpacing: "0.02em" }}>
          {viewYear}
        </span>
        {navBtn("›", canNext, () => canNext && setViewYear(y => y + 1))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 4 }}>
        {MONTH_NAMES.map((name, m) => {
          const disabled = isDisabled(viewYear, m);
          const status   = getStatus(viewYear, m);
          const isEdge   = status === "from" || status === "to";
          const inRange  = status === "range";

          return (
            <button
              key={m}
              onClick={() => handleClick(m)}
              style={{
                padding: "8px 2px", fontSize: 11, borderRadius: 8,
                cursor: disabled ? "not-allowed" : "pointer",
                border: isEdge
                  ? `1.5px solid ${C.accent}`
                  : `0.5px solid ${inRange ? C.accent + "44" : C.border}`,
                background: isEdge ? C.accent : inRange ? C.accentBg : C.card2,
                color: isEdge ? "#fff" : inRange ? C.accentMid : disabled ? C.hint : C.muted,
                opacity: disabled ? 0.2 : 1,
                fontWeight: isEdge ? 700 : 400,
                transition: "background .1s, border-color .1s",
              }}
            >
              {name}
            </button>
          );
        })}
      </div>

      {from && (
        <p style={{ marginTop: 8, fontSize: 11, color: C.muted, textAlign: "center" }}>
          {MONTH_NAMES[from.month]} {from.year}
          {" → "}
          {to ? `${MONTH_NAMES[to.month]} ${to.year}` : <span style={{ color: C.hint }}>selecciona fin</span>}
        </p>
      )}
    </div>
  );
}

// ── RaceCard ──────────────────────────────────────────────────────────────────
function RaceCard({ race }) {
  const [open, setOpen] = useState(false);
  const col = SUB_COLOR[race.modalidad_id] || C.accentMid;
  const bg  = SUB_BG[race.modalidad_id]   || C.accentBg;

  const statusColor = {
    Abierta: { bg: "#052B1A", color: "#34D399" },
    Cerrada:  { bg: "#2D0A12", color: "#F87171" },
  }[race.estado] || { bg: "#1C1200", color: "#FCD34D" };

  return (
    <div
      className="race-card"
      onClick={() => setOpen(o => !o)}
      style={{
        background: C.card,
        border: `0.5px solid ${open ? C.border2 : C.border}`,
        borderRadius: 14,
        padding: "14px 16px",
        cursor: "pointer",
        transition: "border-color .15s, box-shadow .15s",
        boxShadow: open ? `0 0 0 1px rgba(124,111,255,0.12), 0 4px 20px rgba(0,0,0,0.3)` : "none",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 7 }}>
            <span style={{
              fontSize: 10, fontWeight: 600, padding: "2px 9px",
              borderRadius: 100, background: bg, color: col,
              letterSpacing: "0.03em",
            }}>
              {race.modalidad || (race.modalidad_parent || "").toUpperCase()}
            </span>
            {race.estado && (
              <span style={{
                fontSize: 10, padding: "2px 9px", borderRadius: 100,
                background: statusColor.bg, color: statusColor.color,
              }}>
                {race.estado}
              </span>
            )}
          </div>

          <p style={{
            fontSize: 14, fontWeight: 600, margin: "0 0 5px", color: C.text,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            letterSpacing: "-0.2px", lineHeight: 1.3,
          }}>
            {race.nombre}
          </p>

          <p style={{ fontSize: 12, color: C.muted, margin: 0, display: "flex", alignItems: "center", gap: 5, flexWrap: "nowrap", overflow: "hidden" }}>
            <span style={{ flexShrink: 0 }}>{race.fecha || race.fecha_iso}</span>
            {race.ubicacion && (
              <>
                <span style={{ color: C.hint, flexShrink: 0 }}>·</span>
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {race.ubicacion}
                </span>
              </>
            )}
          </p>
        </div>

        <div style={{ textAlign: "right", flexShrink: 0, paddingTop: 2 }}>
          {race.precio && (
            <p style={{ fontSize: 12, fontWeight: 600, color: col, margin: "0 0 3px" }}>{race.precio}</p>
          )}
          <span style={{
            fontSize: 9, color: C.hint,
            display: "inline-block",
            transition: "transform .2s",
            transform: open ? "rotate(180deg)" : "none",
          }}>▼</span>
        </div>
      </div>

      {open && (
        <div style={{ marginTop: 13, paddingTop: 13, borderTop: `0.5px solid ${C.border}` }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 14px", marginBottom: 10 }}>
            {race.distancia && (
              <div>
                <p style={{ fontSize: 9, color: C.muted, margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.07em" }}>Distancia</p>
                <p style={{ fontSize: 12, color: C.text, margin: 0 }}>{race.distancia}</p>
              </div>
            )}
            {race.comunidad && (
              <div>
                <p style={{ fontSize: 9, color: C.muted, margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.07em" }}>Comunidad</p>
                <p style={{ fontSize: 12, color: C.text, margin: 0 }}>{race.comunidad}</p>
              </div>
            )}
          </div>

          {race.notas && (
            <p style={{ fontSize: 11, color: C.muted, margin: "0 0 10px", lineHeight: 1.6 }}>{race.notas}</p>
          )}

          {race.url && (
            <a
              href={race.url}
              target="_blank"
              rel="noreferrer"
              onClick={e => e.stopPropagation()}
              style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                fontSize: 12, color: col, textDecoration: "none",
                border: `1px solid ${col}44`, background: bg,
                padding: "7px 14px", borderRadius: 9,
                fontWeight: 500,
              }}
            >
              Ver inscripción →
            </a>
          )}
        </div>
      )}
    </div>
  );
}

// ── FilterSection ─────────────────────────────────────────────────────────────
function FilterSection({ title, active, children }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <p style={{
        fontSize: 9, fontWeight: 700, letterSpacing: "0.1em",
        textTransform: "uppercase", margin: "0 0 10px",
        color: active ? C.accentMid : C.muted,
        display: "flex", alignItems: "center", gap: 6,
      }}>
        {title}
        {active && (
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: C.accent, display: "inline-block" }} />
        )}
      </p>
      {children}
    </div>
  );
}

// ── Home ──────────────────────────────────────────────────────────────────────
export default function Home() {
  const [ccaa, setCcaa]               = useState([]);
  const [modalParents, setModalParents] = useState([]);
  const [modalSubs, setModalSubs]     = useState([]);
  const [formats, setFormats]         = useState([]);
  const [dateRange, setDateRange]     = useState({ from: null, to: null });
  const [results, setResults]         = useState(null);
  const [loading, setLoading]         = useState(true);
  const [refreshing, setRefreshing]   = useState(false);
  const [error, setError]             = useState(null);
  const [totalCount, setTotalCount]   = useState(null);

  function toggleParent(id) {
    if (modalParents.includes(id)) {
      setModalParents(p => p.filter(x => x !== id));
      const subIds = MODALITIES.find(m => m.id === id)?.subs.map(s => s.id) || [];
      setModalSubs(s => s.filter(x => !subIds.includes(x)));
    } else {
      setModalParents(p => [...p, id]);
    }
  }

  const fetchRaces = useCallback(async () => {
    if (results !== null) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const p = new URLSearchParams();
      p.append("select", "*");
      p.append("order", "fecha_iso.asc");

      // Niche filter: always only show OCR + Functional hybrid events
      if (modalSubs.length > 0) {
        if (modalSubs.length === 1) p.append("modalidad_id", `eq.${modalSubs[0]}`);
        else p.append("modalidad_id", `in.(${modalSubs.join(",")})`);
      } else if (modalParents.length > 0) {
        if (modalParents.length === 1) p.append("modalidad_parent", `eq.${modalParents[0]}`);
        else p.append("modalidad_parent", `in.(${modalParents.join(",")})`);
      } else {
        p.append("modalidad_parent", `in.(${NICHE_PARENTS.join(",")})`);
      }

      // Date range — min is always today
      if (dateRange.from) {
        const fromStr = `${dateRange.from.year}-${String(dateRange.from.month + 1).padStart(2, "0")}-01`;
        p.append("fecha_iso", `gte.${fromStr}`);
      } else {
        p.append("fecha_iso", `gte.${TODAY_ISO}`);
      }

      if (dateRange.to) {
        const last = new Date(dateRange.to.year, dateRange.to.month + 1, 0);
        p.append("fecha_iso", `lte.${last.toISOString().split("T")[0]}`);
      }

      // Location
      if (ccaa.length === 1) p.append("comunidad", `eq.${ccaa[0]}`);
      else if (ccaa.length > 1) p.append("comunidad", `in.(${ccaa.join(",")})`);

      const res  = await fetch(`${SUPABASE_URL}/rest/v1/races?${p}`, {
        headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` },
      });
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error(data.message || "Error");

      // Client-side format filter (pass-through until DB has formato column)
      const hasFormatoData = data.some(r => r.formato);
      const filtered = (formats.length > 0 && hasFormatoData)
        ? data.filter(r => !r.formato || formats.includes(r.formato))
        : data;

      setResults(filtered);
    } catch {
      setError("Error de conexión. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [ccaa, modalParents, modalSubs, formats, dateRange]);

  // Auto-search with debounce
  useEffect(() => {
    const t = setTimeout(fetchRaces, 320);
    return () => clearTimeout(t);
  }, [fetchRaces]);

  // Total count of hybrid events in DB
  useEffect(() => {
    fetch(`${SUPABASE_URL}/rest/v1/races?select=count&modalidad_parent=in.(ocr,funcional)`, {
      headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}`, Prefer: "count=exact" },
    })
      .then(r => { const c = r.headers.get("content-range"); if (c) setTotalCount(c.split("/")[1]); })
      .catch(() => {});
  }, []);

  function handleReset() {
    setCcaa([]); setModalParents([]); setModalSubs([]);
    setFormats([]); setDateRange({ from: null, to: null });
  }

  const anyFilter =
    ccaa.length || modalParents.length || modalSubs.length ||
    formats.length || dateRange.from;

  return (
    <>
      <Head>
        <title>Hybrid Race Hub — OCR, HYROX & Competiciones Funcionales</title>
        <meta name="description" content="El calendario de referencia para carreras OCR, HYROX y competiciones funcionales en España. Encuentra y filtra tu próxima prueba." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Hybrid Race Hub" />
        <meta property="og:description" content="OCR · HYROX · Functional — Calendario de competiciones híbridas" />
      </Head>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; background: #0A0B0F; color: #F0F0F5; font-family: system-ui, -apple-system, sans-serif; overflow: hidden; }
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes fadeIn  { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse   { 0%,100% { opacity: 1; } 50% { opacity: 0.45; } }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #2E3040; border-radius: 4px; }
        .race-card { animation: fadeIn .22s ease both; }
        @media (max-width: 768px) {
          html, body { overflow: auto; }
          #sidebar { width: 100% !important; min-width: unset !important; height: auto !important; border-right: none !important; border-bottom: 0.5px solid rgba(255,255,255,0.07) !important; }
          #layout  { flex-direction: column !important; }
          #main    { height: auto !important; }
        }
      `}</style>

      <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>

        {/* ── Header ── */}
        <header style={{
          height: 56, flexShrink: 0,
          background: C.card, borderBottom: `0.5px solid ${C.border}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 1.5rem", zIndex: 10,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 11, flexShrink: 0,
              background: "linear-gradient(135deg, #7C6FFF 0%, #FB923C 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18,
            }}>
              ⚡
            </div>
            <div>
              <p style={{ fontSize: 15, fontWeight: 700, margin: 0, letterSpacing: "-0.3px", color: C.text }}>
                Hybrid Race Hub
              </p>
              <p style={{ fontSize: 10, color: C.muted, margin: 0, display: "flex", alignItems: "center", gap: 6 }}>
                <span>OCR · HYROX · Functional</span>
                {totalCount !== null && (
                  <span style={{
                    color: C.accent, background: C.accentBg,
                    padding: "1px 7px", borderRadius: 20, fontSize: 10,
                  }}>
                    {totalCount} eventos
                  </span>
                )}
                {refreshing && (
                  <span style={{ color: C.hint, animation: "pulse 1s infinite", fontSize: 10 }}>
                    actualizando…
                  </span>
                )}
              </p>
            </div>
          </div>

          {anyFilter ? (
            <button
              onClick={handleReset}
              style={{
                fontSize: 12, color: C.muted, background: "none",
                border: `0.5px solid ${C.border}`, borderRadius: 8,
                padding: "5px 13px", cursor: "pointer",
              }}
            >
              Limpiar filtros
            </button>
          ) : null}
        </header>

        {/* ── Body ── */}
        <div id="layout" style={{ display: "flex", flex: 1, overflow: "hidden" }}>

          {/* ── Sidebar ── */}
          <aside
            id="sidebar"
            style={{
              width: 268, minWidth: 268,
              background: C.card, borderRight: `0.5px solid ${C.border}`,
              overflowY: "auto", padding: "1.1rem 1rem",
              display: "flex", flexDirection: "column",
            }}
          >
            {/* Competition format */}
            <FilterSection title="Formato" active={formats.length > 0}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {FORMATS.map(f => (
                  <button
                    key={f.id}
                    onClick={() => toggle(formats, setFormats, f.id)}
                    style={{
                      padding: "5px 12px", fontSize: 11, borderRadius: 100, cursor: "pointer",
                      fontWeight: formats.includes(f.id) ? 600 : 400,
                      border:     formats.includes(f.id) ? `1.5px solid ${C.accent}` : `0.5px solid ${C.border}`,
                      background: formats.includes(f.id) ? C.accentBg : C.card2,
                      color:      formats.includes(f.id) ? C.accentMid : C.muted,
                      transition: "all .1s",
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </FilterSection>

            {/* Race type */}
            <FilterSection title="Tipo de prueba" active={modalParents.length > 0 || modalSubs.length > 0}>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {MODALITIES.map(m => (
                  <div key={m.id}>
                    <button
                      onClick={() => toggleParent(m.id)}
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 6,
                        padding: "6px 12px", fontSize: 12, borderRadius: 100, cursor: "pointer",
                        fontWeight:  modalParents.includes(m.id) ? 600 : 400,
                        border:      modalParents.includes(m.id) ? `1.5px solid ${m.color}` : `0.5px solid ${C.border}`,
                        background:  modalParents.includes(m.id) ? m.bg : C.card2,
                        color:       modalParents.includes(m.id) ? m.color : C.muted,
                        marginBottom: modalParents.includes(m.id) ? 7 : 0,
                        transition: "all .1s",
                      }}
                    >
                      <span style={{ fontSize: 14 }}>{m.icon}</span>
                      {m.label}
                      <span style={{ fontSize: 9, opacity: 0.5, marginLeft: 1 }}>
                        {modalParents.includes(m.id) ? "▲" : "▼"}
                      </span>
                    </button>

                    {modalParents.includes(m.id) && (
                      <div style={{
                        display: "flex", flexWrap: "wrap", gap: 4,
                        paddingLeft: 12, borderLeft: `2px solid ${m.color}30`,
                      }}>
                        {m.subs.map(s => (
                          <button
                            key={s.id}
                            onClick={() => toggle(modalSubs, setModalSubs, s.id)}
                            style={{
                              padding: "4px 10px", fontSize: 11, borderRadius: 100, cursor: "pointer",
                              fontWeight: modalSubs.includes(s.id) ? 600 : 400,
                              border:     modalSubs.includes(s.id) ? `1.5px solid ${m.color}` : `0.5px solid ${C.border}`,
                              background: modalSubs.includes(s.id) ? m.bg : C.card2,
                              color:      modalSubs.includes(s.id) ? m.color : C.muted,
                              transition: "all .1s",
                            }}
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </FilterSection>

            {/* Location */}
            <FilterSection title="Comunidad autónoma" active={ccaa.length > 0}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {CCAA.map(c => (
                  <button
                    key={c}
                    onClick={() => toggle(ccaa, setCcaa, c)}
                    style={{
                      padding: "3px 9px", fontSize: 11, borderRadius: 100, cursor: "pointer",
                      fontWeight: ccaa.includes(c) ? 500 : 400,
                      border:     ccaa.includes(c) ? `1.5px solid ${C.accent}` : `0.5px solid ${C.border}`,
                      background: ccaa.includes(c) ? C.accentBg : C.card2,
                      color:      ccaa.includes(c) ? C.accentMid : C.muted,
                      transition: "all .1s",
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </FilterSection>

            {/* Date range */}
            <FilterSection title="Fechas" active={!!dateRange.from}>
              <MonthRangePicker
                from={dateRange.from}
                to={dateRange.to}
                onChange={({ from, to }) => setDateRange({ from, to })}
              />
            </FilterSection>
          </aside>

          {/* ── Main ── */}
          <main id="main" style={{ flex: 1, overflowY: "auto", padding: "1.25rem", background: C.bg }}>

            {/* Initial full-page loader */}
            {loading && results === null && (
              <div style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                justifyContent: "center", height: "60%", minHeight: 280,
                gap: 16, color: C.muted,
              }}>
                <div style={{
                  width: 36, height: 36,
                  border: `2.5px solid ${C.hint}`,
                  borderTop: `2.5px solid ${C.accent}`,
                  borderRadius: "50%",
                  animation: "spin 0.75s linear infinite",
                }} />
                <p style={{ fontSize: 13 }}>Cargando eventos…</p>
              </div>
            )}

            {/* Error state */}
            {error && !loading && (
              <p style={{ fontSize: 13, color: "#F87171", textAlign: "center", padding: "3rem 0" }}>
                {error}
              </p>
            )}

            {/* Results */}
            {results !== null && !loading && !error && (
              <>
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  marginBottom: 16,
                }}>
                  <p style={{ fontSize: 13, fontWeight: 500, color: C.text }}>
                    {results.length > 0
                      ? `${results.length} evento${results.length !== 1 ? "s" : ""}`
                      : "Sin resultados"}
                  </p>
                  {results.length > 0 && (
                    <p style={{ fontSize: 11, color: C.muted }}>Toca para más info</p>
                  )}
                </div>

                {results.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "5rem 1rem" }}>
                    <p style={{ fontSize: 42, marginBottom: 16 }}>🏁</p>
                    <p style={{ fontSize: 15, color: C.muted, marginBottom: 8 }}>
                      Sin eventos con estos filtros
                    </p>
                    <p style={{ fontSize: 12, color: C.hint }}>
                      Prueba a ajustar los filtros o ampliar el rango de fechas
                    </p>
                  </div>
                ) : (
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                    gap: 10,
                  }}>
                    {results.map((r, i) => <RaceCard key={r.id || i} race={r} />)}
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </>
  );
}
