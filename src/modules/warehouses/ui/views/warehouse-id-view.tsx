"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { WarehouseForm } from "../components/warehouse-form";
import { WarehouseStock } from "../components/warehouse-stock";
import { WarehouseIdViewHeader } from "../components/warehouse-id-view-header";

interface WarehouseIdViewProps {
  warehouseId?: string;
}

export const WarehouseIdView = ({ warehouseId }: WarehouseIdViewProps) => {
  const trpc = useTRPC();

  const { data, error } = useSuspenseQuery(
    trpc.warehouse.getOne.queryOptions({ id: warehouseId || "__NO_ID__" })
  );

  if (!warehouseId || error?.data?.code === "NOT_FOUND" || data == null) {
    return <WarehouseForm />;
  }

  return (
    <div className="px-8 py-4">
      <WarehouseIdViewHeader warehouseName={data.name} />
      <WarehouseStock
        warehouseLocation={data.location}
        warehouseName={data.name}
      />
    </div>
  );
};
