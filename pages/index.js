import { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import { SITE_URL, SITE_EMAIL, SITE_INSTAGRAM } from "../lib/site";
import RaceList from "../components/RaceList";
import { fetchUpcomingRaces, seasonLabel } from "../lib/races-server";
import { HYBRID_CITIES } from "../lib/hybrid-cities";
import {
  SUPABASE_URL, ANON_KEY, CCAA, FORMATS,
  InstagramIcon, EnvelopeIcon, HeroStats, SiteFooter, CookieBanner,
  SiteNav,
} from "../lib/shared";

/* ─── FAQ ──────────────────────────────────────────────────────────────────── */
const FAQ_DATA = [
  { question:"¿Qué es una carrera OCR?", answer:"OCR (Obstacle Course Race) es una carrera que combina running con obstáculos naturales o artificiales. Las pruebas más populares son Spartan Race, Tough Mudder y sus variantes. Los corredores deben completar tramos de carrera con desafíos físicos como trepar, arrastrarse, cargar peso y cruzar elementos de agua." },
  { question:"¿Qué es HYROX? ¿En qué se diferencia de CrossFit?", answer:"HYROX es una modalidad específica de fitness funcional que consiste en completar una serie de ejercicios técnicos (burpees, saltos, remo, cargada) intercalados con carrera. A diferencia de los Open de CrossFit, los eventos HYROX están estandarizados y tienen un formato fijo (típicamente 8 estaciones + carrera) permitiendo comparar resultados entre eventos." },
  { question:"¿Cómo me inscribo en una carrera?", answer:"Cada carrera tiene su propio sistema de inscripción. Haz clic en cualquier carrera del calendario para ver los detalles. Encontrarás un enlace directo a la web oficial del evento donde podrás completar tu inscripción." },
  { question:"¿Qué nivel necesito para participar?", answer:"Cada evento indica su nivel de dificultad. Los formatos 'Individual' son para todos los niveles, mientras que 'Pro / Elite' requieren experiencia previa. Las distancias varían desde 5km hasta ultra distancias de 50km+." },
  { question:"¿Puedo competir en pareja o equipo?", answer:"Sí, muchos eventos OCR y funcionales ofrecen formatos por parejas (2 personas) o equipos (4+ personas). Estos formatos añaden una dimensión de teamwork. Filtra por 'Parejas' o 'Equipos' en el calendario." },
  { question:"¿Dónde encuentro entrenamientos específicos?", answer:"En la sección 'Comunidad' del Hub encontrarás box de HYROX y CrossFit por toda España. Muchos de estos gyms ofrecen clases específicas para mejorar tu rendimiento en obstáculos." },
];

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="faq-item">
      <button className={`faq-question${isOpen?" faq-question--open":""}`} onClick={()=>setIsOpen(!isOpen)}>
        <span>{question}</span>
        <span className="faq-icon">{isOpen?"−":"+"}</span>
      </button>
      {isOpen&&<div className="faq-answer">{answer}</div>}
    </div>
  );
}

function FAQSection() {
  return (
    <section className="faq">
      <div className="faq-inner">
        <div className="faq-header">
          <p className="faq-eyebrow">PREGUNTAS FRECUENTES</p>
          <h2 className="faq-title">Lo que más nos preguntáis</h2>
        </div>
        <div className="faq-list">
          {FAQ_DATA.map((item,i)=><FAQItem key={i} question={item.question} answer={item.answer}/>)}
        </div>
      </div>
    </section>
  );
}

