
import { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Plus, Search } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { getOrders } from "@/lib/supabase/orders";
import { Order } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

export function OrdersList() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  
  const { data: orders = [], isLoading, error } = useQuery({
    queryKey: ['orders'],
    queryFn: getOrders
  });

  const filteredOrders = orders.filter(
    (order) => 
      (order.employee?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (order.id?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (order.paymentStatus?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

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

  if (error) {
    console.error("Error loading orders:", error);
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Orders</CardTitle>
          <CardDescription>
            There was an error loading orders. Please try again.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Orders</CardTitle>
          <CardDescription>
            View and manage lunch orders
          </CardDescription>
        </div>
        <Button 
          className="bg-food-orange hover:bg-food-orange-dark"
          onClick={() => navigate("/orders/new")}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Order
        </Button>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Employee</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={`loading-${index}`}>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8 rounded-full" /></TableCell>
                  </TableRow>
                ))
              ) : filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    {searchTerm ? "No orders match your search" : "No orders found"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => {
                  const statusDetails = getPaymentStatusDetails(order.paymentStatus);
                  
                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id.substring(0, 8)}...</TableCell>
                      <TableCell>{order.employee?.name}</TableCell>
                      <TableCell>{format(new Date(order.orderDate), "MMM d, h:mm a")}</TableCell>
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
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => navigate(`/orders/${order.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
