
import { OrdersList as OrdersListComponent } from "@/components/orders/OrdersList";
import { MainLayout } from "@/components/layout/MainLayout";

export default function OrdersListPage() {
  return (
    <MainLayout>
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">
            View and manage lunch orders
          </p>
        </div>
        
        <OrdersListComponent />
      </div>
    </MainLayout>
  );
}
