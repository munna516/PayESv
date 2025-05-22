"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Users,
  CheckCircle2,
  Clock,
  DollarSign,
  Ticket,
  FileText,
} from "lucide-react";
import { useSession } from "next-auth/react";

function AdminDashboard() {
  const { data: session } = useSession();
  const [timePeriod, setTimePeriod] = useState("today");

  const stats = {
    totalUsers: 1250,
    successfulTransactions: 850,
    pendingTransactions: 45,
    earnings: 25000,
    pendingTickets: 12,
    pendingInvoices: 8,
  };

  const transactions = [
    {
      id: 1,
      type: "successful",
      amount: 500.0,
      date: "2024-03-20",
      time: "14:30",
      description: "Payment received",
      from: "John Doe",
      to: "System Account",
      status: "Completed",
      reference: "TRX-123456",
    },
    {
      id: 2,
      type: "pending",
      amount: 300.0,
      date: "2024-03-20",
      time: "15:45",
      description: "Payment processing",
      from: "System Account",
      to: "ABC Company",
      status: "Processing",
      reference: "TRX-123457",
    },
    {
      id: 3,
      type: "successful",
      amount: 750.0,
      date: "2024-03-19",
      time: "10:15",
      description: "Salary deposit",
      from: "Company XYZ",
      to: "System Account",
      status: "Completed",
      reference: "TRX-123458",
    },
  ];

  return (
    <div className="space-y-6 mb-14">
      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 sm:p-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-5">
            <CardTitle className="text-sm sm:text-base font-medium">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">
              {stats.totalUsers}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Registered users
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 sm:p-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-5">
            <CardTitle className="text-sm sm:text-base font-medium">
              Successful Transactions
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
              {stats.successfulTransactions}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Completed transactions
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 p-4 sm:p-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-5">
            <CardTitle className="text-sm font-medium">
              Pending Transactions
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {stats.pendingTransactions}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Awaiting confirmation
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 sm:p-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-5">
            <CardTitle className="text-sm font-medium">
              Total Earnings
            </CardTitle>
            <DollarSign className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              ${stats.earnings}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              System earnings
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 p-4 sm:p-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-5">
            <CardTitle className="text-sm font-medium">
              Pending Tickets
            </CardTitle>
            <Ticket className="h-4 w-4 text-red-600 dark:text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {stats.pendingTickets}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Support tickets
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 p-4 sm:p-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-5">
            <CardTitle className="text-sm font-medium">
              Pending Invoices
            </CardTitle>
            <FileText className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {stats.pendingInvoices}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Unpaid invoices
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card className="w-full dark:bg-slate-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Transaction History</CardTitle>
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
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead className="hidden md:table-cell">From</TableHead>
                  <TableHead className="hidden md:table-cell">To</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>${transaction.amount}</TableCell>
                    <TableCell>{transaction.time}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {transaction.from}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {transaction.to}
                    </TableCell>
                    <TableCell>{transaction.reference}</TableCell>
                    <TableCell
                      className={`${
                        transaction.type === "pending"
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
    </div>
  );
}

export default AdminDashboard;
