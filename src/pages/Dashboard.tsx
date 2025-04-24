
import { DashboardCards } from "@/components/dashboard/DashboardCards";
import { RecentOrders } from "@/components/dashboard/RecentOrders";
import { MainLayout } from "@/components/layout/MainLayout";
import { useQuery } from "@tanstack/react-query";
import { getOrders } from "@/lib/supabase/orders";

export default function Dashboard() {
  // Pre-fetch orders to avoid multiple fetches across components
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: getOrders
  });

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
