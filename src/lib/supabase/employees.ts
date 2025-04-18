
import { supabase } from '@/integrations/supabase/client';

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
