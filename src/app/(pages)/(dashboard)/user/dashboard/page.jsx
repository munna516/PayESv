"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useQuery } from "@tanstack/react-query";
import Loading from "@/components/Loading/Loading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export default function Dashboard() {
  const { data: session } = useSession();
  const [currency, setCurrency] = useState("BDT");
  const handleCurrencyChange = (value) => {
    setCurrency(value);
  };
  const { data: transactions, isLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: () =>
      fetch(`/api/user/transactions?email=${session?.user?.email}`).then(
        (res) => res.json()
      ),
    enabled: !!session?.user?.email,
  });

  if (isLoading) return <Loading />;
 
  return (
    <div className="space-y-6 mb-14">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">User Dashboard</h1>
        </div>
        <div className="">
          <ToggleGroup
            type="single"
            value={currency}
            onValueChange={(val) => setCurrency(val)}
            className={`rounded-full p-1 gap-3 border-2  mb-3`}
          >
            <ToggleGroupItem
              value="BDT"
              className={`px-6 py-3 rounded-full ${
                currency == "BDT" ? "bg-green-500 text-white font-bold" : ""
              }`}
            >
              BDT
            </ToggleGroupItem>
            <ToggleGroupItem
              value="USD"
              className={`px-6 py-3 rounded-full ${
                currency == "USD" ? "bg-green-500 text-white font-bold" : ""
              }`}
            >
              USD
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      {/* Stats Cards */}
      {session?.plan === "0" || session?.plan === "1" ? (
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
                {currency === "BDT" ? "৳ " : "$ "}
                {currency === "BDT"
                  ? transactions?.successAmount?.BDT
                  : transactions?.successAmount?.USD}
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
                {currency === "BDT" ? "৳ " : "$ "}
                {currency === "BDT"
                  ? transactions?.successAmount?.BDT
                  : transactions?.successAmount?.USD}
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
                {currency === "BDT" ? "৳ " : "$ "}
                {currency === "BDT"
                  ? transactions?.pendingAmount?.BDT
                  : transactions?.pendingAmount?.USD}
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
                {currency === "BDT" ? "৳ " : "$ "}
                {currency === "BDT"
                  ? transactions?.allPayments?.BDT
                  : transactions?.allPayments?.USD}
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
                {currency === "BDT" ? "৳ " : "$ "}
                {currency === "BDT"
                  ? transactions?.todayAmount?.BDT
                  : transactions?.todayAmount?.USD}
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
                {currency === "BDT" ? "৳ " : "$ "}
                {currency === "BDT"
                  ? transactions?.yesterdayAmount?.BDT
                  : transactions?.yesterdayAmount?.USD}
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
                {currency === "BDT" ? "৳ " : "$ "}
                {currency === "BDT"
                  ? transactions?.last7DaysAmount?.BDT
                  : transactions?.last7DaysAmount?.USD}
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
                {currency === "BDT" ? "৳ " : "$ "}
                {currency === "BDT"
                  ? transactions?.last30DaysAmount?.BDT
                  : transactions?.last30DaysAmount?.USD}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Transactions Table */}
      <Card className="w-full dark:bg-slate-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Transaction History</CardTitle>
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
                  <TableHead>Currency</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions?.transactions.map((transaction) => (
                  <TableRow key={transaction?.id}>
                    <TableCell className="">
                      {transaction.created_at.split("T")[0]}
                    </TableCell>
                    <TableCell className="">
                      {transaction?.currency == "BDT" ? "৳" : "$"}{" "}
                      {transaction.amount}
                    </TableCell>

                    <TableCell className="">
                      {transaction.created_at.split("T")[1].split(".")[0]}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {transaction.customer_name}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {transaction.merchant_email}
                    </TableCell>
                    <TableCell className="">
                      {transaction.transaction_id || "-----"}
                    </TableCell>
                    <TableCell className="">{transaction.currency}</TableCell>
                    <TableCell
                      className={`${
                        transaction.status == "pending"
                          ? "text-yellow-500 font-bold"
                          : transaction.status == "success"
                          ? "text-green-500 font-bold"
                          : "text-red-500 font-bold"
                      }`}
                    >
                      {transaction.status.charAt(0).toUpperCase() +
                        transaction.status.slice(1)}
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
