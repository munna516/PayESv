"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function BankTransactions() {
  const transactions = [];

  return (
    <Card className="w-full dark:bg-slate-700">
      <CardHeader className="flex flex-row items-center justify-between mb-6">
        <CardTitle className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold">
          Bank Transactions
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
              {transactions.length > 0 ? (
                transactions.map((transaction) => (
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
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center mt-3">
                    No Bank transactions found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
