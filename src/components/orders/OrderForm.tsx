
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/formatters";
import { MinusCircle, Plus, Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getEmployees } from "@/lib/supabase/employees";
import { createOrder } from "@/lib/supabase/orders";
import { Employee, MenuItem } from "@/types";
import { supabase } from "@/integrations/supabase/client";

const orderFormSchema = z.object({
  employeeId: z.string({
    required_error: "Please select an employee.",
  }),
  amountPaid: z.coerce.number().min(0, {
    message: "Please enter a valid amount.",
  }),
});

type OrderFormValues = z.infer<typeof orderFormSchema>;

type OrderItem = {
  menuItemId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

export function OrderForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [itemQuantity, setItemQuantity] = useState<number>(1);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  // Fetch employees from Supabase
  const { data: employees = [], isLoading: isEmployeesLoading } = useQuery({
    queryKey: ['employees'],
    queryFn: getEmployees
  });

  // Fetch menu items from Supabase
  useEffect(() => {
    async function fetchMenuItems() {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*');
      
      if (error) {
        console.error('Error fetching menu items:', error);
        return;
      }
      
      setMenuItems(data || []);
    }
    
    fetchMenuItems();
  }, []);

  const totalOrderAmount = orderItems.reduce((sum, item) => sum + item.totalPrice, 0);

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      employeeId: "",
      amountPaid: 0,
    },
  });

  const amountPaid = form.watch("amountPaid") || 0;
  const changeAmount = amountPaid - totalOrderAmount;
  const paymentStatus = 
    changeAmount === 0 ? "completed" :
    changeAmount < 0 ? "employee-debt" :
    "office-credit";

  function handleAddItem() {
    if (!selectedItemId || itemQuantity <= 0) return;

    const menuItem = menuItems.find(item => item.id === selectedItemId);
    if (!menuItem) return;

    const totalPrice = menuItem.price * itemQuantity;

    setOrderItems([
      ...orderItems,
      {
        menuItemId: selectedItemId,
        quantity: itemQuantity,
        unitPrice: menuItem.price,
        totalPrice,
      }
    ]);

    setSelectedItemId("");
    setItemQuantity(1);
  }

  function handleRemoveItem(index: number) {
    const newItems = [...orderItems];
    newItems.splice(index, 1);
    setOrderItems(newItems);
  }

  function handleUpdateQuantity(index: number, newQuantity: number) {
    if (newQuantity <= 0) return;
    
    const newItems = [...orderItems];
    const menuItem = menuItems.find(item => item.id === newItems[index].menuItemId);
    
    if (!menuItem) return;
    
    newItems[index].quantity = newQuantity;
    newItems[index].totalPrice = menuItem.price * newQuantity;
    
    setOrderItems(newItems);
  }

  async function onSubmit(data: OrderFormValues) {
    if (orderItems.length === 0) {
      form.setError("root", {
        type: "manual",
        message: "Please add at least one item to the order."
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Submit the order to Supabase
      const order = await createOrder(
        data.employeeId,
        orderItems,
        totalOrderAmount,
        data.amountPaid,
        changeAmount,
        paymentStatus
      );
      
      toast.success("Order placed successfully!");
      navigate("/orders");
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Failed to create order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Order</CardTitle>
        <CardDescription>
          Place a lunch order for an employee
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="employeeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employee</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an employee" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isEmployeesLoading ? (
                        <SelectItem value="loading" disabled>Loading employees...</SelectItem>
                      ) : employees.length === 0 ? (
                        <SelectItem value="none" disabled>No employees found</SelectItem>
                      ) : (
                        employees
                          .filter(employee => employee.active)
                          .map((employee) => (
                            <SelectItem key={employee.id} value={employee.id}>
                              {employee.name}
                            </SelectItem>
                          ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-3">
              <h3 className="font-medium">Order Items</h3>
              
              <div className="flex gap-3">
                <div className="flex-1">
                  <Select
                    value={selectedItemId}
                    onValueChange={setSelectedItemId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select menu item" />
                    </SelectTrigger>
                    <SelectContent>
                      {menuItems.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name} ({formatCurrency(item.price)})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="w-24">
                  <Input 
                    type="number" 
                    min="1"
                    value={itemQuantity}
                    onChange={(e) => setItemQuantity(parseInt(e.target.value) || 1)}
                  />
                </div>
                
                <Button 
                  type="button" 
                  onClick={handleAddItem}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
              
              {orderItems.length > 0 ? (
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-center">Qty</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="w-10"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orderItems.map((item, index) => {
                        const menuItem = menuItems.find(mi => mi.id === item.menuItemId);
                        return (
                          <TableRow key={index}>
                            <TableCell>{menuItem?.name}</TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(item.unitPrice)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center justify-center">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-6 w-6" 
                                  onClick={() => handleUpdateQuantity(index, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                >
                                  <MinusCircle className="h-4 w-4" />
                                </Button>
                                <span className="w-6 text-center">{item.quantity}</span>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-6 w-6" 
                                  onClick={() => handleUpdateQuantity(index, item.quantity + 1)}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(item.totalPrice)}
                            </TableCell>
                            <TableCell>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6" 
                                onClick={() => handleRemoveItem(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      <TableRow>
                        <TableCell colSpan={3} className="text-right font-medium">
                          Order Total:
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(totalOrderAmount)}
                        </TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-6 border rounded-md text-muted-foreground">
                  No items added to this order yet
                </div>
              )}

              {form.formState.errors.root && (
                <p className="text-destructive text-sm">
                  {form.formState.errors.root.message}
                </p>
              )}
            </div>

            <div className="border rounded-md p-4 bg-muted/30">
              <div className="space-y-3">
                <h3 className="font-medium">Payment Information</h3>
                
                <FormField
                  control={form.control}
                  name="amountPaid"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount Paid</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5">Rs.</span>
                          <Input 
                            type="number"
                            step="0.01" 
                            placeholder="0.00" 
                            className="pl-7"
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Order Total</p>
                    <p className="font-medium">{formatCurrency(totalOrderAmount)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Change</p>
                    <p className="font-medium">
                      {formatCurrency(changeAmount)}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="font-medium">
                      {paymentStatus === "completed" && "✅ Completed"}
                      {paymentStatus === "employee-debt" && "🔴 Employee Debt"}
                      {paymentStatus === "office-credit" && "🔴 Office Credit"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => navigate("/orders")}
              type="button"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-food-orange hover:bg-food-orange-dark"
            >
              {isLoading ? "Processing..." : "Place Order"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
