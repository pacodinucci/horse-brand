import { ResponsiveDialog } from "@/components/responsive-dialog";
import { WarehouseForm } from "./warehouse-form";

interface NewWarehouseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NewWarehouseDialog = ({
  open,
  onOpenChange,
}: NewWarehouseDialogProps) => {
  return (
    <ResponsiveDialog
      title="Nuevo Depósito"
      description="Crear un nuevo depósito"
      open={open}
      onOpenChange={onOpenChange}
    >
      <WarehouseForm
        onSuccess={() => onOpenChange(false)}
        onCancel={() => onOpenChange(false)}
      />
    </ResponsiveDialog>
  );
};
