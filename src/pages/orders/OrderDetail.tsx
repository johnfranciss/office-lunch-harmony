
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useParams, useNavigate } from "react-router-dom";
import { mockOrders } from "@/data/mockData";
import { formatCurrency, formatDateTime } from "@/lib/formatters";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2, Receipt, User } from "lucide-react";

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const order = mockOrders.find(order => order.id === id);

  if (!order) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <h1 className="text-2xl font-bold">Order Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The order you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate("/orders")}>
            Back to Orders
          </Button>
        </div>
      </MainLayout>
    );
  }

  const getPaymentStatusDetails = (status: string) => {
    switch (status) {
      case "completed":
        return { 
          label: "Completed",
          description: "Payment complete",
          classes: "bg-green-50 text-food-green-dark border-food-green",
          icon: CheckCircle2
        };
      case "employee-debt":
        return { 
          label: "Employee Debt", 
          description: `${order.employee?.name} owes ${formatCurrency(Math.abs(order.changeAmount))}`,
          classes: "bg-red-50 text-red-700 border-red-200",
          icon: AlertCircle
        };
      case "office-credit":
        return { 
          label: "Office Credit", 
          description: `Office owes ${order.employee?.name} ${formatCurrency(order.changeAmount)}`,
          classes: "bg-amber-50 text-amber-700 border-amber-200",
          icon: AlertCircle
        };
      default:
        return { 
          label: status, 
          description: "",
          classes: "",
          icon: CheckCircle2
        };
    }
  };

  const statusDetails = getPaymentStatusDetails(order.paymentStatus);

  const handleResolvePayment = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Resolve payment for order:", order.id);
      setIsLoading(false);
      navigate("/orders");
    }, 1000);
  };

  return (
    <MainLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Order Details
            </h1>
            <p className="text-muted-foreground">
              Order #{id}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate("/orders")}
          >
            Back to Orders
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" /> 
                Order Items
              </CardTitle>
              <CardDescription>
                Items included in this order
              </CardDescription>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Employee Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{order.employee?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Department</p>
                  <p>{order.employee?.department}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Order Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Order Date</p>
                  <p>{formatDateTime(order.orderDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payment Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge 
                      variant="outline"
                      className={cn(statusDetails.classes)}
                    >
                      {statusDetails.label}
                    </Badge>
                  </div>
                  {statusDetails.description && (
                    <p className="text-sm mt-1">{statusDetails.description}</p>
                  )}
                </div>
                <div className="pt-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Order Total</p>
                      <p className="font-medium">{formatCurrency(order.total)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Amount Paid</p>
                      <p className="font-medium">{formatCurrency(order.amountPaid)}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-muted-foreground">Change/Balance</p>
                      <p className="font-medium">{formatCurrency(order.changeAmount)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              {order.paymentStatus !== "completed" && (
                <CardFooter>
                  <Button 
                    className="w-full bg-food-green hover:bg-food-green-dark"
                    disabled={isLoading}
                    onClick={handleResolvePayment}
                  >
                    {isLoading ? "Processing..." : "Resolve Payment"}
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
