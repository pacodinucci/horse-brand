"use client";

// import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
// import { DEFAULT_PAGE } from "@/constants";

export const StockListHeader = () => {
  const router = useRouter();
  //   const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      {/* <NewAgentsDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} /> */}
      <div className="py-4 px-4 md:px-8 flex flex-col gap-y-4">
        <div className="flex items-center justify-between">
          <h5 className="font-medium text-xl">Stock</h5>
          <div className="flex gap-x-2">
            <Button
              onClick={() => router.push("/backoffice/products/new")}
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
