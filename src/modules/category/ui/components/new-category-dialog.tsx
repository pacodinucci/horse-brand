import { ResponsiveDialog } from "@/components/responsive-dialog";
import { CategoryForm } from "./category-form";

interface NewAgentsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NewCategoryDialog = ({
  open,
  onOpenChange,
}: NewAgentsDialogProps) => {
  return (
    <ResponsiveDialog
      title="Nueva Categoría"
      description="Crear nueva categoría"
      open={open}
      onOpenChange={onOpenChange}
    >
      <CategoryForm
        onSuccess={() => onOpenChange(false)}
        onCancel={() => onOpenChange(false)}
      />
    </ResponsiveDialog>
  );
};
