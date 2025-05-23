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

// Mock data - replace with actual data from your API
const mockPaymentMethods = [
  {
    id: 1,
    logo: "https://example.com/bkash-logo.png",
    name: "BKash",
    type: "Mobile Banking",
    sort: 1,
    status: "active",
  },
  {
    id: 2,
    logo: "https://example.com/nagad-logo.png",
    name: "Nagad",
    type: "Mobile Banking",
    sort: 2,
    status: "active",
  },
  {
    id: 3,
    logo: "https://example.com/rocket-logo.png",
    name: "Rocket",
    type: "Mobile Banking",
    sort: 3,
    status: "active",
  },
  {
    id: 4,
    logo: "https://example.com/upay-logo.png",
    name: "Upay",
    type: "Mobile Banking",
    sort: 4,
    status: "active",
  },
  {
    id: 5,
    logo: "https://example.com/tap-logo.png",
    name: "Tap",
    type: "Mobile Banking",
    sort: 5,
    status: "deactive",
  },
  {
    id: 6,
    logo: "https://example.com/sure-cash-logo.png",
    name: "Sure Cash",
    type: "Mobile Banking",
    sort: 6,
    status: "active",
  },
  {
    id: 7,
    logo: "https://example.com/dutch-bangla-logo.png",
    name: "DBBL Mobile Banking",
    type: "Bank",
    sort: 7,
    status: "active",
  },
  {
    id: 8,
    logo: "https://example.com/sonali-bank-logo.png",
    name: "Sonali Bank",
    type: "Bank",
    sort: 8,
    status: "deactive",
  },
  {
    id: 9,
    logo: "https://example.com/rupali-bank-logo.png",
    name: "Rupali Bank",
    type: "Bank",
    sort: 9,
    status: "active",
  },
  {
    id: 10,
    logo: "https://example.com/ucash-logo.png",
    name: "UCash",
    type: "Mobile Banking",
    sort: 10,
    status: "deactive",
  },
  {
    id: 11,
    logo: "https://example.com/tap-logo.png",
    name: "Tap",
    type: "Mobile Banking",
    sort: 11,
    status: "deactive",
  },
  {
    id: 12,
    logo: "https://example.com/prime-bank-logo.png",
    name: "Prime Bank",
    type: "Bank",
    sort: 12,
    status: "deactive",
  },
  {
    id: 13,
    logo: "https://example.com/city-bank-logo.png",
    name: "City Bank",
    type: "Bank",
    sort: 13,
    status: "active",
  },
  {
    id: 14,
    logo: "https://example.com/ebl-logo.png",
    name: "Eastern Bank",
    type: "Bank",
    sort: 14,
    status: "active",
  },
  {
    id: 15,
    logo: "https://example.com/ucb-logo.png",
    name: "UCB Bank",
    type: "Bank",
    sort: 15,
    status: "deactive",
  },
];

export default function PaymentMethods() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [formData, setFormData] = useState({
    logo: "",
    name: "",
    type: "",
    sort: "",
    status: "active",
  });

  const filteredMethods = mockPaymentMethods
    .filter((method) => {
      const matchesSearch =
        method.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        method.type.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || method.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => a.sort - b.sort);

  const handleAddNew = () => {
    setSelectedMethod(null);
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
    setFormData({
      logo: method.logo,
      name: method.name,
      type: method.type,
      sort: method.sort.toString(),
      status: method.status,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id) => {
    // Implement delete functionality
    console.log("Deleting payment method:", id);
  };

  const handleSave = () => {
    // Implement save functionality
    console.log("Saving payment method:", formData);
    setIsDialogOpen(false);
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

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Payment Method</TableHead>

                  <TableHead>Sort</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMethods.map((method, index) => (
                  <TableRow key={method.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{method.name}</TableCell>
                    <TableCell>{method.type}</TableCell>

                    <TableCell>{method.sort}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          method.status === "active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                        }`}
                      >
                        {method.status}
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
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] dark:bg-slate-700">
          <DialogHeader>
            <DialogTitle>
              {selectedMethod
                ? "Edit Payment Method"
                : "Add New Payment Method"}
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
              <Input
                id="type"
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                placeholder="Enter method type"
              />
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
              {selectedMethod ? "Save changes" : "Add Payment Method"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
