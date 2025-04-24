
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
import { formatCurrency } from "@/lib/formatters";
import { getCashInHandDetails } from "@/lib/dashboard-utils";
import { Order } from "@/types";

interface CashInHandDetailsProps {
  orders: Order[];
  onBack: () => void;
}

export function CashInHandDetails({ orders, onBack }: CashInHandDetailsProps) {
  const cashDetails = getCashInHandDetails(orders);
  const totalCashInHand = cashDetails.reduce((sum, detail) => sum + detail.cashInHand, 0);
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-2xl">Cash In Hand Details</CardTitle>
          <CardDescription>
            Total: Rs. {totalCashInHand.toLocaleString()}
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
              <TableHead className="text-right">Amount Paid</TableHead>
              <TableHead className="text-right">Change Given</TableHead>
              <TableHead className="text-right">Cash in Hand</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cashDetails.map((detail) => (
              <TableRow key={detail.id}>
                <TableCell className="font-medium">{detail.employeeName}</TableCell>
                <TableCell className="text-right">Rs. {detail.amountPaid.toLocaleString()}</TableCell>
                <TableCell className="text-right">Rs. {detail.changeAmount.toLocaleString()}</TableCell>
                <TableCell className="text-right">Rs. {detail.cashInHand.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
