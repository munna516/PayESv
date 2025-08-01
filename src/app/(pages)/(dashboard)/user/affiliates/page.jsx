"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

export default function Affiliates() {
  const { data: session } = useSession();
  const referralLink = `https://payesv.com/ref/${
    session?.user?.email.split("@")[0]
  }`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success("Referral link copied to clipboard!");
  };

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
      value: "1000 BDT",
      icon: Wallet,
    },
    {
      title: "Visits",
      value: "0",
      icon: Eye,
    },
    {
      title: "Registrations",
      value: "0",
      icon: UserPlus,
    },
    {
      title: "Referrals",
      value: "0",
      icon: Users2,
    },
    {
      title: "Conversion Rate",
      value: "3.2%",
      icon: TrendingUp,
    },
    {
      title: "Total Earnings",
      value: "0 BDT",
      icon: DollarSign,
    },
    {
      title: "Available Earnings",
      value: "0 BDT",
      icon: CreditCard,
    },
  ];

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
      </CardContent>
    </Card>
  );
}
