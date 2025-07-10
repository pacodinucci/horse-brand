"use client";

import { useRouter } from "next/navigation";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { ProdcutIdViewHeader } from "../components/product-id-view-header";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/use-confirm";
import { ProductForm } from "../components/product-form";
import { normalizeAttributes } from "@/lib/helpers";

interface ProductIdViewProps {
  productId: string;
}

export const ProductIdView = ({ productId }: ProductIdViewProps) => {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data } = useSuspenseQuery(
    trpc.products.getOne.queryOptions({ id: productId })
  );

  // Borrado
  const removeProduct = useMutation(
    trpc.products.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.products.getMany.queryOptions({})
        );
        router.push("/backoffice/products");
        toast.success("Producto eliminado correctamente");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  // Confirmación de borrado
  const [RemoveConfirmation, confirmRemove] = useConfirm(
    "¿Estás seguro?",
    `Esta acción eliminará el producto "${data.name}".`
  );

  const handleRemoveProduct = async () => {
    const ok = await confirmRemove();
    if (!ok) return;
    await removeProduct.mutateAsync({ id: productId });
  };

  return (
    <>
      <RemoveConfirmation />
      <div className="px-8 py-4">
        <ProdcutIdViewHeader
          productName={data.name}
          onRemove={handleRemoveProduct}
        />
        <ProductForm
          initialValues={{
            ...data,
            attributes: normalizeAttributes(data.attributes),
          }}
        />
      </div>
    </>
  );
};

export const ProductIdViewLoading = () => (
  <LoadingState
    title="Cargando producto"
    description="Esto puede tardar unos segundos..."
  />
);

export const ProductIdViewError = () => (
  <ErrorState title="Error al cargar producto" description="Algo salió mal." />
);
