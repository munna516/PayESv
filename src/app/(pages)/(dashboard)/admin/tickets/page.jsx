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
import { Search, Trash2, Mail, MailOpen } from "lucide-react";
import { format } from "date-fns";

// Mock data - replace with actual data from your API
const mockTickets = [
  {
    id: 1,
    user: "user1@example.com",
    subject: "Payment Issue",
    status: "pending",
    createdAt: new Date("2024-03-15T10:30:00"),
  },
  {
    id: 2,
    user: "user2@example.com",
    subject: "Account Verification",
    status: "read",
    createdAt: new Date("2024-03-14T15:45:00"),
  },
  {
    id: 3,
    user: "user3@example.com",
    subject: "Refund Request",
    status: "pending",
    createdAt: new Date("2024-03-14T09:20:00"),
  },
  {
    id: 4,
    user: "user4@example.com",
    subject: "Technical Support",
    status: "read",
    createdAt: new Date("2024-03-13T14:15:00"),
  },
  {
    id: 5,
    user: "user5@example.com",
    subject: "Product Inquiry",
    status: "pending",
    createdAt: new Date("2024-03-13T11:00:00"),
  },
];

export default function Tickets() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredTickets = mockTickets.filter((ticket) => {
    const matchesSearch =
      ticket.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleMarkAsRead = (id) => {
    // Implement mark as read functionality
    console.log("Marking ticket as read:", id);
  };

  const handleMarkAsUnread = (id) => {
    // Implement mark as unread functionality
    console.log("Marking ticket as unread:", id);
  };

  const handleDelete = (id) => {
    // Implement delete functionality
    console.log("Deleting ticket:", id);
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
                variant={statusFilter === "pending" ? "primary" : "outline"}
                onClick={() => setStatusFilter("pending")}
              >
                Pending
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

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created Time</TableHead>
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.map((ticket, index) => (
                  <TableRow key={ticket.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">{ticket.user}</TableCell>
                    <TableCell>{ticket.subject}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          ticket.status === "read"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                        }`}
                      >
                        {ticket.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {format(ticket.createdAt, "MMM dd, yyyy HH:mm")}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-2">
                        {ticket.status === "pending" ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleMarkAsRead(ticket.id)}
                            className="h-8 w-8"
                            title="Mark as read"
                          >
                            <MailOpen className="h-4 w-4 dark:text-white" />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleMarkAsUnread(ticket.id)}
                            className="h-8 w-8"
                            title="Mark as unread"
                          >
                            <Mail className="h-4 w-4 dark:text-white" />
                          </Button>
                        )}
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
        </CardContent>
      </Card>
    </div>
  );
}
