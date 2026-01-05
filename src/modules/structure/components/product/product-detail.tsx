"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

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
import { useCartStore } from "@/store/cart";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

type ProductDetailProduct = {
  id: string;
  name: string;
  price: number;
  images: string[];
  colors: string[];
  materials: string[];
  measures: string[];
  supplier: string;
  description?: string | null;
};

export type ProductDetailProps = {
  product: ProductDetailProduct;
  heroImage?: string;
};

const formatPriceARS = (value: number) =>
  value.toLocaleString("es-AR", { style: "currency", currency: "ARS" });

const LOREM18 =
  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste dolore perspiciatis minima beatae praesentium aliquam.";

function normalizeOptions(arr?: string[]) {
  return (arr ?? [])
    .map((s) => s?.trim())
    .filter(Boolean)
    .filter((v, i, self) => self.indexOf(v) === i);
}

function OptionAccordionRow({
  label,
  value,
  options,
  itemValue,
  isOpen,
  onToggle,
  onSelect,
}: {
  label: string;
  value: string | null;
  options: string[];
  itemValue: string; // id del AccordionItem
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (v: string) => void;
}) {
  if (!options.length) return null;

  // Si hay 1 sola opción, lo mostramos como texto (sin acordeón)
  if (options.length === 1) {
    return (
      <>
        <div className="flex justify-between w-full my-2">
          <h2 className="text-sm">{label}</h2>
          <h3 className="text-sm">{options[0]}</h3>
        </div>
        <Separator className="h-[.5px] bg-slate-300" />
      </>
    );
  }

  return (
    <>
      <AccordionItem value={itemValue} className="border-0">
        <AccordionTrigger
          // Mantengo el look de tus triggers y evito subrayado si tu lib lo agrega
          className="p-0 no-underline hover:no-underline"
          onClick={(e) => {
            // Trigger ya maneja el open/close, pero esto te permite controlar el estado externo si querés
            e.stopPropagation();
            onToggle();
          }}
        >
          <div className="flex justify-between w-full items-center mb-2">
            <h2 className="text-sm font-normal">{label}</h2>

            <div className="flex items-center gap-2">
              <h3 className="text-sm font-normal text-neutral-700">
                {value ?? "—"}
              </h3>
              <ChevronDown
                className={[
                  "ml-1 h-4 w-4 shrink-0 transition-transform duration-300",
                  isOpen ? "rotate-180" : "rotate-0",
                ].join(" ")}
              />
            </div>
          </div>
        </AccordionTrigger>

        <AccordionContent className="pt-3 pb-2">
          <div className="flex flex-col gap-2">
            {options.map((opt) => {
              const active = opt === value;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(opt);
                  }}
                  className={[
                    "text-left text-sm font-light",
                    active ? "text-neutral-900" : "text-neutral-600",
                  ].join(" ")}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </AccordionContent>
      </AccordionItem>

      <Separator className="h-[.5px] bg-slate-300" />
    </>
  );
}

export const ProductDetail = ({ product, heroImage }: ProductDetailProps) => {
  const addItem = useCartStore((state) => state.addItem);

  const imageSrc = heroImage || product.images?.[0] || "/bag.png";

  const colors = useMemo(
    () => normalizeOptions(product.colors),
    [product.colors]
  );
  const materials = useMemo(
    () => normalizeOptions(product.materials),
    [product.materials]
  );
  const measures = useMemo(
    () => normalizeOptions(product.measures),
    [product.measures]
  );

  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [selectedMeasure, setSelectedMeasure] = useState<string | null>(null);

  // Un solo acordeón abierto a la vez (como en tu ejemplo).
  const [openAttr, setOpenAttr] = useState<string>("");

  const trpc = useTRPC();

  const enabled =
    Boolean(product.id) &&
    (colors.length === 0 || Boolean(selectedColor)) &&
    (materials.length === 0 || Boolean(selectedMaterial)) &&
    (measures.length === 0 || Boolean(selectedMeasure));

  const { data: availability, isFetching } = useQuery({
    ...trpc.stock.getAvailabilityBySelection.queryOptions({
      productId: product.id,
      color: selectedColor ?? undefined,
      material: selectedMaterial ?? undefined,
      measure: selectedMeasure ?? undefined,
    }),
    enabled,
  });

  const availableStock = availability?.available ?? 0;
  const hasStock = !isFetching && availableStock > 0;

  // Defaults (primer valor) al montar / cambiar producto
  useEffect(() => {
    setSelectedColor(colors[0] ?? null);
    setSelectedMaterial(materials[0] ?? null);
    setSelectedMeasure(measures[0] ?? null);
    setOpenAttr("");
  }, [product.id]); // importantísimo

  const description =
    (typeof product.description === "string" && product.description.trim()) ||
    LOREM18;

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: imageSrc,
      quantity: 1,
      // productVariantId,
      // si tu CartItem lo permite, acá conviene persistir selecciones:
      // color: selectedColor,
      // material: selectedMaterial,
      // measure: selectedMeasure,
    });
  };

  return (
    <div className="flex flex-col md:gap-6">
      <div className="bg-stone-100/90 shadow-sm p-2 md:p-6">
        <div className={`${poppins.className} flex flex-col gap-4`}>
          <h1 className="text-base md:text-2xl">{product.name}</h1>
          <h3 className="text-sm md:text-lg">
            {formatPriceARS(product.price)}
          </h3>

          <Separator className="h-[.5px] bg-slate-300" />

          {/* Acordeón de atributos (solo si existen) */}
          <Accordion
            type="single"
            collapsible
            value={openAttr}
            onValueChange={setOpenAttr}
            className="w-full"
          >
            <OptionAccordionRow
              label="Color"
              value={selectedColor}
              options={colors}
              itemValue="color"
              isOpen={openAttr === "color"}
              onToggle={() =>
                setOpenAttr((v) => (v === "color" ? "" : "color"))
              }
              onSelect={(v) => {
                setSelectedColor(v);
                setOpenAttr(""); // cerrar al seleccionar
              }}
            />

            <OptionAccordionRow
              label="Material"
              value={selectedMaterial}
              options={materials}
              itemValue="material"
              isOpen={openAttr === "material"}
              onToggle={() =>
                setOpenAttr((v) => (v === "material" ? "" : "material"))
              }
              onSelect={(v) => {
                setSelectedMaterial(v);
                setOpenAttr("");
              }}
            />

            <OptionAccordionRow
              label="Medidas"
              value={selectedMeasure}
              options={measures}
              itemValue="measures"
              isOpen={openAttr === "measures"}
              onToggle={() =>
                setOpenAttr((v) => (v === "measures" ? "" : "measures"))
              }
              onSelect={(v) => {
                setSelectedMeasure(v);
                setOpenAttr("");
              }}
            />
          </Accordion>

          <div className="flex justify-between w-full my-2">
            <h2 className="text-sm">Stock</h2>
            <h3 className="text-sm">
              {isFetching
                ? "Consultando..."
                : hasStock
                ? `${availableStock}`
                : "Sin stock"}
            </h3>
          </div>

          <Separator className="h-[.5px] bg-slate-300" />

          {/* Mini imagen (la dejo como estaba tu layout) */}
          <Image
            src={imageSrc}
            alt={`${product.name} Horse Brand`}
            width={70}
            height={70}
          />

          <Separator className="h-[.5px] bg-slate-300" />

          <Button
            disabled={isFetching || !hasStock}
            className={[
              "w-1/2 self-center rounded-none text-sm font-light my-4 hidden md:flex items-center",
              !hasStock ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
            ].join(" ")}
            onClick={handleAddToCart}
          >
            <HiOutlineShoppingBag />
            {hasStock ? "Agregar al Carrito" : "Sin stock"}
          </Button>

          <div className="flex flex-col gap-2 text-neutral-500 font-light text-sm max-w-[80%]">
            <p>{description}</p>
            <p>Lorem ipsum dolor sit amet.</p>
            <p>Lorem ipsum</p>
          </div>
        </div>
      </div>

      {/* Tu segundo bloque de acordeón (cuidado/detalles/regalo) queda igual */}
      <div className="bg-stone-100/90 shadow-sm p-6">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="cuidado">
            <AccordionTrigger className="text-lg font-medium uppercase tracking-wider flex items-center justify-between">
              <p>Cuidado del producto</p>
              <ChevronDown className="ml-2 h-5 w-5 shrink-0 transition-transform duration-400 group-data-[state=open]:rotate-180" />
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
              <ChevronDown className="ml-2 h-5 w-5 shrink-0 transition-transform duration-400 group-data-[state=open]:rotate-180" />
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
              <ChevronDown className="ml-2 h-5 w-5 shrink-0 transition-transform duration-400 group-data-[state=open]:rotate-180" />
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
