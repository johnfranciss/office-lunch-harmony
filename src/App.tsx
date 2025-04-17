
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import EmployeesListPage from "./pages/employees/EmployeesList";
import EmployeeFormPage from "./pages/employees/EmployeeForm";
import MenuItemsListPage from "./pages/menu-items/MenuItemsList";
import MenuItemFormPage from "./pages/menu-items/MenuItemForm";
import OrdersListPage from "./pages/orders/OrdersList";
import OrderFormPage from "./pages/orders/OrderForm";
import OrderDetailPage from "./pages/orders/OrderDetail";
import ReportsListPage from "./pages/reports/ReportsList";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          
          <Route path="/employees" element={<EmployeesListPage />} />
          <Route path="/employees/new" element={<EmployeeFormPage />} />
          <Route path="/employees/edit/:id" element={<EmployeeFormPage />} />
          
          <Route path="/menu-items" element={<MenuItemsListPage />} />
          <Route path="/menu-items/new" element={<MenuItemFormPage />} />
          <Route path="/menu-items/edit/:id" element={<MenuItemFormPage />} />
          
          <Route path="/orders" element={<OrdersListPage />} />
          <Route path="/orders/new" element={<OrderFormPage />} />
          <Route path="/orders/:id" element={<OrderDetailPage />} />
          
          <Route path="/reports" element={<ReportsListPage />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
