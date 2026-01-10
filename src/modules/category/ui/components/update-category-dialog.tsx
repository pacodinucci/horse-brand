import { ResponsiveDialog } from "@/components/responsive-dialog";
import { CategoryForm } from "./category-form";
import { CategoryGetOne } from "../../types";

interface UpdateAgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues: CategoryGetOne | null;
}

export const UpdateCategoryDialog = ({
  open,
  onOpenChange,
  initialValues,
}: UpdateAgentDialogProps) => {
  return (
    <ResponsiveDialog
      title="Editar Categoría"
      description="Actualiza los detalles de categoría"
      open={open}
      onOpenChange={onOpenChange}
    >
      <CategoryForm
        onSuccess={() => onOpenChange(false)}
        onCancel={() => onOpenChange(false)}
        initialValues={initialValues}
      />
    </ResponsiveDialog>
  );
};
