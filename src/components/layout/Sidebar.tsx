
import { Home, Users, Coffee, ShoppingBag, FileText } from "lucide-react";
import { Button } from "../ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    name: "Dashboard",
    icon: Home,
    path: "/",
  },
  {
    name: "Employees",
    icon: Users,
    path: "/employees",
  },
  {
    name: "Menu Items",
    icon: Coffee,
    path: "/menu-items",
  },
  {
    name: "Orders",
    icon: ShoppingBag,
    path: "/orders",
  },
  {
    name: "Reports",
    icon: FileText,
    path: "/reports",
  },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside className="hidden border-r bg-food-neutral-lightest w-64 p-4 md:block">
      <nav className="grid gap-2 text-sm">
        {menuItems.map((item) => (
          <Button
            key={item.path}
            variant={location.pathname === item.path ? "secondary" : "ghost"}
            className={cn(
              "justify-start",
              location.pathname === item.path 
                ? "bg-food-green-light text-food-green-dark" 
                : ""
            )}
            onClick={() => navigate(item.path)}
          >
            <item.icon className="mr-2 h-4 w-4" />
            {item.name}
          </Button>
        ))}
      </nav>
    </aside>
  );
}
