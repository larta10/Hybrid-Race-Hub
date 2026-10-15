import BlogListing from "../../../components/blog/BlogListing";
import { allSummaries } from "../../../lib/blog";
import { CATEGORIES, CATEGORY_BY_SLUG } from "../../../lib/blog-categories";
import { fetchUpcomingRaces } from "../../../lib/races-server";

export async function getStaticPaths() {
  return { paths: CATEGORIES.map(c => ({ params: { cat: c.slug } })), fallback: false };
}

export async function getStaticProps({ params }) {
  const cat = CATEGORY_BY_SLUG[params.cat];
  const all = allSummaries();
  const items = all.filter(p => p.catSlug === cat.slug);
  const upcoming = (await fetchUpcomingRaces({ limit: 3 })).slice(0, 3);
  return { props: { cat, all, items, upcoming }, revalidate: 3600 };
}

export default function BlogCategory({ cat, all, items, upcoming }) {
  return (
    <BlogListing
      path={`/blog/categoria/${cat.slug}`}
      title={cat.title}
      description={cat.description}
      h1={cat.h1}
      intro={cat.intro}
      items={items}
      all={all}
      categories={CATEGORIES.map(({ slug, name }) => ({ slug, name }))}
      activeCat={cat.slug}
      upcoming={upcoming}
      crumbs={[{ name: "Inicio", href: "/" }, { name: "Blog", href: "/blog" }, { name: cat.name }]}
    />
  );
}
