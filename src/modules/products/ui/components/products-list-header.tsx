"use client";

// import { useState } from "react";
import { PlusIcon, Tags } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
// import { DEFAULT_PAGE } from "@/constants";

export const ProductsListHeader = () => {
  const router = useRouter();
  //   const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      {/* <NewAgentsDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} /> */}
      <div className="py-4 px-4 md:px-8 flex flex-col gap-y-4">
        <div className="flex items-center justify-between">
          <h5 className="font-medium text-xl">Productos</h5>
          <div className="flex gap-x-2">
            <Button
              onClick={() => router.push("/backoffice/category")}
              className="cursor-pointer bg-[var(--var-teal)] hover:bg-[var(--var-teal)]/80"
            >
              <Tags />
              Administrar Categorías
            </Button>
            <Button
              onClick={() => router.push("/backoffice/products/new")}
              className="cursor-pointer bg-[var(--var-brick)] hover:bg-[var(--var-brick)]/80"
            >
              <PlusIcon />
              Nuevo Producto
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
