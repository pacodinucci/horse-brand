"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";
import { stockInsertSchema } from "../../schemas";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

type ProductForStockForm = {
  id: string;
  name: string;
  categoryId: string;
  subCategoryId: string;
  images: string[];
  //   attributes: Record<string, string[]> | null | undefined;
  attributes: unknown;
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    name: string;
  };
  subCategory: {
    id: string;
    name: string;
  };
};

// type WarehouseForStockForm = {
//   id: string;
//   name: string;
// };

export interface StockFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialValues?: {
    id?: string;
    productId: string;
    warehouseId: string;
    quantity: number;
    attributes?: Record<string, string>;
  };
}

export const StockForm = ({
  onSuccess,
  onCancel,
  initialValues,
}: StockFormProps) => {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  // Traé los productos y depósitos (warehouses)
  const { data: productsData } = useSuspenseQuery(
    trpc.products.getMany.queryOptions({})
  );
  const { data: warehousesData } = useSuspenseQuery(
    trpc.warehouse.getMany.queryOptions({})
  );

  // Estado y búsqueda tipados
  const [selectedProduct, setSelectedProduct] = useState<
    ProductForStockForm | undefined
  >(undefined);

  const isEdit = !!initialValues?.id;

  const form = useForm({
    resolver: zodResolver(stockInsertSchema),
    defaultValues: {
      id: initialValues?.id ?? undefined,
      productId: initialValues?.productId ?? "",
      warehouseId: initialValues?.warehouseId ?? "",
      quantity: initialValues?.quantity ?? 0,
      attributes: initialValues?.attributes ?? {},
    },
  });

  // Seleccioná el producto cuando cambia el id
  useEffect(() => {
    const idActual = form.watch("productId") || initialValues?.productId;
    const found = productsData?.items.find((p) => p.id === idActual);
    setSelectedProduct(found);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productsData, form.watch("productId")]);

  const createStock = useMutation(
    trpc.stock.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.stock.getMany.queryOptions({})
        );
        router.push("/backoffice/stock");
        onSuccess?.();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const updateStock = useMutation(
    trpc.stock.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.stock.getMany.queryOptions({})
        );
        router.push("/backoffice/stock");
        onSuccess?.();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const isPending = createStock.isPending;

  // const onSubmit = form.handleSubmit((values) => {
  //   createStock.mutate({
  //     ...values,
  //     quantity: Number(values.quantity),
  //   });
  // });

  const onSubmit = form.handleSubmit((values) => {
    if (isEdit && initialValues?.id) {
      updateStock.mutate({
        ...values,
        id: initialValues.id,
        // warehouseId: values.warehouseId,
        // quantity: Number(values.quantity),
        // sku: values.sku,
        // attributes: values.attributes,
      });
    } else {
      createStock.mutate({
        ...values,
        quantity: Number(values.quantity),
      });
    }
  });

  // Atributos dinámicos según el producto seleccionado
  const renderAttributes = () => {
    if (!selectedProduct?.attributes) return null;
    return Object.entries(selectedProduct.attributes).map(
      ([attrKey, options]) => (
        <FormField
          key={attrKey}
          name={`attributes.${attrKey}`}
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{attrKey}</FormLabel>
              <FormControl>
                <Select
                  value={field.value || ""}
                  onValueChange={field.onChange}
                  disabled={isPending}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={`Seleccionar ${attrKey}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {options.map((option: string) => (
                      <SelectItem value={option} key={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )
    );
  };

  return (
    <Form {...form}>
      <form className="space-y-4 py-4 max-w-3xl" onSubmit={onSubmit}>
        {/* Producto */}
        <FormField
          name="productId"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Producto</FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    setSelectedProduct(
                      productsData?.items.find((p) => p.id === value)
                    );
                  }}
                  disabled={isPending}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Seleccionar producto" />
                  </SelectTrigger>
                  <SelectContent>
                    {productsData?.items.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Warehouse */}
        <FormField
          name="warehouseId"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Depósito</FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isPending}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Seleccionar depósito" />
                  </SelectTrigger>
                  <SelectContent>
                    {warehousesData?.items.map((w) => (
                      <SelectItem key={w.id} value={w.id}>
                        {w.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Atributos dinámicos */}
        {renderAttributes()}

        {/* Cantidad */}
        <FormField
          name="quantity"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cantidad</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  {...field}
                  onChange={(e) => {
                    field.onChange(Number(e.target.value));
                  }}
                  className="bg-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between gap-x-2">
          {onCancel && (
            <Button
              variant="ghost"
              disabled={isPending}
              type="button"
              onClick={onCancel}
            >
              Cancelar
            </Button>
          )}
          <Button disabled={isPending} type="submit">
            {isEdit ? "Actualizar Stock" : "Guardar Stock"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
