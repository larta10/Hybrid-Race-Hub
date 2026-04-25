import { useState, useEffect, useCallback, useRef } from "react";
import Head from "next/head";
import Link from "next/link";

/* ─── Supabase ─────────────────────────────────────────────────────────────── */
const SUPABASE_URL = "https://ssyljhtganuaanczxeep.supabase.co";
const ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzeWxqaHRnYW51YWFuY3p4ZWVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5MzA2MDcsImV4cCI6MjA5MjUwNjYwN30.kY5rw5BFXqdMze0IMQmbDQNfh5uXhaI35e4LfMYNOjE";

/* ─── Date constants ───────────────────────────────────────────────────────── */
const NOW         = new Date();
const TODAY_YEAR  = NOW.getFullYear();
const TODAY_MONTH = NOW.getMonth();
const TODAY_ISO   = `${TODAY_YEAR}-${String(TODAY_MONTH+1).padStart(2,"0")}-${String(NOW.getDate()).padStart(2,"0")}`;
const MAX_YEAR    = TODAY_YEAR + 1;

/* ─── Data constants ───────────────────────────────────────────────────────── */
const NICHE_PARENTS = ["ocr", "funcional"];

const MODALITIES = [
  {
    id:"ocr", label:"OCR",
    color:"var(--ocr)", bg:"var(--ocr-bg)",
    subs:[
      { id:"ocr-spartan", label:"Spartan Race" },
      { id:"ocr-mudder",  label:"Tough Mudder" },
      { id:"ocr-general", label:"OCR General"  },
    ],
  },
  {
    id:"funcional", label:"HYROX / Funcional",
    color:"var(--hyrox)", bg:"var(--hyrox-bg)",
    subs:[
      { id:"func-hyrox",   label:"HYROX"            },
      { id:"func-crossfit",label:"CrossFit"          },
      { id:"func-fitness", label:"Fitness Funcional" },
    ],
  },
];

const SUB_COLOR = {};
const SUB_BG    = {};
MODALITIES.forEach(m => m.subs.forEach(s => { SUB_COLOR[s.id]=m.color; SUB_BG[s.id]=m.bg; }));

const CCAA = [
  "Andalucía","Aragón","Asturias","Baleares","Canarias","Cantabria",
  "Castilla-La Mancha","Castilla y León","Cataluña","Ceuta",
  "Comunidad Valenciana","Extremadura","Galicia","La Rioja",
  "Madrid","Melilla","Murcia","Navarra","País Vasco",
];

const FORMATS = [
  { id:"individual", label:"Individual" },
  { id:"pairs",      label:"Parejas"    },
  { id:"team",       label:"Equipos"    },
  { id:"elite",      label:"Pro / Elite"},
];

const MONTH_NAMES = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

/* ─── Helpers ──────────────────────────────────────────────────────────────── */
function toggle(arr, setArr, val) {
  setArr(arr.includes(val) ? arr.filter(x=>x!==val) : [...arr,val]);
}

function buildGCalUrl(race) {
  const p = new URLSearchParams({ action: "TEMPLATE" });
  p.set("text", race.nombre || "");
  if (race.fecha_iso) {
    const start = race.fecha_iso.replace(/-/g, "");
    const next  = new Date(race.fecha_iso + "T12:00:00");
    next.setDate(next.getDate() + 1);
    const end = next.toISOString().split("T")[0].replace(/-/g, "");
    p.set("dates", `${start}/${end}`);
  }
  if (race.ubicacion) p.set("location", race.ubicacion);
  const details = [
    race.modalidad  && `Modalidad: ${race.modalidad}`,
    race.formato    && `Formato: ${race.formato}`,
    race.precio     && `Precio: ${race.precio}`,
    race.notas,
    race.url        && `Inscripción: ${race.url}`,
  ].filter(Boolean).join("\n");
  if (details) p.set("details", details);
  return `https://calendar.google.com/calendar/render?${p}`;
}

/* ─── SVG Icons ────────────────────────────────────────────────────────────── */
const OcrIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <polygon points="7,1 13,13 1,13" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <line x1="4" y1="9" x2="10" y2="9" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

const FuncIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <circle cx="3" cy="11" r="2" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="11" cy="11" r="2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M5 11h4M7 11V4M5 6h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const CalIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
    <rect x="1" y="2" width="11" height="10" rx="2" stroke="currentColor" strokeWidth="1.3"/>
    <line x1="1" y1="5.5" x2="12" y2="5.5" stroke="currentColor" strokeWidth="1.3"/>
    <line x1="4" y1="1" x2="4" y2="3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    <line x1="9" y1="1" x2="9" y2="3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
    <line x1="10.5" y1="10.5" x2="14" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

/* ─── MonthRangePicker ─────────────────────────────────────────────────────── */
function MonthRangePicker({ from, to, onChange }) {
  const [viewYear, setViewYear] = useState(TODAY_YEAR);
  const ymInt = (y,m) => y*12+m;

  function isDisabled(y,m) {
    return ymInt(y,m)<ymInt(TODAY_YEAR,TODAY_MONTH) || ymInt(y,m)>ymInt(MAX_YEAR,11);
  }

  function getStatus(y,m) {
    if(!from) return "none";
    const ym=ymInt(y,m), fym=ymInt(from.year,from.month), tym=to?ymInt(to.year,to.month):null;
    if(ym===fym) return "from";
    if(tym!==null && ym===tym) return "to";
    if(tym!==null && ym>fym && ym<tym) return "range";
    return "none";
  }

  function handleClick(m) {
    if(isDisabled(viewYear,m)) return;
    const clicked={year:viewYear,month:m};
    if(!from||(from&&to)) { onChange({from:clicked,to:null}); return; }
    const cym=ymInt(viewYear,m), fym=ymInt(from.year,from.month);
    if(cym===fym) onChange({from:null,to:null});
    else if(cym<fym) onChange({from:clicked,to:from});
    else onChange({from,to:clicked});
  }

  const canPrev = viewYear>TODAY_YEAR;
  const canNext = viewYear<MAX_YEAR;

  return (
    <div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
        <button onClick={()=>canPrev&&setViewYear(y=>y-1)} className={`mp-nav${canPrev?"":" mp-nav--off"}`}>‹</button>
        <span className="mp-year">{viewYear}</span>
        <button onClick={()=>canNext&&setViewYear(y=>y+1)} className={`mp-nav${canNext?"":" mp-nav--off"}`}>›</button>
      </div>
      <div className="mp-grid">
        {MONTH_NAMES.map((name,m)=>{
          const dis=isDisabled(viewYear,m);
          const st=getStatus(viewYear,m);
          const edge=st==="from"||st==="to";
          const inR=st==="range";
          return (
            <button key={m} onClick={()=>handleClick(m)}
              className={`mp-cell${edge?" mp-cell--edge":inR?" mp-cell--range":dis?" mp-cell--dis":""}`}>
              {name}
            </button>
          );
        })}
      </div>
      {from && (
        <p className="mp-label">
          {MONTH_NAMES[from.month]} {from.year}
          {" → "}
          {to ? `${MONTH_NAMES[to.month]} ${to.year}` : <span style={{color:"var(--hint)"}}>selecciona fin</span>}
        </p>
      )}
    </div>
  );
}

