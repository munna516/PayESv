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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Loading from "@/components/Loading/Loading";

export default function Withdraw() {
  const [amount, setAmount] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [withdrawalDetails, setWithdrawalDetails] = useState(null);

  const { data: session } = useSession();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["availableBalance"],
    queryFn: () =>
      fetch(`/api/user/withdraw?email=${session?.user?.email}`).then((res) =>
        res.json()
      ),
    enabled: !!session?.user?.email,
  });

  const { data: withdrawalHistory, isLoading: withdrawalHistoryLoading } =
    useQuery({
      queryKey: ["withdrawal_History"],
      queryFn: () =>
        fetch(
          `/api/user/withdrawal-history?email=${session?.user?.email}`
        ).then((res) => res.json()),
      enabled: !!session?.user?.email,
    });
  if (isLoading || withdrawalHistoryLoading) return <Loading />;

  const bdt_balance = data?.bdt_balance || 0;
  const usd_balance = data?.usd_balance || 0;
  const methods = data?.methods || [];

  // Fee structure for different withdrawal methods
  const feeStructure = {
    Bkash: 1.99,
    Nagad: 1.99,
    Rocket: 1.99,
    "Bank (Bangladesh)": 2.99,
    Payeer: 6.99,
    Binance: 7.99,
    "USDT (BEP20)": 7.99,
    "USDT (TRC20)": 7.99,
    "Redot Pay": 8.49,
  };

  // Currency-based method filtering
  const bdtMethods = ["Bkash", "Nagad", "Rocket", "Bank (Bangladesh)"];
  const usdMethods = [
    "Payeer",
    "Binance",
    "USDT (BEP20)",
    "USDT (TRC20)",
    "Redot Pay",
  ];

  // Filter methods based on selected currency
  const getFilteredMethods = () => {
    if (!selectedCurrency) return methods;

    const allowedMethods = selectedCurrency === "BDT" ? bdtMethods : usdMethods;
    return methods.filter((method) => allowedMethods.includes(method.category));
  };

  // Calculate fee and final amount
  const calculateWithdrawal = (amount, currency, accountId) => {
    const selectedMethod = methods.find(
      (method) => method.id.toString() === accountId
    );
    if (!selectedMethod) return null;

    const feePercentage = feeStructure[selectedMethod.category] || 0;
    const feeAmount = (amount * feePercentage) / 100;
    const finalAmount = amount - feeAmount;

    return {
      originalAmount: amount,
      feePercentage,
      feeAmount,
      finalAmount,
      currency,
      method: selectedMethod.category,
    };
  };

  const handleWithdraw = () => {
    if (!amount || !selectedCurrency || !selectedAccount) {
      toast.error("Please fill in all fields");
      return;
    }

    const withdrawAmount = parseFloat(amount);
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    // Check minimum withdrawal amounts
    if (selectedCurrency === "BDT" && withdrawAmount < 130) {
      toast.error("Minimum withdrawal amount is 130 BDT");
      return;
    }

    if (selectedCurrency === "USD" && withdrawAmount < 1) {
      toast.error("Minimum withdrawal amount is 1 USD");
      return;
    }

    // Check balance
    const availableBalance =
      selectedCurrency === "BDT" ? bdt_balance : usd_balance;
    if (withdrawAmount > availableBalance) {
      toast.error("Insufficient balance");
      return;
    }

    // Validate currency-method compatibility
    const selectedMethod = methods.find(
      (method) => method.id.toString() === selectedAccount
    );

    if (selectedMethod) {
      const allowedMethods =
        selectedCurrency === "BDT" ? bdtMethods : usdMethods;
      if (!allowedMethods.includes(selectedMethod.category)) {
        toast.error(
          `Invalid withdrawal method for ${selectedCurrency}. Please select an appropriate method.`
        );
        return;
      }
    }

    // Calculate withdrawal details
    const details = calculateWithdrawal(
      withdrawAmount,
      selectedCurrency,
      selectedAccount
    );
    if (!details) {
      toast.error("Invalid withdrawal method");
      return;
    }

    setWithdrawalDetails(details);
    setIsDialogOpen(true);
  };

  const confirmWithdrawal = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch("/api/user/withdrawal-history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: session?.user?.email,
          amount: parseFloat(amount),
          withdraw_amount: parseFloat(withdrawalDetails.finalAmount),
          currency: selectedCurrency,
          method: selectedAccount,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data?.message);
        return;
      } else {
        toast.success(data?.message);
        setIsDialogOpen(false);
        setWithdrawalDetails(null);
        setAmount("");
        setSelectedCurrency("");
        setSelectedAccount("");
        refetch(); // Refresh balance
      }
    } catch (error) {
      toast.error("Failed to process withdrawal");
    } finally {
      setIsProcessing(false);
    }
  };

  // Reset selected account when currency changes
  const handleCurrencyChange = (currency) => {
    setSelectedCurrency(currency);
    setSelectedAccount(""); // Reset account selection when currency changes
  };

  const getCurrencySymbol = () => {
    return selectedCurrency === "BDT" ? "৳" : "$";
  };

  const getAvailableBalance = () => {
    return selectedCurrency === "BDT" ? bdt_balance : usd_balance;
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
            <div className="flex items-center  gap-5">
              <p className="text-lg font-bold ">Balance In BDT : </p>
              <div>
                <p className="text-2xl font-extrabold text-green-500">
                  ৳{bdt_balance}
                </p>
              </div>
            </div>
            <div className="flex items-center  gap-5 mt-5">
              <p className="text-lg font-bold ">Balance In USD : </p>
              <div>
                <p className="text-2xl font-extrabold text-green-500">
                  ${usd_balance}
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
              {/* Currency Selection */}
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={selectedCurrency}
                  onValueChange={handleCurrencyChange}
                >
                  <SelectTrigger id="currency">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BDT">BDT (Bangladeshi Taka)</SelectItem>
                    <SelectItem value="USD">USD (US Dollar)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Amount Input */}
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {getCurrencySymbol()}
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
                {selectedCurrency && (
                  <p className="text-sm text-muted-foreground">
                    Available: {getCurrencySymbol()}
                    {getAvailableBalance()}
                  </p>
                )}
              </div>

              {/* Account Selection */}
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
                    {getFilteredMethods()?.map((account) => (
                      <SelectItem
                        key={account.id}
                        value={account.id.toString()}
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {account.category}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Fee: {feeStructure[account.category] || 0}%
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedCurrency && getFilteredMethods().length === 0 && (
                  <p className="text-sm text-red-500">
                    No {selectedCurrency} withdrawal methods available. Please
                    add withdrawal methods first.
                  </p>
                )}
              </div>

              <Button
                variant="primary"
                className="w-full"
                onClick={handleWithdraw}
                disabled={
                  isProcessing ||
                  (selectedCurrency && getFilteredMethods().length === 0)
                }
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {withdrawalHistory?.map((withdrawal) => (
                  <TableRow key={withdrawal.id}>
                    <TableCell>
                      {new Date(withdrawal.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-bold">
                      {withdrawal.withdraw_amount} {withdrawal.currency}
                    </TableCell>
                    <TableCell>{withdrawal.method.category}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          withdrawal.status === "Completed"
                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                            : withdrawal.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                            : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                        }`}
                      >
                        {withdrawal.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Withdrawal</DialogTitle>
          </DialogHeader>
          {withdrawalDetails && (
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Withdrawal Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Method:</span>
                    <span className="font-medium">
                      {withdrawalDetails.method}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Original Amount:</span>
                    <span className="font-medium">
                      {getCurrencySymbol()}
                      {withdrawalDetails.originalAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fee ({withdrawalDetails.feePercentage}%):</span>
                    <span className="font-medium text-red-600">
                      -{getCurrencySymbol()}
                      {withdrawalDetails.feeAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-bold">
                      <span>You will receive:</span>
                      <span className="text-green-600">
                        {getCurrencySymbol()}
                        {withdrawalDetails.finalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmWithdrawal}
              disabled={isProcessing}
              className="bg-green-600 hover:bg-green-700"
            >
              {isProcessing ? "Processing..." : "Confirm Withdrawal"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
