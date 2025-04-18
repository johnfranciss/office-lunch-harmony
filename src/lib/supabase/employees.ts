
import { createClient } from '@supabase/supabase-js';
import { Employee } from '@/types';

// Get Supabase URL and key from environment variables
// If they're not available, provide clear error handling
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if Supabase URL and key are available
if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase configuration. Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your environment.");
}

// Create Supabase client with provided credentials
const supabase = createClient(supabaseUrl || '', supabaseKey || '');

export type EmployeeInput = {
  name: string;
  idOrPhone?: string;
};

export async function createEmployee(employee: EmployeeInput) {
  const { data, error } = await supabase
    .from('employees')
    .insert([{
      name: employee.name,
      phone_number: employee.idOrPhone,
      active: true
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getEmployees() {
  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function deleteEmployee(id: string) {
  const { error } = await supabase
    .from('employees')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
