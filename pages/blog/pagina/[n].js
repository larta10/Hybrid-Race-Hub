import BlogListing from "../../../components/blog/BlogListing";
import { allSummaries, PER_PAGE } from "../../../lib/blog";
import { CATEGORIES } from "../../../lib/blog-categories";
import { blogListProps } from "../../../lib/blog-server";

// Páginas 2, 3… del blog. La página 1 es /blog (no se genera /blog/pagina/1).
export async function getStaticPaths() {
  const pages = Math.max(1, Math.ceil((allSummaries().length - 1) / PER_PAGE));
  return { paths: Array.from({ length: pages - 1 }, (_, i) => ({ params: { n: String(i + 2) } })), fallback: false };
}

export async function getStaticProps({ params }) {
  const page = Number(params.n);
  return { props: await blogListProps(page), revalidate: 3600 };
}

export default function BlogPage({ all, featured, items, page, pages, upcoming }) {
  return (
    <BlogListing
      path={`/blog/pagina/${page}`}
      title={`Blog de carreras híbridas, página ${page}`}
      description={`Artículos anteriores del blog de Hybrid Race Hub sobre HYROX, carreras de obstáculos, entrenamiento y material (página ${page}).`}
      h1="Blog de carreras híbridas"
      items={items}
      all={all}
      featured={featured}
      categories={CATEGORIES.map(({ slug, name }) => ({ slug, name }))}
      page={page}
      pages={pages}
      upcoming={upcoming}
      crumbs={[{ name: "Inicio", href: "/" }, { name: "Blog", href: "/blog" }, { name: `Página ${page}` }]}
    />
  );
}
