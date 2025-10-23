// components/layout/Footer.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
// lucide-react
import {
  PiInstagramLogoLight as Instagram,
  PiFacebookLogoLight as Facebook,
} from "react-icons/pi";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

type FooterLink = { label: string; href: string };
type FooterMenu = { title: string; links: FooterLink[] };

const MENUS: FooterMenu[] = [
  {
    title: "INFORMACIóN",
    links: [
      { label: "Guía de talles", href: "#" },
      { label: "Cuidado del producto", href: "#" },
      { label: "Envíos y devoluciones", href: "#" },
    ],
  },
  {
    title: "MIS PEDIDOS",
    links: [
      { label: "Seguimiento de pedido", href: "#" },
      { label: "Cambios y devoluciones", href: "#" },
      { label: "Métodos de pago", href: "#" },
    ],
  },
  {
    title: "SOBRE HORSE BRAND",
    links: [
      { label: "Historia", href: "#" },
      { label: "Savoir-faire", href: "#" },
      { label: "Sustentabilidad", href: "#" },
    ],
  },
  {
    title: "AVISO LEGAL",
    links: [
      { label: "Términos y condiciones", href: "#" },
      { label: "Privacidad", href: "#" },
      { label: "Cookies", href: "#" },
    ],
  },
];

export function Footer({
  year = new Date().getFullYear(),
}: {
  locationLabel?: string;
  year?: number;
}) {
  const [email, setEmail] = useState("");

  return (
    <footer className="w-full bg-white text-neutral-900">
      {/* Menús superiores */}
      <div className="w-full px-4 py-6">
        <Accordion
          type="multiple"
          // className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-24"
          className="grid grid-cols-1 gap-6 md:grid-cols-4 md:gap-24"
        >
          {MENUS.map((m, i) => (
            <AccordionItem
              key={m.title}
              value={`item-${i}`}
              className="border-none"
            >
              {/* Título clickeable */}
              <AccordionTrigger className="no-underline hover:no-underline py-0 cursor-pointer">
                <h3 className="text-base tracking-[0.18em] uppercase flex items-center gap-2">
                  {m.title} <span className="text-[13px]">+</span>
                </h3>
              </AccordionTrigger>

              {/* Contenido con transición de altura */}
              <AccordionContent className="mt-3 data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                <nav className="space-y-2">
                  {m.links.map((l) => (
                    <Link
                      key={l.label}
                      href={l.href}
                      className="block text-[12px] text-neutral-700 hover:text-neutral-900"
                    >
                      {l.label}
                    </Link>
                  ))}
                </nav>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <Separator className="bg-neutral-200/60" />

      {/* Atención al cliente / Newsletter / Síguenos */}
      <div className="mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Atención al cliente */}
        <div>
          <h4 className="text-xs tracking-[0.18em] uppercase">
            Servicio de atención al cliente
          </h4>
          <div className="mt-3 space-y-2 text-[12px]">
            <Link href="#" className="underline underline-offset-2">
              Contacto Whatsapp
            </Link>
            <p className="text-neutral-700">
              De lunes al sábado 10 de la mañana - 19 de la tarde :
            </p>
            <Link href="tel:+34914149996" className="underline">
              +54 11 1234 5678
            </Link>
            <div>
              <Link href="mailto:soporte@tu-marca.com" className="underline">
                Enviar un mensaje de correo electrónico
              </Link>
            </div>
          </div>
        </div>

        {/* Newsletter (centrado) */}
        <div className="flex flex-col items-center text-center">
          <h4 className="text-xs tracking-[0.18em] uppercase">Newsletter</h4>
          <p className="mt-2 max-w-sm text-[12px] text-neutral-700">
            Reciba nuestra newsletter y descubra nuestras historias, colecciones
            y sorpresas.
          </p>
          <form
            className="mt-4 flex items-center gap-2 w-full max-w-sm"
            onSubmit={(e) => {
              e.preventDefault();
              // TODO: enviar
            }}
          >
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Tu email"
              className="bg-white/70 rounded-none"
              required
            />
            <Button
              type="submit"
              variant="outline"
              className="uppercase tracking-wide rounded-none cursor-pointer"
            >
              Suscribirse
            </Button>
          </form>
        </div>

        {/* Síguenos (derecha) */}
        <div className="md:text-right">
          <h4 className="text-xs tracking-[0.18em] uppercase">Seguínos</h4>
          <div className="mt-3 flex md:justify-end gap-5">
            <Link
              href="#"
              aria-label="Facebook"
              className="text-neutral-800 hover:opacity-80"
            >
              <Facebook size={20} />
            </Link>
            <Link
              href="#"
              aria-label="Instagram"
              className="text-neutral-800 hover:opacity-80"
            >
              <Instagram size={20} />
            </Link>
          </div>
        </div>
      </div>

      <Separator className="bg-neutral-200/60" />

      {/* Franja inferior */}
      <div className="mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-end gap-4">
        {/* <Link
          href="#"
          className="text-[12px] uppercase tracking-[0.14em] inline-flex items-center gap-2"
        >
          Su ubicación : {locationLabel} <span className="text-[13px]">›</span>
        </Link> */}

        <Image
          alt="Horse Brand Logo"
          src={"/logos/HB main positivo.svg"}
          width={80}
          height={0}
        />

        <p className="text-[11px] text-neutral-600">
          © Horse-Brand {year}. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
