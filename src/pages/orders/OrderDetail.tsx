
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { MainLayout } from "@/components/layout/MainLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Check, ClipboardCheck } from "lucide-react";
import { formatCurrency, formatDateTime } from "@/lib/formatters";
import { getOrderById } from "@/lib/supabase/orders";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isMarkingAsPaid, setIsMarkingAsPaid] = useState(false);

  const { data: order, isLoading, error } = useQuery({
    queryKey: ['order', id],
    queryFn: () => id ? getOrderById(id) : null,
    enabled: !!id
  });

  const markChangePaidMutation = useMutation({
    mutationFn: async () => {
      if (!id) return;
      
      const { error } = await supabase
        .from('orders')
        .update({ 
          payment_status: 'completed',
          change_amount: 0 
        })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', id] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Change has been marked as paid');
    },
    onError: (error) => {
      console.error('Error marking change as paid:', error);
      toast.error('Failed to mark change as paid');
    },
    onSettled: () => {
      setIsMarkingAsPaid(false);
    }
  });

  const handleMarkChangePaid = () => {
    setIsMarkingAsPaid(true);
    markChangePaidMutation.mutate();
  };

  const getPaymentStatusDetails = (status: string) => {
    switch (status) {
      case "completed":
        return { 
          label: "Completed", 
          variant: "outline", 
          classes: "bg-green-50 text-food-green-dark border-food-green",
          icon: <Check className="mr-1 h-4 w-4 text-food-green-dark" /> 
        };
      case "employee-debt":
        return { 
          label: "Employee Debt", 
          variant: "outline", 
          classes: "bg-red-50 text-red-700 border-red-200" 
        };
      case "office-credit":
        return { 
          label: "Office Credit", 
          variant: "outline", 
          classes: "bg-amber-50 text-amber-700 border-amber-200" 
        };
      default:
        return { label: status, variant: "outline", classes: "" };
    }
  };

  if (error) {
    return (
      <MainLayout>
        <div className="space-y-4">
          <Button variant="ghost" onClick={() => navigate("/orders")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Button>
          
          <Card>
            <CardHeader>
              <CardTitle>Error</CardTitle>
              <CardDescription>
                There was an error loading the order details.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => navigate("/orders")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Orders
        </Button>
        
        <div className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Order Details</CardTitle>
                    {!isLoading && order && (
                      <CardDescription>
                        Order #{order.id.substring(0, 8)}
                      </CardDescription>
                    )}
                  </div>
                  {isLoading ? (
                    <Skeleton className="h-8 w-24" />
                  ) : order && (
                    <Badge 
                      variant="outline"
                      className={cn(getPaymentStatusDetails(order.paymentStatus).classes)}
                    >
                      {getPaymentStatusDetails(order.paymentStatus).icon}
                      {getPaymentStatusDetails(order.paymentStatus).label}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ) : order ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Employee</p>
                        <p className="font-medium">{order.employee?.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Date & Time</p>
                        <p className="font-medium">{formatDateTime(order.orderDate)}</p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-medium mb-2">Order Items</h3>
                      <div className="border rounded-md">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Item</TableHead>
                              <TableHead className="text-right">Price</TableHead>
                              <TableHead className="text-center">Qty</TableHead>
                              <TableHead className="text-right">Total</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {order.items.map((item) => (
                              <TableRow key={item.id}>
                                <TableCell>{item.menuItem?.name}</TableCell>
                                <TableCell className="text-right">
                                  {formatCurrency(item.unitPrice)}
                                </TableCell>
                                <TableCell className="text-center">{item.quantity}</TableCell>
                                <TableCell className="text-right">
                                  {formatCurrency(item.totalPrice)}
                                </TableCell>
                              </TableRow>
                            ))}
                            <TableRow>
                              <TableCell colSpan={3} className="text-right font-medium">
                                Order Total:
                              </TableCell>
                              <TableCell className="text-right font-medium">
                                {formatCurrency(order.total)}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-center py-4">Order not found</p>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div>
            {isLoading ? (
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </CardContent>
              </Card>
            ) : order ? (
              <Card>
                <CardHeader>
                  <CardTitle>Payment Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Amount Paid</p>
                        <p className="font-medium">{formatCurrency(order.amountPaid)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Order Total</p>
                        <p className="font-medium">{formatCurrency(order.total)}</p>
                      </div>
                      
                      <div className="col-span-2">
                        <p className="text-sm text-muted-foreground">Change Amount</p>
                        <p className="font-medium">
                          {formatCurrency(order.changeAmount)}
                        </p>
                      </div>
                      
                      <div className="col-span-2">
                        <p className="text-sm text-muted-foreground">Status</p>
                        <p className="font-medium">
                          {order.paymentStatus === "completed" && "✅ Completed"}
                          {order.paymentStatus === "employee-debt" && "🔴 Employee Debt"}
                          {order.paymentStatus === "office-credit" && "🔴 Office Credit"}
                        </p>
                      </div>
                    </div>
                    
                    {(order.paymentStatus === "employee-debt" || order.paymentStatus === "office-credit") && (
                      <>
                        <Separator />
                        <Button 
                          className="w-full bg-food-green hover:bg-food-green-dark"
                          onClick={handleMarkChangePaid}
                          disabled={isMarkingAsPaid}
                        >
                          <ClipboardCheck className="mr-2 h-4 w-4" />
                          {isMarkingAsPaid ? "Processing..." : 
                            order.paymentStatus === "employee-debt" 
                              ? "Mark Debt as Paid" 
                              : "Mark Office Credit as Settled"}
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
