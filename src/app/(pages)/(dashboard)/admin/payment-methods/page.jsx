"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/components/Loading/Loading";
import toast from "react-hot-toast";
import Image from "next/image";
import Swal from "sweetalert2";

export default function PaymentMethods() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [editPayment, setEditPayment] = useState(false);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["payment-methods"],
    queryFn: () => fetch("/api/admin/payment-method").then((res) => res.json()),
  });

  const [formData, setFormData] = useState({
    logo: "",
    name: "",
    type: "",
    sort: "",
    status: "active",
  });

  if (isLoading) return <Loading />;
  if (data?.error) {
    return toast.error(data.error);
  }
  const paymentMethods = data?.rows || [];

  const filteredMethods = paymentMethods.filter((method) => {
    const name = method.method_name || "";
    const type = method.method_type || "";
    const status = method.status || "";

    const matchesSearch =
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      type.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleAddNew = () => {
    setSelectedMethod(null);
    setEditPayment(false);
    setFormData({
      logo: "",
      name: "",
      type: "",
      sort: "",
      status: "active",
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (method) => {
    setSelectedMethod(method);
    setEditPayment(true);
    setFormData({
      logo: method.method_logo || "",
      name: method.method_name || "",
      type: method.method_type || "",
      sort: method.sort?.toString() || "",
      status: method.status || "active",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await fetch(`/api/admin/payment-method`, {
          method: "DELETE",
          body: JSON.stringify({ id }),
        });
        const data = await response.json();

        if (data?.rowCount > 0) {
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
          });
          refetch();
        }
      }
    });
  };

  const handleSave = async () => {
    console.log("this is form data", formData);
    console.log("this is edit payment", editPayment);
    try {
      if (editPayment) {
        // Handle edit operation
        const response = await fetch("/api/admin/payment-method", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: selectedMethod.id,
            method_logo: formData.logo,
            method_name: formData.name,
            method_type: formData.type,
            sort: parseInt(formData.sort) || 0,
            status: formData.status,
          }),
        });
        const data = await response.json();
        console.log("Edit response:", data);
        if (data?.rowCount > 0) {
          toast.success("Payment method updated");
          refetch();
        } else {
          toast.error("Failed to update payment method");
        }
      } else {
        // Handle add operation
        const response = await fetch("/api/admin/payment-method", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            method_logo: formData.logo,
            method_name: formData.name,
            method_type: formData.type,
            sort: parseInt(formData.sort) || 0,
            status: formData.status,
          }),
        });
        const data = await response.json();
        console.log("Add response:", data);
        if (data?.rowCount > 0) {
          toast.success("Payment method created successfully");
          refetch();
        } else {
          toast.error("Failed to create payment method");
        }
      }
    } catch (error) {
      toast.error("Failed to save payment method");
    } finally {
      setIsDialogOpen(false);
      setEditPayment(false);
      setSelectedMethod(null);
    }
  };

  return (
    <div className="mb-20">
      <Card className="dark:bg-slate-700">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle>Payment Methods</CardTitle>
          <Button
            variant="primary"
            onClick={handleAddNew}
            className="w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex gap-2">
              <Button
                variant={statusFilter === "all" ? "primary" : "outline"}
                onClick={() => setStatusFilter("all")}
              >
                All
              </Button>
              <Button
                variant={statusFilter === "active" ? "primary" : "outline"}
                onClick={() => setStatusFilter("active")}
              >
                Active
              </Button>
              <Button
                variant={statusFilter === "deactive" ? "primary" : "outline"}
                onClick={() => setStatusFilter("deactive")}
              >
                Deactive
              </Button>
            </div>
            <div className="relative w-full sm:w-[300px]">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search payment methods..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {paymentMethods.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">#</TableHead>
                    <TableHead>Method Name</TableHead>
                    <TableHead>Method Type</TableHead>
                    <TableHead>Method Logo</TableHead>
                    <TableHead>Sort</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMethods.map((method, index) => (
                    <TableRow key={method.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{method.method_name}</TableCell>
                      <TableCell>{method.method_type}</TableCell>
                      <TableCell>
                        <Image
                          src={method.method_logo}
                          alt={method.method_name}
                          className="w-10 h-10 rounded-full"
                          width={40}
                          height={40}
                        />
                      </TableCell>
                      <TableCell>{method.sort}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            method.status === "active"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                          }`}
                        >
                          {method.status === "active" ? "Active" : "Deactive"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(method)}
                            className="h-8 w-8"
                          >
                            <Pencil className="h-4 w-4 dark:text-white" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(method.id)}
                            className="h-8 w-8 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex justify-center items-center h-full">
              <p className="text-muted-foreground">No payment methods found</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] dark:bg-slate-700">
          <DialogHeader>
            <DialogTitle>
              {editPayment ? "Edit Payment Method" : "Add New Payment Method"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="logo">Gateway Logo Link</Label>
              <Input
                id="logo"
                value={formData.logo}
                onChange={(e) =>
                  setFormData({ ...formData, logo: e.target.value })
                }
                placeholder="https://example.com/logo.png"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Method Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter method name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">Method Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select method type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cards">Cards</SelectItem>
                  <SelectItem value="Mobile Banking">Mobile Banking</SelectItem>
                  <SelectItem value="Net Banking">Net Banking</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="sort">Sort</Label>
                <Input
                  id="sort"
                  type="number"
                  value={formData.sort}
                  onChange={(e) =>
                    setFormData({ ...formData, sort: e.target.value })
                  }
                  placeholder="Enter sort order"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="deactive">Deactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
              {editPayment ? "Save changes" : "Add Payment Method"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
