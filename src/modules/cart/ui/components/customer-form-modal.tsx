"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { customerInsertSchema } from "../../../customers/schemas";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface CustomerFormModalProps {
  email: string;
  onClose: () => void;
}

export const CustomerFormModal = ({
  email,
  onClose,
}: CustomerFormModalProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof customerInsertSchema>>({
    resolver: zodResolver(customerInsertSchema),
    defaultValues: {
      name: "",
      address: "",
      email: email || "",
    },
  });

  const mutation = useMutation(
    trpc.customers.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries();
        toast.success("Datos guardados correctamente.");
        onClose();
      },
      onError: (err) => {
        toast.error(err.message || "Error al guardar los datos");
      },
    })
  );

  const onSubmit = (values: z.infer<typeof customerInsertSchema>) => {
    mutation.mutate(values);
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-8 min-w-[350px]">
        <h2 className="text-xl font-bold mb-2">Tus datos</h2>
        <p className="mb-4 text-neutral-600 text-sm">
          Completá tus datos para continuar con la compra.
        </p>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Tu nombre completo" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="address"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Dirección de envío" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2 mt-4">
              <Button
                type="submit"
                className="flex-1"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Guardando..." : "Guardar y continuar"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                disabled={mutation.isPending}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
