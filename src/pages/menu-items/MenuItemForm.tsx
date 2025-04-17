
import { MenuItemForm as MenuItemFormComponent } from "@/components/menu-items/MenuItemForm";
import { MainLayout } from "@/components/layout/MainLayout";
import { useParams } from "react-router-dom";

export default function MenuItemFormPage() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  
  return (
    <MainLayout>
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isEditing ? "Edit Menu Item" : "Add Menu Item"}
          </h1>
          <p className="text-muted-foreground">
            {isEditing 
              ? "Update menu item details" 
              : "Enter details for a new menu item"}
          </p>
        </div>
        
        <MenuItemFormComponent />
      </div>
    </MainLayout>
  );
}
