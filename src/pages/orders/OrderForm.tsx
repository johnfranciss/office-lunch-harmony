
import { OrderForm as OrderFormComponent } from "@/components/orders/OrderForm";
import { MainLayout } from "@/components/layout/MainLayout";
import { useParams } from "react-router-dom";

export default function OrderFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  return (
    <MainLayout>
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isEditMode ? "Edit Order" : "New Order"}
          </h1>
          <p className="text-muted-foreground">
            {isEditMode ? "Update an existing order" : "Create a new lunch order"}
          </p>
        </div>
        
        <OrderFormComponent />
      </div>
    </MainLayout>
  );
}
