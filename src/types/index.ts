
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
  price: number;
  created_at: Date;
  updated_at: Date;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  menuItem?: MenuItem;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
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
