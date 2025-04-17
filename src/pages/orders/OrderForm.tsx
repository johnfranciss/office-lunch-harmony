
import { OrderForm as OrderFormComponent } from "@/components/orders/OrderForm";
import { MainLayout } from "@/components/layout/MainLayout";

export default function OrderFormPage() {
  return (
    <MainLayout>
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">New Order</h1>
          <p className="text-muted-foreground">
            Create a new lunch order
          </p>
        </div>
        
        <OrderFormComponent />
      </div>
    </MainLayout>
  );
}
