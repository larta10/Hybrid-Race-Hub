/* Categorías del blog (sin importar artículos: se puede usar en el navegador). */
export const CATEGORIES = [
  {
    slug: "guias", name: "Guías",
    title: "Guías de carreras híbridas: HYROX, OCR y Spartan",
    description: "Guías para entender las carreras híbridas en España: qué es HYROX, en qué se diferencia de una OCR o una Spartan y qué formato encaja contigo.",
    h1: "Guías de carreras híbridas",
    intro: "Aquí están las guías para entender cada formato antes de gastarte la inscripción. Qué es exactamente HYROX y cuáles son sus ocho estaciones, en qué se parece y en qué no a una carrera de obstáculos, qué pide una Spartan frente a un DEKA y qué significa de verdad entrenar como atleta híbrido. Están escritas por gente que compite en estas pruebas en España, con datos del reglamento oficial y sin vender humo. Si es tu primera vez, empieza por la guía de qué es una carrera híbrida y luego ve a la que encaje con tu perfil.",
  },
  {
    slug: "entrenamiento", name: "Entrenamiento",
    title: "Entrenamiento para HYROX y OCR",
    description: "Planes y consejos de entrenamiento para HYROX y OCR: cuánto correr, cómo meter la fuerza, dónde entrenar y cómo saber si estás listo para competir.",
    h1: "Entrenamiento para HYROX y OCR",
    intro: "Entrenar para una carrera híbrida es combinar dos cosas que se estorban: correr mucho y levantar peso. En esta sección tienes planes por semanas, cómo repartir carrera y fuerza sin quedarte a medias, qué hacer si entrenas en un gimnasio normal y no en un box, y pruebas sencillas para saber si llegas preparado a tu primera HYROX o a tu primera OCR. Todo pensado para gente con trabajo, familia y cuatro o cinco días a la semana para entrenar, no para atletas profesionales con tiempo de sobra.",
  },
  {
    slug: "material", name: "Material",
    title: "Material para HYROX y OCR: zapatillas y relojes",
    description: "Qué material necesitas de verdad para HYROX y carreras de obstáculos: zapatillas, guantes, relojes GPS, ropa y recuperación, con pros y contras honestos.",
    h1: "Material para HYROX y carreras de obstáculos",
    intro: "No hace falta comprar media tienda para tu primera carrera híbrida. En esta sección separamos lo que marca diferencia de lo que es capricho: zapatillas que agarran en barro o que aguantan el trineo, guantes que no resbalan en la cuerda, relojes que miden bien los intervalos y lo poco que necesitas para recuperar. Cada artículo explica para quién es cada producto y qué falla tiene. Algunos enlaces son de afiliado de Amazon: si compras a través de ellos nos llevamos una pequeña comisión y a ti te cuesta lo mismo.",
  },
  {
    slug: "carreras", name: "Carreras",
    title: "Carreras híbridas en España: cuál elegir",
    description: "Cómo elegir tu carrera híbrida en España: formatos individual, parejas o equipos, qué prueba encaja con tu perfil y cuáles son las citas del año.",
    h1: "Carreras híbridas en España",
    intro: "En España hay HYROX, DEKA, Spartan y decenas de carreras de obstáculos repartidas por todas las comunidades, y cada una pide algo distinto. Estos artículos te ayudan a elegir: qué formato te conviene si vas solo, en pareja o con tu box, qué prueba encaja con tu nivel y tus objetivos, y cuáles son las carreras con más ambiente del calendario. Cuando ya lo tengas claro, busca la fecha y la ciudad en nuestro calendario, que se actualiza con las webs oficiales de cada organizador.",
  },
  {
    slug: "podcasts", name: "Podcasts",
    title: "Podcasts de HYROX, OCR y deporte híbrido",
    description: "Los podcasts de HYROX, carreras de obstáculos y entrenamiento híbrido que merece la pena escuchar, en español e inglés, con el episodio por el que empezar.",
    h1: "Podcasts de HYROX y deporte híbrido",
    intro: "Los rodajes suaves y los trayectos al box dan para mucho si llevas algo bueno en los auriculares. En esta sección recogemos podcasts de HYROX, carreras de obstáculos, CrossFit de competición y entrenamiento híbrido que siguen publicando, en español y en inglés. De cada uno te contamos quién lo presenta, para qué nivel es y qué episodio escuchar primero, comprobado en Apple Podcasts y Spotify. Los revisamos de vez en cuando y quitamos los que dejan de publicar, para que no pierdas el tiempo con consejos de hace años.",
  },
];

export const CATEGORY_BY_NAME = Object.fromEntries(CATEGORIES.map(c => [c.name, c]));
export const CATEGORY_BY_SLUG = Object.fromEntries(CATEGORIES.map(c => [c.slug, c]));
