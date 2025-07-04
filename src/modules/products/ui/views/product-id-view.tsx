"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ProductForm } from "../components/product-form";
import { ProdcutIdViewHeader } from "../components/product-id-view-header";

interface ProductIdViewProps {
  productId?: string;
}

export const ProductIdView = ({ productId }: ProductIdViewProps) => {
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(
    trpc.products.getOne.queryOptions({ id: productId || "__NO_ID__" })
  );

  return (
    <div className="px-8 py-4">
      <ProdcutIdViewHeader productName={data.name} />
      <ProductForm initialValues={data} />
    </div>
  );
};
