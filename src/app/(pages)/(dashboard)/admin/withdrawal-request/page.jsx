"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  CheckCircle,
  XCircle,
  Trash2,
  Clock,
  DollarSign,
  User,
  Calendar,
} from "lucide-react";
import Loading from "@/components/Loading/Loading";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

export default function WithdrawalRequest() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    data: withdrawalRequests,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["withdrawalRequests"],
    queryFn: () =>
      fetch(`/api/admin/withdrawal-request`).then((res) => res.json()),
    enabled: !!session?.user?.email,
  });

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const response = await fetch("/api/admin/withdrawal-request", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, status }),
      });

      if (!response.ok) {
        toast.error("Failed to update status");
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries(["withdrawalRequests"]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const response = await fetch(`/api/admin/withdrawal-request?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete request");
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries(["withdrawalRequests"]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  if (isLoading) return <Loading />;

  const allRequests = withdrawalRequests || [];

  // Filter requests based on selected status
  const requests =
    selectedStatus === "all"
      ? allRequests
      : allRequests.filter((request) => request.status === selectedStatus);

  const handleStatusUpdate = async (id, status) => {
    const result = await Swal.fire({
      title: `Are you sure?`,
      text: `Do you want to ${status.toLowerCase()} this withdrawal request?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: status === "Completed" ? "#10b981" : "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: `Yes, ${status} it!`,
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      updateStatusMutation.mutate({ id, status });
    }
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setIsDialogOpen(true);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      Pending: {
        className:
          "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-300",
        icon: Clock,
      },
      Completed: {
        className:
          "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-300",
        icon: CheckCircle,
      },
      Rejected: {
        className:
          "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-300",
        icon: XCircle,
      },
    };

    const config = statusConfig[status] || statusConfig.Pending;
    const Icon = config.icon;

    return (
      <Badge className={`${config.className} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {status}
      </Badge>
    );
  };

  const getCurrencySymbol = (currency) => {
    return currency === "BDT" ? "৳" : "$";
  };

  const getStatusCount = (status) => {
    return allRequests.filter((req) => req.status === status).length;
  };

  return (
    <div className="space-y-6 mb-20">
      {/* Header with Status Filter Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Withdrawal Requests
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and process user withdrawal requests
          </p>
        </div>

        {/* Status Filter Buttons */}
        <div className="flex flex-wrap gap-3">
          <Button
            variant={selectedStatus === "all" ? "default" : "outline"}
            onClick={() => setSelectedStatus("all")}
            className="flex items-center gap-2"
          >
            <Clock className="h-4 w-4" />
            All ({allRequests.length})
          </Button>
          <Button
            variant={selectedStatus === "Pending" ? "default" : "outline"}
            onClick={() => setSelectedStatus("Pending")}
            className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700"
          >
            <Clock className="h-4 w-4" />
            Pending ({getStatusCount("Pending")})
          </Button>
          <Button
            variant={selectedStatus === "Completed" ? "default" : "outline"}
            onClick={() => setSelectedStatus("Completed")}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="h-4 w-4" />
            Completed ({getStatusCount("Completed")})
          </Button>
          <Button
            variant={selectedStatus === "Rejected" ? "default" : "outline"}
            onClick={() => setSelectedStatus("Rejected")}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
          >
            <XCircle className="h-4 w-4" />
            Rejected ({getStatusCount("Rejected")})
          </Button>
        </div>
      </div>

      {/* Requests Table */}
      <Card className="dark:bg-slate-700">
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            Withdrawal Requests ({requests.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border dark:border-slate-600">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">SL</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Currency</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <Clock className="h-12 w-12 text-gray-400" />
                        <p className="text-gray-500 dark:text-gray-400">
                          No withdrawal requests found
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  requests.map((request, index) => (
                    <TableRow
                      key={request.id}
                      className="hover:bg-gray-50 dark:hover:bg-slate-600"
                    >
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">{request.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span className="font-bold">
                            {getCurrencySymbol(request.currency)}
                            {request.withdraw_amount}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-medium">
                          {request.currency}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewDetails(request)}
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>

                          {request.status === "Pending" && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleStatusUpdate(request.id, "Completed")
                                }
                                className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                                disabled={updateStatusMutation.isPending}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleStatusUpdate(request.id, "Rejected")
                                }
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                disabled={updateStatusMutation.isPending}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle>Withdrawal Request Details</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">
                    Email
                  </label>
                  <p className="text-sm font-medium">{selectedRequest.email}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">
                    Status
                  </label>
                  <div>{getStatusBadge(selectedRequest.status)}</div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">
                    Original Amount
                  </label>
                  <p className="text-sm font-medium">
                    {getCurrencySymbol(selectedRequest.currency)}
                    {selectedRequest.amount}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">
                    Withdrawal Amount
                  </label>
                  <p className="text-sm font-medium text-green-600">
                    {getCurrencySymbol(selectedRequest.currency)}
                    {selectedRequest.withdraw_amount}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">
                    Currency
                  </label>
                  <p className="text-sm font-medium">
                    {selectedRequest.currency}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">
                    Date
                  </label>
                  <p className="text-sm font-medium">
                    {new Date(selectedRequest.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {selectedRequest.method && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">
                    Withdrawal Method Details
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Method:</span>
                        <span className="text-sm font-medium">
                          {selectedRequest.method.category}
                        </span>
                      </div>
                      {selectedRequest.method.personalAccountNumber && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            Account Number:
                          </span>
                          <span className="text-sm font-medium">
                            {selectedRequest.method.personalAccountNumber}
                          </span>
                        </div>
                      )}
                      {selectedRequest.method.bankName && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Bank:</span>
                          <span className="text-sm font-medium">
                            {selectedRequest.method.bankName}
                          </span>
                        </div>
                      )}
                      {selectedRequest.method.accountName && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            Account Name:
                          </span>
                          <span className="text-sm font-medium">
                            {selectedRequest.method.accountName}
                          </span>
                        </div>
                      )}
                      {selectedRequest.method.accountNumber && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            Account Number:
                          </span>
                          <span className="text-sm font-medium">
                            {selectedRequest.method.accountNumber}
                          </span>
                        </div>
                      )}
                      {selectedRequest.method.branch && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            Branch Name:
                          </span>
                          <span className="text-sm font-medium">
                            {selectedRequest.method.branch}
                          </span>
                        </div>
                      )}
                      {selectedRequest.method.bep20Address && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            BEP20 Address:
                          </span>
                          <span className="text-sm font-medium">
                            {selectedRequest.method.bep20Address}
                          </span>
                        </div>
                      )}
                      {selectedRequest.method.trc20Address && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            TRC20 Address:
                          </span>
                          <span className="text-sm font-medium">
                            {selectedRequest.method.trc20Address}
                          </span>
                        </div>
                      )}
                      {selectedRequest.method.binanceId && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            Binance ID:
                          </span>
                          <span className="text-sm font-medium">
                            {selectedRequest.method.binanceId}
                          </span>
                        </div>
                      )}
                      {selectedRequest.method.payeerId && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            Payeer ID:
                          </span>
                          <span className="text-sm font-medium">
                            {selectedRequest.method.payeerId}
                          </span>
                        </div>
                      )}
                      {selectedRequest.method.redotPayId && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            Redot Pay ID:
                          </span>
                          <span className="text-sm font-medium">
                            {selectedRequest.method.redotPayId}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
