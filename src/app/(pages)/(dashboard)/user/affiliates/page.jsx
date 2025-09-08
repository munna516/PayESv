"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import {
  Copy,
  Link,
  Percent,
  Wallet,
  Eye,
  UserPlus,
  Users2,
  TrendingUp,
  DollarSign,
  CreditCard,
} from "lucide-react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import Loading from "@/components/Loading/Loading";
import { useQuery } from "@tanstack/react-query";

export default function Affiliates() {
  const { data: session } = useSession();
  const referralLink = `https://payesv.com/ref/${
    session?.user?.email.split("@")[0]
  }`;

  const { data: referral, isLoading } = useQuery({
    queryKey: ["referral"],
    queryFn: async () => {
      const response = await fetch(
        `/api/user/referral?email=${session?.user?.email}`
      );
      return response.json();
    },
    enabled: !!session?.user?.email,
  });

  const { data: withdrawInfo, refetch: refetchWithdrawInfo } = useQuery({
    queryKey: ["withdraw", session?.user?.email],
    queryFn: async () => {
      const res = await fetch(
        `/api/user/withdraw?email=${session?.user?.email}`
      );
      return res.json();
    },
    enabled: !!session?.user?.email,
  });

  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("BDT");
  const [methodId, setMethodId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [newMethodCategory, setNewMethodCategory] = useState("");
  const [newMethodAccount, setNewMethodAccount] = useState("");
  const [savingMethod, setSavingMethod] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success("Referral link copied to clipboard!");
  };
  if (isLoading) return <Loading />;
  console.log(referral);
  const affiliateStats = [
    {
      title: "Referral Link",
      value: referralLink,
      icon: Link,
      action: (
        <Button variant="outline" size="sm" onClick={copyToClipboard}>
          <Copy className="h-4 w-4 mr-2" />
          Copy
        </Button>
      ),
    },
    {
      title: "Commission Rate",
      value: "10%",
      icon: Percent,
    },
    {
      title: "Minimum Payout",
      value: "500 BDT",
      icon: Wallet,
    },
    {
      title: "Visits",
      value: referral?.visits,
      icon: Eye,
    },
    {
      title: "Registrations",
      value: referral?.registrations,
      icon: UserPlus,
    },
    {
      title: "Referrals",
      value: referral?.referrals,
      icon: Users2,
    },
    {
      title: "Available Withdrawals",
      value: referral?.available_withdrawals + " BDT",
      icon: TrendingUp,
    },
    {
      title: "Total Earnings",
      value: referral?.total_earnings + " BDT",
      icon: DollarSign,
    },
    {
      title: "Available Earnings",
      value: referral?.available_earnings + " BDT",
      icon: CreditCard,
    },
  ];

  const handleSubmit = async () => {
    if (amount < 500) {
      toast.error("Minimum withdrawal amount is 500 BDT");
      return;
    }
    if (currency === "BDT" && amount > withdrawInfo?.bdt_balance) {
      toast.error("Insufficient balance");
      return;
    }
    if (currency === "USD" && amount > withdrawInfo?.usd_balance) {
      toast.error("Insufficient balance");
      return;
    }
    toast.success("Withdrawal request submitted successfully");
  };

  return (
    <Card className="p-6 dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="text-3xl font-bold tracking-tight">
          Affiliates
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {affiliateStats.map((stat, index) => (
            <Card key={index} className="dark:bg-gray-800 bg-green-50 h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">{stat.value}</div>
                {stat.action && <div className="mt-4">{stat.action}</div>}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Withdrawal Request Section */}
        <div className="mt-10">
          <Card className="dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">
                Withdrawal Request
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="mb-2 block">Currency</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BDT">
                        BDT (Available: {withdrawInfo?.bdt_balance ?? 0})
                      </SelectItem>
                      <SelectItem value="USD">
                        USD (Available: {withdrawInfo?.usd_balance ?? 0})
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-2 block">Amount</Label>
                  <Input
                    type="number"
                    min={0}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label className="mb-2 block">
                    Add New Method (Bkash, Nagad, Rocket, Binance)
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Select
                        value={newMethodCategory}
                        onValueChange={(v) => {
                          setNewMethodCategory(v);
                          setNewMethodAccount("");
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Bkash">Bkash</SelectItem>
                          <SelectItem value="Nagad">Nagad</SelectItem>
                          <SelectItem value="Rocket">Rocket</SelectItem>
                          <SelectItem value="Binance">Binance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="md:col-span-2">
                      <Input
                        value={newMethodAccount}
                        onChange={(e) => setNewMethodAccount(e.target.value)}
                        placeholder={
                          newMethodCategory === "Binance"
                            ? "Enter your Binance ID"
                            : "Enter your personal account number"
                        }
                      />
                    </div>
                  </div>
                  <div className="mt-3"></div>
                </div>
              </div>
              <div className="mt-6">
                <Button variant="primary" onClick={handleSubmit}>
                  {submitting ? "Submitting..." : "Submit Withdrawal"}
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  Minimum balance required: 500 in selected currency. The submit
                  button is enabled only when you meet the requirement and the
                  amount is within your available balance.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
