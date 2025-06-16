"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Pencil, Trash2, UserPlus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

export default function Staff() {
  const [staffStatus, setStaffStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["staffs"],
    queryFn: () => fetch("/api/admin/staff").then((res) => res.json()),
  });

  const staffs = data?.rows;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    status: "active",
    role: "support operator",
  });


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditStaff = (staff) => {
    const nameParts = staff.name.trim().split(" ");
    setEditingStaff(staff);

    setFormData({
      lastName: nameParts.pop(),
      firstName: nameParts.join(" "),
      email: staff.email,
      phone: staff.phone || "",
      password: "", // Don't show password when editing
      status: staff.status,
      role: staff.role,
    });
    setIsDialogOpen(true);
  };

  const handleAddStaff = () => {
    setEditingStaff(null);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      status: "active",
      role: "support operator",
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingStaff) {
      const response = await fetch(`/api/admin/staff`, {
        method: "PUT",
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data?.error) {
        toast.error(data?.error);
        return;
      } else if (data?.rowCount > 0) {
        toast.success("Staff updated successfully");
      }
      refetch();
    } else {
      const response = await fetch("/api/admin/staff", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data?.error) {
        toast.error(data?.error);
        return;
      } else if (data?.rowCount > 0) {
        toast.success("Staff added successfully");
      }
      refetch();
    }

    setIsDialogOpen(false);
  };

  const handleDeleteStaff = async (id) => {
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
        const response = await fetch(`/api/admin/staff`, {
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

  // Filter staff based on selected filters
  const filteredStaff = staffs?.filter((staff) => {
    const matchesStatus = staffStatus === "all" || staff.status === staffStatus;
    const matchesSearch =
      searchQuery === "" ||
      staff.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${staff.firstName} ${staff.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 mb-14">
      <Card className="dark:bg-slate-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold">
            Staffs
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="primary"
                onClick={handleAddStaff}
                className="gap-2"
              >
                <UserPlus className="h-4 w-4" />
                Add New
              </Button>
            </DialogTrigger>
            <DialogContent className="dark:bg-slate-700">
              <DialogHeader>
                <DialogTitle>
                  {editingStaff ? "Edit Staff" : "Add New Staff"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="dark:bg-slate-600 dark:border-slate-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="dark:bg-slate-600 dark:border-slate-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      disabled={editingStaff}
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="dark:bg-slate-600 dark:border-slate-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="dark:bg-slate-600 dark:border-slate-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {!editingStaff && (
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required={!editingStaff}
                        className="dark:bg-slate-600 dark:border-slate-500"
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      name="status"
                      value={formData.status}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, status: value }))
                      }
                    >
                      <SelectTrigger className="dark:bg-slate-600 dark:border-slate-500">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="deactive">Deactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select
                      name="role"
                      value={formData.role}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, role: value }))
                      }
                    >
                      <SelectTrigger className="dark:bg-slate-600 dark:border-slate-500">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="support operator">
                          Support Operator
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button variant="primary" type="submit" className="w-full">
                  {editingStaff ? "Update Staff" : "Save Staff"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Filters Section */}
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant={staffStatus === "all" ? "primary" : "outline"}
                onClick={() => setStaffStatus("all")}
                className="dark:bg-slate-600 dark:hover:bg-slate-500"
              >
                All
              </Button>
              <Button
                variant={staffStatus === "active" ? "primary" : "outline"}
                onClick={() => setStaffStatus("active")}
                className="dark:bg-slate-600 dark:hover:bg-slate-500"
              >
                Active
              </Button>
            </div>

            <div className="relative w-full md:w-[300px]">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search staff..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 dark:text-white"
              />
            </div>
          </div>

          {/* Staff Table */}
          <div className="rounded-md border dark:border-slate-600">
            <Table>
              <TableHeader>
                <TableRow className="dark:border-slate-600">
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead>User Profile</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaff?.map((staff, index) => (
                  <TableRow key={staff.id} className="dark:border-slate-600">
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{staff.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {staff.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                        {staff.role}
                      </span>
                    </TableCell>
                    <TableCell>৳{staff?.balance?.toFixed(2) || 0}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          staff.status === "active"
                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                            : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                        }`}
                      >
                        {staff.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditStaff(staff)}
                          className="h-8 w-8"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteStaff(staff.id)}
                          className="h-8 w-8 text-red-500 hover:text-red-700"
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
        </CardContent>
      </Card>
    </div>
  );
}
