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
import { Search, Pencil } from "lucide-react";
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
import Image from "next/image";
import toast from "react-hot-toast";

export default function Brand() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-brands"],
    queryFn: () => fetch("/api/admin/brands").then((res) => res.json()),
  });

  const [editForm, setEditForm] = useState({
    status: "",
  });
  if (isLoading) return <Loading />;
  const brands = data?.rows||[];
  const filteredBrands = brands.filter((brand) =>
    Object.values(brand).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleEdit = (brand) => {
    setSelectedBrand(brand);
    setEditForm({
      status: brand.status,
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    // Implement save functionality
    const res = await fetch(`/api/admin/brands`, {
      method: "PUT",
      body: JSON.stringify({
        brand_key: selectedBrand.brand_key,
        status: editForm.status,
      }),
    });
    const data = await res.json();
    if (data.message) {
      toast.success(data.message);
    }
    if (data.error) {
      toast.error(data.error);
    }
    setIsDialogOpen(false);
    refetch();
  };

  const handleStatusChange = (value) => {
    setEditForm({ ...editForm, status: value });
  };

  return (
    <div className="">
      <Card className="dark:bg-slate-700">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle>Brands</CardTitle>
          <div className="relative w-full sm:w-[300px]">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search brands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead>Merchant Email</TableHead>
                  <TableHead>Brand Name</TableHead>
                  <TableHead>Domain</TableHead>
                  <TableHead>Brand Logo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBrands.map((brand, index) => (
                  <TableRow key={brand.brand_key}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{brand.email}</TableCell>
                    <TableCell>{brand.brand_name}</TableCell>
                    <TableCell>{brand.brand_url}</TableCell>
                    <TableCell>
                      <Image
                        src={brand.brand_logo}
                        alt={brand.brand_name}
                        width={50}
                        height={50}
                      />
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          brand.status === "Active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                        }`}
                      >
                        {brand.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(brand)}
                        className="h-8 w-8"
                      >
                        <Pencil className="h-4 w-4 dark:text-white" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Brand Status</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select
                value={editForm.status}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Deactive">Deactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => handleSave()}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
