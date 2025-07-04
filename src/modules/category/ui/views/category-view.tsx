"use client";

import { DataTable } from "@/components/data-table";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { columns } from "../components/columns";
import { UpdateCategoryDialog } from "../components/update-category-dialog";
import { useState } from "react";
import { CategoryGetOne } from "../../types";

export const CategoryView = () => {
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryGetOne | null>(null);

  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.category.getMany.queryOptions({}));

  return (
    <>
      <UpdateCategoryDialog
        open={!!selectedCategory}
        onOpenChange={(open) => {
          if (!open) setSelectedCategory(null);
        }}
        initialValues={selectedCategory}
      />
      <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
        <DataTable
          data={data.items}
          columns={columns}
          onRowClick={setSelectedCategory}
        />
        {/* <DataPagination /> */}
      </div>
    </>
  );
};

export const CategoryViewLoading = () => {
  return (
    <LoadingState
      title="Cargando Categorías"
      description="Esto puede tardar unos segundos..."
    />
  );
};

export const CategoryViewError = () => {
  return (
    <ErrorState
      title="Error al cargar categorías"
      description="Algo salió mal."
    />
  );
};
