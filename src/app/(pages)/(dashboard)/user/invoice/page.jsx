"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { useState } from "react";

export default function Transactions() {
  const transactions = [
    {
      id: 1,
      email: "john@gmail.com",
      amount: 500.0,
      date: "2024-03-20",
      status: "Pending",
      transactionId: "TRX-123456",
      action: "View",
    },
    {
      id: 2,
      email: "jane@gmail.com",
      amount: 300.0,
      date: "2024-03-20",
      status: "Complete",
      transactionId: "TRX-123457",
      action: "View",
    },
    {
      id: 3,
      email: "john@gmail.com",
      amount: 750.0,
      date: "2024-03-19",
      status: "Completed",
      transactionId: "TRX-123458",
      action: "View",
    },
  ];
  const [timePeriod, setTimePeriod] = useState("today");
  return (
    <Card className="w-full dark:bg-slate-700">
      <CardHeader className="flex flex-row items-center justify-between mb-6">
        <Select value={timePeriod} onValueChange={setTimePeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today"> 10 Entries</SelectItem>
            <SelectItem value="week"> 20 Entries</SelectItem>
            <SelectItem value="month"> 30 Entries</SelectItem>
            <SelectItem value="year"> 40 Entries</SelectItem>
          </SelectContent>
        </Select>
        <CardTitle className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold">
          Invoices
        </CardTitle>
        <div>
          <Input type="text" placeholder="Search" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-200 dark:bg-slate-700">
                <TableHead>#</TableHead>
                <TableHead>Customer Email</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="">{transaction.id}</TableCell>
                  <TableCell className="">{transaction.email}</TableCell>

                  <TableCell className="">{transaction.amount}</TableCell>
                  <TableCell className="">{transaction.date}</TableCell>
                  <TableCell
                    className={`${
                      transaction.status == "Pending"
                        ? "text-yellow-500 font-bold"
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
