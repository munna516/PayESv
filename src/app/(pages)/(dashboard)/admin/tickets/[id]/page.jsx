"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import Loading from "@/components/Loading/Loading";

export default function TicketDetails() {
  const { id } = useParams();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["ticket", id],
    queryFn: () => fetch(`/api/admin/tickets/${id}`).then((res) => res.json()),
  });
  if (isLoading) return <Loading />;

  const ticket = data?.rows[0];
  if (error) return <div>Error loading ticket details</div>;

  const handleStatusChange = async (newStatus) => {
    console.log(newStatus);
    const res = await fetch(`/api/admin/tickets/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    });
    const data = await res.json();
    if (data.error) {
      toast.error(data.error);
    } else {
      toast.success(`Ticket status updated to ${newStatus}`);
      refetch();
    }
  };

  return (
    <div className="container mx-auto  mb-10">
      <Card className="dark:bg-slate-700">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Ticket Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* First Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Category</Label>
              <div className="p-2 bg-slate-100 dark:bg-slate-600 rounded-md">
                {ticket?.category}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Payment Method</Label>
              <div className="p-2 bg-slate-100 dark:bg-slate-600 rounded-md">
                {ticket?.paymentmethod || "N/A"}
              </div>
            </div>
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Transaction ID</Label>
              <div className="p-2 bg-slate-100 dark:bg-slate-600 rounded-md">
                {ticket?.transactionid || "N/A"}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Website Link</Label>
              <div className="p-2 bg-slate-100 dark:bg-slate-600 rounded-md">
                {ticket?.websitelink || "N/A"}
              </div>
            </div>
          </div>

          {/* Description Row */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Description</Label>
            <div className="p-4 bg-slate-100 dark:bg-slate-600 rounded-md min-h-[100px]">
              {ticket?.description}
            </div>
          </div>

          {/* Status Dropdown */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Status</Label>
            <Select
              defaultValue={ticket?.status}
              onValueChange={(value) => handleStatusChange(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
