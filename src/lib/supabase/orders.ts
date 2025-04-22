
import { supabase } from "@/integrations/supabase/client";
import { Order } from "@/types";
import { formatOrderData } from "@/lib/formatters";

/**
 * Fetch all orders from Supabase
 */
export async function getOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      employee:employeeId(*),
      items:order_items(
        *,
        menuItem:menuItemId(*)
      )
    `)
    .order('orderDate', { ascending: false });
  
  if (error) {
    console.error('Error fetching orders:', error);
    throw new Error(error.message);
  }
  
  return data?.map(formatOrderData) || [];
}

/**
 * Get an order by ID
 */
export async function getOrderById(id: string): Promise<Order | null> {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      employee:employeeId(*),
      items:order_items(
        *,
        menuItem:menuItemId(*)
      )
    `)
    .eq('id', id)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      // Order not found
      return null;
    }
    console.error('Error fetching order:', error);
    throw new Error(error.message);
  }
  
  return formatOrderData(data);
}