/* ─── OrganizerContact ─────────────────────────────────────────────────────── */
function OrganizerContact() {
  const [form, setForm]     = useState({ nombre:"", email:"", prueba:"", mensaje:"" });
  const [status, setStatus] = useState("idle");
  const [errMsg, setErrMsg] = useState("");

  function set(field, val){ setForm(f=>({...f,[field]:val})); }

  async function handleSubmit(e) {
    e.preventDefault();
    if(!form.nombre||!form.email||!form.mensaje) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/contact",{
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify(form),
      });
      if(res.ok){ setStatus("success"); }
      else { const body=await res.json().catch(()=>({})); throw new Error(body.error||"Error al enviar"); }
    } catch(err) { setStatus("error"); setErrMsg(err.message||"No se pudo enviar. Inténtalo de nuevo."); }
  }

  return (
    <section className="oc">
      <div className="oc-inner">
        <div className="oc-text">
          <p className="oc-eyebrow">COLABORACIONES</p>
          <h2 className="oc-title">¿TRABAJAMOS<br/>JUNTOS?</h2>
          <p className="oc-sub">
            ¿Organizas una prueba, llevas un box o entrenas a atletas híbridos?
            Escríbenos. Publicamos tu evento en el calendario y vemos juntos cómo
            llegar a la gente que ya está buscando carrera.
          </p>
          <a href="mailto:hola@hybridracehub.com" className="oc-ig-link" style={{marginBottom:8,display:"inline-flex"}}>
            <EnvelopeIcon size={14}/><span>hola@hybridracehub.com</span>
          </a>
          <br/>
          <a href="https://www.instagram.com/hybridracehub_spain" target="_blank" rel="noreferrer" className="oc-ig-link">
            <InstagramIcon size={14}/><span>O DM · @hybridracehub_spain</span>
          </a>
        </div>

        <div className="oc-form-wrap">
          {status==="success"?(
            <div className="oc-success">
              <span className="oc-check">✓</span>
              <div>
                <p className="oc-success-title">Mensaje enviado</p>
                <p className="oc-success-sub">Te contestamos en 48 horas como mucho.</p>
              </div>
            </div>
          ):(
            <form className="oc-form" onSubmit={handleSubmit}>
              <div className="oc-field">
                <label className="oc-label">Nombre *</label>
                <input className="oc-input" type="text" placeholder="Tu nombre" required
                  value={form.nombre} onChange={e=>set("nombre",e.target.value)} disabled={status==="loading"}/>
              </div>
              <div className="oc-field">
                <label className="oc-label">Email de contacto *</label>
                <input className="oc-input" type="email" placeholder="tu@email.com" required
                  value={form.email} onChange={e=>set("email",e.target.value)} disabled={status==="loading"}/>
              </div>
              <div className="oc-field">
                <label className="oc-label">Nombre del evento</label>
                <input className="oc-input" type="text" placeholder="Nombre de la prueba (opcional)"
                  value={form.prueba} onChange={e=>set("prueba",e.target.value)} disabled={status==="loading"}/>
              </div>
              <div className="oc-field">
                <label className="oc-label">Mensaje *</label>
                <textarea className="oc-input oc-textarea" placeholder="Cuéntanos tu prueba, fecha, lugar…" required
                  rows={4} value={form.mensaje} onChange={e=>set("mensaje",e.target.value)} disabled={status==="loading"}/>
              </div>
              <button type="submit" className="oc-btn" disabled={status==="loading"}>
                {status==="loading"?"Enviando…":"Enviar mensaje"}
              </button>
              {status==="error"&&<p className="oc-error">{errMsg}</p>}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

/* ─── HomeSections: índice editorial del hub (sin iconos, filas con separador) ─ */
function HomeSections() {
  const sections = [
    {
      href: "/calendario",
      title: "Calendario",
      desc: "Más de 140 pruebas de OCR, HYROX y funcional en España. Filtra por comunidad, formato y mes.",
      cta: "Ver carreras",
    },
    {
      href: "/plan-entrenamiento",
      title: "Plan de entrenamiento",
      desc: "Cinco preguntas y tienes un plan por semanas para una Spartan Sprint, una HYROX o el Open. Gratis, en Excel o PDF.",
      cta: "Crear plan",
    },
    {
      href: "/blog",
      title: "Blog",
      desc: "Guías de carrera, análisis de material y estrategia para el día de la prueba.",
      cta: "Leer artículos",
    },
    {
      href: "/productos",
      title: "Productos",
      desc: "Rankings de zapatillas, relojes GPS, pulsómetros y ropa, probados en barro y en estaciones.",
      cta: "Ver rankings",
    },
    {
      href: "/calculadora-hyrox",
      title: "Calculadora HYROX",
      desc: "Mete tu ritmo de carrera y tus tiempos por estación, del SkiErg a los wall balls, y mira dónde acabas.",
      cta: "Calcular",
    },
    {
      href: "/centros-entrenamiento",
      title: "Centros de entrenamiento",
      desc: "Boxes y gimnasios con material de OCR, HYROX y CrossFit. Busca por ciudad o código postal.",
      cta: "Buscar centro",
    },
  ];
  return (
    <section className="home-index" aria-label="Secciones del hub">
      <div className="home-index-inner">
        <div className="home-index-head">
          <p className="section-label">EL HUB</p>
          <h2 className="section-title">Todo lo que hay aquí</h2>
        </div>
        <ol className="home-index-list">
          {sections.map((s,i)=>(
            <li key={s.href}>
              <a href={s.href} className="home-index-row">
                <span className="home-index-num">{String(i+1).padStart(2,"0")}</span>
                <span className="home-index-body">
                  <h3 className="home-index-title">{s.title}</h3>
                  <span className="home-index-desc">{s.desc}</span>
                </span>
                <span className="home-index-cta">{s.cta} →</span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ─── Editorial Block ──────────────────────────────────────────────────────── */
function EditorialBlock({ imgSrc, imgAlt, eyebrow, title, body, cta, ctaHref, reverse }) {
  return (
    <section className="editorial-section">
      <div className={`editorial${reverse ? " editorial--reverse" : ""}`}>
        <Image src={imgSrc} alt={imgAlt} width={900} height={675} className="editorial-photo"
          sizes="(max-width: 900px) 100vw, 560px"/>
        <div className="editorial-text">
          {eyebrow && <p className="editorial-eyebrow">{eyebrow}</p>}
          <h2 className="editorial-title">{title}</h2>
          <p className="editorial-body">{body}</p>
          {cta && <a href={ctaHref} className="editorial-cta">{cta}</a>}
        </div>
      </div>
    </section>
  );
}

/* ─── Home ─────────────────────────────────────────────────────────────────── */
export async function getStaticProps() {
  const races = await fetchUpcomingRaces();
  return {
    props: { nextRaces: races.slice(0, 6), upcomingCount: races.length, season: seasonLabel() },
    revalidate: 3600,
  };
}

export default function Home({ nextRaces = [], upcomingCount = 0, season }) {
  const [totalCount, setTotalCount] = useState(null);
  useEffect(()=>{
    fetch(`${SUPABASE_URL}/rest/v1/races?select=count&modalidad_parent=in.(ocr,funcional)`,{
      headers:{ apikey:ANON_KEY, Authorization:`Bearer ${ANON_KEY}`, Prefer:"count=exact" },
    }).then(r=>{ const c=r.headers.get("content-range"); if(c) setTotalCount(c.split("/")[1]); }).catch(()=>{});
  },[]);

  return (
    <>
      <Head>
        <title>{`Carreras híbridas en España ${season}: calendario Hyrox y OCR | Hybrid Race Hub`}</title>
        <meta name="description" content="Calendario de carreras híbridas en España: HYROX, OCR, Spartan y DEKA con fechas, precios e inscripción. Busca por ciudad y prepara tu próxima carrera." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`${SITE_URL}/`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/`} />
        <meta property="og:title" content={`Carreras híbridas en España ${season}: calendario HYROX y OCR`} />
        <meta property="og:description" content="Todas las carreras híbridas de España en un calendario: HYROX, OCR, Spartan y DEKA. Fechas, precios, inscripción y dónde entrenar." />
        <meta property="og:locale" content="es_ES" />
        <meta property="og:site_name" content="Hybrid Race Hub" />
        <meta property="og:image" content={`${SITE_URL}/og-image.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`Carreras híbridas en España ${season}`} />
        <meta name="twitter:description" content="Calendario de carreras híbridas en España: HYROX, OCR, Spartan y DEKA." />
        <meta name="twitter:image" content={`${SITE_URL}/og-image.png`} />
        <link rel="preconnect" href={SUPABASE_URL} />
        <link rel="preload" as="image" href="/hero-home.webp" media="(min-width: 721px)" fetchpriority="high" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{__html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                "@id": `${SITE_URL}/#organization`,
                "name": "Hybrid Race Hub",
                "url": `${SITE_URL}/`,
                "logo": { "@type": "ImageObject", "url": `${SITE_URL}/logo.svg` },
                "description": "Calendario y guías de carreras híbridas en España: HYROX, OCR, Spartan y DEKA.",
                "email": SITE_EMAIL,
                "contactPoint": { "@type": "ContactPoint", "email": SITE_EMAIL, "contactType": "customer support", "availableLanguage": ["es"] },
                "sameAs": [SITE_INSTAGRAM],
              },
              {
                "@type": "WebSite",
                "@id": `${SITE_URL}/#website`,
                "url": `${SITE_URL}/`,
                "name": "Hybrid Race Hub",
                "description": "Calendario de carreras híbridas en España",
                "inLanguage": "es-ES",
                "publisher": { "@id": `${SITE_URL}/#organization` },
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": { "@type": "EntryPoint", "urlTemplate": `${SITE_URL}/calendario?q={search_term_string}` },
                  "query-input": "required name=search_term_string",
                },
              },
            ],
          })}}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{__html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "¿Qué es una carrera OCR?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "OCR (Obstacle Course Race) es una carrera que combina running con obstáculos naturales o artificiales. Las pruebas más populares son Spartan Race, Tough Mudder y sus variantes. Los corredores deben completar tramos de carrera con desafíos físicos como trepar, arrastrarse, cargar peso y cruzar elementos de agua.",
                },
              },
              {
                "@type": "Question",
                "name": "¿Qué es HYROX? ¿En qué se diferencia de CrossFit?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "HYROX es una modalidad específica de fitness funcional que consiste en completar una serie de ejercicios técnicos (burpees, saltos, remo, cargada) intercalados con carrera. A diferencia de los Open de CrossFit, los eventos HYROX están estandarizados y tienen un formato fijo (típicamente 8 estaciones + carrera) permitiendo comparar resultados entre eventos.",
                },
              },
              {
                "@type": "Question",
                "name": "¿Cómo me inscribo en una carrera?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Cada carrera tiene su propio sistema de inscripción. Haz clic en cualquier carrera del calendario para ver los detalles. Encontrarás un enlace directo a la web oficial del evento donde podrás completar tu inscripción.",
                },
              },
              {
                "@type": "Question",
                "name": "¿Qué nivel necesito para participar?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Cada evento indica su nivel de dificultad. Los formatos 'Individual' son para todos los niveles, mientras que 'Pro / Elite' requieren experiencia previa. Las distancias varían desde 5km hasta ultra distancias de 50km+.",
                },
              },
              {
                "@type": "Question",
                "name": "¿Puedo competir en pareja o equipo?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Sí, muchos eventos OCR y funcionales ofrecen formatos por parejas (2 personas) o equipos (4+ personas). Estos formatos añaden una dimensión de teamwork. Filtra por 'Parejas' o 'Equipos' en el calendario.",
                },
              },
              {
                "@type": "Question",
                "name": "¿Dónde encuentro entrenamientos específicos?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "En la sección 'Comunidad' del Hub encontrarás box de HYROX y CrossFit por toda España. Muchos de estos gyms ofrecen clases específicas para mejorar tu rendimiento en obstáculos.",
                },
              },
            ],
          })}}
        />
      </Head>

      {/* ── HEADER ── */}
      <header className="hero hero--home">
        <div className="hero-inner">
          <div className="brand">
            <Image src="/logo-icon.svg" className="brand-logo-img" alt="" width={40} height={40} priority />
            <div>
              <div className="brand-name">Hybrid Race Hub</div>
              <div className="brand-sub">
                <span>OCR · HYROX · Functional</span>
                {totalCount&&<span className="brand-count">{totalCount} eventos</span>}
              </div>
            </div>
          </div>
          <SiteNav activePath="/"/>
        </div>

        {/* Hero body */}
        <div className="hero-body" style={{ paddingTop: 0 }}>
          <div className="hero-left">
            <p className="section-label">{`CALENDARIO · TEMPORADA ${season}`}</p>
            <h1 className="hero-title" style={{ fontSize: 'clamp(32px,6vw,48px)', textTransform:'none' }}>
              {`Carreras híbridas en España ${season}`}
            </h1>
            <p className="hero-sub" style={{ maxWidth: 640 }}>
              El calendario de carreras híbridas (<em>hybrid races</em> en inglés) de España: HYROX, Spartan, OCR y DEKA en un solo sitio.
              Elige fecha y ciudad, prepara la carrera y busca dónde entrenar.
            </p>
            <div className="hero-actions">
              <a href="/calendario" className="btn-solid">Ver carreras</a>
              <a href="/plan-entrenamiento" className="btn-line">Crear plan gratis</a>
            </div>
            <HeroStats totalCount={totalCount} ccaaCount={CCAA.length} formatsCount={FORMATS.length}/>
          </div>
        </div>
      </header>

      {/* Próximas carreras reales (Supabase, ISR cada hora) */}
      <section className="home-next" aria-labelledby="proximas">
        <div className="home-next-inner">
          <div className="home-next-head">
            <p className="section-label">PRÓXIMAS CARRERAS</p>
            <h2 id="proximas" className="section-title">Las siguientes {nextRaces.length} carreras híbridas</h2>
            {upcomingCount > 0 && <p className="home-next-sub">Hay {upcomingCount} carreras programadas en el calendario. Fechas y precios los publica cada organizador.</p>}
          </div>
          {nextRaces.length
            ? <RaceList races={nextRaces} pageUrl={`${SITE_URL}/`} />
            : <p className="home-next-sub">Ahora mismo no podemos cargar las próximas fechas. Las tienes en el <a href="/calendario">calendario</a>.</p>}
          <div className="home-next-more">
            <a href="/calendario" className="btn-solid">Ver todo el calendario</a>
            <a href="/que-es-una-carrera-hibrida" className="btn-line">Qué es una carrera híbrida</a>
          </div>
        </div>
      </section>

      {/* Accesos por ciudad + guía + rankings */}
      <section className="home-cities" aria-labelledby="por-ciudad">
        <div className="home-cities-inner">
          <div>
            <p className="section-label">POR CIUDAD</p>
            <h2 id="por-ciudad" className="section-title">Carreras híbridas cerca de ti</h2>
          </div>
          <ul className="city-links">
            {HYBRID_CITIES.filter(c => c.priority <= 10).map(c => (
              <li key={c.slug}><a href={`/carreras-hibridas/${c.slug}`}>{c.name}</a></li>
            ))}
          </ul>
          <div className="home-guides">
            <p className="section-label">EMPIEZA AQUÍ</p>
            <ul>
              <li><a href="/que-es-una-carrera-hibrida">Qué es una carrera híbrida y qué tipos hay</a></li>
              <li><a href="/blog/que-es-hyrox">Qué es HYROX: estaciones, pesos y cómo inscribirte</a></li>
              <li><a href="/blog/carreras-hibridas-principiantes-primera-prueba">Cómo elegir tu primera carrera híbrida</a></li>
              <li><a href="/blog/plan-entrenamiento-hyrox-12-semanas">Plan de entrenamiento HYROX de 12 semanas</a></li>
              <li><a href="/blog/material-hyrox-carreras-obstaculos">Material para HYROX y carreras de obstáculos</a></li>
              <li><a href="/productos/zapatillas-hyrox">Ranking de zapatillas para HYROX</a></li>
              <li><a href="/productos/zapatillas-trail">Ranking de zapatillas de trail para OCR</a></li>
              <li><a href="/productos/relojes">Ranking de relojes GPS</a></li>
              <li><a href="/calculadora-hyrox">Calculadora de tiempos HYROX</a></li>
            </ul>
          </div>
        </div>
      </section>

      {/* Cómo funciona: lista numerada, sin tarjetas ni iconos */}
      <section className="steps" aria-label="Cómo funciona">
        <div className="steps-inner">
          <div className="steps-head">
            <p className="section-label">CÓMO FUNCIONA</p>
            <h2 className="section-title">De la inscripción a la línea de meta</h2>
          </div>
          <ol className="steps-list">
            <li className="step">
              <span className="step-num">01</span>
              <h3 className="step-title">Elige carrera</h3>
              <p className="step-text">Todas las fechas de OCR, HYROX y funcional que conocemos en España. Filtra por ciudad, mes y formato: individual, parejas o equipos.</p>
              <a href="/calendario" className="step-link">Ver calendario →</a>
            </li>
            <li className="step">
              <span className="step-num">02</span>
              <h3 className="step-title">Prepárala con un plan</h3>
              <p className="step-text">Respondes cinco preguntas y te damos las semanas que faltan hasta la carrera, con cargas y días de descarga. Sin registro. Lo bajas en Excel o PDF.</p>
              <p className="step-text step-text--small">¿Prefieres que te lleve un entrenador? Escríbenos a <a href="mailto:hola@hybridracehub.com">hola@hybridracehub.com</a></p>
              <a href="/plan-entrenamiento" className="step-link">Crear mi plan →</a>
            </li>
            <li className="step">
              <span className="step-num">03</span>
              <h3 className="step-title">Entrena cerca de casa</h3>
              <p className="step-text">Más de 400 boxes y centros con sleds, rigs y remos. Busca por ciudad o código postal y llama antes de ir.</p>
              <a href="/centros-entrenamiento" className="step-link">Buscar centro →</a>
            </li>
          </ol>
        </div>
      </section>

      {/* Banda de foto a ancho completo */}
      <figure className="photo-band">
        <Image
          src="https://images.unsplash.com/photo-1743993414654-0be2b73a9620?w=1920&q=80&fit=crop&auto=format"
          alt="Fila de atletas en la estación de SkiErg durante una competición de fitness híbrido en pabellón"
          width={1920}
          height={1080}
          sizes="100vw"
        />
        <figcaption>SkiErg, la primera estación de HYROX: 1.000 metros tirando de brazos con la carrera recién empezada.</figcaption>
      </figure>

      {/* Editorial 1: Eventos */}
      <EditorialBlock
        imgSrc="https://images.unsplash.com/photo-1741562238447-d7c44397f7e0?w=900&q=80&fit=crop&auto=format"
        imgAlt="Corredores en carrera indoor de atletismo híbrido"
        eyebrow="CALENDARIO"
        title="Fechas revisadas cada día"
        body="Más de 140 pruebas en España, desde una Spartan Sprint de 5 km hasta HYROX Madrid. Revisamos fechas y enlaces de inscripción a diario para que no te enteres cuando ya no quedan dorsales."
        cta="Ver carreras →"
        ctaHref="/calendario"
      />

      <HomeSections/>

      {/* Editorial 2: Comunidad */}
      <EditorialBlock
        imgSrc="https://images.unsplash.com/photo-1757147517580-90c214fc28f3?w=900&q=80&fit=crop&auto=format"
        imgAlt="Atletas compitiendo en evento HYROX Grand Palais París"
        eyebrow="QUIÉNES SOMOS"
        title="Lo hacemos atletas"
        body="Corremos OCR, competimos en HYROX y entrenamos en box. Montamos esto porque estábamos hartos de buscar fechas en veinte webs distintas. Los rankings dicen qué compraríamos nosotros y por qué. Si un enlace es de afiliado, lo pone."
        cta="Síguenos en Instagram →"
        ctaHref="https://www.instagram.com/hybridracehub_spain"
        reverse
      />

      <FAQSection/>
      <OrganizerContact/>
      <SiteFooter/>
      <CookieBanner/>
    </>
  );
}
