"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Transactions() {
  const transactions = [
    {
      id: 1,
      brand_key: "49940",
      brand_name: "Apple",
      status: "Active",
      action: "Edit",
    },
    {
      id: 2,
      brand_key: "49940",
      brand_name: "Apple",
      status: "Deactive",
      action: "Edit",
    },
    {
      id: 3,
      brand_key: "49940",
      brand_name: "Apple",
      status: "Deactive",
      action: "Edit",
    },
  ];
  return (
    <Card className="w-full dark:bg-slate-700">
      <CardHeader className="flex flex-row items-center justify-between mb-3">
        <CardTitle className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold">
          Brands
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-200 dark:bg-slate-700">
                <TableHead>#</TableHead>
                <TableHead>Brand Key</TableHead>
                <TableHead>Brand Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="">{transaction.id}</TableCell>
                  <TableCell className="">{transaction.brand_key}</TableCell>
                  <TableCell>{transaction.brand_name}</TableCell>
                  <TableCell
                    className={`${
                      transaction.status == "Deactive"
                        ? "text-red-500 font-bold"
                        : "text-green-500 font-bold"
                    }`}
                  >
                    {transaction.status}
                  </TableCell>

                  <TableCell className="">{transaction.action}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
