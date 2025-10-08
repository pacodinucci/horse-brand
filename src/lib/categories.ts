// categories.ts
import { Shapes, Lamp, Armchair, Shirt, Gem, Flame } from "lucide-react";

export type SubItem = { name: string; href: string };
export type Category = {
  key: string; // id interno
  name: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  items?: SubItem[];
  highlightClass?: string;
};

export const CATEGORIES: Category[] = [
  {
    key: "cueros",
    name: "Cueros",
    href: "/cueros",
    icon: Shapes,
    items: [
      { name: "Lanar", href: "/cueros/lanar" },
      { name: "Vacuno", href: "/cueros/vacuno" },
      { name: "Hereford", href: "/cueros/hereford" },
      { name: "Ver todo", href: "/cueros" },
    ],
  },
  {
    key: "deco",
    name: "Deco",
    href: "/deco",
    icon: Lamp,
    items: [
      { name: "Almohadones", href: "/deco/almohadones" },
      { name: "Mantas", href: "/deco/mantas" },
      { name: "Puffs", href: "/deco/puffs" },
      { name: "Ver todo", href: "/deco" },
    ],
  },
  {
    key: "living",
    name: "Living",
    href: "/living",
    icon: Armchair,
    items: [
      { name: "Sillones", href: "/living/sillones" },
      { name: "Banquitos", href: "/living/banquitos" },
      { name: "Mesas", href: "/living/mesas" },
      { name: "Ver todo", href: "/living" },
    ],
  },
  {
    key: "bolsos",
    name: "Bolsos & Carteras",
    href: "/bolsos-y-carteras",
    icon: Shirt,
    items: [
      { name: "Materas", href: "/bolsos-y-carteras/materas" },
      { name: "Bolsos", href: "/bolsos-y-carteras/bolsos" },
      { name: "Mochilas", href: "/bolsos-y-carteras/mochilas" },
      { name: "Morral/Portafolio", href: "/bolsos-y-carteras/morrales" },
      { name: "Carteras", href: "/bolsos-y-carteras/carteras" },
      { name: "Riñoneras", href: "/bolsos-y-carteras/rinoneras" },
      { name: "Billeteras", href: "/bolsos-y-carteras/billeteras" },
      { name: "Accesorios", href: "/bolsos-y-carteras/accesorios" },
      { name: "Ver todo", href: "/bolsos-y-carteras" },
    ],
  },
  {
    key: "indumentaria",
    name: "Indumentaria",
    href: "/indumentaria",
    icon: Shirt,
    items: [
      { name: "Camperas", href: "/indumentaria/camperas" },
      { name: "Chalecos", href: "/indumentaria/chalecos" },
      { name: "Cintos", href: "/indumentaria/cintos" },
      { name: "Ver todo", href: "/indumentaria" },
    ],
  },
  {
    key: "accesorios",
    name: "Accesorios",
    href: "/accesorios",
    icon: Gem,
    items: [
      { name: "Cintos", href: "/accesorios/cintos" },
      { name: "Billeteras", href: "/accesorios/billeteras" },
      { name: "Llaveros", href: "/accesorios/llaveros" },
      { name: "Ver todo", href: "/accesorios" },
    ],
  },
  {
    key: "sale",
    name: "SALE",
    href: "/sale",
    icon: Flame,
    highlightClass: "text-red-600",
    items: [{ name: "Ver todo", href: "/sale" }],
  },
];
