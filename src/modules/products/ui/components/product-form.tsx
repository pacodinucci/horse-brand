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
import { ImageUpload } from "@/components/image-upload";
import Image from "next/image";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { AttributeInput } from "./attribute-input";
import { Checkbox } from "@/components/ui/checkbox";

const ATTRIBUTES = [
  { key: "colors", label: "Color" },
  { key: "size", label: "Talle" },
  { key: "material", label: "Material" },
  { key: "dimensions", label: "Medida" },
];

export interface ProductFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialValues?: {
    id?: string;
    name: string;
    categoryId: string;
    subCategoryId: string;
    images?: string[];
    attributes?: Record<string, string[]>;
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

  const [activeAttributes, setActiveAttributes] = useState<string[]>([]);

  useEffect(() => {
    if (initialValues?.attributes) {
      setActiveAttributes(
        Object.keys(initialValues.attributes).filter(
          (key) =>
            Array.isArray(initialValues.attributes?.[key]) &&
            initialValues.attributes?.[key].length > 0
        )
      );
    }
  }, [initialValues]);

  // Consulta categorías y subcategorías
  const { data: categories } = useSuspenseQuery(
    trpc.category.getMany.queryOptions({})
  );
  const { data: subcategories } = useSuspenseQuery(
    trpc.subcategory.getMany.queryOptions({})
  );

  const createProduct = useMutation(
    // @ts-expect-error Type instantiation is excessively deep and possibly infinite
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

  const form = useForm({
    resolver: zodResolver(productsInsertSchema),
    defaultValues: {
      name: initialValues?.name ?? "",
      categoryId: initialValues?.categoryId ?? "",
      subCategoryId: initialValues?.subCategoryId ?? "",
      images: initialValues?.images ?? [],
      attributes: initialValues?.attributes ?? {},
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
        <div className="flex gap-x-40 items-center">
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
        </div>
        <div className="p-4 rounded-md bg-[var(--var-blue-grey)]/20">
          <div className="flex flex-col gap-y-1 mb-4">
            <p className="text-sm">Atributos del producto</p>
            <p className="text-xs text-neutral-600">
              Seleccionar solo los que corresponden
            </p>
          </div>
          {ATTRIBUTES.map((attr) => (
            <div
              key={attr.key}
              className="mb-4 flex justify-center flex-col gap-2"
            >
              <div className="flex gap-x-2 items-center">
                <Checkbox
                  checked={activeAttributes.includes(attr.key)}
                  onCheckedChange={(checked) => {
                    setActiveAttributes((current) => {
                      if (checked) {
                        return [...current, attr.key];
                      } else {
                        const attrs = { ...form.getValues("attributes") };
                        delete attrs[attr.key];
                        form.setValue("attributes", attrs);
                        return current.filter((k) => k !== attr.key);
                      }
                    });
                  }}
                  className="bg-white data-[state=checked]:bg-[var(--var-brown)] data-[state=checked]:border-[var(--var-brown)]"
                  id={`checkbox-${attr.key}`}
                />
                <label
                  htmlFor={`checkbox-${attr.key}`}
                  className="text-sm cursor-pointer select-none"
                >
                  {attr.label}
                </label>
              </div>
              {activeAttributes.includes(attr.key) && (
                <FormField
                  name={`attributes.${attr.key}`}
                  control={form.control}
                  render={({ field }) => (
                    <AttributeInput
                      label={attr.label}
                      values={field.value ?? []}
                      onChange={field.onChange}
                    />
                  )}
                />
              )}
            </div>
          ))}
        </div>
        <FormField
          name="images"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Imágenes</FormLabel>
              <div className="flex flex-wrap gap-2 max-w-[460px]">
                {(field.value ?? []).map((imgUrl: string, idx: number) => (
                  <div key={imgUrl + idx} className="relative w-20 h-20">
                    {/* <img
                      src={imgUrl}
                      alt={`Imagen ${idx + 1}`}
                      className="object-cover w-20 h-20"
                    /> */}
                    <Image
                      src={imgUrl}
                      alt={`Imagen ${idx + 1}`}
                      width={80} // w-20 = 80px
                      height={80}
                      className="object-cover w-20 h-20 rounded"
                      style={{ width: 80, height: 80 }} // Para evitar warnings con layout
                    />
                    <button
                      type="button"
                      className="absolute top-0 right-0 bg-[var(--var-red)] text-white rounded-full w-5 h-5 p-1 flex items-center justify-center"
                      onClick={() => {
                        const updated = (field.value ?? []).filter(
                          (_, i) => i !== idx
                        );
                        field.onChange(updated);
                      }}
                      title="Quitar"
                    >
                      <X />
                    </button>
                  </div>
                ))}
                {/* Botón de agregar imagen */}
                <div className="w-20 h-20 flex items-center justify-center">
                  <ImageUpload
                    key={(field.value ?? []).length}
                    value=""
                    onChange={(url) => {
                      if (!url) return;
                      field.onChange([...(field.value ?? []), url]);
                    }}
                  />
                </div>
              </div>
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
