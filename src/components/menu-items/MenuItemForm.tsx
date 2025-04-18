
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addMenuItem, getMenuItemById, updateMenuItem } from "@/lib/supabase/menu-items";
import { useToast } from "@/hooks/use-toast";

const menuItemFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  price: z.coerce.number().positive({
    message: "Price must be a positive number.",
  }),
});

type MenuItemFormValues = z.infer<typeof menuItemFormSchema>;

export function MenuItemForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: menuItem, isLoading: isFetchingMenuItem } = useQuery({
    queryKey: ['menu-item', id],
    queryFn: () => id ? getMenuItemById(id) : null,
    enabled: isEditing,
  });

  const form = useForm<MenuItemFormValues>({
    resolver: zodResolver(menuItemFormSchema),
    defaultValues: {
      name: "",
      price: 0,
    },
  });

  // Set form values when menu item data is loaded
  useEffect(() => {
    if (menuItem) {
      form.reset({
        name: menuItem.name,
        price: menuItem.price,
      });
    }
  }, [menuItem, form]);

  // Add menu item mutation
  const addMutation = useMutation({
    mutationFn: addMenuItem,
    onSuccess: () => {
      setIsLoading(false);
      toast({
        title: "Success",
        description: "Menu item has been added successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['menu-items'] });
      navigate("/menu-items");
    },
    onError: (error) => {
      setIsLoading(false);
      toast({
        title: "Error",
        description: `Failed to add menu item: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  });

  // Update menu item mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<MenuItemFormValues> }) => 
      updateMenuItem(id, data),
    onSuccess: () => {
      setIsLoading(false);
      toast({
        title: "Success",
        description: "Menu item has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['menu-items'] });
      queryClient.invalidateQueries({ queryKey: ['menu-item', id] });
      navigate("/menu-items");
    },
    onError: (error) => {
      setIsLoading(false);
      toast({
        title: "Error",
        description: `Failed to update menu item: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  });

  function onSubmit(data: MenuItemFormValues) {
    setIsLoading(true);
    
    if (isEditing && id) {
      updateMutation.mutate({ id, data });
    } else {
      addMutation.mutate(data);
    }
  }

  if (isEditing && isFetchingMenuItem) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="py-10 text-center">
          Loading menu item...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Menu Item" : "Add New Menu Item"}</CardTitle>
        <CardDescription>
          {isEditing ? "Update menu item details." : "Enter details to add a new menu item."}
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter item name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5">Rs.</span>
                      <Input 
                        type="number"
                        step="0.01" 
                        placeholder="0.00" 
                        className="pl-12"
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => navigate("/menu-items")}
              type="button"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-food-green hover:bg-food-green-dark"
            >
              {isLoading ? "Saving..." : isEditing ? "Update Item" : "Add Item"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
