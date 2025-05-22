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
import { Search, Pencil } from "lucide-react";
import { Label } from "@/components/ui/label";

export default function UserPlans() {
  const [searchQuery, setSearchQuery] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState("10");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  // Mock data - replace with actual data from your backend
  const userPlans = [
    {
      id: 1,
      email: "john.doe@example.com",
      planName: "Premium Plan",
      planDescription: "Full access to all features",
      price: 5000,
      expiryDate: "2024-04-20",
      maxDevices: 5,
      brand: "Samsung",
      expiryDays: 30,
    },
    {
      id: 2,
      email: "jane.smith@example.com",
      planName: "Basic Plan",
      planDescription: "Limited features access",
      price: 2500,
      expiryDate: "2024-05-15",
      maxDevices: 3,
      brand: "Apple",
      expiryDays: 15,
    },
    {
      id: 3,
      email: "mike.johnson@example.com",
      planName: "Enterprise Plan",
      planDescription: "Advanced features with priority support",
      price: 10000,
      expiryDate: "2024-06-01",
      maxDevices: 10,
      brand: "Xiaomi",
      expiryDays: 60,
    },
  ];

  const [formData, setFormData] = useState({
    maxDevices: "",
    brand: "",
    expiryDays: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditPlan = (plan) => {
    setEditingPlan(plan);
    setFormData({
      maxDevices: plan.maxDevices.toString(),
      brand: plan.brand,
      expiryDays: plan.expiryDays.toString(),
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log(formData);
    setIsDialogOpen(false);
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
            <Select value={entriesPerPage} onValueChange={setEntriesPerPage}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select entries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 entries</SelectItem>
                <SelectItem value="10">10 entries</SelectItem>
                <SelectItem value="25">25 entries</SelectItem>
                <SelectItem value="50">50 entries</SelectItem>
                <SelectItem value="100">100 entries</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border dark:border-slate-600">
            <Table>
              <TableHeader>
                <TableRow className="dark:border-slate-600">
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Plan Name</TableHead>
                  <TableHead>Plan Description</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlans.map((plan) => (
                  <TableRow key={plan.id} className="dark:border-slate-600">
                    <TableCell>{plan.id}</TableCell>
                    <TableCell className="font-medium">{plan.email}</TableCell>
                    <TableCell>{plan.planName}</TableCell>
                    <TableCell>{plan.planDescription}</TableCell>
                    <TableCell>৳{plan.price.toFixed(2)}</TableCell>
                    <TableCell>{plan.expiryDate}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditPlan(plan)}
                        className="h-8 w-8"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Plan Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="dark:bg-slate-700">
          <DialogHeader>
            <DialogTitle>Edit User Plan</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="maxDevices">Maximum Devices</Label>
              <Input
                id="maxDevices"
                name="maxDevices"
                type="number"
                value={formData.maxDevices}
                onChange={handleInputChange}
                required
                className="dark:bg-slate-600 dark:border-slate-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                required
                className="dark:bg-slate-600 dark:border-slate-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiryDays">
                Number of Expiry Days to Increase
              </Label>
              <Input
                id="expiryDays"
                name="expiryDays"
                type="number"
                value={formData.expiryDays}
                onChange={handleInputChange}
                required
                className="dark:bg-slate-600 dark:border-slate-500"
              />
            </div>

            <Button type="submit" className="w-full">
              Update Plan
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
