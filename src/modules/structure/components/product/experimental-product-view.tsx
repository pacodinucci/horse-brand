"use client";

import { Navbar } from "../navbar/navbar";
import { Footer } from "../footer/footer";
import { useState } from "react";
import { ProductImagesStrip } from "./product-image-strip";
import { Separator } from "@radix-ui/react-select";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { poppins } from "@/lib/fonts";
import { ChevronDown } from "lucide-react";

const stripImages = [
  { src: "/bag.png", alt: "Vista frontal" },
  { src: "/cat8.png", alt: "Vista lateral" },
  { src: "/cat9.png", alt: "Detalle hebilla" },
  { src: "/cat10.png", alt: "Vista detrás" },
];

export default function ExperimentalProductView() {
  const [navFixed, setNavFixed] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      {/* NAVBAR (asumo que es fixed o sticky arriba) */}
      <Navbar
        onFixedChange={(isFixed) => {
          setNavFixed(isFixed);
        }}
      />

      {/* MAIN: importante el padding-top para que el contenido no quede debajo del navbar */}
      <main className={`relative flex-1 ${navFixed && "mt-32"}`}>
        <ProductImagesStrip images={stripImages} />
        <div className="max-w-screen mx-auto px-12 md:px-6 pt-[120px] pb-24">
          {/* GRID: izquierda contenido largo, derecha sidebar sticky */}
          <div className="grid gap-32 lg:grid-cols-[minmax(0,1.7fr)_minmax(320px,1fr)] items-start">
            {/* COLUMNA IZQUIERDA - contenido falso solo para scrollear */}
            <section className="space-y-6">
              <h1 className="uppercase text-2xl tracking-wide">
                Productos Relacionados
              </h1>
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-40 rounded-[2rem] bg-gradient-to-br from-slate-400 via-neutral-500 to-zinc-900"
                />
              ))}
            </section>

            {/* SIDEBAR STICKY */}
            <aside
              className={`
                sticky
                top-[48px]
                -mt-240
                self-start
                space-y-4
              `}
            >
              <div className="bg-stone-100/90 shadow-sm p-6">
                <div className={`${poppins.className} flex flex-col gap-4`}>
                  <h1 className="text-2xl">Cartera de cuero</h1>
                  <h3 className="text-lg">$100.000</h3>
                  <Separator className="h-[.5px] bg-slate-300" />
                  <div className="flex justify-between w-full">
                    <h2>Color</h2>
                    <h3>Marrón</h3>
                  </div>
                  <Separator className="h-[.5px] bg-slate-300" />
                  <Image
                    src={"/bag.png"}
                    alt="Cartera de cuero Horse Brand"
                    width={70}
                    height={70}
                  />
                  <Separator className="h-[.5px] bg-slate-300" />
                  <Button className="w-1/2 self-center rounded-none text-lg font-light my-4 cursor-pointer">
                    Agregar al Carrito
                  </Button>
                  <div className="flex flex-col gap-2 text-neutral-500 font-light text-sm max-w-[80%]">
                    <p>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Iste dolore perspiciatis minima beatae praesentium aliquam
                      fuga consequuntur qui rerum tempore, officiis eos non, nam
                      aperiam hic, harum distinctio quas veniam nostrum error
                      sapiente cumque ut!
                    </p>
                    <p>Lorem ipsum dolor sit amet.</p>
                    <p>Lorem ipsum</p>
                  </div>
                </div>
              </div>
              <div className="bg-stone-100/90 shadow-sm p-6">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="cuidado">
                    <AccordionTrigger className="text-lg font-medium uppercase tracking-wider flex items-center justify-between">
                      <p>Cuidado del producto</p>
                      <ChevronDown
                        className="
                          ml-2 h-5 w-5 shrink-0
                          transition-transform duration-400
                          group-data-[state=open]:rotate-180
                        "
                      />
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-neutral-600 font-light">
                      Guardar en un lugar seco, evitar exposición prolongada al
                      sol y limpiar únicamente con paños suaves ligeramente
                      humedecidos. No usar solventes ni productos abrasivos.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="detalles">
                    <AccordionTrigger className="text-lg font-medium uppercase tracking-wider flex items-center justify-between">
                      <p>Detalles del producto</p>
                      <ChevronDown
                        className="
                          ml-2 h-5 w-5 shrink-0
                          transition-transform duration-400
                          group-data-[state=open]:rotate-180
                        "
                      />
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-neutral-600 font-light">
                      Cuero vacuno seleccionado, herrajes metálicos en tono
                      níquel, forrería interna en algodón y costuras reforzadas
                      en puntos de tensión.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="regalo">
                    <AccordionTrigger className="text-lg font-medium uppercase tracking-wider flex items-center justify-between">
                      <p>Hacer un regalo</p>
                      <ChevronDown
                        className="
                          ml-2 h-5 w-5 shrink-0
                          transition-transform duration-400
                          group-data-[state=open]:rotate-180
                        "
                      />
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-neutral-600 font-light">
                      Podés agregar una tarjeta con mensaje personalizado y
                      envolver el producto en nuestro packaging especial para
                      regalo. Consultanos por opciones de envío directo a la
                      persona agasajada.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
