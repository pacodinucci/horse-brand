import { useState } from "react";
import { useCartStore } from "@/store/cart";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

interface ProductVariant {
  id: string;
  price?: number;
  image?: string;
  quantity?: number;
  color?: string | null;
  material?: string | null;
  measure?: string | null;
  attributes?: Record<string, string>;
  sku: string | null;
}

interface ProductDetailsProps {
  product:
    | {
        id: string;
        name: string;
        price?: number;
        images?: string[];
        category?: { name: string } | null;
        subCategory?: { name: string } | null;
        description?: string | null;
        quantity?: number;
        // attributes: Record<string, string[]>;
        colors?: string[];
        materials?: string[];
        measures?: string[];
        ProductVariant: ProductVariant[];
      }
    | undefined;
  //   onAddToCart?: () => void;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedAttrs, setSelectedAttrs] = useState<Record<string, string>>(
    {}
  );
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  if (!product) return null;

  // Mapeo plural -> singular para comparar con variant.attributes
  const keyMap: Record<string, string> = {
    colors: "color",
    materials: "material",
    measures: "measure",
  };

  // Armar estructura de selects solo con arrays que tengan opciones
  const attrsForUI: Record<string, string[]> = {};
  if (product.colors?.length) attrsForUI.colors = product.colors;
  if (product.materials?.length) attrsForUI.materials = product.materials;
  if (product.measures?.length) attrsForUI.measures = product.measures;

  const requiredKeys = Object.keys(attrsForUI);
  const allAttributesSelected = requiredKeys.every((k) => !!selectedAttrs[k]);

  const hasVariants = (product.ProductVariant?.length ?? 0) > 0;

  // Buscar variante que matchee los atributos seleccionados (usando singulares)
  // const selectedVariant = hasVariants
  //   ? product.ProductVariant.find((variant) =>
  //       requiredKeys.every((kPlural) => {
  //         const kSing = keyMap[kPlural] ?? kPlural;
  //         return (
  //           selectedAttrs[kPlural] &&
  //           variant.attributes?.[kSing] === selectedAttrs[kPlural]
  //         );
  //       })
  //     )
  //   : undefined;

  const selectedVariant = hasVariants
    ? product.ProductVariant.find((variant) =>
        requiredKeys.every((kPlural) => {
          const kSing = keyMap[kPlural] ?? kPlural;
          const chosen = selectedAttrs[kPlural];
          if (!chosen) return false;

          // valor real de la variante según el campo
          const fromFields =
            kSing === "color"
              ? variant.color ?? undefined
              : kSing === "material"
              ? variant.material ?? undefined
              : kSing === "measure"
              ? variant.measure ?? undefined
              : undefined;

          const fromAttributes = variant.attributes?.[kSing];

          const vVal = fromFields ?? fromAttributes; // prioridad a campos nuevos
          return vVal === chosen;
        })
      )
    : undefined;

  const priceToShow = selectedVariant?.price ?? product.price ?? 0;
  const canAdd = hasVariants
    ? !!selectedVariant && allAttributesSelected
    : true;

  const handleAttrChange = (attrPlural: string, value: string) => {
    setSelectedAttrs((prev) => ({ ...prev, [attrPlural]: value }));
  };

  const handleAddToCart = () => {
    if (!canAdd) return;

    // Normalizar atributos para guardar en el carrito con claves en singular
    // const normalizedAttrs: Record<string, string> = {};
    // for (const [kPlural, v] of Object.entries(selectedAttrs)) {
    //   normalizedAttrs[keyMap[kPlural] ?? kPlural] = v;
    // }

    // Normalizar atributos (guardamos en singular)
    const normalizedAttrs: Record<string, string> = {};

    // elegidos por el usuario (plural → singular)
    for (const [kPlural, v] of Object.entries(selectedAttrs)) {
      const kSing = keyMap[kPlural] ?? kPlural;
      normalizedAttrs[kSing] = v;
    }

    // si hay variante, mergeamos lo que traiga
    if (selectedVariant) {
      if (selectedVariant.color) normalizedAttrs.color = selectedVariant.color;
      if (selectedVariant.material)
        normalizedAttrs.material = selectedVariant.material;
      if (selectedVariant.measure)
        normalizedAttrs.measure = selectedVariant.measure;
      if (selectedVariant.attributes)
        Object.assign(normalizedAttrs, selectedVariant.attributes);
    }

    addItem({
      id: selectedVariant?.id ?? product.id, // si no hay variantes, usar id de producto
      name: product.name,
      price: priceToShow,
      image: product.images?.[0],
      quantity,
      attributes: hasVariants ? selectedVariant!.attributes : normalizedAttrs,
    });
  };

  return (
    <div className="flex flex-col gap-4 bg-white p-6 rounded-xl shadow border min-w-[320px]">
      <div>
        <span className="text-2xl font-bold text-neutral-800">
          ${priceToShow.toLocaleString("es-AR")}
        </span>
      </div>

      <div className="text-base text-neutral-600">
        <span className="font-semibold">Categoría: </span>
        {product.category?.name ?? "-"}
        <br />
        <span className="font-semibold">Subcategoría: </span>
        {product.subCategory?.name ?? "-"}
      </div>

      {/* Selectores de atributos (solo si hay opciones) */}
      {Object.keys(attrsForUI).length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {Object.entries(attrsForUI).map(([attrKey, options]) => (
            <div key={attrKey} className="flex flex-col">
              <span className="font-semibold text-xs">
                {attrKey === "colors"
                  ? "Color"
                  : attrKey === "materials"
                  ? "Material"
                  : attrKey === "measures"
                  ? "Medida"
                  : attrKey}
              </span>
              <Select
                value={selectedAttrs[attrKey] || ""}
                onValueChange={(value) => handleAttrChange(attrKey, value)}
              >
                <SelectTrigger className="bg-white min-w-[110px]">
                  <SelectValue placeholder={`Elegí ${attrKey}`} />
                </SelectTrigger>
                <SelectContent>
                  {options.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      )}

      <div>
        <span className="font-semibold text-neutral-700">Descripción:</span>
        <p className="text-neutral-700 mt-1">
          {product.description ?? "Sin descripción disponible."}
        </p>
      </div>

      <div className="flex gap-2 items-center">
        <span className="text-sm">Cantidad:</span>
        <input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="w-16 p-1 border rounded"
        />
      </div>

      <Button onClick={handleAddToCart} disabled={!canAdd} className="mt-2">
        Agregar al carrito
      </Button>
    </div>
  );
}
