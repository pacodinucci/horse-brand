"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { customerInsertSchema } from "@/modules/customers/schemas";

const checkoutSchema = z.object({
  location: z.string().min(1, "Seleccioná una ubicación"), // country
  firstName: z.string().min(1, "Ingresá tu nombre"),
  lastName: z.string().min(1, "Ingresá tus apellidos"),
  company: z.string().optional(),
  address1: z.string().min(1, "Ingresá tu dirección"),
  city: z.string().min(1, "Ingresá tu ciudad"),
  postalCode: z.string().min(1, "Ingresá tu código postal"),
  phonePrefix: z.string().min(1, "Elegí un indicativo"),
  phoneNumber: z.string().min(1, "Ingresá tu número"),
});

type CheckoutValues = z.infer<typeof checkoutSchema>;
type CustomerValues = z.infer<typeof customerInsertSchema>;

export const CheckoutForm = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [savedValues, setSavedValues] = useState<CheckoutValues | null>(null);

  const form = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      location: "Argentina",
      firstName: "",
      lastName: "",
      company: "",
      address1: "",
      city: "",
      postalCode: "",
      phonePrefix: "+54",
      phoneNumber: "",
    },
  });

  const mutation = useMutation(trpc.customers.create.mutationOptions());

  const onSubmit = (values: CheckoutValues) => {
    // TODO: reemplazar esto por el email real (logged user, campo extra, etc.)
    const email: string = "cliente@example.com";

    const payload: CustomerValues = {
      // ---- Campos requeridos en Customer ----
      name: `${values.firstName} ${values.lastName}`.trim(),
      email,

      // ---- Opcionales ----
      phone: `${values.phonePrefix} ${values.phoneNumber}`.trim(),
      address: values.address1,
      city: values.city,
      // si agregás un campo "state" al form, podés mapearlo acá
      state: undefined,
      country: values.location,
      zipCode: values.postalCode,
    };

    mutation.mutate(payload, {
      onSuccess: () => {
        queryClient.invalidateQueries();
        toast.success("Datos guardados correctamente.");
        setSavedValues(values); // mostramos el resumen
      },
      onError: (err) => {
        toast.error(err.message || "Error al guardar los datos");
      },
    });
  };

  const handleEdit = () => {
    if (savedValues) form.reset(savedValues);
    setSavedValues(null);
  };

  return (
    <div className="bg-zinc-50 px-6 py-6 max-w-4xl">
      <h2 className="text-[15px] font-medium mb-2">Dirección de entrega</h2>
      <div className="h-px bg-[#cbcaca] mb-6" />

      {/* -------- RESUMEN -------- */}
      {savedValues && (
        <div className="space-y-4 text-sm text-neutral-800">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-[0.18em] text-neutral-600">
              Nombre y apellidos
            </span>
            <span>
              {savedValues.firstName} {savedValues.lastName}
            </span>
          </div>

          {savedValues.company && (
            <div className="flex flex-col gap-1">
              <span className="text-[11px] uppercase tracking-[0.18em] text-neutral-600">
                Empresa
              </span>
              <span>{savedValues.company}</span>
            </div>
          )}

          <div className="flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-[0.18em] text-neutral-600">
              Dirección
            </span>
            <span>{savedValues.address1}</span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-[0.18em] text-neutral-600">
              Ciudad y código postal
            </span>
            <span>
              {savedValues.postalCode} {savedValues.city}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-[0.18em] text-neutral-600">
              País
            </span>
            <span>{savedValues.location}</span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-[0.18em] text-neutral-600">
              Teléfono
            </span>
            <span>
              {savedValues.phonePrefix} {savedValues.phoneNumber}
            </span>
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              className="px-6 py-3 rounded-sm text-[11px] tracking-[0.18em] uppercase"
              onClick={handleEdit}
            >
              Modificar
            </Button>
            <Button
              type="button"
              variant="default"
              className="px-6 py-3 rounded-sm text-[11px] tracking-[0.18em] uppercase"
            >
              Continuar con el pago
            </Button>
          </div>
        </div>
      )}

      {/* -------- FORM -------- */}
      {!savedValues && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Ubicación */}
            <FormField
              name="location"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="text-[11px] uppercase tracking-[0.18em] text-neutral-600">
                      Ubicación *
                    </span>
                    <span className="text-[11px] text-neutral-400">
                      * Información necesaria
                    </span>
                  </div>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full rounded-none border-[#cbcaca] bg-white">
                        <SelectValue placeholder="Seleccioná un país" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Argentina">Argentina</SelectItem>
                        <SelectItem value="Uruguay">Uruguay</SelectItem>
                        <SelectItem value="Chile">Chile</SelectItem>
                        <SelectItem value="Paraguay">Paraguay</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Nombre / Apellidos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                name="firstName"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[11px] uppercase tracking-[0.18em] text-neutral-600">
                      Nombre *
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="rounded-none border-[#cbcaca] bg-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="lastName"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[11px] uppercase tracking-[0.18em] text-neutral-600">
                      Apellidos *
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="rounded-none border-[#cbcaca] bg-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Empresa */}
            <FormField
              name="company"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[11px] uppercase tracking-[0.18em] text-neutral-600">
                    Empresa
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="rounded-none border-[#cbcaca] bg-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Dirección */}
            <FormField
              name="address1"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[11px] uppercase tracking-[0.18em] text-neutral-600">
                    Dirección *
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="rounded-none border-[#cbcaca] bg-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Ciudad */}
            <FormField
              name="city"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[11px] uppercase tracking-[0.18em] text-neutral-600">
                    Ciudad *
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="rounded-none border-[#cbcaca] bg-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Código postal */}
            <FormField
              name="postalCode"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[11px] uppercase tracking-[0.18em] text-neutral-600">
                    Código postal *
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="rounded-none border-[#cbcaca] bg-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Indicativo + Teléfono */}
            <div>
              <div className="mb-1">
                <span className="text-[11px] uppercase tracking-[0.18em] text-neutral-600">
                  Indicativo *
                </span>
              </div>
              <div className="flex">
                <div className="w-24">
                  <FormField
                    name="phonePrefix"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="w-full rounded-none border-[#cbcaca] bg-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="+34">+34</SelectItem>
                              <SelectItem value="+33">+33</SelectItem>
                              <SelectItem value="+39">+39</SelectItem>
                              <SelectItem value="+54">+54</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex-1">
                  <FormField
                    name="phoneNumber"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="ml-2">
                        <FormLabel className="sr-only">
                          Número de teléfono
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Número de teléfono *"
                            className="rounded-none border-[#cbcaca] bg-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Botón guardar */}
            <div className="pt-4 flex justify-end">
              <Button
                type="submit"
                disabled={mutation.isPending}
                className="
                  px-10 py-3 rounded-sm
                  bg-zinc-800 text-white
                  text-[11px] tracking-[0.18em] uppercase
                  hover:bg-neutral-900
                  transition-colors cursor-pointer
                "
              >
                {mutation.isPending ? "Guardando..." : "GUARDAR"}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
