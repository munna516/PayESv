"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Plus } from "lucide-react";
import { toast } from "react-hot-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Loading from "@/components/Loading/Loading";

export default function WithdrawMethods() {
  const { data: session } = useSession();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingMethod, setEditingMethod] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    category: "",
    personalAccountNumber: "",
    bankName: "",
    accountName: "",
    accountNumber: "",
    branch: "",
    binanceId: "",
    trc20Address: "",
    bep20Address: "",
    payeerId: "",
    redotPayId: "",
  });

  // TODO: Replace with actual user ID from your auth system
  const userId = "user123"; // This should come from your authentication context

  const categories = [
    "Bkash",
    "Nagad",
    "Rocket",
    "Bank (Bangladesh)",
    "Binance",
    "USDT (TRC20)",
    "USDT (BEP20)",
    "Payeer",
    "Redot Pay",
  ];

  // Fetch withdrawal methods
  const {
    data: withdrawMethods = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["withdrawalMethods", userId],
    queryFn: async () => {
      const response = await fetch(
        `/api/user/withdrawal-methods?email=${session?.user?.email}`
      );
      if (!response.ok) {
        toast.error("Failed to fetch withdrawal methods");
      }
      const data = await response.json();
      return data.methods || [];
    },
    enabled: !!session?.user?.email,
  });

  const resetForm = () => {
    setFormData({
      category: "",
      personalAccountNumber: "",
      bankName: "",
      accountName: "",
      accountNumber: "",
      branch: "",
      binanceId: "",
      trc20Address: "",
      bep20Address: "",
      payeerId: "",
      redotPayId: "",
    });
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateAccountNumber = () => {
    const { category, personalAccountNumber } = formData;

    if (category === "Bkash" || category === "Nagad") {
      if (personalAccountNumber.length !== 11) {
        toast.error(`${category} number must contain 11 digits`);
        return false;
      }
    } else if (category === "Rocket") {
      if (personalAccountNumber.length !== 12) {
        toast.error("Rocket number must contain 12 digits");
        return false;
      }
    }

    return true;
  };

  const getInputFields = () => {
    switch (formData.category) {
      case "Bkash":
      case "Nagad":
      case "Rocket":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="personalAccountNumber">
                Personal Account Number
              </Label>
              <Input
                id="personalAccountNumber"
                value={formData.personalAccountNumber}
                onChange={(e) =>
                  handleInputChange("personalAccountNumber", e.target.value)
                }
                placeholder={`Enter ${formData.category} account number`}
                maxLength={formData.category === "Rocket" ? 12 : 11}
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.category === "Rocket"
                  ? "Must be 12 digits"
                  : "Must be 11 digits"}
              </p>
            </div>
          </div>
        );

      case "Bank (Bangladesh)":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="bankName">Bank Name</Label>
              <Input
                id="bankName"
                value={formData.bankName}
                onChange={(e) => handleInputChange("bankName", e.target.value)}
                placeholder="Enter bank name"
              />
            </div>
            <div>
              <Label htmlFor="accountName">Account Name</Label>
              <Input
                id="accountName"
                value={formData.accountName}
                onChange={(e) =>
                  handleInputChange("accountName", e.target.value)
                }
                placeholder="Enter account holder name"
              />
            </div>
            <div>
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                value={formData.accountNumber}
                onChange={(e) =>
                  handleInputChange("accountNumber", e.target.value)
                }
                placeholder="Enter account number"
              />
            </div>
            <div>
              <Label htmlFor="branch">Branch</Label>
              <Input
                id="branch"
                value={formData.branch}
                onChange={(e) => handleInputChange("branch", e.target.value)}
                placeholder="Enter branch name"
              />
            </div>
          </div>
        );

      case "Binance":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="binanceId">Binance ID</Label>
              <Input
                id="binanceId"
                value={formData.binanceId}
                onChange={(e) => handleInputChange("binanceId", e.target.value)}
                placeholder="Enter Binance ID"
              />
            </div>
          </div>
        );

      case "USDT (TRC20)":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="trc20Address">Address (TRC20)</Label>
              <Input
                id="trc20Address"
                value={formData.trc20Address}
                onChange={(e) =>
                  handleInputChange("trc20Address", e.target.value)
                }
                placeholder="Enter TRC20 address"
              />
            </div>
          </div>
        );

      case "USDT (BEP20)":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="bep20Address">Address (BEP20)</Label>
              <Input
                id="bep20Address"
                value={formData.bep20Address}
                onChange={(e) =>
                  handleInputChange("bep20Address", e.target.value)
                }
                placeholder="Enter BEP20 address"
              />
            </div>
          </div>
        );

      case "Payeer":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="payeerId">Payeer ID</Label>
              <Input
                id="payeerId"
                value={formData.payeerId}
                onChange={(e) => handleInputChange("payeerId", e.target.value)}
                placeholder="Enter Payeer ID"
              />
            </div>
          </div>
        );

      case "Redot Pay":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="redotPayId">Redot Pay ID</Label>
              <Input
                id="redotPayId"
                value={formData.redotPayId}
                onChange={(e) =>
                  handleInputChange("redotPayId", e.target.value)
                }
                placeholder="Enter Redot Pay ID"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const handleSubmit = async () => {
    if (!formData.category) {
      toast.error("Please select a category");
      return;
    }
    // Validate account number length for specific categories
    if (!validateAccountNumber()) {
      return;
    }

    const methodData = {
      id: isEditMode ? editingMethod.id : Date.now(),
      category: formData.category,
      ...formData,
    };

    if (isEditMode) {
      try {
        const response = await fetch("/api/user/withdrawal-methods", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: session?.user?.email,
            methodId: editingMethod.id,
            updatedMethod: methodData,
          }),
        });
        if (!response.ok) {
          throw new Error("Failed to update withdrawal method");
        }
        const data = await response.json();
        if (!response.ok) {
          toast.error(data.message);
        } else {
          refetch();
          toast.success(data?.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    } else {
      try {
        const response = await fetch("/api/user/withdrawal-methods", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: session?.user?.email,
            methods: [...withdrawMethods, methodData],
          }),
        });
        const data = await response.json();
        if (!response.ok) {
          toast.error(data.message);
        } else {
          refetch();
          toast.success(data?.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    }

    handleClose();
  };

  const handleEdit = (method) => {
    setEditingMethod(method);
    setFormData({
      category: method.category,
      personalAccountNumber: method.personalAccountNumber || "",
      bankName: method.bankName || "",
      accountName: method.accountName || "",
      accountNumber: method.accountNumber || "",
      branch: method.branch || "",
      binanceId: method.binanceId || "",
      trc20Address: method.trc20Address || "",
      bep20Address: method.bep20Address || "",
      payeerId: method.payeerId || "",
      redotPayId: method.redotPayId || "",
    });
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const handleClose = () => {
    setIsDialogOpen(false);
    setIsEditMode(false);
    setEditingMethod(null);
    resetForm();
  };

  const getMethodDisplayInfo = (method) => {
    switch (method.category) {
      case "Bkash":
      case "Nagad":
      case "Rocket":
        return { label: "Account Number", value: method.personalAccountNumber };
      case "Bank (Bangladesh)":
        return {
          label: "Bank Details",
          value: `${method.bankName} - ${method.accountName}`,
        };
      case "Binance":
        return { label: "Binance ID", value: method.binanceId };
      case "USDT (TRC20)":
        return { label: "TRC20 Address", value: method.trc20Address };
      case "USDT (BEP20)":
        return { label: "BEP20 Address", value: method.bep20Address };
      case "Payeer":
        return { label: "Payeer ID", value: method.payeerId };
      case "Redot Pay":
        return { label: "Redot Pay ID", value: method.redotPayId };
      default:
        return { label: "Details", value: "N/A" };
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-4">
              Error loading withdrawal methods
            </p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-14">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Setup Your Withdrawal Method
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Configure your preferred withdrawal methods for receiving payments
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setIsEditMode(false);
                resetForm();
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Setup
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] dark:bg-slate-700">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">
                {isEditMode
                  ? "Edit Withdrawal Method"
                  : "Setup Withdrawal Method"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    handleInputChange("category", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.category && getInputFields()}

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleSubmit}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      {isEditMode ? "Updating..." : "Saving..."}
                    </div>
                  ) : isEditMode ? (
                    "Update"
                  ) : (
                    "Submit"
                  )}
                </Button>
                <Button
                  onClick={handleClose}
                  variant="outline"
                  className="flex-1"
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Withdrawal Methods List */}
      <div
        className={`${
          withdrawMethods?.length === 0
            ? "grid grid-cols-1 justify-center items-center"
            : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        }`}
      >
        {withdrawMethods?.length === 0 ? (
          <Card className="border-dashed border-2 border-gray-300 dark:border-gray-600">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <Plus className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No withdrawal methods set up
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-center mb-4">
                Click the Setup button to add your first withdrawal method
              </p>
            </CardContent>
          </Card>
        ) : (
          withdrawMethods?.map((method) => {
            const displayInfo = getMethodDisplayInfo(method);
            return (
              <div key={method.id}>
                <Card
                  key={method.id}
                  className="hover:shadow-md transition-shadow dark:bg-slate-700 hover:bg-green-50 "
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge
                            variant="secondary"
                            className="text-sm bg-blue-100  text-blue-600   hover:text-blue-800 hover:bg-blue-200"
                          >
                            {method.category}
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {displayInfo.label}
                          </p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white break-all">
                            {displayInfo.value}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(method)}
                          className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white hover:text-white"
                          disabled={loading}
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
