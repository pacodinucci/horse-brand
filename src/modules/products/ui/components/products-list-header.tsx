"use client";

// import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { DEFAULT_PAGE } from "@/constants";

export const ProductsListHeader = () => {
  //   const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      {/* <NewAgentsDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} /> */}
      <div className="py-4 px-4 md:px-8 flex flex-col gap-y-4">
        <div className="flex items-center justify-between">
          <h5 className="font-medium text-xl">Productos</h5>
          <Button onClick={() => {}}>
            <PlusIcon />
            Nuevo Producto
          </Button>
        </div>
      </div>
    </>
  );
};
