
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
    ...data,
    orderDate: new Date(data.orderDate),
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
    // Map any other fields if necessary
  };
};
