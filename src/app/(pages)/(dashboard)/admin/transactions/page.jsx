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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function Transactions() {
  const [transactionType, setTransactionType] = useState("all");
  const [paymentMethod, setPaymentMethod] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data - replace with actual data from your backend
  const transactions = [
    {
      id: 1,
      email: "john.doe@example.com",
      paymentMethod: "bKash",
      transactionId: "TRX-123456",
      amount: 5000.0,
      status: "success",
      date: "2024-03-20",
    },
    {
      id: 2,
      email: "jane.smith@example.com",
      paymentMethod: "BRAC Bank",
      transactionId: "TRX-123457",
      amount: 7500.0,
      status: "pending",
      date: "2024-03-20",
    },
    {
      id: 3,
      email: "mike.johnson@example.com",
      paymentMethod: "Nagad",
      transactionId: "TRX-123458",
      amount: 3000.0,
      status: "success",
      date: "2024-03-19",
    },
    {
      id: 4,
      email: "sarah.wilson@example.com",
      paymentMethod: "City Bank",
      transactionId: "TRX-123459",
      amount: 4500.0,
      status: "success",
      date: "2024-03-19",
    },
    {
      id: 5,
      email: "david.brown@example.com",
      paymentMethod: "Rocket",
      transactionId: "TRX-123460",
      amount: 6000.0,
      status: "pending",
      date: "2024-03-18",
    },
  ];

  // Filter transactions based on selected filters
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesType =
      transactionType === "all" || transaction.status === transactionType;
    const matchesPaymentMethod =
      paymentMethod === "all" ||
      (paymentMethod === "mobile_banking" &&
        ["bKash", "Nagad", "Rocket", "Upay"].includes(
          transaction.paymentMethod
        )) ||
      (paymentMethod === "bank_transfer" &&
        ["BRAC Bank", "City Bank", "AB Bank", "DBBL"].includes(
          transaction.paymentMethod
        ));
    const matchesSearch =
      searchQuery === "" ||
      transaction.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.transactionId
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    return matchesType && matchesPaymentMethod && matchesSearch;
  });

  return (
    <div className="space-y-6 mb-14">
      <Card className="dark:bg-slate-700">
        <CardHeader className="">
          <CardTitle className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold">
            Transactions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 ">
          {/* Filters Section */}
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-10">
            <div className="flex gap-2">
              <Button
                variant={transactionType === "all" ? "primary" : "outline"}
                onClick={() => setTransactionType("all")}
                className="dark:bg-slate-600 dark:hover:bg-slate-500"
              >
                All
              </Button>
              <Button
                variant={transactionType === "success" ? "primary" : "outline"}
                onClick={() => setTransactionType("success")}
                className="dark:bg-slate-600 dark:hover:bg-slate-500"
              >
                Success
              </Button>
            </div>

            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Payment Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="mobile_banking">Mobile Banking</SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
              </SelectContent>
            </Select>

            <div className="relative w-full md:w-[300px]">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 dark:text-white"
              />
            </div>
          </div>

          {/* Transactions Table */}
          <div className="rounded-md border dark:border-slate-600">
            <Table>
              <TableHeader>
                <TableRow className="dark:border-slate-600">
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead>Customer Email</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Payment Method
                  </TableHead>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow
                    key={transaction.id}
                    className="dark:border-slate-600"
                  >
                    <TableCell>{transaction.id}</TableCell>
                    <TableCell className="font-medium">
                      {transaction.email}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                        {transaction.paymentMethod}
                      </span>
                    </TableCell>
                    <TableCell>{transaction.transactionId}</TableCell>
                    <TableCell>৳{transaction.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.status === "success"
                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                            : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </TableCell>
                    <TableCell>{transaction.date}</TableCell>
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
