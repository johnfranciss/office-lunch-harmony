
/**
 * Format a number as a currency string
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

/**
 * Format a date as a locale string
 */
export const formatDate = (date: Date | string): string => {
  const dateObj = date instanceof Date ? date : new Date(date);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
};

/**
 * Format a date and time as a locale string
 */
export const formatDateTime = (date: Date | string): string => {
  const dateObj = date instanceof Date ? date : new Date(date);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
};

/**
 * Format raw order data from Supabase into the Order type
 */
export const formatOrderData = (data: any): any => {
  if (!data) return null;
  
  return {
    id: data.id,
    employeeId: data.employee_id,
    employee: data.employee ? {
      id: data.employee.id,
      name: data.employee.name,
      phone_number: data.employee.phone_number,
      active: data.employee.active,
      created_at: data.employee.created_at,
      updated_at: data.employee.updated_at
    } : undefined,
    items: (data.items || []).map((item: any) => ({
      id: item.id,
      menuItemId: item.menu_item_id,
      menuItem: item.menuItem ? {
        id: item.menuItem.id,
        name: item.menuItem.name,
        price: item.menuItem.price,
        created_at: item.menuItem.created_at,
        updated_at: item.menuItem.updated_at
      } : undefined,
      quantity: item.quantity,
      unitPrice: item.unit_price,
      totalPrice: item.total_price
    })),
    total: data.total,
    amountPaid: data.amount_paid,
    changeAmount: data.change_amount,
    paymentStatus: data.payment_status,
    orderDate: new Date(data.order_date),
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at)
  };
};
