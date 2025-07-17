"use client";

// import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { useRouter } from "next/navigation";
import { useState } from "react";
import { StockFormDialog } from "./stock-form-dialog";
// import { DEFAULT_PAGE } from "@/constants";

export const StockListHeader = () => {
  // const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      {isDialogOpen && (
        <StockFormDialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            if (!open) setIsDialogOpen(false);
          }}
          title="Nuevo stock"
          description="Crear nuevo stock"
        />
      )}
      <div className="py-4 px-4 md:px-8 flex flex-col gap-y-4">
        <div className="flex items-center justify-between">
          <h5 className="font-medium text-xl">Stock</h5>
          <div className="flex gap-x-2">
            <Button
              // onClick={() => router.push("/backoffice/stock/new")}
              onClick={() => setIsDialogOpen(true)}
              className="cursor-pointer bg-[var(--var-brick)] hover:bg-[var(--var-brick)]/80"
            >
              <PlusIcon />
              Crear nuevo Stock
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
