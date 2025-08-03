"use client";

import React, { useState, useEffect, memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  CheckCircle2,
  Clock,
  DollarSign,
  Ticket,
  FileText,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/components/Loading/Loading";

function AdminDashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboardData"],
    queryFn: () => fetch("/api/admin/dashboard").then((res) => res.json()),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <Loading />;
  if (error) return <div>Error loading dashboard data</div>;

  const dashboardData = data?.rows[0];

  // Ensure we have valid data before creating charts
  if (!dashboardData) {
    return <div>No dashboard data available</div>;
  }

  return (
    <div className="space-y-6 mb-14">
      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 sm:p-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-5">
            <CardTitle className="text-sm sm:text-base font-medium">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">
              {dashboardData?.total_users}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Registered users
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 sm:p-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-5">
            <CardTitle className="text-sm sm:text-base font-medium">
              Successful Transactions
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
              {dashboardData?.successful_transactions}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Completed transactions
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 p-4 sm:p-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-5">
            <CardTitle className="text-sm font-medium">
              Pending Transactions
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {dashboardData?.unsuccessful_transactions}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Awaiting confirmation
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 sm:p-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-5">
            <CardTitle className="text-sm font-medium">
              Total Earnings
            </CardTitle>
            <DollarSign className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              ৳{" "}
              {parseFloat(dashboardData?.total_earning_usdt || 0) * 123 +
                parseFloat(dashboardData?.total_earning_bdt || 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              System earnings
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 p-4 sm:p-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-5">
            <CardTitle className="text-sm font-medium">
              Pending Tickets
            </CardTitle>
            <Ticket className="h-4 w-4 text-red-600 dark:text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {dashboardData?.pending_tickets}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Support tickets
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 p-4 sm:p-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-5">
            <CardTitle className="text-sm font-medium">
              Pending Invoices
            </CardTitle>
            <FileText className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {dashboardData?.pending_invoices || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Unpaid invoices
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AdminDashboard;
