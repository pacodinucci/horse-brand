import { MenuSection } from "@/modules/structure/components/navbar/menu-section";

export const mueblesLiving = {
  eyebrow: "COLECCIÓN LIVING",
  title: "Texturas nobles para tu casa",
  subtitle:
    "Maderas macizas, tapicería premium y líneas contemporáneas para un espacio cálido y funcional.",
  ctaLabel: "VER LA COLECCIÓN",
  ctaHref: "/colecciones/living",
  heroImageUrl: "/garden.png",
  heroImageAlt: "Ambiente de living con sofá modular y mesa de centro de roble",
  products: [
    {
      id: "sofa-modular-nordic",
      href: "/strucure-hermes/category",
      name: "Sofá Modular Nordic 3C",
      price: "USD 1.890",
      imageUrl: "/silla-landing.png",
      imageAlt: "Sofá modular tapizado en lino color arena",
    },
    {
      id: "mesa-centro-roble",
      href: "/strucure-hermes/category",
      name: "Mesa de Centro Roble 110",
      price: "USD 520",
      imageUrl: "/silla-landing.png",
      imageAlt: "Mesa de centro de roble macizo con cantos redondeados",
    },
    {
      id: "butaca-aurora",
      href: "/strucure-hermes/category",
      name: "Butaca Aurora Bouclé",
      price: "USD 740",
      imageUrl: "/silla-landing.png",
      imageAlt: "Butaca tapizada en bouclé con patas de madera",
    },
    {
      id: "rack-tv-olmo",
      href: "/strucure-hermes/category",
      name: "Rack TV Olmo 180",
      price: "USD 890",
      imageUrl: "/silla-landing.png",
      imageAlt: "Mueble para TV en olmo con puertas correderas",
    },
  ],
};

export const carterasBolsos = {
  eyebrow: "COLECCIÓN CARTERAS Y BOLSOS",
  title: "Elegancia artesanal para acompañarte todos los días",
  subtitle:
    "Carteras y bolsos de cuero natural, diseñados con líneas simples y detalles que envejecen con carácter.",
  ctaLabel: "VER LA COLECCIÓN",
  ctaHref: "/colecciones/carteras-bolsos",
  heroImageUrl: "/purse.png",
  heroImageAlt: "Bolso de cuero marrón sobre camino rural al aire libre",
  products: [
    {
      id: "bolso-tote-classic",
      href: "/strucure-hermes/category",
      name: "Bolso Tote Classic",
      price: "USD 480",
      imageUrl: "/zipper.png",
      imageAlt: "Bolso tote de cuero con cierre metálico y costuras visibles",
    },
    {
      id: "cartera-satchel-vintage",
      href: "/strucure-hermes/category",
      name: "Cartera Satchel Vintage",
      price: "USD 560",
      imageUrl: "/zipper.png",
      imageAlt:
        "Cartera estilo satchel en cuero color coñac con hebillas metálicas",
    },
    {
      id: "bandolera-urbana",
      href: "/strucure-hermes/category",
      name: "Bandolera Urbana",
      price: "USD 390",
      imageUrl: "/zipper.png",
      imageAlt: "Bandolera de cuero suave con correa ajustable",
    },
    {
      id: "mochila-craft",
      href: "/strucure-hermes/category",
      name: "Mochila Craft",
      price: "USD 620",
      imageUrl: "/zipper.png",
      imageAlt:
        "Mochila artesanal de cuero con cierres metálicos y bolsillo frontal",
    },
  ],
};

export type SectionData = Parameters<typeof MenuSection>[0];

export const MENU_DATA: Record<string, SectionData> = {
  Mujer: {
    title: "Mujer",
    image: { src: "/chair.png", alt: "Colección Mujer" },
    links: [
      { label: "Bolsos", href: "/mujer/bolsos" },
      { label: "Pequeña marroquinería", href: "/mujer/marroquineria" },
      { label: "Calzado", href: "/mujer/calzado" },
      { label: "Accesorios", href: "/mujer/accesorios" },
    ],
  },
  Hombre: {
    title: "Hombre",
    image: { src: "/chair.png", alt: "Colección Hombre" },
    links: [
      { label: "Marroquinería", href: "/hombre/marroquineria" },
      { label: "Calzado", href: "/hombre/calzado" },
      { label: "Cinturones", href: "/hombre/cinturones" },
      { label: "Accesorios", href: "/hombre/accesorios" },
    ],
  },
  Joyas: {
    title: "Joyas",
    image: { src: "/chair.png", alt: "Joyas" },
    links: [
      { label: "Anillos", href: "/joyas/anillos" },
      { label: "Pulseras", href: "/joyas/pulseras" },
    ],
  },
  Relojes: {
    title: "Relojes",
    image: { src: "/chair.png", alt: "Relojes" },
    links: [
      { label: "Clásicos", href: "/relojes/clasicos" },
      { label: "Deportivos", href: "/relojes/deportivos" },
    ],
  },
  Casa: {
    title: "Casa",
    image: { src: "/chair.png", alt: "Casa" },
    links: [
      { label: "Decoración", href: "/casa/decoracion" },
      { label: "Mesa", href: "/casa/mesa" },
    ],
  },
  Beauty: {
    title: "Beauty",
    image: { src: "/chair.png", alt: "Beauty" },
    links: [
      { label: "Fragancias", href: "/beauty/fragancias" },
      { label: "Cuidado", href: "/beauty/cuidado" },
    ],
  },
  Ecuestre: {
    title: "Ecuestre",
    image: { src: "/chair.png", alt: "Ecuestre" },
    links: [
      { label: "Sillas", href: "/ecuestre/sillas" },
      { label: "Accesorios", href: "/ecuestre/accesorios" },
    ],
  },
  Regalos: {
    title: "Regalos y Petit H",
    image: { src: "/chair.png", alt: "Regalos", caption: "PETIT H" },
    links: [
      { label: "Petit H", href: "/petit-h" },
      { label: "Regalos para mujer", href: "/regalos/mujer" },
      { label: "Regalos para hombre", href: "/regalos/hombre" },
      { label: "Regalos para recién nacidos", href: "/regalos/recien-nacidos" },
    ],
  },
  Historias: {
    title: "Historias",
    image: { src: "/chair.png", alt: "Historias" },
    links: [{ label: "Maison", href: "/historias/maison" }],
  },
  Nosotros: {
    title: "Nosotros",
    image: { src: "/chair.png", alt: "Servicios" },
    links: [{ label: "Nostros", href: "/servicios/cuidado" }],
  },
};

export type SectionKey = keyof typeof MENU_DATA;
export const MENU_KEYS = Object.keys(MENU_DATA) as SectionKey[];
