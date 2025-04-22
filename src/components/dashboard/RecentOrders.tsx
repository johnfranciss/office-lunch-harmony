
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { getOrders } from "@/lib/supabase/orders";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";

export function RecentOrders() {
  const { data: orders = [], isLoading, error } = useQuery({
    queryKey: ['orders'],
    queryFn: getOrders
  });

  const recentOrders = [...orders].sort(
    (a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
  ).slice(0, 5);

  const getPaymentStatusDetails = (status: string) => {
    switch (status) {
      case "completed":
        return { label: "Completed", variant: "outline", classes: "bg-green-50 text-food-green-dark border-food-green" };
      case "employee-debt":
        return { label: "Employee Debt", variant: "outline", classes: "bg-red-50 text-red-700 border-red-200" };
      case "office-credit":
        return { label: "Office Credit", variant: "outline", classes: "bg-amber-50 text-amber-700 border-amber-200" };
      default:
        return { label: status, variant: "outline", classes: "" };
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>
            Latest lunch orders placed in the system
          </CardDescription>
        </div>
        <Link to="/orders">
          <Badge variant="secondary">View All</Badge>
        </Link>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Items</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <TableRow key={`loading-${index}`}>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                </TableRow>
              ))
            ) : error ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  Error loading recent orders
                </TableCell>
              </TableRow>
            ) : recentOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              recentOrders.map((order) => {
                const statusDetails = getPaymentStatusDetails(order.paymentStatus);
                
                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.employee?.name}</TableCell>
                    <TableCell>
                      {format(new Date(order.orderDate), "MMM d, h:mm a")}
                    </TableCell>
                    <TableCell>
                      {order.items.length} {order.items.length === 1 ? "item" : "items"}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(order.total)}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline"
                        className={cn(statusDetails.classes)}
                      >
                        {statusDetails.label}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