/* ─── RaceModal ────────────────────────────────────────────────────────────── */
function RaceModal({ race, onClose }) {
  const col  = SUB_COLOR[race.modalidad_id] || "var(--accent)";
  const bg   = SUB_BG[race.modalidad_id]   || "var(--accent-bg)";
  const statusStyle = race.estado==="Abierta"
    ? {bg:"var(--green-bg)",color:"var(--green)"}
    : race.estado==="Cerrada"
    ? {bg:"var(--red-bg)",color:"var(--red)"}
    : {bg:"rgba(250,204,21,0.12)",color:"var(--hyrox)"};

  useEffect(()=>{
    const fn=(e)=>{ if(e.key==="Escape") onClose(); };
    document.addEventListener("keydown",fn);
    document.body.style.overflow="hidden";
    return ()=>{ document.removeEventListener("keydown",fn); document.body.style.overflow=""; };
  },[onClose]);

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-box" onClick={e=>e.stopPropagation()}>
        <div className="modal-head">
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:10}}>
            <span className="tag" style={{background:bg,color:col}}>
              {race.modalidad || (race.modalidad_parent||"").toUpperCase()}
            </span>
            {race.estado && (
              <span className="tag" style={{background:statusStyle.bg,color:statusStyle.color}}>
                {race.estado.toUpperCase()}
              </span>
            )}
          </div>
          <h2 className="modal-title">{(race.nombre||"").toUpperCase()}</h2>
          <p className="modal-loc">
            {race.fecha && <span>{race.fecha}</span>}
            {race.ubicacion && <><span className="sep">·</span><span>{race.ubicacion}</span></>}
            {race.comunidad && <><span className="sep">·</span><span>{race.comunidad}</span></>}
          </p>
          <button className="modal-close" onClick={onClose} aria-label="Cerrar">✕</button>
        </div>

        <div className="modal-stats">
          <div className="stat-cell">
            <span className="stat-label">DISTANCIA</span>
            <span className="stat-val">{race.distancia||"—"}</span>
          </div>
          <div className="stat-cell">
            <span className="stat-label">FORMATO</span>
            <span className="stat-val">{race.formato||"—"}</span>
          </div>
          <div className="stat-cell">
            <span className="stat-label">PRECIO</span>
            <span className="stat-val" style={{color:col}}>{race.precio||"—"}</span>
          </div>
        </div>

        {race.notas && <p className="modal-notes">{race.notas}</p>}

        <div className="modal-ctas">
          {race.url
            ? <a href={race.url} target="_blank" rel="noreferrer" className="btn-primary">
                IR A INSCRIPCIÓN →
              </a>
            : <span className="btn-primary btn-primary--off">SIN ENLACE</span>
          }
          <button className="btn-ghost">GUARDAR ★</button>
        </div>
      </div>
    </div>
  );
}

/* ─── RaceCard ─────────────────────────────────────────────────────────────── */
function RaceCard({ race, featured, onClick }) {
  const col = SUB_COLOR[race.modalidad_id] || "var(--accent)";
  const bg  = SUB_BG[race.modalidad_id]   || "var(--accent-bg)";
  const statusStyle = race.estado==="Abierta"
    ? {bg:"var(--green-bg)",color:"var(--green)"}
    : race.estado==="Cerrada"
    ? {bg:"var(--red-bg)",color:"var(--red)"}
    : {bg:"rgba(250,204,21,0.12)",color:"var(--hyrox)"};

  return (
    <div className={`race-card${featured?" race-card--featured":""}`} onClick={onClick} role="button" tabIndex={0}
      onKeyDown={e=>e.key==="Enter"&&onClick()}>
      {featured && <div className="featured-badge">DESTACADA</div>}

      <div className="card-tags">
        <span className="tag" style={{background:bg,color:col}}>
          {race.modalidad || (race.modalidad_parent||"").toUpperCase()}
        </span>
        {race.estado && (
          <span className="tag" style={{background:statusStyle.bg,color:statusStyle.color}}>
            {race.estado.toUpperCase()}
          </span>
        )}
      </div>

      <p className="card-name">{(race.nombre||"").toUpperCase()}</p>

      <p className="card-meta">
        {race.fecha || race.fecha_iso}
        {race.ubicacion && <><span className="sep"> · </span>{race.ubicacion}</>}
      </p>

      <div className="card-footer">
        <span className="card-format">{race.formato || (race.distancia||"")}</span>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span className="card-price" style={{color:col}}>{race.precio||"—"}</span>
          {race.fecha_iso && (
            <a href={buildGCalUrl(race)} target="_blank" rel="noreferrer"
              className="card-gcal" onClick={e=>e.stopPropagation()}
              title="Añadir a Google Calendar" aria-label="Añadir a Google Calendar">
              <CalIcon/>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── FilterSection ────────────────────────────────────────────────────────── */
function FilterSection({ title, active, children }) {
  return (
    <div className="fs">
      <div className={`fs-label${active?" fs-label--active":""}`}>
        <span className={`fs-bar${active?" fs-bar--active":""}`}/>
        <span className="fs-title">{title}</span>
      </div>
      {children}
    </div>
  );
}

/* ─── ActiveFiltersRow ─────────────────────────────────────────────────────── */
function ActiveFiltersRow({ ccaa, modalParents, modalSubs, formats, dateRange,
  setCcaa, setModalParents, setModalSubs, setFormats, setDateRange }) {
  const pills = [];

  formats.forEach(f=>{
    const lbl = FORMATS.find(x=>x.id===f)?.label||f;
    pills.push({ label:lbl, onRemove:()=>setFormats(p=>p.filter(x=>x!==f)) });
  });
  modalSubs.forEach(s=>{
    const lbl = MODALITIES.flatMap(m=>m.subs).find(x=>x.id===s)?.label||s;
    pills.push({ label:lbl, onRemove:()=>setModalSubs(p=>p.filter(x=>x!==s)) });
  });
  modalParents.forEach(p=>{
    const hasSubs = MODALITIES.find(m=>m.id===p)?.subs.some(s=>modalSubs.includes(s.id));
    if(!hasSubs) {
      const lbl = MODALITIES.find(m=>m.id===p)?.label||p;
      pills.push({ label:lbl, onRemove:()=>setModalParents(prev=>prev.filter(x=>x!==p)) });
    }
  });
  ccaa.forEach(c=>{
    pills.push({ label:c, onRemove:()=>setCcaa(p=>p.filter(x=>x!==c)) });
  });
  if(dateRange.from) {
    const label = dateRange.to
      ? `${MONTH_NAMES[dateRange.from.month]} ${dateRange.from.year} → ${MONTH_NAMES[dateRange.to.month]} ${dateRange.to.year}`
      : `Desde ${MONTH_NAMES[dateRange.from.month]} ${dateRange.from.year}`;
    pills.push({ label, onRemove:()=>setDateRange({from:null,to:null}) });
  }

  if(pills.length===0) return null;
  return (
    <div className="af-row">
      {pills.map((p,i)=>(
        <button key={i} className="af-pill" onClick={p.onRemove}>
          {p.label}<span className="af-x">×</span>
        </button>
      ))}
    </div>
  );
}

/* ─── CountUpNumber ────────────────────────────────────────────────────────── */
function CountUpNumber({ target }) {
  const [count, setCount] = useState("—");
  const ref = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const n = parseInt(target);
    if (!target || isNaN(n)) return;
    clearInterval(timerRef.current);
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") { setCount(n); return; }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      let current = 0;
      const step = Math.max(1, Math.ceil(n / 70));
      timerRef.current = setInterval(() => {
        current = Math.min(current + step, n);
        setCount(current);
        if (current >= n) clearInterval(timerRef.current);
      }, 18);
    }, { threshold: 0.3 });

    observer.observe(el);
    return () => { observer.disconnect(); clearInterval(timerRef.current); };
  }, [target]);

  return <span ref={ref}>{count}</span>;
}

/* ─── HeroStats ────────────────────────────────────────────────────────────── */
function HeroStats({ totalCount, ccaaCount, formatsCount }) {
  return (
    <div className="hero-stats">
      <div className="hero-stat">
        <span className="hero-stat-val"><CountUpNumber target={totalCount} /></span>
        <span className="hero-stat-lbl">Eventos</span>
      </div>
      <div className="hero-stat">
        <span className="hero-stat-val"><CountUpNumber target={String(ccaaCount)} /></span>
        <span className="hero-stat-lbl">CCAA</span>
      </div>
      <div className="hero-stat">
        <span className="hero-stat-val"><CountUpNumber target={String(formatsCount)} /></span>
        <span className="hero-stat-lbl">Formatos</span>
      </div>
      <div className="hero-stat">
        <span className="hero-stat-val">Diario</span>
        <span className="hero-stat-lbl">Sync</span>
      </div>
    </div>
  );
}

