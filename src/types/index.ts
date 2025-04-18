// Types for the application

export interface Employee {
  id: string;
  name: string;
  phone_number?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  available: boolean;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  employeeId: string;
  employee?: Employee;
  items: OrderItem[];
  total: number;
  amountPaid: number;
  changeAmount: number;
  paymentStatus: "completed" | "employee-debt" | "office-credit";
  orderDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  menuItem?: MenuItem;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}
