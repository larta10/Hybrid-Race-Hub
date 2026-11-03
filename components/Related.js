/* Bloque "Relacionado": enlaces internos calculados con lib/related.js a partir de los datos de la página. */
export default function Related({ links, title = "Relacionado" }) {
  if (!links?.length) return null;
  return (
    <nav className="related" aria-label={title}>
      <p className="section-label">{title}</p>
      <ul>
        {links.map(l => <li key={l.href}><a href={l.href}>{l.label}</a></li>)}
      </ul>
    </nav>
  );
}
