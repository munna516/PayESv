"use client";
import Loading from "@/components/Loading/Loading";
import { Button } from "@/components/ui/button";
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
import { DownloadIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState, useMemo } from "react";

export default function Transactions() {
  const {data:session} = useSession();
  const [searchTerm, setSearchTerm] = useState("");

const {data:transactions, isLoading} = useQuery({
  queryKey: ["invoice"],
  queryFn: async () => {
    const response = await fetch(`/api/user/invoice?email=${session?.user?.email}`);
    return response.json();
  },
  enabled: !!session?.user?.email,
});

// Filter transactions based on search term
const filteredTransactions = useMemo(() => {
  if (!transactions || !searchTerm) return transactions;
  
  return transactions.filter(transaction => 
    transaction.merchant_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );
}, [transactions, searchTerm]);

// Function to generate and download PDF invoice
const downloadInvoice = async (transaction) => {
  try {
    const response = await fetch('/api/user/invoice/download', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transaction: transaction,
        userEmail: session?.user?.email
      }),
    });

    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${transaction.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } else {
      console.error('Failed to generate invoice');
    }
  } catch (error) {
    console.error('Error downloading invoice:', error);
  }
};

if(isLoading) return <Loading />;

  return (
    <Card className="w-full dark:bg-slate-700">
      <CardHeader className="flex flex-row items-center justify-between mb-6">
        <CardTitle className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold">
          Invoices
        </CardTitle>
        <div>
          <Input 
            type="text" 
            placeholder="Search by email or status..." 
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
                <TableHead>#</TableHead>
                <TableHead>Customer Email</TableHead>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Download</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions?.length > 0 ? filteredTransactions?.map((transaction,index) => (
                <TableRow key={transaction.id}>
                  <TableCell className="">{index+1}</TableCell>
                  <TableCell className="">{transaction.customer_email}</TableCell>
                  <TableCell className="">{transaction.transaction_id || "----------------------" }</TableCell>
                  <TableCell className="">{transaction.amount}{" "}{transaction.currency=="BDT" ? '৳': '$'}</TableCell>
                  <TableCell className="">{transaction.created_at.split("T")[0]}</TableCell>
                  <TableCell
                    className={`${
                      transaction.status == "pending"
                        ? "text-yellow-500 font-bold"
                        : "text-green-500 font-bold"
                    }`}
                  >
                    {transaction.status}
                  </TableCell>
                  <TableCell className="">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => downloadInvoice(transaction)}
                    >
                      <DownloadIcon className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    {searchTerm ? 'No matching invoices found' : 'No data found'}
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
