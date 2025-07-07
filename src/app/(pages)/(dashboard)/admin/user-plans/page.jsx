"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
import { Search, Pencil } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/app/(pages)/pay/loading";

export default function UserPlans() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["user-plans"],
    queryFn: () => fetch("/api/admin/user-plans").then((res) => res.json()),
  });

  if (isLoading) return <Loading />;

  const userPlans = data?.rows;

  const handleEditPlan = (plan) => {
    setEditingPlan(plan);
    setFormData({
      websitequantity:
        plan.websitequantity == "Unlimited" ? 0 : plan.websitequantity,
      plan:
        plan.plan == 1
          ? "Personal Account Automation"
          : "Ready Payment Gateway",
      expires_at: 0,
    });
    setIsDialogOpen(true);
  };

  // Filter plans based on search query
  const filteredPlans = userPlans.filter((plan) =>
    plan.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 mb-14">
      <Card className="dark:bg-slate-700">
        <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <CardTitle className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold">
            Users Plan
          </CardTitle>
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-[300px]">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 dark:text-white"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border dark:border-slate-600">
            <Table>
              <TableHeader>
                <TableRow className="dark:border-slate-600">
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Website Quantity</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Expiry Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlans.map((plan, index) => (
                  <TableRow key={plan.id} className="dark:border-slate-600">
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">{plan.email}</TableCell>
                    <TableCell>{plan.websitequantity}</TableCell>
                    <TableCell>
                      {plan.plan == 1
                        ? "Personal Account Automation"
                        : "Ready Payment Gateway"}
                    </TableCell>
                    <TableCell>
                      {plan.yearly
                        ? "Yearly"
                        : plan.plan == 2
                        ? "Unlimited"
                        : "Monthly"}
                    </TableCell>
                    <TableCell>
                      {new Date(plan.expires_at).toLocaleDateString()}
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
