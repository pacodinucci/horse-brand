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
import { useState } from "react";
import { AttributeInput } from "./attribute-input";
import { Checkbox } from "@/components/ui/checkbox";

export interface ProductFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialValues?: {
    id?: string;
    name: string;
    categoryId: string;
    subCategoryId: string;
    images?: string[];
    // reemplaza attributes por campos reales:
    colors?: string[];
    materials?: string[];
    measures?: string[];
    price: number;
    // si en tu modelo usás supplier, podés incluirlo aquí:
    supplier?: string;
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

  // Checkboxes individuales (sin ATTRIBUTES)
  const [showColors, setShowColors] = useState<boolean>(
    (initialValues?.colors?.length ?? 0) > 0
  );
  const [showMaterials, setShowMaterials] = useState<boolean>(
    (initialValues?.materials?.length ?? 0) > 0
  );
  const [showMeasures, setShowMeasures] = useState<boolean>(
    (initialValues?.measures?.length ?? 0) > 0
  );

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

  const unionSchema = productsInsertSchema.or(productsUpdateSchema);

  const form = useForm({
    resolver: zodResolver(unionSchema),
    defaultValues: {
      name: initialValues?.name ?? "",
      categoryId: initialValues?.categoryId ?? "",
      subCategoryId: initialValues?.subCategoryId ?? "",
      images: initialValues?.images ?? [],
      colors: initialValues?.colors ?? [],
      materials: initialValues?.materials ?? [],
      measures: initialValues?.measures ?? [],
      price: initialValues?.price ?? 0,
      supplier: initialValues?.supplier ?? "",
      ...(initialValues?.id ? { id: initialValues.id } : {}),
    },
  });

  // const form = useForm<
  //   z.infer<typeof productsInsertSchema | typeof productsUpdateSchema>
  // >({
  //   resolver: zodResolver(productsInsertSchema),
  //   defaultValues: {
  //     name: initialValues?.name ?? "",
  //     categoryId: initialValues?.categoryId ?? "",
  //     subCategoryId: initialValues?.subCategoryId ?? "",
  //     images: initialValues?.images ?? [],
  //     // campos reales:
  //     colors: initialValues?.colors ?? [],
  //     materials: initialValues?.materials ?? [],
  //     measures: initialValues?.measures ?? [],
  //     price: initialValues?.price ?? 0,
  //     // opcional:
  //     // @ts-ignore si no existe en tu schema, simplemente quítalo
  //     supplier: initialValues?.supplier ?? "",
  //   } as any,
  // });

  const isPending = createProduct.isPending || updateProduct.isPending;

