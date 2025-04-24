
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
import { calculateItemsSummary } from "@/lib/dashboard-utils";
import { Order } from "@/types";

interface ItemsSummaryProps {
  orders: Order[];
  onBack: () => void;
}

export function ItemsSummary({ orders, onBack }: ItemsSummaryProps) {
  const itemsSummary = calculateItemsSummary(orders);
  const totalItems = itemsSummary.reduce((sum, item) => sum + item.totalQuantity, 0);
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-2xl">Items Summary</CardTitle>
          <CardDescription>
            Total Items Ordered: {totalItems}
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
              <TableHead>Item Name</TableHead>
              <TableHead className="text-right">Total Quantity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {itemsSummary.length > 0 ? (
              itemsSummary.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.itemName}</TableCell>
                  <TableCell className="text-right">{item.totalQuantity}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} className="text-center">No items found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
