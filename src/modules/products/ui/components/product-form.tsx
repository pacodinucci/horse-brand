"use client";

import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";
import { productsInsertSchema, productsUpdateSchema } from "../../schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface ProductFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialValues?: {
    id?: string;
    name: string;
    category: string;
    subCategory: string;
  };
}

export const ProductForm = ({
  onSuccess,
  onCancel,
  initialValues,
}: ProductFormProps) => {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const createProduct = useMutation(
    trpc.products.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.products.getMany.queryOptions({})
        );
        router.push("/backoffice/products");
        onSuccess?.();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const updateProduct = useMutation(
    trpc.products.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.products.getMany.queryOptions({})
        );
        if (initialValues?.id) {
          await queryClient.invalidateQueries(
            trpc.products.getOne.queryOptions({ id: initialValues.id })
          );
        }
        router.push("/backoffice/products");
        onSuccess?.();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const isEdit = !!initialValues?.id;

  const form = useForm<
    z.infer<typeof productsInsertSchema | typeof productsUpdateSchema>
  >({
    resolver: zodResolver(productsInsertSchema),
    defaultValues: {
      name: initialValues?.name ?? "",
      category: initialValues?.category ?? "",
      subCategory: initialValues?.subCategory ?? "",
    },
  });

  const isPending = createProduct.isPending || updateProduct.isPending;

  const onSubmit = (
    values: z.infer<typeof productsInsertSchema | typeof productsUpdateSchema>
  ) => {
    if (isEdit && initialValues?.id) {
      updateProduct.mutate({ ...values, id: initialValues.id });
    } else {
      createProduct.mutate(values);
    }
  };

  console.log("Renderizando ProductForm", { initialValues, isEdit });

  return (
    <Form {...form}>
      <form
        className="space-y-4"
        onSubmit={form.handleSubmit(onSubmit, (err) =>
          console.log("ERRORES", err)
        )}
      >
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Nombre del producto" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="category"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoría</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Categoría" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="subCategory"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subcategoría</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Subcategoría" />
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
            {isEdit ? "Actualizar" : "Crear"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
