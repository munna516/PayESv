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
  TrendingUp,
  BarChart3,
  PieChart,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/components/Loading/Loading";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Memoized Chart Components to prevent unnecessary re-renders
const ChartWrapper = memo(({ children, className }) => (
  <div className={className}>{children}</div>
));

ChartWrapper.displayName = "ChartWrapper";

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

  // Safe data extraction with fallbacks
  const monthlyRevenue = dashboardData.monthly_revenue || [];
  const monthlyUsers = dashboardData.monthly_users || [];

  // Create labels for the last 12 months
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const monthlyData = {
    labels: months,
    datasets: [
      {
        label: "Revenue",
        data:
          monthlyRevenue.length > 0
            ? monthlyRevenue.map((item) => item.revenue || 0)
            : [
                12000, 19000, 15000, 25000, 22000, 30000, 28000, 35000, 32000,
                40000, 38000, 45000,
              ],
        borderColor: "rgb(99, 102, 241)",
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "rgb(99, 102, 241)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
      {
        label: "Users",
        data:
          monthlyUsers.length > 0
            ? monthlyUsers.map((item) => item.user_count || 0)
            : [100, 150, 120, 200, 180, 250, 220, 300, 280, 350, 320, 400],
        borderColor: "rgb(34, 197, 94)",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "rgb(34, 197, 94)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const transactionData = {
    labels: ["Successful", "Pending"],
    datasets: [
      {
        data: [
          dashboardData?.successful_transactions || 0,
          dashboardData?.unsuccessful_transactions || 0,
        ],
        backgroundColor: ["rgba(34, 197, 94, 0.8)", "rgba(251, 191, 36, 0.8)"],
        borderColor: ["rgb(34, 197, 94)", "rgb(251, 191, 36)"],
        borderWidth: 2,
        hoverBackgroundColor: ["rgba(34, 197, 94, 1)", "rgba(251, 191, 36, 1)"],
      },
    ],
  };

  const platformData = {
    labels: ["Users", "Transactions", "Tickets", "Invoices"],
    datasets: [
      {
        label: "Usage",
        data: [
          dashboardData.total_users || 0,
          dashboardData.successful_transactions || 0,
          dashboardData.pending_tickets || 0,
          dashboardData.pending_invoices || 0,
        ],
        backgroundColor: [
          "rgba(99, 102, 241, 0.8)",
          "rgba(34, 197, 94, 0.8)",
          "rgba(251, 191, 36, 0.8)",
          "rgba(239, 68, 68, 0.8)",
        ],
        borderColor: [
          "rgb(99, 102, 241)",
          "rgb(34, 197, 94)",
          "rgb(251, 191, 36)",
          "rgb(239, 68, 68)",
        ],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: "600",
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        padding: 12,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
          },
        },
      },
      y: {
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          font: {
            size: 12,
          },
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: "600",
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        padding: 12,
      },
    },
  };

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
              {dashboardData.total_users}
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
              {dashboardData.successful_transactions}
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
              {dashboardData.unsuccessful_transactions}
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
              $
              {parseFloat(dashboardData.total_earning_usdt || 0) * 125 +
                parseFloat(dashboardData.total_earning_bdt || 0)}
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
              {dashboardData.pending_tickets}
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
              {dashboardData.pending_invoices || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Unpaid invoices
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="space-y-6">
        {/* Revenue & Users Trend Chart */}
        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-indigo-600" />
                Revenue & Users Trend
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Monthly performance overview
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <ChartWrapper className="h-80 w-full">
              <Line data={monthlyData} options={chartOptions} />
            </ChartWrapper>
          </CardContent>
        </Card>

        {/* Transaction Status & Platform Usage */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 w-full">
          {/* Transaction Status Doughnut Chart */}
          <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-green-600" />
                  Transaction Status
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Distribution of transaction types
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <ChartWrapper className="h-80 w-full">
                <Doughnut data={transactionData} options={doughnutOptions} />
              </ChartWrapper>
            </CardContent>
          </Card>

          {/* Platform Usage Bar Chart */}
          <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  Platform Usage
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  User activity across platforms
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <ChartWrapper className="h-80 w-full">
                <Bar data={platformData} options={chartOptions} />
              </ChartWrapper>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
