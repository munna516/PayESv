"use client";
import Loading from "@/components/Loading/Loading";
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
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useState, useMemo } from "react";

export default function Transactions() {
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: transactions, isLoading } = useQuery({
    queryKey: ["user_transactions"],
    queryFn: async () => {
      const res = await fetch(
        `/api/user/user-transactions?email=${session?.user?.email}`
      );
      return res.json();
    },
  });

  // Filter transactions based on search term
  const filteredTransactions = useMemo(() => {
    if (!transactions || !searchTerm.trim()) {
      return transactions;
    }

    const searchLower = searchTerm.toLowerCase();
    return transactions.filter((transaction) => {
      const amount = transaction?.amount?.toString() || "";
      const customerName = transaction?.customer_name?.toLowerCase() || "";
      const status = transaction?.status?.toLowerCase() || "";

      return (
        amount.includes(searchLower) ||
        customerName.includes(searchLower) ||
        status.includes(searchLower)
      );
    });
  }, [transactions, searchTerm]);

  if (isLoading) return <Loading />;

  return (
    <Card className="w-full dark:bg-slate-700">
      <CardHeader className="flex flex-row items-center justify-between mb-6">
        <CardTitle className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold">
          Transactions
        </CardTitle>
        <div>
          <Input
            type="text"
            placeholder="Search by amount, customer name, or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-200 dark:bg-slate-700">
                <TableHead>Date</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead className="hidden md:table-cell">From</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead> Time</TableHead>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions?.length > 0 ? (
                filteredTransactions?.map((transaction) => (
                  <TableRow key={transaction?.id}>
                    <TableCell className="">
                      {transaction?.created_at.split("T")[0]}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {transaction?.customer_email}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {transaction?.customer_name}
                    </TableCell>
                    <TableCell className="">
                      {" "}
                      {transaction?.currency == "BDT" ? "৳" : "$"}{" "}
                      {transaction?.amount}
                    </TableCell>
                    <TableCell className="">
                      {transaction.created_at.split("T")[1].split(".")[0]}
                    </TableCell>
                    
                    
                    <TableCell className="">
                      {transaction.transaction_id || "-------------"}
                    </TableCell>
                    <TableCell
                      className={`${
                        transaction?.status == "success"
                          ? "text-green-500 font-bold"
                          : transaction?.status === "pending"
                          ? "text-yellow-500 font-bold"
                          : "text-red-500 font-bold"
                      }`}
                    >
                      {transaction?.status}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    <span className="text-lg font-bold">
                      No Transaction Found
                    </span>
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
