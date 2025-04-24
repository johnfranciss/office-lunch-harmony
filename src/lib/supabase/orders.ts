import { supabase } from "@/integrations/supabase/client";
import { Order, OrderItem } from "@/types";
import { formatOrderData } from "@/lib/formatters";
import { getMenuItemsRaw } from "@/lib/supabase/menu-items";

/**
 * Create or update an order in Supabase
 */
export async function createOrder(
  employeeId: string,
  items: OrderItem[],
  total: number,
  amountPaid: number,
  changeAmount: number,
  paymentStatus: "completed" | "employee-debt" | "office-credit",
  orderId?: string
): Promise<Order | null> {
  // If orderId exists, update instead of create
  if (orderId) {
    return updateOrder(
      orderId,
      employeeId,
      items,
      total,
      amountPaid,
      changeAmount,
      paymentStatus
    );
  }

  // Start a Supabase transaction for new order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert([{
      employee_id: employeeId,
      total,
      amount_paid: amountPaid,
      change_amount: changeAmount,
      payment_status: paymentStatus,
      order_date: new Date().toISOString()
    }])
    .select()
    .single();

  if (orderError) {
    console.error('Error creating order:', orderError);
    throw new Error(orderError.message);
  }

  // Insert order items
  const orderItems = items.map(item => ({
    order_id: order.id,
    menu_item_id: item.menuItemId,
    quantity: item.quantity,
    unit_price: item.unitPrice,
    total_price: item.totalPrice
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);

  if (itemsError) {
    console.error('Error creating order items:', itemsError);
    throw new Error(itemsError.message);
  }

  return getOrderById(order.id);
}

/**
 * Update an existing order
 */
async function updateOrder(
  orderId: string,
  employeeId: string,
  items: OrderItem[],
  total: number,
  amountPaid: number,
  changeAmount: number,
  paymentStatus: "completed" | "employee-debt" | "office-credit"
): Promise<Order | null> {
  try {
    // First, update the order
    const { error: orderError } = await supabase
      .from('orders')
      .update({
        employee_id: employeeId,
        total,
        amount_paid: amountPaid,
        change_amount: changeAmount,
        payment_status: paymentStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId);

    if (orderError) {
      console.error('Error updating order:', orderError);
      throw new Error(orderError.message);
    }

    // Delete all existing order items
    const { error: deleteItemsError } = await supabase
      .from('order_items')
      .delete()
      .eq('order_id', orderId);

    if (deleteItemsError) {
      console.error('Error deleting existing order items:', deleteItemsError);
      throw new Error(deleteItemsError.message);
    }

    // Insert the new order items
    const orderItems = items.map(item => ({
      order_id: orderId,
      menu_item_id: item.menuItemId,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      total_price: item.totalPrice
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Error creating new order items:', itemsError);
      throw new Error(itemsError.message);
    }

    return getOrderById(orderId);
  } catch (error) {
    console.error("Error in updateOrder function:", error);
    throw error;
  }
}

/**
 * Fetch all orders from Supabase
 */
export async function getOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      employee:employees(*),
      items:order_items(
        *,
        menuItem:menu_items(*)
      )
    `)
    .order('order_date', { ascending: false });

  if (error) {
    console.error('Error fetching orders:', error);
    throw new Error(error.message);
  }

  return data ? data.map(formatOrderData) : [];
}

/**
 * Get an order by ID
 */
export async function getOrderById(id: string): Promise<Order | null> {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      employee:employees(*),
      items:order_items(
        *,
        menuItem:menu_items(*)
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching order:', error);
    throw new Error(error.message);
  }

  return data ? formatOrderData(data) : null;
}

/**
 * Delete an order by ID
 */
export async function deleteOrder(id: string): Promise<boolean> {
  try {
    // Delete order_items first to maintain FK constraint
    const { error: itemsError } = await supabase
      .from("order_items")
      .delete()
      .eq("order_id", id);
      
    if (itemsError) {
      console.error("Error deleting order items:", itemsError);
      throw itemsError;
    }

    // Then delete the order itself
    const { error: orderError } = await supabase
      .from("orders")
      .delete()
      .eq("id", id);

    if (orderError) {
      console.error("Error deleting order:", orderError);
      throw orderError;
    }

    return true;
  } catch (error) {
    console.error("Error in deleteOrder function:", error);
    return false;
  }
}
