
import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { getOfficeDebtDetails } from "@/lib/dashboard-utils";
import { Order } from "@/types";

interface OfficeDebtDetailsProps {
  orders: Order[];
  onBack: () => void;
}

export function OfficeDebtDetails({ orders, onBack }: OfficeDebtDetailsProps) {
  const debtDetails = getOfficeDebtDetails(orders);
  const totalDebt = debtDetails.reduce((sum, detail) => sum + detail.debtAmount, 0);
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-2xl">Office Debt Details</CardTitle>
          <CardDescription>
            Total Debt on Office Boy: Rs. {totalDebt.toLocaleString()}
          </CardDescription>
        </div>
        <Button variant="outline" onClick={onBack} className="h-8 w-8 p-0">
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead className="text-right">Debt Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {debtDetails.length > 0 ? (
              debtDetails.map((detail, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{detail.employeeName}</TableCell>
                  <TableCell className="text-right">Rs. {detail.debtAmount.toLocaleString()}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} className="text-center">No office debts found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
