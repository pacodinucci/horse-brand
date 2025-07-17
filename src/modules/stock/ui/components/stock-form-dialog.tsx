import { ResponsiveDialog } from "@/components/responsive-dialog";
import { StockForm, StockFormProps } from "./stock-form";

interface StockFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  initialValues?: StockFormProps["initialValues"];
}

export const StockFormDialog = ({
  open,
  onOpenChange,
  title,
  description,
  initialValues,
}: StockFormDialogProps) => {
  return (
    <ResponsiveDialog
      title={title}
      description={description}
      open={open}
      onOpenChange={onOpenChange}
    >
      <StockForm initialValues={initialValues} />
    </ResponsiveDialog>
  );
};
