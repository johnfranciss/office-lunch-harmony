
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
import { Badge } from "@/components/ui/badge";
import { Edit, Plus, Search } from "lucide-react";
import { mockMenuItems } from "@/data/mockData";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "@/lib/formatters";

export function MenuItemsList() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  
  const filteredMenuItems = mockMenuItems.filter(
    (item) => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get unique categories for filter buttons
  const categories = Array.from(new Set(mockMenuItems.map(item => item.category)));

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

        <div className="flex flex-wrap gap-2 mb-4">
          <Button
            variant={searchTerm === "" ? "default" : "outline"}
            size="sm"
            onClick={() => setSearchTerm("")}
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={searchTerm.toLowerCase() === category.toLowerCase() ? "default" : "outline"}
              size="sm"
              onClick={() => setSearchTerm(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMenuItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="h-32 bg-food-neutral-medium flex items-center justify-center">
                <div className="text-4xl text-food-neutral-dark">🍽️</div>
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-semibold">{item.name}</div>
                  <div className="font-medium text-food-orange">
                    {formatCurrency(item.price)}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {item.description}
                </p>
                <div className="flex justify-between items-center">
                  <Badge variant="outline">{item.category}</Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/menu-items/edit/${item.id}`)}
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
