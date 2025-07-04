"use client";

import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { NewWarehouseDialog } from "./new-warehouse-dialog";

export const WarehouseListHeader = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <NewWarehouseDialog onOpenChange={setIsDialogOpen} open={isDialogOpen} />
      <div className="py-4 px-4 md:px-8 flex flex-col gap-y-4">
        <div className="flex items-center justify-between">
          <h5 className="font-medium text-xl">Depósitos</h5>
          <Button onClick={() => setIsDialogOpen(true)}>
            <PlusIcon />
            Nuevo Depósito
          </Button>
        </div>
      </div>
    </>
  );
};
