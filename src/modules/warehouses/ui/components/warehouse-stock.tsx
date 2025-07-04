interface WarehouseStockProps {
  warehouseName: string;
  warehouseLocation: string | null;
}

export const WarehouseStock = ({
  warehouseName,
  warehouseLocation,
}: WarehouseStockProps) => {
  return (
    <div className="py-4 px-2">
      <div>
        <p className="text-3xl font-semibold text-neutral-800">
          {warehouseName}
        </p>
        <p className="text-lg font-medium text-neutral-600">
          {warehouseLocation}
        </p>
      </div>
      <div className="flex justify-center items-center min-h-60">
        Aca van todos los productos guardados en este depósito
      </div>
    </div>
  );
};
