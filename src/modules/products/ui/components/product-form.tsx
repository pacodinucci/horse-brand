"use client";

import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CategoryGetOne } from "@/modules/category/types";
import { SubcategoryGetOne } from "@/modules/subcategory/types";

export interface ProductFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialValues?: {
    id?: string;
    name: string;
    categoryId: string;
    subCategoryId: string;
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

  // Consulta categorías y subcategorías
  const { data: categories } = useSuspenseQuery(
    trpc.category.getMany.queryOptions({})
  );
  const { data: subcategories } = useSuspenseQuery(
    trpc.subcategory.getMany.queryOptions({})
  );

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
      categoryId: initialValues?.categoryId ?? "",
      subCategoryId: initialValues?.subCategoryId ?? "",
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

  const categoryId = form.watch("categoryId");

  const filteredSubcategories =
    subcategories?.items?.filter(
      (sub: SubcategoryGetOne) => sub.categoryId === categoryId
    ) ?? [];

  return (
    <Form {...form}>
      <form
        className="space-y-4 py-4 max-w-3xl"
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
                <Input
                  {...field}
                  placeholder="Nombre del producto"
                  className="bg-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="categoryId"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoría</FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isPending}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.items?.map((cat: CategoryGetOne) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="subCategoryId"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subcategoría</FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isPending || !categoryId}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Seleccionar subcategoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredSubcategories.map((sub: SubcategoryGetOne) => (
                      <SelectItem key={sub.id} value={sub.id}>
                        {sub.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
