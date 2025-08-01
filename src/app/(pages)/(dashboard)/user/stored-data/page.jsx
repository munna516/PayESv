"use client";
import { Button } from "@/components/ui/button";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Loading from "@/components/Loading/Loading";
import { useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

export default function Transactions() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [formData, setFormData] = useState({
    category: "",
    status: "",
    message: "",
  });

  const {
    data: storedData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["storedData"],
    queryFn: async () => {
      const response = await fetch(
        `/api/user/stored-data?email=${session?.user?.email}`
      );
      return response.json();
    },
    enabled: !!session?.user?.email,
  });

  // Mutation for adding/updating data
  const mutation = useMutation({
    mutationFn: async (data) => {
      const response = await fetch("/api/user/stored-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          email: session?.user?.email,
        }),
      });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success(
          isEditing ? "Data updated successfully!" : "Data added successfully!"
        );
        setIsDialogOpen(false);
        resetForm();
        queryClient.invalidateQueries(["storedData"]);
      } else {
        toast.error(data.message || "Something went wrong!");
      }
    },
    onError: () => {
      toast.error("Something went wrong!");
    },
  });

  // Mutation for deleting data
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const response = await fetch(
        `/api/user/stored-data/${id}?email=${session?.user?.email}`,
        {
          method: "DELETE",
        }
      );
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Data deleted successfully!");
        queryClient.invalidateQueries(["storedData"]);
      } else {
        toast.error(data.message || "Something went wrong!");
      }
    },
    onError: () => {
      toast.error("Something went wrong!");
    },
  });

  const resetForm = () => {
    setFormData({
      category: "",
      status: "",
      message: "",
    });
    setIsEditing(false);
    setEditingData(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.category || !formData.status || !formData.message.trim()) {
      toast.error("Please fill all fields!");
      return;
    }

    if (isEditing) {
      mutation.mutate({
        ...formData,
        id: editingData.id,
      });
    } else {
      mutation.mutate(formData);
    }
  };

  const handleEdit = (data) => {
    setEditingData(data);
    setFormData({
      category: data.category,
      status: data.status,
      message: data.message,
    });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure to delete this data?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };

  const handleDialogOpen = (open) => {
    setIsDialogOpen(open);
    if (!open) {
      resetForm();
    }
  };

  if (isLoading) return <Loading />;

  return (
    <Card className="w-full dark:bg-slate-700">
      <CardHeader className="flex flex-row items-center justify-between mb-3">
        <CardTitle className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold">
          Stored Data
        </CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={handleDialogOpen}>
         {
          (session?.plan == "1" || session?.plan == "2") && (
            <DialogTrigger className="text-green-500 border-2 font-bold border-green-500 hover:bg-green-500 hover:text-white px-2 py-1 rounded-md">
              Add Data
            </DialogTrigger>
          )
         }

          <DialogContent className="max-2[300px] sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center">
                {isEditing
                  ? "Edit Transaction Message"
                  : "Add Transaction Message"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="messageAddress" className="font-semibold">
                  Message Address
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger id="messageAddress">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bkash">Bkash</SelectItem>
                    <SelectItem value="nagad">Nagad</SelectItem>
                    <SelectItem value="rocket">Rocket</SelectItem>
                    <SelectItem value="binace">Binance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="font-semibold">
                  Status
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="deactive">Deactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="font-semibold">
                  Message
                </Label>
                <Textarea
                  id="message"
                  placeholder="Enter your message"
                  className="min-h-[100px]"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full"
                disabled={mutation.isPending}
              >
                {mutation.isPending
                  ? "Saving..."
                  : isEditing
                  ? "Update"
                  : "Save"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="rounded-md">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-200 dark:bg-slate-700">
                <TableHead>#</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {storedData?.length > 0 ? (
                storedData.map((data, index) => (
                  <TableRow key={data.id}>
                    <TableCell className="">{index + 1}</TableCell>
                    <TableCell className="">
                      {data.category.charAt(0).toUpperCase() +
                        data.category.slice(1)}
                    </TableCell>
                    <TableCell>{data.message}</TableCell>
                    <TableCell
                      className={`${
                        data.status == "deactive"
                          ? "text-red-500 font-bold"
                          : "text-green-500 font-bold"
                      }`}
                    >
                      {data.status === "active" ? "Active" : "Deactive"}
                    </TableCell>
                    <TableCell>
                      {new Date(data.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(data)}
                        className="h-8 w-8"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(data.id)}
                        className="h-8 w-8 text-red-500 hover:text-red-700"
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No data found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
