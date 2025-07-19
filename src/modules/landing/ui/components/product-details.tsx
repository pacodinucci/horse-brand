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
  price: number;
  image?: string;
  quantity: number;
  attributes: Record<string, string>;
  sku?: string;
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
        quantity: number;
        attributes: Record<string, string[]>;
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
  const cart = useCartStore((state) => state.items);

  console.log(cart);

  if (!product) return null;

  console.log(product);

  const handleAttrChange = (attr: string, value: string) => {
    setSelectedAttrs((prev) => ({ ...prev, [attr]: value }));
  };

  const allAttributesSelected = Object.keys(product.attributes).every(
    (attrKey) => !!selectedAttrs[attrKey]
  );

  const selectedVariant = product?.ProductVariant.find(
    (variant) =>
      Object.entries(variant.attributes).every(
        ([k, v]) => selectedAttrs[k] === v
      ) && allAttributesSelected
  );

  const handleAddToCart = () => {
    if (!selectedVariant) return;

    if (!product) return;

    addItem({
      id: selectedVariant.id,
      name: product.name,
      price: product.price!,
      image: product.images![0],
      quantity: quantity,
      attributes: selectedVariant.attributes,
    });
  };

  return (
    <div className="flex flex-col gap-4 bg-white p-6 rounded-xl shadow border min-w-[320px]">
      <div>
        <span className="text-2xl font-bold text-neutral-800">
          {/* {selectedVariant
            ? `$${selectedVariant.price?.toLocaleString("es-AR")}`
            : "Seleccioná una variante"} */}
          ${product.price?.toLocaleString("es-AR")}
        </span>
      </div>
      <div className="text-base text-neutral-600">
        <span className="font-semibold">Categoría: </span>
        {product.category?.name ?? "-"}
        <br />
        <span className="font-semibold">Subcategoría: </span>
        {product.subCategory?.name ?? "-"}
      </div>
      {/* Selectores de atributos */}
      <div className="flex gap-2">
        {Object.entries(product.attributes).map(([attrKey, options]) => (
          <div key={attrKey} className="flex flex-col">
            <span className="font-semibold text-xs">{attrKey}</span>
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
      <div>
        <span className="font-semibold text-neutral-700">Descripción:</span>
        <p className="text-neutral-700 mt-1">
          {product.description ?? "Sin descripción disponible."}
        </p>
      </div>
      {/* Selector de cantidad (opcional) */}
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
      <Button
        onClick={handleAddToCart}
        disabled={!selectedVariant}
        className="mt-2"
      >
        Agregar al carrito
      </Button>
    </div>
  );
}
