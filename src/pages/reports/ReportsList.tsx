
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReportsListPage() {
  return (
    <MainLayout>
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">
            View and generate reports
          </p>
        </div>
        
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Reports</CardTitle>
            <CardDescription>
              Generate and view reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Report functionality will be implemented soon.</p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
