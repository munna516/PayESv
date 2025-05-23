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

// Mock data - replace with actual data from your API
const mockPlans = [
  {
    id: 1,
    name: "Basic Plan",
    about: "Perfect for small businesses",
    regularPrice: 99.99,
    finalPrice: 79.99,
    maxDevices: 5,
    maxTransactions: 100,
    maxBrands: 3,
    durationType: "monthly",
    sort: 1,
    status: "active",
  },
  {
    id: 2,
    name: "Professional Plan",
    about: "Ideal for growing businesses",
    regularPrice: 199.99,
    finalPrice: 149.99,
    maxDevices: 15,
    maxTransactions: 500,
    maxBrands: 10,
    durationType: "monthly",
    sort: 2,
    status: "active",
  },
  {
    id: 3,
    name: "Enterprise Plan",
    about: "For large scale operations",
    regularPrice: 499.99,
    finalPrice: 399.99,
    maxDevices: 50,
    maxTransactions: 2000,
    maxBrands: 30,
    durationType: "yearly",
    sort: 3,
    status: "active",
  },
  {
    id: 4,
    name: "Starter Plan",
    about: "For new businesses",
    regularPrice: 49.99,
    finalPrice: 29.99,
    maxDevices: 2,
    maxTransactions: 50,
    maxBrands: 1,
    durationType: "monthly",
    sort: 4,
    status: "deactive",
  },
];

export default function Plans() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    about: "",
    regularPrice: "",
    finalPrice: "",
    maxDevices: "",
    maxTransactions: "",
    maxBrands: "",
    durationType: "monthly",
    sort: "",
    status: "active",
  });

  const filteredPlans = mockPlans.filter((plan) => {
    const matchesSearch = plan.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || plan.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddNew = () => {
    setSelectedPlan(null);
    setFormData({
      name: "",
      about: "",
      regularPrice: "",
      finalPrice: "",
      maxDevices: "",
      maxTransactions: "",
      maxBrands: "",
      durationType: "monthly",
      sort: "",
      status: "active",
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (plan) => {
    setSelectedPlan(plan);
    setFormData({
      name: plan.name,
      about: plan.about,
      regularPrice: plan.regularPrice.toString(),
      finalPrice: plan.finalPrice.toString(),
      maxDevices: plan.maxDevices.toString(),
      maxTransactions: plan.maxTransactions.toString(),
      maxBrands: plan.maxBrands.toString(),
      durationType: plan.durationType,
      sort: plan.sort.toString(),
      status: plan.status,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id) => {
    // Implement delete functionality
    console.log("Deleting plan:", id);
  };

  const handleSave = () => {
    // Implement save functionality
    console.log("Saving plan:", formData);
    setIsDialogOpen(false);
  };

  return (
    <div className="mb-20">
      <Card className="dark:bg-slate-700">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle>Plans</CardTitle>
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
                placeholder="Search plans..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Device</TableHead>
                  <TableHead>Transactions</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Sort</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlans.map((plan, index) => (
                  <TableRow key={plan.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">{plan.name}</TableCell>
                    <TableCell>{plan.maxBrands}</TableCell>
                    <TableCell>{plan.maxDevices}</TableCell>
                    <TableCell>{plan.maxTransactions}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="line-through text-muted-foreground text-sm">
                          ${plan.regularPrice}
                        </span>
                        <span className="font-medium">${plan.finalPrice}</span>
                      </div>
                    </TableCell>
                    <TableCell>{plan.sort}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          plan.status === "active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                        }`}
                      >
                        {plan.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(plan)}
                          className="h-8 w-8"
                        >
                          <Pencil className="h-4 w-4 dark:text-white" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(plan.id)}
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
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] dark:bg-slate-700">
          <DialogHeader>
            <DialogTitle>
              {selectedPlan ? "Edit Plan" : "Add New Plan"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Plan Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter plan name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="about">About Plan</Label>
              <Textarea
                id="about"
                value={formData.about}
                onChange={(e) =>
                  setFormData({ ...formData, about: e.target.value })
                }
                placeholder="Enter plan description"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="regularPrice">Regular Price</Label>
                <Input
                  id="regularPrice"
                  type="number"
                  value={formData.regularPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, regularPrice: e.target.value })
                  }
                  placeholder="Enter regular price"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="finalPrice">Final Price</Label>
                <Input
                  id="finalPrice"
                  type="number"
                  value={formData.finalPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, finalPrice: e.target.value })
                  }
                  placeholder="Enter final price"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="maxDevices">Maximum Devices</Label>
                <Input
                  id="maxDevices"
                  type="number"
                  value={formData.maxDevices}
                  onChange={(e) =>
                    setFormData({ ...formData, maxDevices: e.target.value })
                  }
                  placeholder="Enter max devices"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="maxTransactions">Maximum Transactions</Label>
                <Input
                  id="maxTransactions"
                  type="number"
                  value={formData.maxTransactions}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxTransactions: e.target.value,
                    })
                  }
                  placeholder="Enter max transactions"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="maxBrands">Maximum Brands</Label>
                <Input
                  id="maxBrands"
                  type="number"
                  value={formData.maxBrands}
                  onChange={(e) =>
                    setFormData({ ...formData, maxBrands: e.target.value })
                  }
                  placeholder="Enter max brands"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="durationType">Duration Type</Label>
                <Select
                  value={formData.durationType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, durationType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
              {selectedPlan ? "Save changes" : "Add Plan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
