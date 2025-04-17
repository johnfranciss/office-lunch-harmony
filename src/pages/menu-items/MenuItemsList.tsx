
import { MenuItemsList as MenuItemsListComponent } from "@/components/menu-items/MenuItemsList";
import { MainLayout } from "@/components/layout/MainLayout";

export default function MenuItemsListPage() {
  return (
    <MainLayout>
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Menu Items</h1>
          <p className="text-muted-foreground">
            Manage food and beverage items
          </p>
        </div>
        
        <MenuItemsListComponent />
      </div>
    </MainLayout>
  );
}
