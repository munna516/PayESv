"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading/Loading";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader, Pencil, Copy, Check, Eye } from "lucide-react";
import toast, { ToastBar } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";

export default function Transactions() {
  const { data: session } = useSession();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [brandName, setBrandName] = useState("");
  const [brandUrl, setBrandUrl] = useState("");
  const [brandLogo, setBrandLogo] = useState("");
  const [status, setStatus] = useState("Active");
  const [editOpen, setEditOpen] = useState(false);
  const [editBrand, setEditBrand] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [copiedField, setCopiedField] = useState(null);

  const fetchBrands = async (email) => {
    const res = await fetch(`/api/user/brand?email=${email}`);
    const data = await res.json();
    return data.rows;
  };

  const {
    data: brands,
    isLoading: isBrandsLoading,
    refetch,
  } = useQuery({
    queryKey: ["brands"],
    queryFn: () => fetchBrands(session?.user?.email),
  });

  const fetchPlan = async () => {
    setIsLoading(true);
    const response = await fetch(
      `/api/user/plan?email=${encodeURIComponent(session?.user?.email)}`
    );
    const data = await response.json();

    setData(data);
    setIsLoading(false);
  };
  useEffect(() => {
    if (session?.user?.email) {
      fetchPlan();
    }
  }, [session]);
  if (isLoading || isBrandsLoading) return <Loading />;

  // Handler to open edit modal with brand data
  const handleEdit = (brand) => {
    setEditBrand(brand);
    setEditOpen(true);
  };

  // Handler to open details modal with brand data
  const handleViewDetails = (brand) => {
    setSelectedBrand(brand);
    setDetailsOpen(true);
  };

  // Copy to clipboard function
  const copyToClipboard = async (text, fieldName) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      toast.success(`${fieldName} copied to clipboard!`);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleAddBrand = async (e) => {
    e.preventDefault();
    
    const res = await fetch("/api/user/brand", {
      method: "POST",
      body: JSON.stringify({
        brandName,
        brandUrl,
        brandLogo,
        email: session?.user?.email,
        status,
      }),
    });
    const data = await res.json();
    if (data.rowCount > 0) {
      toast.success("Brand added successfully");
      setBrandName("");
      setBrandUrl("");
      setBrandLogo("");
      setStatus("Active");
      refetch();
    } else {
      toast.error("Brand addition failed");
    }
    setOpen(false);
  };

  // Edit Brand Modal handler
  const handleEditBrand = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("/api/user/brand", {
        method: "PUT",
        body: JSON.stringify({
          brandKey: editBrand.brand_key,
          brandName: editBrand.brand_name,
          brandUrl: editBrand.brand_url,
          brandLogo: editBrand.brand_logo,
          status: editBrand.status,
        }),
      });
      const data = await res.json();
      if (data.rowCount > 0) {
        toast.success("Brand updated successfully");
        refetch();
      } else {
        toast.error("Brand update failed", {
          duration: 3000,
        });
      }
    } catch (error) {
      toast.error("Brand update failed", {
        duration: 3000,
      });
    } finally {
      setEditOpen(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <Card className="w-full dark:bg-slate-700">
        <CardHeader className="flex flex-row items-center justify-between mb-3">
          <CardTitle className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold">
            Brands
          </CardTitle>
          <Dialog open={open} onOpenChange={setOpen}>
            {data && (data?.plan == "1" || data.plan == "2") && (
              <DialogTrigger asChild>
                <Button variant="primary" onClick={() => setOpen(true)}>
                  Add Brand
                </Button>
              </DialogTrigger>
            )}
            <DialogContent className="max-w-[95vw] sm:max-w-[450px]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-center">
                  Add Brand
                </DialogTitle>
              </DialogHeader>
              <form className="space-y-4 mt-4" onSubmit={handleAddBrand}>
                <div className="space-y-2">
                  <Label htmlFor="brandName" className="font-semibold">
                    Brand Name
                  </Label>
                  <Input
                    id="brandName"
                    name="brandName"
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="Enter brand name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brandUrl" className="font-semibold">
                    Brand URL
                  </Label>
                  <Input
                    id="brandUrl"
                    name="brandUrl"
                    type="url"
                    value={brandUrl}
                    onChange={(e) => setBrandUrl(e.target.value)}
                    placeholder="Enter brand URL"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brandLogo" className="font-semibold">
                    Brand Logo
                  </Label>
                  <Input
                    id="brandLogo"
                    name="brandLogo"
                    type="url"
                    value={brandLogo}
                    onChange={(e) => setBrandLogo(e.target.value)}
                    placeholder="Upload brand logo"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status" className="font-semibold">
                    Status
                  </Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger id="status" name="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Deactive">Deactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" variant="primary" className="w-full">
                  Save Brand
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {brands && brands.length > 0 ? (
            <div className="rounded-md">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-200 dark:bg-slate-700">
                    <TableHead>#</TableHead>
                    <TableHead>Brand Name</TableHead>
                    <TableHead>Brand URL</TableHead>
                    <TableHead>Brand Logo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>API Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {brands.map((brand, index) => (
                    <TableRow key={brand.brand_key}>
                      <TableCell className="">{index + 1}</TableCell>
                      <TableCell className="">{brand.brand_name}</TableCell>
                      <TableCell>{brand.brand_url}</TableCell>
                      <TableCell>
                        <img
                          src={brand.brand_logo.split(",")[0]}
                          alt={brand.brand_name}
                          className=" h-10 w-15 rounded-full"
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
                      <TableCell className="">
                        <button
                          className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded"
                          onClick={() => handleEdit(brand)}
                        >
                          <Pencil size={18} />
                        </button>
                      </TableCell>
                      <TableCell className="">
                        <Button
                          variant="primary"
                          onClick={() => handleViewDetails(brand)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center text-sm text-gray-500">
              No brands found
            </div>
          )}
        </CardContent>
      </Card>
      {/* Edit Brand Modal */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              Edit Brand
            </DialogTitle>
          </DialogHeader>
          <form className="space-y-4 mt-4" onSubmit={handleEditBrand}>
            <div className="space-y-2">
              <Label htmlFor="editBrandName" className="font-semibold">
                Brand Name
              </Label>
              <Input
                id="editBrandName"
                name="editBrandName"
                type="text"
                value={editBrand?.brand_name || ""}
                onChange={(e) =>
                  setEditBrand({ ...editBrand, brand_name: e.target.value })
                }
                placeholder="Enter brand name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editBrandUrl" className="font-semibold">
                Brand URL
              </Label>
              <Input
                id="editBrandUrl"
                name="editBrandUrl"
                type="text"
                value={editBrand?.brand_url || ""}
                onChange={(e) =>
                  setEditBrand({ ...editBrand, brand_url: e.target.value })
                }
                placeholder="Enter brand URL"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editBrandLogo" className="font-semibold">
                Brand Logo
              </Label>
              <Input
                id="editBrandLogo"
                name="editBrandLogo"
                type="text"
                value={editBrand?.brand_logo || ""}
                onChange={(e) =>
                  setEditBrand({ ...editBrand, brand_logo: e.target.value })
                }
                placeholder="Enter brand logo"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editStatus" className="font-semibold">
                Status
              </Label>
              <Select
                value={editBrand?.status || "Active"}
                onValueChange={(val) =>
                  setEditBrand({ ...editBrand, status: val })
                }
              >
                <SelectTrigger id="editStatus" name="editStatus">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Deactive">Deactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" variant="primary" className="w-full">
              {isLoading ? <Loader className="animate-spin" /> : "Save Changes"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-[500px] dark:bg-slate-700">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              API Details
            </DialogTitle>
            <DialogDescription className="text-center">
              Copy your API credentials for integration
            </DialogDescription>
          </DialogHeader>

          {selectedBrand && (
            <div className="space-y-6 mt-4">
              {/* Brand Key */}
              <div className="space-y-2">
                <Label className="font-semibold text-sm">Brand Key</Label>
                <div className="flex items-center gap-2">
                  <Input
                    value={selectedBrand.brand_key || "N/A"}
                    readOnly
                    className="flex-1 bg-gray-50 dark:bg-gray-800"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(
                        selectedBrand.brand_key || "",
                        "Brand Key"
                      )
                    }
                    className="min-w-[40px] h-10"
                  >
                    {copiedField === "Brand Key" ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* API Key */}
              <div className="space-y-2">
                <Label className="font-semibold text-sm">API Key</Label>
                <div className="flex items-center gap-2">
                  <Input
                    value={selectedBrand.api_key || "N/A"}
                    readOnly
                    className="flex-1 bg-gray-50 dark:bg-gray-800"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(selectedBrand.api_key || "", "API Key")
                    }
                    className="min-w-[40px] h-10"
                  >
                    {copiedField === "API Key" ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* API Secret */}
              <div className="space-y-2">
                <Label className="font-semibold text-sm">API Secret</Label>
                <div className="flex items-center gap-2">
                  <Input
                    value={selectedBrand.api_secret || "N/A"}
                    readOnly
                    className="flex-1 bg-gray-50 dark:bg-gray-800"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(
                        selectedBrand.api_secret || "",
                        "API Secret"
                      )
                    }
                    className="min-w-[40px] h-10"
                  >
                    {copiedField === "API Secret" ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => setDetailsOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
