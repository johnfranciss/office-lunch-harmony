
import { Menu, Search, ShoppingCart, User } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b bg-background shadow-sm">
      <div className="container flex h-16 items-center justify-between py-2">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          <div className="flex items-center gap-1" onClick={() => navigate("/")} role="button">
            <ShoppingCart className="h-6 w-6 text-food-orange" />
            <h1 className="hidden text-xl font-bold text-food-orange sm:inline-block">OLOMS</h1>
          </div>
        </div>

        <div className="hidden flex-1 items-center justify-center px-4 md:flex md:px-6 lg:px-8">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-full"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/profile")}
          >
            <User className="h-5 w-5" />
            <span className="sr-only">User profile</span>
          </Button>
          <Button
            variant="default"
            size="sm"
            className="bg-food-orange hover:bg-food-orange-dark"
            onClick={() => navigate("/orders/new")}
          >
            New Order
          </Button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      <div className={cn(
        "border-b md:hidden",
        isMobileMenuOpen ? "block" : "hidden"
      )}>
        <div className="container py-2 space-y-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full appearance-none bg-background pl-8 shadow-none"
            />
          </div>
          <nav className="flex flex-col space-y-1">
            <Button variant="ghost" className="justify-start" onClick={() => navigate("/employees")}>
              Employees
            </Button>
            <Button variant="ghost" className="justify-start" onClick={() => navigate("/menu-items")}>
              Menu Items
            </Button>
            <Button variant="ghost" className="justify-start" onClick={() => navigate("/orders")}>
              Orders
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
