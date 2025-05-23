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

// Mock data - replace with actual data from your API
const mockBrands = [
  {
    id: 1,
    merchantEmail: "merchant1@example.com",
    businessEmail: "business1@example.com",
    domain: "example1.com",
    ip: "192.168.1.1",
    status: "Active",
  },
  {
    id: 2,
    merchantEmail: "merchant2@example.com",
    businessEmail: "business2@example.com",
    domain: "example2.com",
    ip: "192.168.1.2",
    status: "Inactive",
  },
  {
    id: 3,
    merchantEmail: "merchant3@example.com",
    businessEmail: "business3@example.com",
    domain: "example3.com",
    ip: "192.168.1.3",
    status: "Active",
  },
];

export default function Brand() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    domain: "",
    ip: "",
  });

  const filteredBrands = mockBrands.filter((brand) =>
    Object.values(brand).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleEdit = (brand) => {
    setSelectedBrand(brand);
    setEditForm({
      domain: brand.domain,
      ip: brand.ip,
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    // Implement save functionality
    console.log("Saving changes:", { ...selectedBrand, ...editForm });
    setIsDialogOpen(false);
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
                  <TableHead>Business Email</TableHead>
                  <TableHead>Domain</TableHead>
                  <TableHead>IP</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBrands.map((brand, index) => (
                  <TableRow key={brand.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{brand.merchantEmail}</TableCell>
                    <TableCell>{brand.businessEmail}</TableCell>
                    <TableCell>{brand.domain}</TableCell>
                    <TableCell>{brand.ip}</TableCell>
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
            <DialogTitle>Edit Brand Details</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="domain" className="text-right">
                Domain
              </Label>
              <Input
                id="domain"
                value={editForm.domain}
                onChange={(e) =>
                  setEditForm({ ...editForm, domain: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ip" className="text-right">
                IP
              </Label>
              <Input
                id="ip"
                value={editForm.ip}
                onChange={(e) =>
                  setEditForm({ ...editForm, ip: e.target.value })
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
