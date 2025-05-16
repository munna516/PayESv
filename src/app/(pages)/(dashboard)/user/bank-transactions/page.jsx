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

export default function BankTransactions() {
  const transactions = [
    {
      id: 1,
      type: "successful",
      amount: 500.0,
      date: "2024-03-20",
      time: "14:30",
      from: "John Doe",
      to: "Your Account",
      status: "Completed",
      transactionId: "TRX-123456",
    },
    {
      id: 2,
      type: "pending",
      amount: 300.0,
      date: "2024-03-20",
      time: "15:45",
      from: "This Account",
      to: "ABC Companyd",
      status: "Processing",
      transactionId: "TRX-123457",
    },
    {
      id: 3,
      type: "successful",
      amount: 750.0,
      date: "2024-03-19",
      time: "10:15",
      from: "Company XYZ",
      to: "Your Account",
      status: "Completed",
      transactionId: "TRX-123458",
    },
  ];
  const [timePeriod, setTimePeriod] = useState("today");
  return (
    <Card className="w-full dark:bg-slate-700">
      <CardHeader className="flex flex-row items-center justify-between mb-6">
        <CardTitle className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold">
          Bank Transactions
        </CardTitle>
        <div>
          <Input type="text" placeholder="Search" />
        </div>
        <Select value={timePeriod} onValueChange={setTimePeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="rounded-md">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-200 dark:bg-slate-700">
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead> Time</TableHead>
                <TableHead className="hidden md:table-cell">From</TableHead>
                <TableHead className="hidden md:table-cell">To</TableHead>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="">{transaction.date}</TableCell>
                  <TableCell className="">${transaction.amount}</TableCell>

                  <TableCell className="">{transaction.time}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {transaction.from}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {transaction.to}
                  </TableCell>
                  <TableCell className="">
                    {transaction.transactionId}
                  </TableCell>
                  <TableCell
                    className={`${
                      transaction.type == "pending"
                        ? "text-yellow-500 font-bold"
                        : "text-green-500 font-bold"
                    }`}
                  >
                    {transaction.type}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
