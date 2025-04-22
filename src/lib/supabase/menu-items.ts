
import { supabase } from "@/integrations/supabase/client";
import { MenuItem } from "@/types";

/**
 * Convert Supabase menu item data to MenuItem type
 */
const toMenuItem = (item: any): MenuItem => ({
  id: item.id,
  name: item.name,
  price: item.price,
  created_at: new Date(item.created_at),
  updated_at: new Date(item.updated_at)
});

/**
 * Fetch all menu items from Supabase
 */
export async function getMenuItems(): Promise<MenuItem[]> {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching menu items:', error);
    throw new Error(error.message);
  }
  
  return data ? data.map(toMenuItem) : [];
}

/**
 * Add a new menu item to Supabase
 */
export async function addMenuItem(item: Omit<MenuItem, 'id' | 'created_at' | 'updated_at'>): Promise<MenuItem> {
  const { data, error } = await supabase
    .from('menu_items')
    .insert([item])
    .select()
    .single();
  
  if (error) {
    console.error('Error adding menu item:', error);
    throw new Error(error.message);
  }
  
  return toMenuItem(data);
}

/**
 * Update an existing menu item in Supabase
 */
export async function updateMenuItem(id: string, item: Partial<Omit<MenuItem, 'id' | 'created_at' | 'updated_at'>>): Promise<MenuItem> {
  const { data, error } = await supabase
    .from('menu_items')
    .update(item)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating menu item:', error);
    throw new Error(error.message);
  }
  
  return toMenuItem(data);
}

/**
 * Delete a menu item from Supabase
 */
export async function deleteMenuItem(id: string): Promise<void> {
  const { error } = await supabase
    .from('menu_items')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting menu item:', error);
    throw new Error(error.message);
  }
}

/**
 * Get a menu item by ID
 */
export async function getMenuItemById(id: string): Promise<MenuItem | null> {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      // Item not found
      return null;
    }
    console.error('Error fetching menu item:', error);
    throw new Error(error.message);
  }
  
  return toMenuItem(data);
}

/**
 * Get all menu items but returns them with dates as strings
 * Used for components that don't need the Date object conversion
 */
export async function getMenuItemsRaw() {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching menu items:', error);
    throw new Error(error.message);
  }
  
  return data || [];
}
