
import { EmployeesList as EmployeesListComponent } from "@/components/employees/EmployeesList";
import { MainLayout } from "@/components/layout/MainLayout";

export default function EmployeesListPage() {
  return (
    <MainLayout>
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
          <p className="text-muted-foreground">
            Manage employee information
          </p>
        </div>
        
        <EmployeesListComponent />
      </div>
    </MainLayout>
  );
}
