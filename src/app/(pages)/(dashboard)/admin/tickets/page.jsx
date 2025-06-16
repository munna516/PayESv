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
import { Search, Trash2 } from "lucide-react";
import { format } from "date-fns";
import Loading from "@/components/Loading/Loading";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

export default function Tickets() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["tickets"],
    queryFn: () => fetch("/api/admin/tickets").then((res) => res.json()),
  });

  if (isLoading) return <Loading />;

  const tickets = data?.rows;

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this ticket?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await fetch(`/api/admin/tickets`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        });
        const data = await res.json();
        if (data.error) {
          toast.error(data.error);
        } else {
          toast.success("Ticket deleted successfully");
          refetch();
        }
      }
    });
  };

  const handleClick = async (id) => {
    const res = await fetch(`/api/admin/tickets`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
    const data = await res.json();
    if (data.error) {
      toast.error(data.error);
    } else {
      refetch();
    }
  };

  return (
    <div className="mb-20">
      <Card className="dark:bg-slate-700">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle>Tickets</CardTitle>
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
                variant={statusFilter === "Pending" ? "primary" : "outline"}
                onClick={() => setStatusFilter("Pending")}
              >
                Pending
              </Button>
              <Button
                variant={statusFilter === "In Progress" ? "primary" : "outline"}
                onClick={() => setStatusFilter("In Progress")}
              >
                In Progress
              </Button>
              <Button
                variant={statusFilter === "Resolved" ? "primary" : "outline"}
                onClick={() => setStatusFilter("Resolved")}
              >
                Resolved
              </Button>
            </div>
            <div className="relative w-full sm:w-[300px]">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tickets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {filteredTickets?.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">#</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Created Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTickets.map((ticket, index) => (
                    <TableRow key={ticket.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="font-medium">
                        {ticket.email}
                      </TableCell>
                      <TableCell className="text-blue-500 cursor-pointer font-medium">
                        <Link
                          onClick={() => handleClick(ticket.id)}
                          href={`/admin/tickets/${ticket.id}`}
                        >
                          {ticket.category || "-"}
                        </Link>
                      </TableCell>
                      <TableCell>
                        {format(new Date(ticket?.createdat), "dd-MM-yyyy")}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            ticket.status === "Pending"
                              ? "bg-yellow-200 text-gray-600 dark:bg-yellow-500 dark:text-white"
                              : ticket.status === "In Progress"
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                              : ticket.status === "Resolved"
                              ? "bg-green-200 text-green-600 dark:bg-green-900 dark:text-green-300"
                              : "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300"
                          }`}
                        >
                          {ticket.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(ticket.id)}
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            title="Delete"
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
          ) : (
            <p className="text-center text-sm text-muted-foreground my-10">
              No tickets found
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
