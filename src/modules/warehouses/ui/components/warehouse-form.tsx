"use client";

import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";
import { warehouseInsertSchema, warehouseUpdateSchema } from "../../schemas";
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
    location: string;
  };
}

export const WarehouseForm = ({
  onSuccess,
  onCancel,
  initialValues,
}: ProductFormProps) => {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const createWarehouse = useMutation(
    trpc.warehouse.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.warehouse.getMany.queryOptions({})
        );
        router.push("/backoffice/warehouses");
        onSuccess?.();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const updateWarehouse = useMutation(
    trpc.warehouse.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.warehouse.getMany.queryOptions({})
        );
        if (initialValues?.id) {
          await queryClient.invalidateQueries(
            trpc.warehouse.getOne.queryOptions({ id: initialValues.id })
          );
        }
        router.push("/backoffice/warehouses");
        onSuccess?.();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const isEdit = !!initialValues?.id;

  const form = useForm<
    z.infer<typeof warehouseInsertSchema | typeof warehouseUpdateSchema>
  >({
    resolver: zodResolver(warehouseInsertSchema),
    defaultValues: {
      name: initialValues?.name ?? "",
      location: initialValues?.location ?? "",
    },
  });

  const isPending = createWarehouse.isPending || updateWarehouse.isPending;

  const onSubmit = (
    values: z.infer<typeof warehouseInsertSchema | typeof warehouseUpdateSchema>
  ) => {
    if (isEdit && initialValues?.id) {
      updateWarehouse.mutate({ ...values, id: initialValues.id });
    } else {
      createWarehouse.mutate(values);
    }
  };

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
          name="location"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dirección</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Escribí la dirección del nuevo depósito"
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
            {isEdit ? "Actualizar" : "Crear"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
