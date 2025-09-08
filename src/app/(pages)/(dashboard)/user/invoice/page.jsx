"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  FileText,
  Download,
  Eye,
  Edit,
  Trash2,
  Calendar,
  DollarSign,
  User,
  Mail,
  Phone,
  Copy,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import Loading from "@/components/Loading/Loading";
import { useQuery } from "@tanstack/react-query";

export default function Invoice() {
  const { data: session } = useSession();
  const [invoices, setInvoices] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [formData, setFormData] = useState({
    brand: "",
    fullName: "",
    email: "",
    phone: "",
    amount: "",
    currency: "BDT",
  });

  const { data: brandsData, isLoading: isBrandsLoading } = useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const response = await fetch(
        `/api/user/brand?email=${session?.user?.email}`
      );
      return response.json();
    },
    enabled: !!session?.user?.email,
  });

  const {
    data: invoicesData,
    isLoading: isInvoicesLoading,
    refetch: refetchInvoices,
  } = useQuery({
    queryKey: ["invoices"],
    queryFn: async () => {
      const response = await fetch(
        `/api/user/invoice?email=${session?.user?.email}`
      );
      return response.json();
    },
    enabled: !!session?.user?.email,
  });
  if (isBrandsLoading || isInvoicesLoading) return <Loading />;
  const brands = brandsData?.rows;
  console.log(invoicesData);
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.brand ||
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.amount
    ) {
      toast.error("Please fill in all required fields");
      return;
    }
    // console.log(formData);
    const data = {
      amount: formData.amount,
      currency: formData.currency,
      customer: {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
      },
      orderId: formData.email,
      redirectUrl: {
        success: formData.brand?.brand_url,
        failed: formData.brand?.brand_url,
      },
    };

    try {
      setIsLoading(true);
      const response = await fetch("/api/initiate-payment", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          "x-api-key": formData.brand?.api_key,
          "x-brand-key": formData.brand?.brand_key,
          "x-api-secret": formData.brand?.api_secret,
        },
      });
      const resData = await response.json();
      const invoiceData = {
        brand: formData.brand?.brand_name,
        fullName: formData.fullName,
        customer_email: formData.email,
        merchant_email: session?.user?.email,
        phone: formData.phone,
        amount: formData.amount,
        currency: formData.currency,
        paymentLink: resData?.redirectGatewayUrl,
      };

      const res = await fetch("/api/user/invoice", {
        method: "POST",
        body: JSON.stringify(invoiceData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        toast.success("Invoice created successfully");
        setIsDialogOpen(false);
        setFormData({
          brand: "",
          fullName: "",
          email: "",
          phone: "",
          amount: "",
          currency: "BDT",
        });
        refetchInvoices();
      }
    } catch (error) {
      toast.error("Failed to create invoice");
    } finally {
      setIsLoading(false);
    }
  };
  const getStatusColor = (status) => {
    if (status === "Pending") return "bg-yellow-500";
    if (status === "Success") return "bg-green-500";
    if (status === "Failed") return "bg-red-500";
  };
  const handleViewDetails = (invoice) => {
    setSelectedInvoice(invoice);
    setIsDetailsDialogOpen(true);
  };

  const handleCopyPaymentLink = () => {
    if (selectedInvoice?.paymentlink) {
      navigator.clipboard.writeText(selectedInvoice.paymentlink);
      toast.success("Payment link copied to clipboard!");
    }
  };
  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Invoice Management
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Create and manage your invoices
                </p>
              </div>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Invoice
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Create New Invoice
                  </DialogTitle>
                  <DialogDescription>
                    Fill in the details to create a new invoice
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    {/* Brand Selection */}
                    <div className="space-y-2">
                      <Label htmlFor="brand">Brand Category *</Label>
                      <Select
                        value={formData.brand?.brand_name || ""}
                        onValueChange={(value) => {
                          const selectedBrand = brands?.find(
                            (brand) => brand.brand_name === value
                          );
                          handleInputChange("brand", selectedBrand);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select brand category" />
                        </SelectTrigger>
                        <SelectContent className="text-black">
                          {brands?.map((brand, index) => (
                            <SelectItem
                              key={brand.id || index}
                              value={brand.brand_name}
                            >
                              {brand.brand_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Full Name */}
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="fullName"
                          type="text"
                          placeholder="Enter full name"
                          value={formData.fullName}
                          onChange={(e) =>
                            handleInputChange("fullName", e.target.value)
                          }
                          className="pl-10"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter email address"
                          value={formData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          className="pl-10"
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone *</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="Enter phone number"
                          value={formData.phone}
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                          className="pl-10"
                        />
                      </div>
                    </div>

                    {/* Amount and Currency */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="amount">Amount *</Label>
                        <div className="relative">
                          
                          <Input
                            id="amount"
                            type="number"
                            placeholder="0.00"
                            value={formData.amount}
                            onChange={(e) =>
                              handleInputChange("amount", e.target.value)
                            }
                            className="pl-10"
                            min="0"
                            step="0.01"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="currency">Currency *</Label>
                        <Select
                          value={formData.currency}
                          onValueChange={(value) =>
                            handleInputChange("currency", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="BDT">BDT</SelectItem>
                            <SelectItem value="USD">USD</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <DialogFooter className="gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isLoading ? "Creating..." : "Create Invoice"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      {/* Invoices Table Card */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Recent Invoices
          </CardTitle>
        </CardHeader>
        <CardContent>
          {invoicesData?.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No invoices yet
              </h3>
              <p className="text-gray-600 mb-4">
                Create your first invoice to get started
              </p>
              <Button
                onClick={() => setIsDialogOpen(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Invoice
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SL</TableHead>
                    <TableHead>Brand</TableHead>
                    <TableHead>Invoice ID</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Payment Link</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoicesData?.map((invoice, index) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell className="font-medium">
                        {invoice.brand}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{invoice.invoice_id}</Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{invoice.fullName}</div>
                          <div className="text-sm text-gray-600">
                            {invoice.customer_email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <a
                          href={invoice.paymentlink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 font-bold hover:underline"
                        >
                          {invoice.paymentlink && "Link"}
                        </a>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(invoice.status)}>
                          {invoice.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(invoice.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="primary"
                            onClick={() => handleViewDetails(invoice)}
                          >
                            View Details
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Invoice Details</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDetailsDialogOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>

          {selectedInvoice && (
            <div className="space-y-4">
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b">
                  <div className="grid grid-cols-2 gap-4 text-sm font-medium text-gray-600">
                    <div>Title</div>
                    <div>Information</div>
                  </div>
                </div>

                <div className="divide-y">
                  {/* Full Name */}
                  <div className="grid grid-cols-2 gap-4 px-4 py-3">
                    <div className="text-sm font-medium text-gray-600">
                      Full Name
                    </div>
                    <div className="text-sm text-gray-900">
                      {selectedInvoice.fullname}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="grid grid-cols-2 gap-4 px-4 py-3">
                    <div className="text-sm font-medium text-gray-600">
                      Email
                    </div>
                    <div className="text-sm text-gray-900">
                      {selectedInvoice.customer_email}
                    </div>
                  </div>

                  {/* Invoice ID */}
                  <div className="grid grid-cols-2 gap-4 px-4 py-3">
                    <div className="text-sm font-medium text-gray-600">
                      Invoice Id
                    </div>
                    <div className="text-sm text-gray-900 font-mono">
                      {selectedInvoice.invoice_id}
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="grid grid-cols-2 gap-4 px-4 py-3">
                    <div className="text-sm font-medium text-gray-600">
                      Amount
                    </div>
                    <div className="text-sm text-gray-900">
                      {selectedInvoice.currency} {selectedInvoice.amount}
                    </div>
                  </div>

                  {/* Currency */}
                  <div className="grid grid-cols-2 gap-4 px-4 py-3">
                    <div className="text-sm font-medium text-gray-600">
                      Currency
                    </div>
                    <div className="text-sm text-gray-900">
                      {selectedInvoice.currency}
                    </div>
                  </div>

                  {/* Payment Link */}
                  <div className="grid grid-cols-2 gap-4 px-4 py-3">
                    <div className="text-sm font-medium text-gray-600">
                      Payment Link
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-gray-900 truncate flex-1">
                        {selectedInvoice.paymentlink ||
                          "No payment link available"}
                      </div>
                      {selectedInvoice.paymentlink && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleCopyPaymentLink}
                          className="h-8 w-8 p-0"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="primary"
              onClick={() => setIsDetailsDialogOpen(false)}
              className="w-full"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
