
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Edit, Plus, Search, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "@/lib/formatters";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMenuItems, deleteMenuItem } from "@/lib/supabase/menu-items";
import { MenuItem } from "@/types";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export function MenuItemsList() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [itemToDelete, setItemToDelete] = useState<MenuItem | null>(null);
  
  // Fetch menu items from Supabase
  const { data: menuItems = [], isLoading, error } = useQuery({
    queryKey: ['menu-items'],
    queryFn: getMenuItems
  });

  // Delete menu item mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteMenuItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-items'] });
      toast({
        title: "Item deleted",
        description: "The menu item has been successfully deleted.",
      });
      setItemToDelete(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete menu item: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  });

  // Filter menu items based on search term
  const filteredMenuItems = menuItems.filter(
    (item) => item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    if (itemToDelete) {
      deleteMutation.mutate(itemToDelete.id);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Menu Items</CardTitle>
          <CardDescription>
            Manage your available food and beverage items
          </CardDescription>
        </div>
        <Button 
          className="bg-food-orange hover:bg-food-orange-dark"
          onClick={() => navigate("/menu-items/new")}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search menu items..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {isLoading && (
          <div className="text-center py-8">Loading menu items...</div>
        )}

        {error && (
          <div className="text-center py-8 text-destructive">
            Error loading menu items. Please try again.
          </div>
        )}

        {!isLoading && !error && filteredMenuItems.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            {searchTerm ? "No items match your search." : "No menu items found. Add your first item!"}
          </div>
        )}

        {!isLoading && !error && filteredMenuItems.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMenuItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-semibold">{item.name}</div>
                    <div className="font-medium text-food-orange">
                      {formatCurrency(item.price)}
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/menu-items/edit/${item.id}`)}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setItemToDelete(item)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>

      <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Menu Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{itemToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
