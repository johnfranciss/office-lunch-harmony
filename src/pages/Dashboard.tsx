
import { DashboardCards } from "@/components/dashboard/DashboardCards";
import { RecentOrders } from "@/components/dashboard/RecentOrders";
import { MainLayout } from "@/components/layout/MainLayout";

export default function Dashboard() {
  return (
    <MainLayout>
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Office Lunch Order Management System
          </p>
        </div>
        
        <DashboardCards />
        
        <RecentOrders />
      </div>
    </MainLayout>
  );
}
