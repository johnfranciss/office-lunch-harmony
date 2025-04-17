
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MainLayout } from "@/components/layout/MainLayout";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ShoppingBag, FileBarChart, PieChart, ListChecked } from "lucide-react";
import { mockOrders } from "@/data/mockData";
import { formatCurrency } from "@/lib/formatters";
import { Badge } from "@/components/ui/badge";

// Sample data for reports
const salesData = [
  { date: "Mon", sales: 1200 },
  { date: "Tue", sales: 1900 },
  { date: "Wed", sales: 1500 },
  { date: "Thu", sales: 2400 },
  { date: "Fri", sales: 2800 },
  { date: "Sat", sales: 1400 },
  { date: "Sun", sales: 900 },
];

const categoryData = [
  { name: "Sandwiches", sales: 4800 },
  { name: "Beverages", sales: 3200 },
  { name: "Salads", sales: 2100 },
  { name: "Desserts", sales: 1600 },
  { name: "Snacks", sales: 950 },
];

// Process orders to get procurement summary
const getProcurementSummary = () => {
  // Group all order items by category and sum their quantities
  const categoryItemsMap = new Map();
  
  mockOrders.forEach(order => {
    order.items.forEach(item => {
      if (!item.menuItem) return;
      
      const category = item.menuItem.category;
      if (!categoryItemsMap.has(category)) {
        categoryItemsMap.set(category, new Map());
      }
      
      const itemsInCategory = categoryItemsMap.get(category);
      const itemName = item.menuItem.name;
      
      if (itemsInCategory.has(itemName)) {
        itemsInCategory.set(itemName, itemsInCategory.get(itemName) + item.quantity);
      } else {
        itemsInCategory.set(itemName, item.quantity);
      }
    });
  });
  
  // Convert the map to an array structure for rendering
  const procurementSummary = [];
  categoryItemsMap.forEach((items, category) => {
    const categoryItems = [];
    items.forEach((quantity, name) => {
      categoryItems.push({ name, quantity });
    });
    procurementSummary.push({ category, items: categoryItems });
  });
  
  return procurementSummary;
};

const procurementSummary = getProcurementSummary();

const ReportsList = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        </div>

        <Tabs defaultValue="procurement">
          <TabsList className="mb-4">
            <TabsTrigger value="procurement" className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              Procurement Summary
            </TabsTrigger>
            <TabsTrigger value="sales" className="flex items-center gap-2">
              <FileBarChart className="h-4 w-4" />
              Sales Reports
            </TabsTrigger>
            <TabsTrigger value="category" className="flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              Category Analysis
            </TabsTrigger>
            <TabsTrigger value="employee" className="flex items-center gap-2">
              <ListChecked className="h-4 w-4" />
              Employee Performance
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="procurement" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Procurement Summary</CardTitle>
                <CardDescription>
                  Total items to be purchased grouped by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                {procurementSummary.length > 0 ? (
                  <div className="space-y-6">
                    {procurementSummary.map((category, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-food-orange text-white">
                            {category.category}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {category.items.reduce((sum, item) => sum + item.quantity, 0)} items total
                          </span>
                        </div>
                        
                        <div className="rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Item Name</TableHead>
                                <TableHead className="text-right">Quantity</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {category.items.map((item, itemIdx) => (
                                <TableRow key={itemIdx}>
                                  <TableCell>{item.name}</TableCell>
                                  <TableCell className="text-right font-medium">{item.quantity}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-6">No orders to display. Procurement data will appear once orders are placed.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="sales" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Daily Sales Overview</CardTitle>
                  <CardDescription>View your daily sales performance for the current week.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="sales" name="Sales ($)" fill="#22c55e" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Select Date Range</CardTitle>
                  <CardDescription>Choose a date to view specific reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="category" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Sales by Category</CardTitle>
                <CardDescription>Breakdown of sales by menu item category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="sales" name="Sales ($)" fill="#f97316" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="employee" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Coming Soon</CardTitle>
                <CardDescription>Employee performance reports will be available in a future update</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">This feature is under development. Check back soon!</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default ReportsList;
