// Datos de los listados del blog (solo servidor: getStaticProps)
import { allSummaries, featuredPost, paginate } from "./blog";
import { fetchUpcomingRaces } from "./races-server";

export async function blogListProps(page) {
  const all = allSummaries();
  const featured = featuredPost(all);
  const rest = all.filter(p => p.slug !== featured.slug);
  const { items, pages } = paginate(rest, page);
  const upcoming = (await fetchUpcomingRaces({ limit: 3 })).slice(0, 3);
  return { all, featured: page === 1 ? featured : null, items, page, pages, upcoming };
}
