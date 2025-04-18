
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { createEmployee, EmployeeInput } from "@/lib/supabase/employees";

const employeeFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  idOrPhone: z.string().optional(),
});

type EmployeeFormValues = z.infer<typeof employeeFormSchema>;

export function EmployeeForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const createMutation = useMutation({
    mutationFn: createEmployee,
    onSuccess: () => {
      toast.success("Employee added successfully!");
      navigate("/employees");
    },
    onError: (error) => {
      setIsLoading(false);
      toast.error("Failed to add employee");
      console.error("Create error:", error);
    }
  });

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      name: "",
      idOrPhone: "",
    },
  });

  function onSubmit(data: EmployeeFormValues) {
    setIsLoading(true);
    // Ensure name is always provided as required by EmployeeInput type
    const employeeData: EmployeeInput = {
      name: data.name,
      idOrPhone: data.idOrPhone
    };
    createMutation.mutate(employeeData);
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Add New Employee</CardTitle>
        <CardDescription>
          Enter employee details below.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Smith" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="idOrPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID Number or Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Optional" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => navigate("/employees")}
              type="button"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-food-green hover:bg-food-green-dark"
            >
              {isLoading ? "Adding..." : "Add Employee"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
