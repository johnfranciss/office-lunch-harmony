import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/formatters";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getOrderById } from "@/lib/supabase/orders";
import { Order } from "@/types";
import { MainLayout } from "@/components/layout/MainLayout";

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { data: orderData, isLoading: isOrderLoading, error: orderError } = useQuery({
    queryKey: ['order', id],
    queryFn: () => getOrderById(id as string),
    enabled: !!id,
  });

  useEffect(() => {
    if (orderData) {
      setOrder(orderData);
      setIsLoading(false);
    }

    if (orderError) {
      setError(orderError);
      setIsLoading(false);
    }
  }, [orderData, orderError]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-full">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading order details...
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-full text-red-500">
          Error: {error.message}
        </div>
      </MainLayout>
    );
  }

  if (!order) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-full">
          Order not found.
        </div>
      </MainLayout>
    );
  }

  const { employee, items, total, amountPaid, changeAmount, paymentStatus, orderDate, createdAt, updatedAt } = order;

  return (
    <MainLayout>
      <div className="space-y-4">
        <div>
          <Button variant="ghost" onClick={() => navigate("/orders")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Button>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
            <CardDescription>
              View details for order #{order.id}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold">Employee Information</h3>
                <p className="text-sm text-muted-foreground">Name: {employee?.name}</p>
                <p className="text-sm text-muted-foreground">Phone: {employee?.phone_number || 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Order Information</h3>
                <p className="text-sm text-muted-foreground">Order Date: {formatDate(new Date(orderDate))}</p>
                <p className="text-sm text-muted-foreground">Created At: {formatDateTime(new Date(createdAt))}</p>
                <p className="text-sm text-muted-foreground">Updated At: {formatDateTime(new Date(updatedAt))}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Order Items</h3>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-center">Quantity</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.menuItem?.name}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                        <TableCell className="text-center">{item.quantity}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.totalPrice)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3} className="text-right font-medium">
                        Order Total:
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(total)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="border rounded-md p-4 bg-muted/30">
              <h3 className="text-lg font-semibold">Payment Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Amount Paid</p>
                  <p className="font-medium">{formatCurrency(amountPaid)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Change</p>
                  <p className="font-medium">{formatCurrency(changeAmount)}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Payment Status</p>
                  <p className="font-medium">
                    {paymentStatus === "completed" && "✅ Completed"}
                    {paymentStatus === "employee-debt" && "🔴 Employee Debt"}
                    {paymentStatus === "office-credit" && "🔴 Office Credit"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
