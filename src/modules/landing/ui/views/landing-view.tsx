"use client";

import { useState } from "react";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { ProductGallery } from "../components/product-gallery";
import { ProductDetails } from "../components/product-details";
import { CartButton } from "../components/cart-button";

export const LandingView = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.products.getMany.queryOptions({}));

  const [selectedProductId, setSelectedProductId] = useState<string>("");

  const selectedProduct = data?.items.find(
    (item) => item.id === selectedProductId
  );

  console.log("SELECTED --> ", selectedProduct);

  return (
    <div className="flex gap-16 min-h-screen px-8 py-6 relative">
      <div className="absolute top-5 right-5">
        <CartButton />
      </div>
      <div>
        <Select
          value={selectedProductId}
          onValueChange={(value) => setSelectedProductId(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccioná un producto" />
          </SelectTrigger>
          <SelectContent>
            {data?.items.map((product) => (
              <SelectItem value={product.id} key={product.id}>
                {product.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <h1 className="text-3xl text-neutral-800">{selectedProduct?.name}</h1>
        <div className="flex gap-6">
          <ProductGallery
            images={selectedProduct?.images}
            name={selectedProduct?.name}
          />
          <ProductDetails product={selectedProduct} />
        </div>
      </div>
    </div>
  );
};

export const LandingViewLoadingState = () => {
  return (
    <LoadingState
      title="Cargando productos"
      description="Esto puede demorar unos segundos."
    />
  );
};

export const LandingViewErrorState = () => {
  return (
    <ErrorState
      title="Error al cargar productos"
      description="Algo salió mal."
    />
  );
};
