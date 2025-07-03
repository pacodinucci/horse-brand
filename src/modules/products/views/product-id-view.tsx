"use client";

import { useTRPC } from "@/trpc/client";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { ProductForm } from "../ui/product-form";

interface ProductIdViewProps {
  productId?: string;
}

export const ProductIdView = ({ productId }: ProductIdViewProps) => {
  const trpc = useTRPC();
  //   const queryClient = useQueryClient();

  const { data } = useSuspenseQuery(
    trpc.products.getOne.queryOptions({ id: productId })
  );

  return (
    <div>
      <ProductForm initialValues={data} />
      {/* {data.name} */}
    </div>
  );
};
