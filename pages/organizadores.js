/* Página para organizadores: cómo añadir su carrera (formulario de /contacto-organizadores) y sello embebible
   "Carrera verificada en Hybrid Race Hub" que enlaza a la ficha de su carrera. */
import Head from "next/head";
import { useState } from "react";
import PageShell, { Breadcrumbs } from "../components/PageShell";
import { SITE_URL, SITE_EMAIL, pageTitle, breadcrumbLd, ROBOTS_INDEX } from "../lib/site";
import { fetchUpcomingRaces } from "../lib/races-server";
import { fechaLarga } from "../lib/dates";

const PATH = "/organizadores";

export async function getStaticProps() {
  const races = (await fetchUpcomingRaces()).map(r => ({ slug: r.slug, nombre: r.nombre, fecha_iso: r.fecha_iso }));
  return { props: { races }, revalidate: 3600 };
}

const snippet = slug => `<a href="${SITE_URL}/carreras/${slug}" title="Ficha de la carrera en Hybrid Race Hub">
  <img src="${SITE_URL}/sello-carrera-verificada.svg" width="240" height="64" alt="Carrera verificada en Hybrid Race Hub" loading="lazy">
</a>`;

export default function Organizadores({ races }) {
  const url = `${SITE_URL}${PATH}`;
  const [slug, setSlug] = useState(races[0]?.slug || "");
  const [copied, setCopied] = useState(false);
  const title = "Organizadores: publica tu carrera y pon el sello";
  const desc = "Publica gratis tu carrera híbrida u OCR en el calendario de España y pon en tu web el sello de carrera verificada que enlaza a su ficha. Así funciona.";
  const crumbs = [{ name: "Inicio", href: "/" }, { name: "Organizadores" }];
  async function copy() {
    try { await navigator.clipboard.writeText(snippet(slug)); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
  }
  return (
    <PageShell>
      <Head>
        <title>{pageTitle(title)}</title>
        <meta name="description" content={desc} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content={ROBOTS_INDEX} />
        <link rel="canonical" href={url} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={desc} />
        <meta property="og:image" content={`${SITE_URL}/og?title=${encodeURIComponent("Publica tu carrera en Hybrid Race Hub")}&cat=Organizadores`} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd(crumbs, url)) }} />
      </Head>
      <article className="guide">
        <div className="guide-head">
          <Breadcrumbs items={crumbs} />
          <p className="section-label">Organizadores</p>
          <h1 className="guide-title">Publica tu carrera y pon el sello en tu web</h1>
        </div>
        <div className="guide-body">
          <p className="guide-lead">
            Si organizas una carrera híbrida, un HYROX-like, un DEKA, una liga de box o una carrera de obstáculos en España, la publicamos gratis
            en el calendario, con su propia ficha, y la enlazamos desde la página de su comunidad y del mes en que se corre.
          </p>

          <h2 id="anadir">Cómo añadir tu carrera</h2>
          <ol>
            <li>Mándanos el nombre, la fecha, la sede y el enlace de inscripción desde el <a href="/contacto-organizadores#contact-form">formulario para organizadores</a> o a <a href={`mailto:${SITE_EMAIL}`}>{SITE_EMAIL}</a>.</li>
            <li>La comprobamos en tu web como hacemos con todas: fecha, sede, inscripción y precio (<a href="/como-verificamos-las-carreras">cómo verificamos las carreras</a>).</li>
            <li>Te respondemos con el enlace de la ficha, normalmente en 48 horas. Si cambias fecha o precio, avísanos y lo actualizamos.</li>
          </ol>
          <p>No cobramos por aparecer ni vendemos dorsales: el botón de inscripción lleva siempre a tu web.</p>

          <h2 id="sello">El sello «Carrera verificada»</h2>
          <p>
            Si tu carrera ya está en el calendario, puedes poner este sello en tu web. Enlaza a la ficha de tu carrera, donde los atletas ven la fecha,
            la sede, cómo prepararla y dónde entrenar cerca. Es un SVG de menos de 1 KB y no carga nada más.
          </p>
          <p><img src="/sello-carrera-verificada.svg" width="240" height="64" alt="Carrera verificada en Hybrid Race Hub" /></p>
          {races.length > 0 ? (
            <>
              <label className="org-label" htmlFor="org-race">Elige tu carrera</label>
              <select id="org-race" className="org-select" value={slug} onChange={e => setSlug(e.target.value)}>
                {races.map(r => <option key={r.slug} value={r.slug}>{r.nombre} · {fechaLarga(r.fecha_iso)}</option>)}
              </select>
              <pre className="org-code"><code>{snippet(slug)}</code></pre>
              <p><button type="button" className="btn-line org-copy" onClick={copy}>{copied ? "Código copiado" : "Copiar el código"}</button></p>
            </>
          ) : (
            <pre className="org-code"><code>{snippet("nombre-de-tu-carrera-2027")}</code></pre>
          )}
          <p>¿Tu carrera no está en la lista? Envíala primero desde el <a href="/contacto-organizadores#contact-form">formulario</a>.</p>
        </div>
      </article>
    </PageShell>
  );
}
