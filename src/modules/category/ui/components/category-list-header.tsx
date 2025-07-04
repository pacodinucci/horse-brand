"use client";

import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NewCategoryDialog } from "./new-category-dialog";
// import { DEFAULT_PAGE } from "@/constants";

export const CategoryListHeader = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <NewCategoryDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      <div className="py-4 px-4 md:px-8 flex flex-col gap-y-4">
        <div className="flex items-center justify-between">
          <h5 className="font-medium text-xl">Categorías</h5>
          <div className="flex gap-x-2">
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="cursor-pointer bg-[var(--var-brick)] hover:bg-[var(--var-brick)]/80"
            >
              <PlusIcon />
              Nueva Categoría
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
