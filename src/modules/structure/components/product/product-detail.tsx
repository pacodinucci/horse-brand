import Image from "next/image";

import { poppins } from "@/lib/fonts";
import { Separator } from "@radix-ui/react-select";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { ChevronDown } from "lucide-react";
import { HiOutlineShoppingBag } from "react-icons/hi2";

export const ProductDetail = () => {
  return (
    <div className="flex flex-col md:gap-6">
      <div className="bg-stone-100/90 shadow-sm p-2 md:p-6">
        <div className={`${poppins.className} flex flex-col gap-4`}>
          <h1 className="text-base md:text-2xl">Cartera de cuero</h1>
          <h3 className="text-sm md:text-lg">$100.000</h3>
          <Separator className="h-[.5px] bg-slate-300" />
          <div className="flex justify-between w-full">
            <h2 className="text-sm">Color</h2>
            <h3 className="text-sm">Marrón</h3>
          </div>
          <Separator className="h-[.5px] bg-slate-300" />
          <Image
            src={"/bag.png"}
            alt="Cartera de cuero Horse Brand"
            width={70}
            height={70}
          />
          <Separator className="h-[.5px] bg-slate-300" />
          <Button className="w-1/2 self-center rounded-none text-sm font-light my-4 cursor-pointer hidden md:block">
            <HiOutlineShoppingBag />
            Agregar al Carrito
          </Button>
          <div className="flex flex-col gap-2 text-neutral-500 font-light text-sm max-w-[80%]">
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste
              dolore perspiciatis minima beatae praesentium aliquam fuga
              consequuntur qui rerum tempore, officiis eos non, nam aperiam hic,
              harum distinctio quas veniam nostrum error sapiente cumque ut!
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
              Guardar en un lugar seco, evitar exposición prolongada al sol y
              limpiar únicamente con paños suaves ligeramente humedecidos. No
              usar solventes ni productos abrasivos.
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
              Cuero vacuno seleccionado, herrajes metálicos en tono níquel,
              forrería interna en algodón y costuras reforzadas en puntos de
              tensión.
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
              Podés agregar una tarjeta con mensaje personalizado y envolver el
              producto en nuestro packaging especial para regalo. Consultanos
              por opciones de envío directo a la persona agasajada.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};
