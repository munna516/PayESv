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
import { Textarea } from "@/components/ui/textarea";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/components/Loading/Loading";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

export default function Coupons() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  const { data, isLoading,  refetch } = useQuery({
    queryKey: ["coupons"],
    queryFn: () => fetch("/api/admin/coupons").then((res) => res.json()),
  });
  const [formData, setFormData] = useState({
    code: "",
    type: "fixed",
    price: "",
    status: "active",
    description: "",
  });

  if (isLoading) return <Loading />;
  const coupons = data?.rows || [];
  const filteredCoupons = coupons.filter((coupon) => {
    const matchesSearch = coupon.code
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || coupon.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddNew = () => {
    setSelectedCoupon(null);
    setFormData({
      code: "",
      type: "fixed",
      price: "",
      status: "active",
      description: "",
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (coupon) => {
    setSelectedCoupon(coupon);
    setFormData({
      code: coupon.code,
      type: coupon.type,
      price: coupon.price.toString(),
      status: coupon.status,
      description: coupon.description,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure ?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await fetch(`/api/admin/coupons`, {
          method: "DELETE",
          body: JSON.stringify({ id }),
        });
        const data = await response.json();
        if (data?.rowCount > 0) {
          Swal.fire({
            title: "Deleted!",
            text: "Your coupon has been deleted.",
            icon: "success",
          });
          refetch();
        }
      }
    });
  };

  const handleSave = async () => {
    try {
      if (selectedCoupon) {
        const response = await fetch(`/api/admin/coupons`, {
          method: "PUT",
          body: JSON.stringify({
            id: selectedCoupon.id,
            code: formData.code,
            type: formData.type,
            price: formData.price,
            status: formData.status,
            description: formData.description,
          }),
        });
        if (response.ok) {
          toast.success("Coupon updated successfully");
          refetch();
        } else {
          toast.error("Failed to update coupon");
        }
      } else {
        const response = await fetch("/api/admin/coupons", {
          method: "POST",
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          toast.success("Coupon created successfully");
          refetch();
        } else {
          toast.error("Failed to create coupon");
        }
      }
    } catch (error) {
      console.error("Error saving coupon:", error);
    } finally {
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="">
      <Card className="dark:bg-slate-700">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle>Coupons</CardTitle>
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
                variant={statusFilter === "deactive" ? "primary" : "outline"}
                onClick={() => setStatusFilter("deactive")}
              >
                Deactive
              </Button>
            </div>
            <div className="relative w-full sm:w-[300px]">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search coupons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {filteredCoupons.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">#</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Used</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCoupons.map((coupon, index) => (
                    <TableRow key={coupon.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="font-medium">
                        {coupon.code}
                      </TableCell>
                      <TableCell>
                        <span className="capitalize">{coupon.type}</span>
                      </TableCell>
                      <TableCell>
                        {coupon.type === "percent"
                          ? `${coupon.price}%`
                          : `৳ ${coupon.price}`}
                      </TableCell>
                      <TableCell>{coupon.used_count || 0}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            coupon.status === "active"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                          }`}
                        >
                          {coupon.status === "active" ? "Active" : "Deactive"}
                        </span>
                      </TableCell>
                      <TableCell>
                        {coupon.description.slice(0, 50)}...
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(coupon)}
                            className="h-8 w-8"
                          >
                            <Pencil className="h-4 w-4 dark:text-white" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(coupon.id)}
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
              No coupons found
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] dark:bg-slate-700">
          <DialogHeader>
            <DialogTitle>
              {selectedCoupon ? "Edit Coupon" : "Add New Coupon"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="code">Coupon Code</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                placeholder="Enter coupon code"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  placeholder="Enter price"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">Fixed</SelectItem>
                    <SelectItem value="percent">Percent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
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
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                placeholder="Enter coupon description..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => handleSave()}>
              {selectedCoupon ? "Save changes" : "Add Coupon"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
