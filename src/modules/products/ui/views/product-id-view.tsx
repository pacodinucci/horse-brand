"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
// import { ProductForm } from "../ui/product-form";
import { ProductForm } from "../components/product-form";

interface ProductIdViewProps {
  productId?: string;
}

export const ProductIdView = ({ productId }: ProductIdViewProps) => {
  const trpc = useTRPC();

  const { data, error } = useSuspenseQuery(
    trpc.products.getOne.queryOptions({ id: productId || "__NO_ID__" })
  );

  if (!productId || error?.data?.code === "NOT_FOUND" || data == null) {
    return <ProductForm />;
  }

  return (
    <div>
      <ProductForm initialValues={data} />
    </div>
  );
};
