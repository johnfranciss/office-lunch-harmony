import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Users, Coffee, FileText, ShoppingBag, CreditCard, ArrowUpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Order } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { getOrders } from "@/lib/supabase/orders";
import { useNavigate } from "react-router-dom";
import { 
  calculateCashInHand,
  calculateOfficeDebt,
  calculateEmployeeDebt,
  calculateItemsSummary
} from "@/lib/dashboard-utils";

interface StatCardProps {
  title: string;
  value: string;
  description?: string;
  icon: React.ElementType;
  colorClass?: string;
  onClick?: () => void;
}

function StatCard({ title, value, description, icon: Icon, colorClass, onClick }: StatCardProps) {
  return (
    <Card 
      className={cn(onClick && "cursor-pointer hover:bg-muted/50 transition-colors")}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={cn("h-4 w-4", colorClass)} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  );
}

export function DashboardCards() {
  const navigate = useNavigate();
  const [selectedView, setSelectedView] = useState<string | null>(null);
  const { data: orders = [] } = useQuery({
    queryKey: ['orders'],
    queryFn: getOrders
  });

  const cashInHand = calculateCashInHand(orders);
  const officeDebt = calculateOfficeDebt(orders);
  const employeeDebt = calculateEmployeeDebt(orders);
  const itemsSummary = calculateItemsSummary(orders);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todaysOrders = orders.filter(order => 
    new Date(order.orderDate) >= today
  ).length;
  
  const uniqueEmployees = new Set(orders.map(order => order.employeeId));
  
  const handleViewChange = (view: string) => {
    setSelectedView(view);
  };
  
  const handleBack = () => {
    setSelectedView(null);
  };

  const { CashInHandDetails } = require("./CashInHandDetails");
  const { OfficeDebtDetails } = require("./OfficeDebtDetails");
  const { EmployeeDebtDetails } = require("./EmployeeDebtDetails");
  const { ItemsSummary } = require("./ItemsSummary");
  
  if (selectedView === "cashInHand") {
    return <CashInHandDetails orders={orders} onBack={handleBack} />;
  } else if (selectedView === "officeDebt") {
    return <OfficeDebtDetails orders={orders} onBack={handleBack} />;
  } else if (selectedView === "employeeDebt") {
    return <EmployeeDebtDetails orders={orders} onBack={handleBack} />;
  } else if (selectedView === "itemsSummary") {
    return <ItemsSummary orders={orders} onBack={handleBack} />;
  }
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Orders Today"
        value={todaysOrders.toString()}
        description={todaysOrders > 0 ? "Click to view today's orders" : "No orders today"}
        icon={FileText}
        colorClass="text-food-orange"
        onClick={() => navigate("/orders")}
      />
      <StatCard
        title="Active Employees"
        value={uniqueEmployees.size.toString()}
        icon={Users}
        colorClass="text-food-green"
        onClick={() => navigate("/employees")}
      />
      <StatCard
        title="Ordered Items Summary"
        value={`${itemsSummary.length} items`}
        description={`${itemsSummary.reduce((sum, item) => sum + item.totalQuantity, 0)} total quantity`}
        icon={Coffee}
        colorClass="text-food-orange-dark"
        onClick={() => handleViewChange("itemsSummary")}
      />
      <StatCard
        title="Cash in Hand"
        value={`Rs. ${cashInHand.toLocaleString()}`}
        description="Click for details"
        icon={ShoppingBag}
        colorClass="text-green-600"
        onClick={() => handleViewChange("cashInHand")}
      />
      <StatCard
        title="Office Boy Debt"
        value={`Rs. ${officeDebt.toLocaleString()}`}
        description={officeDebt > 0 ? "Click for details" : "No debts"}
        icon={CreditCard}
        colorClass="text-food-orange"
        onClick={() => handleViewChange("officeDebt")}
      />
      <StatCard
        title="Employee Debt"
        value={`Rs. ${employeeDebt.toLocaleString()}`}
        description={employeeDebt > 0 ? "Click for details" : "No debts"}
        icon={ArrowUpCircle}
        colorClass="text-destructive"
        onClick={() => handleViewChange("employeeDebt")}
      />
    </div>
  );
}
