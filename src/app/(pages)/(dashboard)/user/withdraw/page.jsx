"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { ArrowUpRight, Wallet, History, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function Withdraw() {
  const [amount, setAmount] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock data - replace with actual data from your backend
  const availableBalance = 0;
  const accounts = [
    { id: 1, name: "Bkash", number: "01XXXXXXXXX", type: "Mobile Banking" },
  ];

  const withdrawalHistory = [];

  const handleWithdraw = () => {
    if (!amount || !selectedAccount) {
      toast.error("Please fill in all fields");
      return;
    }

    const withdrawAmount = parseFloat(amount);
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (withdrawAmount > availableBalance) {
      toast.error("Insufficient balance");
      return;
    }

    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      toast.success("Please contact with admin for withdrawal");
      setAmount("");
      setSelectedAccount("");
    }, 1500);
  };

  return (
    <div className="space-y-6 mb-20">
      {/* Balance and Withdrawal Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Balance Card */}
        <Card className="dark:bg-slate-700 ">
          <CardHeader>
            <CardTitle className="text-xl font-bold">
              Available Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center  gap-10">
              <Wallet className="h-12 w-12 text-green-500" />
              <div>
                <p className="text-3xl font-bold">
                  ${availableBalance.toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Ready for withdrawal
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Withdrawal Form */}
        <Card className="dark:bg-slate-700">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Withdraw Funds</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="account">Select Account</Label>
                <Select
                  value={selectedAccount}
                  onValueChange={setSelectedAccount}
                >
                  <SelectTrigger id="account">
                    <SelectValue placeholder="Choose an account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((account) => (
                      <SelectItem
                        key={account.id}
                        value={account.id.toString()}
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">{account.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {account.number} • {account.type}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant="primary"
                className="w-full"
                onClick={handleWithdraw}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  "Processing..."
                ) : (
                  <>
                    <ArrowUpRight className="h-4 w-4 mr-2" />
                    Withdraw Now
                  </>
                )}
              </Button>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertCircle className="h-4 w-4" />
                <p>Withdrawals are processed within 24-48 hours</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Withdrawal History */}
      <Card className="dark:bg-slate-700">
        <CardHeader>
          <div className="flex items-center gap-2">
            <History className="h-5 w-5" />
            <CardTitle className="text-xl font-bold">
              Withdrawal History
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border dark:border-slate-600">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Transaction ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {withdrawalHistory.map((withdrawal) => (
                  <TableRow key={withdrawal.id}>
                    <TableCell>{withdrawal.date}</TableCell>
                    <TableCell>${withdrawal.amount.toFixed(2)}</TableCell>
                    <TableCell>{withdrawal.account}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          withdrawal.status === "Completed"
                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                            : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                        }`}
                      >
                        {withdrawal.status}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {withdrawal.transactionId}
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
