
import { EmployeeForm as EmployeeFormComponent } from "@/components/employees/EmployeeForm";
import { MainLayout } from "@/components/layout/MainLayout";
import { useParams } from "react-router-dom";

export default function EmployeeFormPage() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  
  return (
    <MainLayout>
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isEditing ? "Edit Employee" : "Add Employee"}
          </h1>
          <p className="text-muted-foreground">
            {isEditing 
              ? "Update employee information" 
              : "Enter details for a new employee"}
          </p>
        </div>
        
        <EmployeeFormComponent />
      </div>
    </MainLayout>
  );
}
