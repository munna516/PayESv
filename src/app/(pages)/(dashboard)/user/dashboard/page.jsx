"use client";

import { useState } from "react";
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
import { Wallet, Clock, CreditCard } from "lucide-react";
import { useSession } from "next-auth/react";

export default function Dashboard() {
  const [timePeriod, setTimePeriod] = useState("today");

  const { data: session } = useSession();

  // Mock data - replace with actual data from your backend
  const stats = {
    balance: 2500.0,
    successfulTransactions: 1500.0,
    pendingTransactions: 500.0,
    payments: 2000.0,
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
      to: "Your Account",
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
      from: "Your Account",
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
      to: "Your Account",
      status: "Completed",
      reference: "TRX-123458",
    },
  ];

  return (
    <div className=" space-y-6 mb-14">
      {/* Stats Cards */}
      {session?.plan === "0" ? (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 sm:p-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-5">
              <CardTitle className="text-sm sm:text-base font-medium">
                Total Balance
              </CardTitle>
              <Wallet className="h-4 w-4 text-green-600 dark:text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">
                ${stats.balance.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Available for withdrawal
              </p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br  from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 sm:p-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-5">
              <CardTitle className="text-sm sm:text-base font-medium">
                Successful Transactions
              </CardTitle>
              <Wallet className="h-4 w-4 text-green-600 dark:text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">
                ${stats.balance.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Total successful transactions
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br  from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 p-4 sm:p-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-5">
              <CardTitle className="text-sm font-medium">
                Pending Transactions
              </CardTitle>
              <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                ${stats.pendingTransactions.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Awaiting confirmation
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br   from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 sm:p-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-5">
              <CardTitle className="text-sm font-medium">
                Total Payments
              </CardTitle>
              <CreditCard className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                ${stats.payments.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Processed payments
              </p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 sm:p-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-5">
              <CardTitle className="text-sm sm:text-base font-medium">
                Todays Transactions
              </CardTitle>
              <Wallet className="h-4 w-4 text-green-600 dark:text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">
                ${stats.balance.toFixed(2)}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br  from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 sm:p-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-5">
              <CardTitle className="text-sm sm:text-base font-medium">
                Yesterday Transactions
              </CardTitle>
              <Wallet className="h-4 w-4 text-green-600 dark:text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">
                ${stats.balance.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br  from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 p-4 sm:p-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-5">
              <CardTitle className="text-sm font-medium">
                Last 7 Days Transactions
              </CardTitle>
              <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                ${stats.pendingTransactions.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br   from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 sm:p-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-5">
              <CardTitle className="text-sm font-medium">
                Last 30 Days Transactions
              </CardTitle>
              <CreditCard className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                ${stats.payments.toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

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
                  <TableHead> Time</TableHead>
                  <TableHead className="hidden md:table-cell">From</TableHead>
                  <TableHead className="hidden md:table-cell">To</TableHead>
                  <TableHead>Reference</TableHead>
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
                    <TableCell className="">{transaction.reference}</TableCell>
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
    </div>
  );
}
