"use client";

import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useTRPC } from "@/trpc/client";
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
  categoryWithSubsInsertSchema,
  categoryWithSubsUpdateSchema,
} from "../../schemas";

// Schemas
// const subcategorySchema = z.object({
//   name: z.string().min(1, "El nombre es requerido"),
//   description: z.string().optional().nullable(),
// });

// export const categoryWithSubsInsertSchema = z.object({
//   name: z.string().min(1, "El nombre es requerido"),
//   description: z.string().optional().nullable(),
//   subcategories: z
//     .array(subcategorySchema)
//     .min(1, "Agrega al menos una subcategoría"),
// });

// export const categoryWithSubsUpdateSchema = categoryWithSubsInsertSchema.extend(
//   {
//     id: z.string().min(1, "Id requerido"),
//   }
// );

export interface CategoryFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialValues?: {
    id?: string;
    name: string;
    description?: string | null;
    subcategories: { id?: string; name: string; description?: string | null }[];
  } | null;
}

export function CategoryForm({
  onSuccess,
  onCancel,
  initialValues,
}: CategoryFormProps) {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const isEdit = !!initialValues?.id;

  // Mutation con TRPC (asumí que tenés backend preparado)
  const createCategory = useMutation(
    trpc.category.createWithSubcategories.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.category.getMany.queryOptions({})
        );
        router.push("/backoffice/category");
        onSuccess?.();
      },
      onError: (error) => toast.error(error.message),
    })
  );

  const updateCategory = useMutation(
    trpc.category.updateWithSubcategories.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.category.getMany.queryOptions({})
        );
        if (initialValues?.id) {
          await queryClient.invalidateQueries(
            trpc.category.getOne.queryOptions({ id: initialValues.id })
          );
        }
        router.push("/backoffice/category");
        onSuccess?.();
      },
      onError: (error) => toast.error(error.message),
    })
  );

  // Formulario y subcategorías dinámicas
  const form = useForm<
    z.infer<
      typeof categoryWithSubsInsertSchema | typeof categoryWithSubsUpdateSchema
    >
  >({
    resolver: zodResolver(
      // isEdit ? categoryWithSubsUpdateSchema : categoryWithSubsInsertSchema
      categoryWithSubsInsertSchema
    ),
    defaultValues: {
      name: initialValues?.name ?? "",
      description: initialValues?.description ?? "",
      subcategories: initialValues?.subcategories?.length
        ? initialValues.subcategories
        : [{ name: "", description: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "subcategories",
  });

  const isPending = createCategory.isPending || updateCategory.isPending;

  const onSubmit = (
    values: z.infer<
      typeof categoryWithSubsInsertSchema | typeof categoryWithSubsUpdateSchema
    >
  ) => {
    if (isEdit && initialValues?.id) {
      updateCategory.mutate({ ...values, id: initialValues.id });
    } else {
      createCategory.mutate(
        values as z.infer<typeof categoryWithSubsInsertSchema>
      );
    }
  };

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
              <FormLabel>Nombre de la categoría</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Nombre de la categoría"
                  className="bg-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="description"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Descripción (opcional)"
                  className="bg-white"
                  value={field.value ?? ""} // <-- esto lo fuerza a string
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm">Subcategorías</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ name: "", description: "" })}
              className="ml-2"
            >
              + Agregar subcategoría
            </Button>
          </div>
          <div className="space-y-2 mt-2">
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2 items-end">
                <FormField
                  name={`subcategories.${index}.name`}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Nombre subcategoría"
                          className="bg-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* <FormField
                  name={`subcategories.${index}.description`}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Descripción</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Descripción (opcional)"
                          className="bg-white"
                          value={field.value ?? ""} // <-- esto lo fuerza a string
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => remove(index)}
                  className="mb-2"
                  disabled={fields.length === 1}
                >
                  Quitar
                </Button>
              </div>
            ))}
          </div>
        </div>

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
}
