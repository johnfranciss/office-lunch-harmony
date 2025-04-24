
import { Order, OrderItem } from "@/types";

/**
 * Calculate the total cash in hand from all orders
 */
export function calculateCashInHand(orders: Order[]): number {
  return orders.reduce((total, order) => {
    if (order.paymentStatus === "completed") {
      // Cash in hand for completed payments is the total amount
      return total + order.total;
    } else if (order.paymentStatus === "employee-debt") {
      // For employee debt, we count what was paid (if any)
      return total + (order.amountPaid > 0 ? order.amountPaid : 0);
    } else {
      // For office credit, we count what was paid minus change
      return total + order.amountPaid - order.changeAmount;
    }
  }, 0);
}

/**
 * Calculate the total debt owed by the office boy
 */
export function calculateOfficeDebt(orders: Order[]): number {
  return orders
    .filter(order => order.paymentStatus === "office-credit")
    .reduce((total, order) => total + (order.total - order.amountPaid + order.changeAmount), 0);
}

/**
 * Calculate the total debt owed by employees
 */
export function calculateEmployeeDebt(orders: Order[]): number {
  return orders
    .filter(order => order.paymentStatus === "employee-debt")
    .reduce((total, order) => total + (order.total - order.amountPaid), 0);
}

/**
 * Get the orders for Cash in Hand details
 */
export function getCashInHandDetails(orders: Order[]): Array<{
  id: string;
  employeeName: string;
  amountPaid: number;
  changeAmount: number;
  cashInHand: number;
}> {
  return orders.map(order => ({
    id: order.id,
    employeeName: order.employee?.name || 'Unknown',
    amountPaid: order.amountPaid,
    changeAmount: order.changeAmount,
    cashInHand: order.paymentStatus === "completed" ? 
      order.total : 
      order.amountPaid - order.changeAmount
  }));
}

/**
 * Get the office debt details by employee
 */
export function getOfficeDebtDetails(orders: Order[]): Array<{
  employeeName: string;
  debtAmount: number;
}> {
  const debtByEmployee: Record<string, number> = {};
  
  orders
    .filter(order => order.paymentStatus === "office-credit")
    .forEach(order => {
      const employeeName = order.employee?.name || 'Unknown';
      const debtAmount = order.total - order.amountPaid + order.changeAmount;
      
      if (debtAmount > 0) {
        if (debtByEmployee[employeeName]) {
          debtByEmployee[employeeName] += debtAmount;
        } else {
          debtByEmployee[employeeName] = debtAmount;
        }
      }
    });
    
  return Object.entries(debtByEmployee).map(([employeeName, debtAmount]) => ({
    employeeName,
    debtAmount
  }));
}

/**
 * Get the employee debt details
 */
export function getEmployeeDebtDetails(orders: Order[]): Array<{
  employeeName: string;
  debtAmount: number;
}> {
  const debtByEmployee: Record<string, number> = {};
  
  orders
    .filter(order => order.paymentStatus === "employee-debt")
    .forEach(order => {
      const employeeName = order.employee?.name || 'Unknown';
      const debtAmount = order.total - order.amountPaid;
      
      if (debtAmount > 0) {
        if (debtByEmployee[employeeName]) {
          debtByEmployee[employeeName] += debtAmount;
        } else {
          debtByEmployee[employeeName] = debtAmount;
        }
      }
    });
    
  return Object.entries(debtByEmployee).map(([employeeName, debtAmount]) => ({
    employeeName,
    debtAmount
  }));
}

/**
 * Calculate the summary of all ordered items
 */
export function calculateItemsSummary(orders: Order[]): Array<{
  itemName: string;
  totalQuantity: number;
}> {
  const itemSummary: Record<string, number> = {};
  
  orders.forEach(order => {
    order.items.forEach(item => {
      const itemName = item.menuItem?.name || `Item ${item.menuItemId}`;
      
      if (itemSummary[itemName]) {
        itemSummary[itemName] += item.quantity;
      } else {
        itemSummary[itemName] = item.quantity;
      }
    });
  });
  
  return Object.entries(itemSummary).map(([itemName, totalQuantity]) => ({
    itemName,
    totalQuantity
  }));
}
