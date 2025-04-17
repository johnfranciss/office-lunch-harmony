
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Users, Coffee, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  description?: string;
  icon: React.ElementType;
  colorClass?: string;
}

function StatCard({ title, value, description, icon: Icon, colorClass }: StatCardProps) {
  return (
    <Card>
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
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Orders Today"
        value="12"
        description="↗ 12% from yesterday"
        icon={FileText}
        colorClass="text-food-orange"
      />
      <StatCard
        title="Active Employees"
        value="24"
        icon={Users}
        colorClass="text-food-green"
      />
      <StatCard
        title="Menu Items"
        value="32"
        description="5 seasonal items"
        icon={Coffee}
        colorClass="text-food-orange-dark"
      />
      <StatCard
        title="Pending Payments"
        value="$127.50"
        description="3 employees with debt"
        icon={AlertCircle}
        colorClass="text-destructive"
      />
    </div>
  );
}