  const onSubmit = (
    values: z.infer<typeof productsInsertSchema | typeof productsUpdateSchema>
  ) => {
    // Si un toggle está en off, mandamos []
    const payload = {
      ...values,
      colors: showColors ? values.colors ?? [] : [],
      materials: showMaterials ? values.materials ?? [] : [],
      measures: showMeasures ? values.measures ?? [] : [],
    };

    if (isEdit && initialValues?.id) {
      updateProduct.mutate({ ...payload, id: initialValues.id });
    } else {
      createProduct.mutate(payload);
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
        {/* Nombre */}
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

        {/* Categoría / Subcategoría */}
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

        {/* Atributos reales con toggles individuales */}
        <div className="p-4 rounded-md bg-[var(--var-blue-grey)]/10">
          <div className="flex flex-col gap-y-1 mb-4">
            <p className="text-sm">Atributos del producto</p>
            <p className="text-xs text-neutral-600">
              Activá sólo los que correspondan
            </p>
          </div>

          {/* Colors */}
          <div className="mb-4 flex flex-col gap-2">
            <div className="flex gap-x-2 items-center">
              <Checkbox
                id="chk-colors"
                checked={showColors}
                onCheckedChange={(c) => {
                  const checked = Boolean(c);
                  setShowColors(checked);
                  if (!checked) form.setValue("colors", []);
                }}
                className="bg-white data-[state=checked]:bg-[var(--var-brown)] data-[state=checked]:border-[var(--var-brown)]"
              />
              <label
                htmlFor="chk-colors"
                className="text-sm cursor-pointer select-none"
              >
                Colores
              </label>
            </div>

            {showColors && (
              <FormField
                name="colors"
                control={form.control}
                render={({ field }) => (
                  <AttributeInput
                    label="Colores"
                    values={(field.value as string[]) ?? []}
                    onChange={field.onChange}
                  />
                )}
              />
            )}
          </div>

          {/* Materials */}
          <div className="mb-4 flex flex-col gap-2">
            <div className="flex gap-x-2 items-center">
              <Checkbox
                id="chk-materials"
                checked={showMaterials}
                onCheckedChange={(c) => {
                  const checked = Boolean(c);
                  setShowMaterials(checked);
                  if (!checked) form.setValue("materials", []);
                }}
                className="bg-white data-[state=checked]:bg-[var(--var-brown)] data-[state=checked]:border-[var(--var-brown)]"
              />
              <label
                htmlFor="chk-materials"
                className="text-sm cursor-pointer select-none"
              >
                Materiales
              </label>
            </div>

            {showMaterials && (
              <FormField
                name="materials"
                control={form.control}
                render={({ field }) => (
                  <AttributeInput
                    label="Materiales"
                    values={(field.value as string[]) ?? []}
                    onChange={field.onChange}
                  />
                )}
              />
            )}
          </div>

          {/* Measures */}
          <div className="mb-4 flex flex-col gap-2">
            <div className="flex gap-x-2 items-center">
              <Checkbox
                id="chk-measures"
                checked={showMeasures}
                onCheckedChange={(c) => {
                  const checked = Boolean(c);
                  setShowMeasures(checked);
                  if (!checked) form.setValue("measures", []);
                }}
                className="bg-white data-[state=checked]:bg-[var(--var-brown)] data-[state=checked]:border-[var(--var-brown)]"
              />
              <label
                htmlFor="chk-measures"
                className="text-sm cursor-pointer select-none"
              >
                Medidas
              </label>
            </div>

            {showMeasures && (
              <FormField
                name="measures"
                control={form.control}
                render={({ field }) => (
                  <AttributeInput
                    label="Medidas"
                    values={(field.value as string[]) ?? []}
                    onChange={field.onChange}
                  />
                )}
              />
            )}
          </div>
        </div>

        {/* Precio */}
        <FormField
          name="price"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Precio</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  step={1}
                  {...field}
                  value={field.value ?? ""}
                  placeholder="Precio"
                  className="bg-white"
                  onChange={(e) => {
                    // Solo enteros
                    const val =
                      e.target.value === "" ? "" : parseInt(e.target.value, 10);
                    field.onChange(Number.isNaN(val as number) ? "" : val);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Imágenes */}
        <FormField
          name="images"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Imágenes</FormLabel>
              <div className="flex flex-wrap gap-2 max-w-[460px]">
                {(field.value ?? []).map((imgUrl: string, idx: number) => (
                  <div key={imgUrl + idx} className="relative w-20 h-20">
                    <Image
                      src={imgUrl}
                      alt={`Imagen ${idx + 1}`}
                      width={80}
                      height={80}
                      className="object-cover w-20 h-20 rounded"
                      style={{ width: 80, height: 80 }}
                    />
                    <button
                      type="button"
                      className="absolute top-0 right-0 bg-[var(--var-red)] text-white rounded-full w-5 h-5 p-1 flex items-center justify-center"
                      onClick={() => {
                        const updated = (field.value ?? []).filter(
                          (_: string, i: number) => i !== idx
                        );
                        field.onChange(updated);
                      }}
                      title="Quitar"
                    >
                      <X />
                    </button>
                  </div>
                ))}
                {/* Agregar imagen */}
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