/* ─── NewsletterSignup ─────────────────────────────────────────────────────── */
function NewsletterSignup() {
  const [email, setEmail]   = useState("");
  const [status, setStatus] = useState("idle");
  const [errMsg, setErrMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setStatus("loading");
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/subscribers`, {
        method: "POST",
        headers: {
          apikey: ANON_KEY,
          Authorization: `Bearer ${ANON_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({ email: email.toLowerCase().trim(), active: true }),
      });
      if (res.ok || res.status === 201) {
        setStatus("success");
      } else {
        const body = await res.json().catch(() => ({}));
        if (body?.code === "23505") {
          setStatus("success");
        } else {
          throw new Error(body?.message || "Error");
        }
      }
    } catch {
      setStatus("error");
      setErrMsg("No se pudo completar. Inténtalo de nuevo.");
    }
  }

  return (
    <section className="nl">
      <div className="nl-inner">
        <div className="nl-text">
          <p className="nl-eyebrow">NEWSLETTER</p>
          <h2 className="nl-title">¿Sin perderte<br/>una carrera?</h2>
          <p className="nl-sub">
            Te avisamos cuando añadamos nuevas carreras OCR, HYROX o
            competiciones funcionales en España.
          </p>
        </div>
        {status === "success" ? (
          <div className="nl-success">
            <span className="nl-check">✓</span>
            ¡Apuntado! Te avisaremos de nuevas pruebas.
          </div>
        ) : (
          <form className="nl-form" onSubmit={handleSubmit}>
            <input
              type="email"
              className="nl-input"
              placeholder="tu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              disabled={status === "loading"}
            />
            <button type="submit" className="nl-btn" disabled={status === "loading"}>
              {status === "loading" ? "…" : "QUIERO AVISOS →"}
            </button>
            {status === "error" && <p className="nl-error">{errMsg}</p>}
          </form>
        )}
      </div>
    </section>
  );
}

