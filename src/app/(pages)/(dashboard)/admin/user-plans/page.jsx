"use client";

import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Search, Pencil } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Loading from "@/app/(pages)/pay/loading";
import { Button } from "@/components/ui/button";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import toast from "react-hot-toast";

export default function UserPlans() {
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();

  // Add dialog state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addEmail, setAddEmail] = useState("");
  const [addPlanType, setAddPlanType] = useState(""); // "1" | "2"
  const [addWebsiteQty, setAddWebsiteQty] = useState("");
  const [addBillingCycle, setAddBillingCycle] = useState(""); // "monthly" | "yearly"

  // Edit dialog state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [editWebsiteQty, setEditWebsiteQty] = useState("");
  const [editExpiryDate, setEditExpiryDate] = useState(""); // ISO-like string for datetime-local
  const [loading, setLoading] = useState(false);

  function handleOpenAdd() {
    setIsAddOpen(true);
  }

  function resetAddForm() {
    setAddEmail("");
    setAddPlanType("");
    setAddWebsiteQty("");
    setAddBillingCycle("");
  }

  function handleCloseAdd() {
    setIsAddOpen(false);
    resetAddForm();
  }

  function handleEditPlan(plan) {
    setSelectedPlan(plan);
    setEditWebsiteQty(plan?.websitequantity ?? "");
    // Normalize to yyyy-MM-ddTHH:mm for input[type=datetime-local]
    if (plan?.expires_at) {
      const d = new Date(plan.expires_at);
      const iso = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
      setEditExpiryDate(iso);
    } else {
      setEditExpiryDate("");
    }
    setIsEditOpen(true);
  }

  function handleCloseEdit() {
    setIsEditOpen(false);
    setSelectedPlan(null);
    setEditWebsiteQty("");
    setEditExpiryDate("");
  }

  async function handleSubmitEdit() {
    if (!selectedPlan) return;
    const planNumber = Number(selectedPlan.plan);
    const payload =
      planNumber === 1
        ? {
            id: selectedPlan.id,
            plan: 1,
            websitequantity: Number(editWebsiteQty || 0),
            expires_at: editExpiryDate
              ? new Date(editExpiryDate).toISOString()
              : null,
          }
        : {
            id: selectedPlan.id,
            plan: 2,
            expires_at: editExpiryDate
              ? new Date(editExpiryDate).toISOString()
              : null,
          };
    try {
      setLoading(true);
      const res = await fetch("/api/admin/user-plans", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message);
        return;
      } else {
        refetch();
        handleCloseEdit();
        toast.success(data?.message);
      }
    } catch (error) {
      toast.error("Failed to update plan");
    } finally {
      setLoading(false);
    }
  }

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["user-plans"],
    queryFn: () => fetch("/api/admin/user-plans").then((res) => res.json()),
  });

  if (isLoading) return <Loading />;

  const userPlans = data?.rows || [];

  // Filter plans based on search query
  const filteredPlans = userPlans.filter((plan) =>
    plan.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  async function handleSubmitAdd() {
    if (!addEmail || !addPlanType) {
      toast.error("Please fill all the fields");
      return;
    }
    const planNumber = Number(addPlanType);
    if (planNumber === 1 && (!addWebsiteQty || !addBillingCycle)) return;

    const payload =
      planNumber === 1
        ? {
            email: addEmail,
            plan: 1,
            websitequantity: Number(addWebsiteQty),
            yearly: addBillingCycle === "yearly" ? 1 : 0,
          }
        : {
            email: addEmail,
            plan: 2,
          };
    try {
      setLoading(true);
      const res = await fetch("/api/admin/user-plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message);
        return;
      } else {
        refetch();
        handleCloseAdd();
        toast.success(data?.message);
      }
    } catch (error) {
      toast.error("Failed to add plan");
    } finally {
      setLoading(false);
    }
  }
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
          </div>
          <div>
            <Dialog
              open={isAddOpen}
              onOpenChange={(open) =>
                open ? handleOpenAdd() : handleCloseAdd()
              }
            >
              <DialogTrigger asChild>
                <Button variant="primary">
                  <FaPlus />
                  Add Plan
                </Button>
              </DialogTrigger>
              <DialogContent className="dark:bg-slate-800">
                <DialogHeader>
                  <DialogTitle>Add Plan</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-2">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      placeholder="user@example.com"
                      value={addEmail}
                      onChange={(e) => setAddEmail(e.target.value)}
                      className="dark:text-white"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Category</Label>
                    <Select value={addPlanType} onValueChange={setAddPlanType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">
                          Personal Account Automation
                        </SelectItem>
                        <SelectItem value="2">Ready Payment Gateway</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {addPlanType === "1" && (
                    <>
                      <div className="grid gap-2">
                        <Label htmlFor="websiteqty">Website Quantity</Label>
                        <Input
                          id="websiteqty"
                          type="number"
                          min="1"
                          value={addWebsiteQty}
                          onChange={(e) => setAddWebsiteQty(e.target.value)}
                          className="dark:text-white"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Billing Cycle</Label>
                        <Select
                          value={addBillingCycle}
                          onValueChange={setAddBillingCycle}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select billing" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="yearly">Yearly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={handleCloseAdd}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmitAdd} disabled={loading}>
                    {loading ? "Submitting..." : "Submit"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border dark:border-slate-600">
            <Table>
              <TableHeader>
                <TableRow className="dark:border-slate-600">
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Website Quantity</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlans.map((plan, index) => (
                  <TableRow key={plan.id} className="dark:border-slate-600">
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">{plan.email}</TableCell>
                    <TableCell>{plan.websitequantity}</TableCell>
                    <TableCell>
                      {plan.plan == 1
                        ? "Personal Account Automation"
                        : "Ready Payment Gateway"}
                    </TableCell>

                    <TableCell>
                      {new Date(plan.expires_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => handleEditPlan(plan)}
                        className="text-green-500 hover:text-green-500/80"
                      >
                        <FaEdit />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog
        open={isEditOpen}
        onOpenChange={(open) =>
          open ? setIsEditOpen(true) : handleCloseEdit()
        }
      >
        <DialogContent className="dark:bg-slate-800">
          <DialogHeader>
            <DialogTitle>Edit Plan</DialogTitle>
          </DialogHeader>
          {selectedPlan && (
            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                <Label>Email</Label>
                <Input
                  value={selectedPlan.email}
                  readOnly
                  className="dark:text-white"
                />
              </div>
              {Number(selectedPlan.plan) === 1 && (
                <div className="grid gap-2">
                  <Label htmlFor="editWebsiteQty">Website Quantity</Label>
                  <Input
                    id="editWebsiteQty"
                    type="number"
                    min="1"
                    value={editWebsiteQty}
                    onChange={(e) => setEditWebsiteQty(e.target.value)}
                    className="dark:text-white"
                  />
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="editExpiry">Expiry Date</Label>
                <Input
                  id="editExpiry"
                  type="datetime-local"
                  value={editExpiryDate}
                  onChange={(e) => setEditExpiryDate(e.target.value)}
                  className="dark:text-white"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseEdit}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmitEdit}
              disabled={loading}
              variant="primary"
            >
              {loading ? "Updating..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
