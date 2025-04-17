
import { createClient } from '@supabase/supabase-js';
import { Employee } from '@/types';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

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