/* ─── WhyHRH ───────────────────────────────────────────────────────────────── */
function WhyHRH() {
  const cards = [
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/>
        </svg>
      ),
      title: "Todo en un hub",
      text: "OCR, HYROX y CrossFit en una sola plataforma actualizada a diario desde las fuentes oficiales.",
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M9 12l2 2 4-4"/>
          <path d="M12 3C7 3 3.6 6.1 3.1 10c-.1.7-.1 1.4 0 2 .5 3.9 3.9 7 8.9 7s8.4-3.1 8.9-7c.1-.6.1-1.3 0-2C20.4 6.1 17 3 12 3z"/>
        </svg>
      ),
      title: "Datos oficiales",
      text: "Sincronizamos directamente con los organizadores de cada disciplina. Precios, fechas y estado de inscripción al día.",
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <line x1="4" y1="6" x2="20" y2="6"/>
          <line x1="8" y1="12" x2="20" y2="12"/>
          <line x1="12" y1="18" x2="20" y2="18"/>
          <circle cx="4" cy="12" r="1.5" fill="currentColor" stroke="none"/>
          <circle cx="8" cy="18" r="1.5" fill="currentColor" stroke="none"/>
        </svg>
      ),
      title: "Filtros avanzados",
      text: "Filtra por modalidad, comunidad autónoma, formato y mes. Encuentra tu próxima carrera en segundos.",
    },
  ];

  return (
    <section className="why-hrh">
      <div className="why-inner">
        <p className="why-eyebrow">Por qué Hybrid Race Hub</p>
        <h2 className="why-title">El hub de referencia<br/>para el atleta híbrido</h2>
        <div className="why-grid">
          {cards.map((c, i) => (
            <div key={i} className="why-card">
              <div className="why-icon">{c.icon}</div>
              <h3 className="why-card-title">{c.title}</h3>
              <p className="why-card-text">{c.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── SiteFooter ───────────────────────────────────────────────────────────── */
function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        {/* Brand */}
        <div className="footer-brand">
          <div className="footer-brand-logo">H</div>
          <div>
            <div className="footer-brand-name">Hybrid Race Hub</div>
            <div className="footer-brand-sub">OCR · HYROX · Functional</div>
          </div>
        </div>

        {/* Links */}
        <div className="footer-links">
          <div className="footer-col">
            <span className="footer-col-title">Explorar</span>
            <a href="#">Calendario</a>
            <a href="#">Mapa de España</a>
            <a href="#">Rankings</a>
          </div>
          <div className="footer-col">
            <span className="footer-col-title">Comunidad</span>
            <Link href="/blog">Blog & Guías</Link>
            <Link href="/equipamiento">Equipamiento</Link>
            <a href="#newsletter">Newsletter</a>
          </div>
          <div className="footer-col">
            <span className="footer-col-title">Disciplinas</span>
            <a href="#">OCR / Spartan</a>
            <a href="#">HYROX</a>
            <a href="#">CrossFit</a>
          </div>
        </div>

        {/* Social */}
        <div className="footer-social">
          <a href="https://instagram.com/hybridracehub" target="_blank" rel="noopener noreferrer"
            className="footer-social-btn" aria-label="Instagram">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <rect x="2" y="2" width="20" height="20" rx="5"/>
              <circle cx="12" cy="12" r="4"/>
              <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
            </svg>
          </a>
          <a href="https://x.com/hybridracehub" target="_blank" rel="noopener noreferrer"
            className="footer-social-btn" aria-label="X / Twitter">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
          <a href="https://www.strava.com/clubs/hybridracehub" target="_blank" rel="noopener noreferrer"
            className="footer-social-btn" aria-label="Strava">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169"/>
            </svg>
          </a>
        </div>
      </div>

      <div className="footer-copy">
        <span>© {TODAY_YEAR} Hybrid Race Hub · Todos los derechos reservados</span>
        <span style={{display:"flex",gap:"16px"}}>
          <a href="#">Privacidad</a>
          <a href="#">Aviso legal</a>
        </span>
      </div>
    </footer>
  );
}

/* ─── Home ─────────────────────────────────────────────────────────────────── */
export default function Home() {
  const [ccaa, setCcaa]                 = useState([]);
  const [modalParents, setModalParents] = useState([]);
  const [modalSubs, setModalSubs]       = useState([]);
  const [formats, setFormats]           = useState([]);
  const [dateRange, setDateRange]       = useState({ from:null, to:null });
  const [results, setResults]           = useState(null);
  const [loading, setLoading]           = useState(true);
  const [refreshing, setRefreshing]     = useState(false);
  const [error, setError]               = useState(null);
  const [totalCount, setTotalCount]     = useState(null);
  const [sortBy, setSortBy]             = useState("date");
  const [selectedRace, setSelectedRace] = useState(null);
  const [sidebarOpen, setSidebarOpen]   = useState(false);
  const [searchQuery, setSearchQuery]   = useState("");

  function toggleParent(id) {
    if(modalParents.includes(id)) {
      setModalParents(p=>p.filter(x=>x!==id));
      const subs=MODALITIES.find(m=>m.id===id)?.subs.map(s=>s.id)||[];
      setModalSubs(s=>s.filter(x=>!subs.includes(x)));
    } else {
      setModalParents(p=>[...p,id]);
    }
  }

  /* ── Fetch ─────────────────────────────────────────────────────────────── */
  const fetchRaces = useCallback(async () => {
    if(results!==null) setRefreshing(true); else setLoading(true);
    setError(null);
    try {
      const p = new URLSearchParams();
      p.append("select","*");
      p.append("order","fecha_iso.asc");

      if(modalSubs.length>0) {
        if(modalSubs.length===1) p.append("modalidad_id",`eq.${modalSubs[0]}`);
        else p.append("modalidad_id",`in.(${modalSubs.join(",")})`);
      } else if(modalParents.length>0) {
        if(modalParents.length===1) p.append("modalidad_parent",`eq.${modalParents[0]}`);
        else p.append("modalidad_parent",`in.(${modalParents.join(",")})`);
      } else {
        p.append("modalidad_parent",`in.(${NICHE_PARENTS.join(",")})`);
      }

      if(dateRange.from) {
        p.append("fecha_iso",`gte.${dateRange.from.year}-${String(dateRange.from.month+1).padStart(2,"0")}-01`);
      } else {
        p.append("fecha_iso",`gte.${TODAY_ISO}`);
      }
      if(dateRange.to) {
        const last=new Date(dateRange.to.year,dateRange.to.month+1,0);
        p.append("fecha_iso",`lte.${last.toISOString().split("T")[0]}`);
      }

      if(ccaa.length===1) p.append("comunidad",`eq.${ccaa[0]}`);
      else if(ccaa.length>1) p.append("comunidad",`in.(${ccaa.join(",")})`);

      const res  = await fetch(`${SUPABASE_URL}/rest/v1/races?${p}`,{
        headers:{ apikey:ANON_KEY, Authorization:`Bearer ${ANON_KEY}` },
      });
      const data = await res.json();
      if(!Array.isArray(data)) throw new Error(data.message||"Error");

      const hasFormato = data.some(r=>r.formato);
      const filtered = (formats.length>0 && hasFormato)
        ? data.filter(r=>!r.formato||formats.includes(r.formato))
        : data;

      setResults(filtered);
    } catch {
      setError("Error de conexión. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [ccaa, modalParents, modalSubs, formats, dateRange]);

  useEffect(()=>{ const t=setTimeout(fetchRaces,320); return ()=>clearTimeout(t); },[fetchRaces]);

  useEffect(()=>{
    fetch(`${SUPABASE_URL}/rest/v1/races?select=count&modalidad_parent=in.(ocr,funcional)`,{
      headers:{ apikey:ANON_KEY, Authorization:`Bearer ${ANON_KEY}`, Prefer:"count=exact" },
    }).then(r=>{ const c=r.headers.get("content-range"); if(c) setTotalCount(c.split("/")[1]); }).catch(()=>{});
  },[]);

  function handleReset() {
    setCcaa([]); setModalParents([]); setModalSubs([]);
    setFormats([]); setDateRange({from:null,to:null});
    setSearchQuery("");
  }

  const anyFilter = ccaa.length||modalParents.length||modalSubs.length||formats.length||dateRange.from;

  /* ── Sort + search results ─────────────────────────────────────────────── */
  const sorted = results ? [...results]
    .filter(r => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        (r.nombre||"").toLowerCase().includes(q) ||
        (r.ubicacion||"").toLowerCase().includes(q) ||
        (r.municipio||"").toLowerCase().includes(q) ||
        (r.modalidad||"").toLowerCase().includes(q)
      );
    })
    .sort((a,b)=>{
      if(sortBy==="price") {
        const pa=parseFloat((a.precio||"").replace(/[^\d.]/g,""))||0;
        const pb=parseFloat((b.precio||"").replace(/[^\d.]/g,""))||0;
        return pa-pb;
      }
      return (a.fecha_iso||"").localeCompare(b.fecha_iso||"");
    }) : [];

  /* ── Active filter subtitle ────────────────────────────────────────────── */
  const subtitle = [
    dateRange.from && (dateRange.to
      ? `${MONTH_NAMES[dateRange.from.month]}→${MONTH_NAMES[dateRange.to.month]}`
      : `Desde ${MONTH_NAMES[dateRange.from.month]}`),
    ...ccaa.slice(0,2),
    ccaa.length>2 && `+${ccaa.length-2} CCAA`,
    modalParents.length>0 && modalParents.map(p=>MODALITIES.find(m=>m.id===p)?.label||p).join(" + "),
  ].filter(Boolean).join(" · ");

  return (
    <>
      <Head>
        <title>Hybrid Race Hub — Calendario OCR, HYROX y CrossFit en España</title>
        <meta name="description" content="El calendario de referencia para carreras OCR, HYROX y competiciones funcionales en España. Filtra por formato, comunidad y fecha." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Hybrid Race Hub" />
        <meta property="og:description" content="OCR · HYROX · Functional — Calendario de competiciones híbridas en España" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
        <link rel="preconnect" href={SUPABASE_URL} />
      </Head>

      {/* ── Global styles ─────────────────────────────────────────────────── */}
      <style>{`
        /* ── HERO ── */
        .hero {
          background: var(--bg);
          border-bottom: 1px solid var(--border);
          position: relative;
          overflow: hidden;
          min-height: 480px;
        }
        .hero-video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 0;
        }
        .hero-overlay {
          position: absolute;
          inset: 0;
          background: rgba(8,9,12,0.60);
          z-index: 1;
        }
        .hero-content {
          position: relative;
          z-index: 2;
          padding: 0 2rem 2.5rem;
        }
        .hero-inner {
          display: flex; align-items: center; justify-content: space-between;
          height: 64px;
        }
        .brand { display:flex; align-items:center; gap:14px; }
        .brand-logo {
          width:40px; height:40px; flex-shrink:0;
          clip-path: polygon(15% 0, 100% 0, 85% 100%, 0 100%);
          background: linear-gradient(135deg, var(--ocr) 0%, var(--hyrox) 100%);
          display:flex; align-items:center; justify-content:center;
          font-family:var(--font-display); font-size:20px; font-weight:900;
          color:#08090C; letter-spacing:-1px; user-select:none;
        }
        .brand-name {
          font-family:var(--font-display); font-size:18px; font-weight:800;
          text-transform:uppercase; letter-spacing:-0.01em; color:var(--text);
        }
        .brand-sub {
          font-family:var(--font-mono); font-size:9px; font-weight:500;
          text-transform:uppercase; letter-spacing:0.14em; color:var(--muted);
          display:flex; align-items:center; gap:6px; margin-top:1px;
        }
        .brand-count {
          background:var(--accent-bg); color:var(--accent);
          padding:1px 7px; border-radius:20px;
        }
        .refreshing-dot { width:5px; height:5px; border-radius:50%; background:var(--accent); animation:pulse 1s infinite; }
        .nav { display:flex; align-items:center; gap:4px; }
        .nav a {
          font-family:var(--font-mono); font-size:10px; font-weight:500;
          text-transform:uppercase; letter-spacing:0.1em;
          color:var(--muted); text-decoration:none;
          padding:6px 12px; border-radius:var(--radius-sm);
          border:0.5px solid transparent; transition:color .15s, border-color .15s;
        }
        .nav a:hover { color:var(--text); border-color:var(--border2); }

        /* Hero headline */
        .hero-eyebrow {
          display:flex; align-items:center; gap:8px; margin-bottom:16px;
          font-family:var(--font-mono); font-size:11px; font-weight:500;
          text-transform:uppercase; letter-spacing:0.14em; color:rgba(255,255,255,0.55);
        }
        .hero-eyebrow-dot {
          width:6px; height:6px; border-radius:50%; background:var(--accent); animation:pulse 2s infinite;
        }
        .hero-title {
          font-family:var(--font-display); font-weight:900; text-transform:uppercase;
          letter-spacing:-0.02em; line-height:.88;
          font-size: clamp(60px, 10vw, 148px);
          color:var(--text); margin-bottom:24px;
        }
        .hero-title .slash { color:var(--accent); margin:0 2px; }
        .hero-title .hy {
          background: linear-gradient(90deg, var(--ocr) 0%, var(--hyrox) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Hero search */
        .hero-search {
          position: relative;
          max-width: 560px;
          margin-bottom: 24px;
        }
        .hero-search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255,255,255,0.35);
          display: flex;
          align-items: center;
          pointer-events: none;
        }
        .hero-search-input {
          width: 100%;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.14);
          border-radius: 10px;
          padding: 13px 44px 13px 44px;
          font-family: var(--font-body);
          font-size: 14px;
          color: var(--text);
          outline: none;
          transition: border-color .15s, background .15s;
          backdrop-filter: blur(12px);
          box-sizing: border-box;
        }
        .hero-search-input::placeholder { color: rgba(255,255,255,0.3); }
        .hero-search-input:focus {
          border-color: rgba(251,146,60,0.5);
          background: rgba(255,255,255,0.10);
        }
        .hero-search-clear {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: rgba(255,255,255,0.4);
          cursor: pointer;
          font-size: 13px;
          padding: 4px 6px;
          border-radius: 4px;
          line-height: 1;
          transition: color .12s;
        }
        .hero-search-clear:hover { color: var(--text); }

        .hero-sub {
          font-family:var(--font-body); font-size:16px; font-weight:400;
          color:rgba(255,255,255,0.6); max-width:560px; line-height:1.65; margin-bottom:32px;
        }
        .hero-sub strong { color:var(--text); font-weight:600; }

        /* Hero stats */
        .hero-stats { display:flex; gap:28px; flex-wrap:wrap; }
        .hero-stat { display:flex; flex-direction:column; gap:2px; }
        .hero-stat-val {
          font-family:var(--font-display); font-size:32px; font-weight:900;
          color:var(--accent); line-height:1;
        }
        .hero-stat-lbl {
          font-family:var(--font-mono); font-size:9px; font-weight:500;
          text-transform:uppercase; letter-spacing:0.14em; color:rgba(255,255,255,0.4);
        }

        /* ── WHY HRH ── */
        .why-hrh {
          background: var(--surface);
          border-bottom: 1px solid var(--border);
          padding: 4rem 2rem;
        }
        .why-inner {
          max-width: 960px;
          margin: 0 auto;
        }
        .why-eyebrow {
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          color: var(--accent-mid);
          margin-bottom: 10px;
          text-align: center;
        }
        .why-title {
          font-family: var(--font-display);
          font-size: clamp(28px, 4vw, 44px);
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: -0.01em;
          color: var(--text);
          text-align: center;
          line-height: 1;
          margin-bottom: 3rem;
        }
        .why-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2.5rem;
        }
        .why-card {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 14px;
        }
        .why-icon {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          background: var(--accent-bg);
          border: 0.5px solid rgba(251,146,60,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent-mid);
          flex-shrink: 0;
        }
        .why-card-title {
          font-family: var(--font-display);
          font-size: 20px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: -0.01em;
          color: var(--text);
          line-height: 1;
        }
        .why-card-text {
          font-family: var(--font-body);
          font-size: 13.5px;
          color: var(--muted);
          line-height: 1.65;
        }

        /* ── BODY LAYOUT ── */
        .body {
          display:grid;
          grid-template-columns: 300px 1fr;
          min-height: calc(100vh - 380px);
        }

        /* ── SIDEBAR ── */
        .sidebar {
          background:var(--surface);
          border-right:1px solid var(--border);
          padding:0;
          overflow-y:auto;
          position:sticky; top:0;
          height:calc(100vh - 64px);
        }
        .sidebar-head {
          display:flex; align-items:center; justify-content:space-between;
          padding:1rem 1.1rem .8rem;
          border-bottom:1px solid var(--border);
          position:sticky; top:0; background:var(--surface); z-index:5;
        }
        .sidebar-head-title {
          font-family:var(--font-display); font-size:14px; font-weight:700;
          text-transform:uppercase; letter-spacing:0.06em; color:var(--text);
        }
        .sidebar-clear {
          font-family:var(--font-mono); font-size:10px; font-weight:500;
          text-transform:uppercase; letter-spacing:0.08em;
          color:var(--muted); background:none;
          border:0.5px solid var(--border); border-radius:var(--radius-sm);
          padding:4px 10px; cursor:pointer; transition:color .15s, border-color .15s;
        }
        .sidebar-clear:hover { color:var(--text); border-color:var(--border2); }
        .sidebar-body { padding:.9rem 1.1rem; }

        /* Filter section */
        .fs { margin-bottom:22px; }
        .fs-label {
          display:flex; align-items:center; gap:8px; margin-bottom:10px;
        }
        .fs-bar {
          width:3px; height:13px; border-radius:2px; background:var(--hint); flex-shrink:0;
          transition:background .15s;
        }
        .fs-bar--active { background:var(--accent-mid); }
        .fs-title {
          font-family:var(--font-mono); font-size:10px; font-weight:600;
          text-transform:uppercase; letter-spacing:0.16em;
          color:var(--muted); transition:color .15s;
        }
        .fs-label--active .fs-title { color:var(--accent-mid); }

        /* Chips */
        .chip {
          display:inline-flex; align-items:center; gap:4px;
          padding:4px 10px; border-radius:999px; cursor:pointer;
          font-family:var(--font-body); font-size:11px; font-weight:500;
          border:0.5px solid var(--border); background:var(--surface2);
          color:var(--muted); transition:all .1s;
        }
        .chip--on {
          border-width:1.5px; font-weight:600;
        }
        .chips-wrap { display:flex; flex-wrap:wrap; gap:5px; }
        .chips-col  { display:flex; flex-direction:column; gap:6px; }

        .sub-chips {
          display:flex; flex-wrap:wrap; gap:4px;
          padding-left:12px; border-left:2px solid rgba(255,255,255,0.06);
          margin-top:4px;
        }

        /* MonthPicker */
        .mp-nav {
          width:28px; height:28px; border-radius:7px;
          border:0.5px solid var(--border2); background:var(--surface2);
          color:var(--text); cursor:pointer; font-size:15px; line-height:1;
          display:flex; align-items:center; justify-content:center; transition:opacity .1s;
        }
        .mp-nav--off { opacity:.25; cursor:not-allowed; }
        .mp-year {
          font-family:var(--font-display); font-size:14px; font-weight:700;
          text-transform:uppercase; color:var(--text);
        }
        .mp-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:4px; }
        .mp-cell {
          padding:10px 2px; border-radius:8px; cursor:pointer;
          font-family:var(--font-mono); font-size:10px; font-weight:500;
          text-transform:uppercase; letter-spacing:0.06em;
          border:0.5px solid var(--border); background:var(--surface2);
          color:var(--muted); transition:all .1s;
          min-height:44px;
        }
        .mp-cell--edge {
          background:var(--accent); border-color:var(--accent);
          color:#08090C; font-weight:700;
        }
        .mp-cell--range {
          background:var(--accent-bg); border-color:rgba(251,146,60,0.25);
          color:var(--accent-mid);
        }
        .mp-cell--dis { opacity:.2; cursor:not-allowed; }
        .mp-label {
          margin-top:8px; font-family:var(--font-mono); font-size:10px;
          font-weight:500; text-align:center; color:var(--muted);
          letter-spacing:0.06em; text-transform:uppercase;
        }

        /* ── MAIN ── */
        .main { background:var(--bg2); min-height:100%; }
        .main-inner { padding:1.5rem; }

        /* Results head */
        .results-head {
          display:flex; align-items:flex-start; justify-content:space-between;
          gap:12px; margin-bottom:14px; flex-wrap:wrap;
        }
        .results-count {
          font-family:var(--font-display); font-size:36px; font-weight:800;
          text-transform:uppercase; letter-spacing:-0.01em; line-height:1;
          color:var(--text);
        }
        .results-count span { color:var(--accent); }
        .results-sub {
          font-family:var(--font-mono); font-size:10px; font-weight:500;
          text-transform:uppercase; letter-spacing:0.1em; color:var(--muted);
          margin-top:4px;
        }
        .sort-btns { display:flex; gap:4px; flex-shrink:0; }
        .sort-btn {
          font-family:var(--font-mono); font-size:10px; font-weight:500;
          text-transform:uppercase; letter-spacing:0.08em;
          padding:6px 12px; border-radius:var(--radius-sm); cursor:pointer;
          border:0.5px solid var(--border); background:var(--surface);
          color:var(--muted); transition:all .1s;
        }
        .sort-btn--on {
          border-color:var(--accent); background:var(--accent-bg); color:var(--accent-mid);
        }
        .sort-btn:hover { border-color:var(--border2); color:var(--text); }

        /* Active filters row */
        .af-row { display:flex; flex-wrap:wrap; gap:6px; margin-bottom:16px; }
        .af-pill {
          display:inline-flex; align-items:center; gap:5px;
          padding:4px 10px; border-radius:999px;
          background:var(--accent-bg); color:var(--accent-mid);
          border:0.5px solid rgba(251,146,60,0.3);
          font-family:var(--font-mono); font-size:10px; font-weight:500;
          text-transform:uppercase; letter-spacing:0.06em;
          cursor:pointer; transition:background .1s;
        }
        .af-pill:hover { background:rgba(251,146,60,0.22); }
        .af-x { color:var(--accent); font-size:13px; line-height:1; }

        /* Race grid */
        .race-grid {
          display:grid;
          grid-template-columns:repeat(auto-fill, minmax(300px,1fr));
          gap:12px;
        }

        /* Race card */
        .race-card {
          background:var(--surface); border:0.5px solid var(--border);
          border-radius:var(--radius-lg); padding:16px;
          cursor:pointer; position:relative; overflow:hidden;
          transition:transform .15s, border-color .15s, box-shadow .15s;
          animation:fadeUp .2s ease both;
        }
        .race-card:hover {
          transform: scale(1.02);
          border-color: var(--accent);
          box-shadow: 0 8px 32px rgba(251,146,60,0.15);
        }
        .race-card--featured {
          box-shadow:0 0 0 1px rgba(251,146,60,0.2), 0 8px 32px rgba(251,146,60,0.06);
          border-color:rgba(251,146,60,0.2);
        }
        .featured-badge {
          position:absolute; top:14px; right:-18px;
          background:var(--accent); color:#08090C;
          font-family:var(--font-display); font-size:9px; font-weight:800;
          text-transform:uppercase; letter-spacing:0.08em;
          padding:3px 22px; transform:rotate(35deg); transform-origin:center;
          pointer-events:none;
        }
        .card-tags { display:flex; gap:5px; flex-wrap:wrap; margin-bottom:10px; }
        .tag {
          font-family:var(--font-display); font-size:10px; font-weight:700;
          text-transform:uppercase; letter-spacing:0.06em;
          padding:2px 9px; border-radius:999px;
        }
        .card-name {
          font-family:var(--font-display); font-size:20px; font-weight:700;
          text-transform:uppercase; letter-spacing:-0.01em; line-height:1.15;
          color:var(--text); margin-bottom:6px;
          overflow:hidden; text-overflow:ellipsis;
          display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical;
        }
        .card-meta {
          font-family:var(--font-mono); font-size:10px; font-weight:500;
          text-transform:uppercase; letter-spacing:0.1em; color:var(--muted);
          margin-bottom:12px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
        }
        .card-footer {
          display:flex; align-items:center; justify-content:space-between;
          padding-top:11px; border-top:0.5px solid var(--border);
        }
        .card-format {
          font-family:var(--font-mono); font-size:10px; font-weight:500;
          text-transform:uppercase; letter-spacing:0.08em; color:var(--muted2);
        }
        .card-price {
          font-family:var(--font-display); font-size:18px; font-weight:700;
          text-transform:uppercase;
        }
        .sep { color:var(--hint); }

        /* ── MODAL ── */
        .modal-backdrop {
          position:fixed; inset:0; z-index:1000;
          background:rgba(8,9,12,.85); backdrop-filter:blur(6px);
          display:flex; align-items:center; justify-content:center;
          padding:1.5rem;
        }
        .modal-box {
          background:var(--surface); border:0.5px solid var(--border2);
          border-radius:var(--radius-lg); padding:2rem;
          width:100%; max-width:560px; max-height:90vh; overflow-y:auto;
          position:relative; animation:modalIn .2s ease both;
        }
        .modal-head { position:relative; margin-bottom:1.5rem; }
        .modal-title {
          font-family:var(--font-display); font-size:clamp(28px,5vw,40px);
          font-weight:800; text-transform:uppercase; letter-spacing:-0.01em;
          color:var(--text); line-height:1.05; margin-bottom:8px;
        }
        .modal-loc {
          font-family:var(--font-mono); font-size:11px; font-weight:500;
          text-transform:uppercase; letter-spacing:0.1em; color:var(--muted);
        }
        .modal-close {
          position:absolute; top:0; right:0;
          width:30px; height:30px; border-radius:8px;
          border:0.5px solid var(--border); background:var(--surface2);
          color:var(--muted); cursor:pointer; font-size:14px;
          display:flex; align-items:center; justify-content:center;
          transition:color .15s;
        }
        .modal-close:hover { color:var(--text); }
        .modal-stats {
          display:grid; grid-template-columns:1fr 1fr 1fr;
          border:0.5px solid var(--border); border-radius:var(--radius);
          overflow:hidden; margin-bottom:1.5rem;
        }
        .stat-cell {
          padding:1rem; display:flex; flex-direction:column; gap:5px;
          border-right:0.5px solid var(--border);
        }
        .stat-cell:last-child { border-right:none; }
        .stat-label {
          font-family:var(--font-mono); font-size:9px; font-weight:600;
          text-transform:uppercase; letter-spacing:0.14em; color:var(--muted);
        }
        .stat-val {
          font-family:var(--font-display); font-size:26px; font-weight:800;
          text-transform:uppercase; letter-spacing:-0.01em; color:var(--text);
          line-height:1;
        }
        .modal-notes {
          font-family:var(--font-body); font-size:14px; color:var(--muted);
          line-height:1.6; margin-bottom:1.5rem;
        }
        .modal-ctas { display:flex; gap:10px; flex-wrap:wrap; }
        .btn-primary {
          font-family:var(--font-display); font-size:14px; font-weight:700;
          text-transform:uppercase; letter-spacing:0.04em;
          background:var(--accent); color:#08090C;
          padding:11px 22px; border-radius:var(--radius-sm); border:none;
          cursor:pointer; text-decoration:none; display:inline-flex; align-items:center;
          transition:transform .12s, box-shadow .12s;
        }
        .btn-primary:hover {
          transform:translateY(-1px);
          box-shadow:0 6px 20px rgba(251,146,60,0.35);
        }
        .btn-primary--off { opacity:.45; cursor:not-allowed; background:var(--hint); color:var(--muted); }
        .btn-ghost {
          font-family:var(--font-display); font-size:14px; font-weight:700;
          text-transform:uppercase; letter-spacing:0.04em;
          background:none; color:var(--muted);
          border:0.5px solid var(--border); border-radius:var(--radius-sm);
          padding:11px 22px; cursor:pointer; transition:color .12s, border-color .12s;
        }
        .btn-ghost:hover { color:var(--text); border-color:var(--border2); }

        /* ── Mobile filters trigger ── */
        .mobile-filter-btn {
          display:none;
          position:fixed; bottom:1.5rem; left:50%; transform:translateX(-50%);
          z-index:100; background:var(--accent); color:#08090C;
          font-family:var(--font-display); font-size:13px; font-weight:800;
          text-transform:uppercase; letter-spacing:0.06em;
          padding:12px 28px; border-radius:999px; border:none; cursor:pointer;
          box-shadow:0 8px 32px rgba(251,146,60,0.4);
        }

        /* ── States ── */
        .state-center {
          display:flex; flex-direction:column; align-items:center;
          justify-content:center; min-height:320px; gap:14px; color:var(--muted);
          text-align:center;
        }
        .spinner {
          width:34px; height:34px;
          border:2.5px solid var(--hint); border-top-color:var(--accent);
          border-radius:50%; animation:spin .75s linear infinite;
        }
        .state-icon { font-size:40px; margin-bottom:4px; }
        .state-title {
          font-family:var(--font-display); font-size:22px; font-weight:700;
          text-transform:uppercase; color:var(--text);
        }
        .state-sub { font-family:var(--font-body); font-size:13px; max-width:260px; line-height:1.6; }

        /* ── Google Calendar ── */
        .card-gcal {
          display:inline-flex; align-items:center; justify-content:center;
          width:26px; height:26px; border-radius:6px;
          border:0.5px solid var(--border); background:var(--surface2);
          color:var(--muted); text-decoration:none; flex-shrink:0;
          transition:color .12s, border-color .12s, background .12s;
        }
        .card-gcal:hover {
          color:var(--accent-mid); border-color:rgba(251,146,60,0.35);
          background:var(--accent-bg);
        }

        /* ── NEWSLETTER ── */
        .nl {
          background:var(--surface); border-top:1px solid var(--border);
          border-bottom:1px solid var(--border); padding:4rem 2rem;
        }
        .nl-inner {
          max-width:900px; margin:0 auto;
          display:flex; align-items:center; justify-content:space-between;
          gap:3rem; flex-wrap:wrap;
        }
        .nl-text { flex:1; min-width:220px; }
        .nl-eyebrow {
          font-family:var(--font-mono); font-size:10px; font-weight:600;
          text-transform:uppercase; letter-spacing:0.16em; color:var(--accent-mid);
          margin-bottom:8px;
        }
        .nl-title {
          font-family:var(--font-display); font-size:clamp(26px,4vw,40px);
          font-weight:800; text-transform:uppercase; letter-spacing:-0.01em;
          color:var(--text); line-height:1.05; margin-bottom:12px;
        }
        .nl-sub {
          font-family:var(--font-body); font-size:14px; color:var(--muted);
          line-height:1.65; max-width:380px;
        }
        .nl-form { display:flex; flex-direction:column; gap:8px; flex-shrink:0; }
        .nl-input {
          font-family:var(--font-body); font-size:14px;
          background:var(--bg2); color:var(--text);
          border:1px solid var(--border2); border-radius:var(--radius-sm);
          padding:12px 16px; min-width:280px; outline:none;
          transition:border-color .15s;
        }
        .nl-input::placeholder { color:var(--muted2); }
        .nl-input:focus { border-color:var(--accent); }
        .nl-input:disabled { opacity:.5; }
        .nl-btn {
          font-family:var(--font-display); font-size:14px; font-weight:800;
          text-transform:uppercase; letter-spacing:0.06em;
          background:var(--accent); color:#08090C;
          border:none; border-radius:var(--radius-sm);
          padding:12px 22px; cursor:pointer; white-space:nowrap;
          transition:transform .12s, box-shadow .12s, opacity .12s;
        }
        .nl-btn:hover:not(:disabled) {
          transform:translateY(-1px); box-shadow:0 6px 20px rgba(251,146,60,0.35);
        }
        .nl-btn:disabled { opacity:.5; cursor:not-allowed; }
        .nl-error { font-family:var(--font-body); font-size:12px; color:var(--red); }
        .nl-success {
          display:flex; align-items:center; gap:14px;
          font-family:var(--font-display); font-size:20px; font-weight:700;
          text-transform:uppercase; letter-spacing:0.02em; color:var(--text);
        }
        .nl-check {
          width:38px; height:38px; border-radius:50%; flex-shrink:0;
          background:var(--green-bg); color:var(--green);
          display:flex; align-items:center; justify-content:center; font-size:18px;
        }

        /* ── FOOTER ── */
        .site-footer {
          background: var(--surface);
          border-top: 1px solid var(--border);
          padding: 3rem 2rem 0;
        }
        .footer-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: 4rem;
          padding-bottom: 2.5rem;
          align-items: start;
        }
        .footer-brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .footer-brand-logo {
          width: 40px;
          height: 40px;
          clip-path: polygon(15% 0, 100% 0, 85% 100%, 0 100%);
          background: linear-gradient(135deg, var(--ocr) 0%, var(--hyrox) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-display);
          font-size: 20px;
          font-weight: 900;
          color: #08090C;
          flex-shrink: 0;
        }
        .footer-brand-name {
          font-family: var(--font-display);
          font-size: 16px;
          font-weight: 800;
          text-transform: uppercase;
          color: var(--text);
        }
        .footer-brand-sub {
          font-family: var(--font-mono);
          font-size: 9px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: var(--muted);
          margin-top: 2px;
        }
        .footer-links {
          display: flex;
          gap: 3rem;
        }
        .footer-col {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .footer-col-title {
          font-family: var(--font-mono);
          font-size: 9px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          color: var(--muted);
          margin-bottom: 4px;
        }
        .footer-col a {
          font-family: var(--font-body);
          font-size: 13px;
          color: var(--muted);
          text-decoration: none;
          transition: color .15s;
        }
        .footer-col a:hover { color: var(--text); }
        .footer-social {
          display: flex;
          gap: 8px;
          align-items: flex-start;
        }
        .footer-social-btn {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          border: 0.5px solid var(--border);
          background: none;
          color: var(--muted);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: color .15s, border-color .15s;
          text-decoration: none;
        }
        .footer-social-btn:hover {
          color: var(--text);
          border-color: var(--border2);
        }
        .footer-copy {
          max-width: 1100px;
          margin: 0 auto;
          border-top: 0.5px solid var(--border);
          padding: 1.25rem 0 1.5rem;
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--hint);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
        }
        .footer-copy a {
          color: var(--muted2);
          text-decoration: none;
          transition: color .15s;
        }
        .footer-copy a:hover { color: var(--text); }

        /* ── RESPONSIVE ── */
        @media (max-width:1024px) {
          .hero-title { font-size:88px; }
          .body { grid-template-columns:260px 1fr; }
          .race-grid { grid-template-columns:repeat(auto-fill,minmax(260px,1fr)); }
          .footer-inner { grid-template-columns:1fr 1fr; gap:2.5rem; }
          .footer-social { grid-column:1/-1; }
        }
        @media (max-width:720px) {
          .nav { display:none; }
          .hero-content { padding:0 1rem 2rem; }
          .hero-title { font-size:clamp(50px,14vw,72px); }
          .hero-sub { font-size:14px; }
          .hero-stats { gap:18px; }
          .hero-stat-val { font-size:26px; }
          .hero-search-input { font-size:13px; }
          .body { grid-template-columns:1fr; }
          .sidebar {
            height:auto; position:relative;
            border-right:none; border-bottom:1px solid var(--border);
            display: none;
          }
          .sidebar--open { display:block; }
          .mobile-filter-btn { display:flex; align-items:center; gap:6px; }
          .race-grid { grid-template-columns:1fr; }
          .modal-stats { grid-template-columns:1fr; }
          .stat-cell { border-right:none; border-bottom:0.5px solid var(--border); }
          .stat-cell:last-child { border-bottom:none; }
          .results-head { flex-direction:column; gap:10px; }
          .main-inner { padding:1rem 1rem 5rem; }
          .nl { padding:2.5rem 1rem; }
          .nl-inner { flex-direction:column; gap:1.5rem; }
          .nl-form { width:100%; }
          .nl-input { min-width:0; width:100%; }
          .nl-btn { width:100%; text-align:center; }
          .why-hrh { padding:2.5rem 1rem; }
          .why-grid { grid-template-columns:1fr; gap:2rem; }
          .site-footer { padding:2rem 1rem 0; }
          .footer-inner { grid-template-columns:1fr; gap:2rem; }
          .footer-links { flex-wrap:wrap; gap:2rem; }
          .footer-copy { flex-direction:column; align-items:flex-start; gap:6px; }
        }
      `}</style>

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <header className="hero">
        <video
          autoPlay muted loop playsInline
          className="hero-video"
          poster="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1400&q=60&fit=crop"
        >
          <source
            src="https://videos.pexels.com/video-files/3209211/3209211-hd_1280_720_25fps.mp4"
            type="video/mp4"
          />
        </video>
        <div className="hero-overlay" />

        <div className="hero-content">
          {/* Nav */}
          <div className="hero-inner">
            <div className="brand">
              <div className="brand-logo">H</div>
              <div>
                <div className="brand-name">Hybrid Race Hub</div>
                <div className="brand-sub">
                  <span>OCR · HYROX · Functional</span>
                  {totalCount && <span className="brand-count">{totalCount} eventos</span>}
                  {refreshing && <span className="refreshing-dot"/>}
                </div>
              </div>
            </div>
            <nav className="nav" aria-label="Navegación principal">
              <a href="#">Calendario</a>
              <a href="#">Mapa</a>
              <a href="#">Rankings</a>
              <Link href="/blog">Comunidad</Link>
            </nav>
          </div>

          {/* Headline */}
          <div className="hero-headline">
            <div className="hero-eyebrow">
              <span className="hero-eyebrow-dot"/>
              Calendario híbrido · España {TODAY_YEAR}
            </div>
            <h1 className="hero-title">
              OCR<span className="slash">/</span><span className="hy">HYROX</span><span className="slash">/</span>CROSSFIT.
            </h1>

            {/* Search bar */}
            <div className="hero-search">
              <span className="hero-search-icon"><SearchIcon/></span>
              <input
                type="text"
                className="hero-search-input"
                placeholder="Buscar carreras, ciudades, modalidades…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                aria-label="Buscar eventos"
              />
              {searchQuery && (
                <button
                  className="hero-search-clear"
                  onClick={() => setSearchQuery("")}
                  aria-label="Limpiar búsqueda"
                >✕</button>
              )}
            </div>

            <p className="hero-sub">
              Un solo hub para las <strong>carreras híbridas, OCR y competiciones funcionales</strong> en España.
              Filtra por formato, comunidad y mes. Actualizado a diario desde las fuentes oficiales.
            </p>
            <HeroStats totalCount={totalCount} ccaaCount={CCAA.length} formatsCount={FORMATS.length}/>
          </div>
        </div>
      </header>

      {/* ── POR QUÉ HRH ─────────────────────────────────────────────────── */}
      <WhyHRH/>

      {/* ── BODY ────────────────────────────────────────────────────────── */}
      <div className="body">

        {/* ── SIDEBAR ──────────────────────────────────────────────────── */}
        <aside className={`sidebar${sidebarOpen?" sidebar--open":""}`}>
          <div className="sidebar-head">
            <span className="sidebar-head-title">Filtros</span>
            {anyFilter
              ? <button className="sidebar-clear" onClick={handleReset}>Limpiar ×</button>
              : null}
          </div>
          <div className="sidebar-body">

            <FilterSection title="Formato" active={formats.length>0}>
              <div className="chips-wrap">
                {FORMATS.map(f=>(
                  <button key={f.id} onClick={()=>toggle(formats,setFormats,f.id)}
                    className={`chip${formats.includes(f.id)?" chip--on":""}`}
                    style={formats.includes(f.id)?{borderColor:"var(--accent)",background:"var(--accent-bg)",color:"var(--accent-mid)"}:{}}>
                    {f.label}
                  </button>
                ))}
              </div>
            </FilterSection>

            <FilterSection title="Tipo de prueba" active={modalParents.length>0||modalSubs.length>0}>
              <div className="chips-col">
                {MODALITIES.map(m=>(
                  <div key={m.id}>
                    <button onClick={()=>toggleParent(m.id)}
                      className={`chip${modalParents.includes(m.id)?" chip--on":""}`}
                      style={modalParents.includes(m.id)?{borderColor:m.color,background:m.bg,color:m.color}:{}}>
                      {m.id==="ocr" ? <OcrIcon/> : <FuncIcon/>}
                      {m.label}
                      <span style={{fontSize:8,opacity:.5,marginLeft:2}}>{modalParents.includes(m.id)?"▲":"▼"}</span>
                    </button>
                    {modalParents.includes(m.id) && (
                      <div className="sub-chips">
                        {m.subs.map(s=>(
                          <button key={s.id} onClick={()=>toggle(modalSubs,setModalSubs,s.id)}
                            className={`chip${modalSubs.includes(s.id)?" chip--on":""}`}
                            style={modalSubs.includes(s.id)?{borderColor:m.color,background:m.bg,color:m.color}:{}}>
                            {s.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </FilterSection>

            <FilterSection title="Comunidad autónoma" active={ccaa.length>0}>
              <div className="chips-wrap">
                {CCAA.map(c=>(
                  <button key={c} onClick={()=>toggle(ccaa,setCcaa,c)}
                    className={`chip${ccaa.includes(c)?" chip--on":""}`}
                    style={ccaa.includes(c)?{borderColor:"var(--accent)",background:"var(--accent-bg)",color:"var(--accent-mid)"}:{}}>
                    {c}
                  </button>
                ))}
              </div>
            </FilterSection>

            <FilterSection title="Fechas" active={!!dateRange.from}>
              <MonthRangePicker
                from={dateRange.from} to={dateRange.to}
                onChange={({from,to})=>setDateRange({from,to})}
              />
            </FilterSection>

          </div>
        </aside>

        {/* ── MAIN ─────────────────────────────────────────────────────── */}
        <main className="main">
          <div className="main-inner">

            {results!==null && !loading && !error && (
              <div className="results-head">
                <div>
                  <div className="results-count">
                    <span>{sorted.length}</span> EVENTO{sorted.length!==1?"S":""}
                  </div>
                  {subtitle && <div className="results-sub">{subtitle}</div>}
                  {searchQuery && (
                    <div className="results-sub" style={{color:"var(--accent-mid)"}}>
                      Buscando: "{searchQuery}"
                    </div>
                  )}
                </div>
                <div className="sort-btns">
                  <button className={`sort-btn${sortBy==="date"?" sort-btn--on":""}`} onClick={()=>setSortBy("date")}>
                    Fecha ↑
                  </button>
                  <button className={`sort-btn${sortBy==="price"?" sort-btn--on":""}`} onClick={()=>setSortBy("price")}>
                    Precio
                  </button>
                </div>
              </div>
            )}

            {anyFilter && (
              <ActiveFiltersRow
                ccaa={ccaa} modalParents={modalParents} modalSubs={modalSubs}
                formats={formats} dateRange={dateRange}
                setCcaa={setCcaa} setModalParents={setModalParents}
                setModalSubs={setModalSubs} setFormats={setFormats}
                setDateRange={setDateRange}
              />
            )}

            {loading && results===null && (
              <div className="state-center">
                <div className="spinner"/>
                <p className="state-sub">Cargando eventos…</p>
              </div>
            )}

            {error && !loading && (
              <div className="state-center">
                <p className="state-sub" style={{color:"var(--red)"}}>{error}</p>
              </div>
            )}

            {results!==null && !loading && !error && (
              sorted.length===0 ? (
                <div className="state-center">
                  <div className="state-icon">🏁</div>
                  <p className="state-title">Sin resultados</p>
                  <p className="state-sub">
                    {searchQuery
                      ? `Sin eventos que coincidan con "${searchQuery}".`
                      : "Prueba a ajustar los filtros o ampliar el rango de fechas."}
                  </p>
                </div>
              ) : (
                <div className="race-grid">
                  {sorted.map((r,i)=>(
                    <RaceCard key={r.id||i} race={r} featured={i===0} onClick={()=>setSelectedRace(r)}/>
                  ))}
                </div>
              )
            )}
          </div>
        </main>
      </div>

      {/* Newsletter */}
      <NewsletterSignup/>

      {/* Footer */}
      <SiteFooter/>

      {/* Mobile filter button */}
      <button className="mobile-filter-btn" onClick={()=>setSidebarOpen(o=>!o)}>
        {sidebarOpen ? "Cerrar ×" : `Filtros${anyFilter?` (${[ccaa.length,modalParents.length,modalSubs.length,formats.length,dateRange.from?1:0].reduce((a,b)=>a+b,0)})`:"" }`}
      </button>

      {/* Race modal */}
      {selectedRace && <RaceModal race={selectedRace} onClose={()=>setSelectedRace(null)}/>}
    </>
  );
}
