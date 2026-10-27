import BlogListing from "../../components/blog/BlogListing";
import { CATEGORIES } from "../../lib/blog-categories";
import { blogListProps } from "../../lib/blog-server";


export async function getStaticProps() {
  return { props: await blogListProps(1), revalidate: 3600 };
}

export default function BlogIndex({ all, featured, items, page, pages, upcoming }) {
  return (
    <BlogListing
      path="/blog"
      title="Blog de carreras híbridas: HYROX, OCR y material"
      description="Guías, planes de entrenamiento, material y podcasts para HYROX, carreras de obstáculos y Spartan en España, escritos por gente que compite en ellas."
      h1="Blog de carreras híbridas"
      intro="Guías para entender cada formato, planes para llegar en forma a tu primera HYROX u OCR, el material que de verdad hace falta y los podcasts que escuchamos mientras entrenamos. Todo pensado para carreras en España."
      items={items}
      all={all}
      featured={featured}
      categories={CATEGORIES.map(({ slug, name }) => ({ slug, name }))}
      page={page}
      pages={pages}
      upcoming={upcoming}
      crumbs={[{ name: "Inicio", href: "/" }, { name: "Blog" }]}
    />
  );
}
