"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Plus, Ticket, AlertCircle, Clock, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

export default function Tickets() {
  const [category, setCategory] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [websiteLink, setWebsiteLink] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data - replace with actual data from your backend
  const tickets = [
    {
      id: 1,
      subject: "Payment Issue",
      category: "Payment",
      status: "Open",
      createdAt: "2024-03-20",
      lastUpdated: "2024-03-20",
      priority: "High",
    },
    {
      id: 2,
      subject: "Gateway Integration",
      category: "Gateway setup",
      status: "In Progress",
      createdAt: "2024-03-19",
      lastUpdated: "2024-03-20",
      priority: "Medium",
    },
    {
      id: 3,
      subject: "General Inquiry",
      category: "Others",
      status: "Resolved",
      createdAt: "2024-03-18",
      lastUpdated: "2024-03-19",
      priority: "Low",
    },
  ];

  const paymentMethods = [
    "Bkash",
    "Nagad",
    "Rocket",
    "Upay",
    "Celfin",
    "Tap",
    "Islamic Bank",
    "City Bank",
    "Sonali Bank",
    "DBBL Bank",
    "Basic Bank",
    "EBL Bank",
    "Brac Bank",
    "Bank Asia",
    "Agrani Bank",
    "Jamuna Bank",
    "IFIC Bank",
    "Binance",
    "Payeer",
    "Ipay",
    "Ok Wallet",
    "Sure Cash",
    "My Cash",
  ];

  const handleSubmit = () => {
    if (!category) {
      toast.error("Please select a category");
      return;
    }

    if (!description) {
      toast.error("Please provide a description");
      return;
    }

    if (category === "Payment" && (!paymentMethod || !transactionId)) {
      toast.error("Please fill in all payment details");
      return;
    }

    if (category === "Gateway setup" && !websiteLink) {
      toast.error("Please provide the website link");
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Ticket submitted successfully!");
      // Reset form
      setCategory("");
      setPaymentMethod("");
      setTransactionId("");
      setWebsiteLink("");
      setDescription("");
    }, 1500);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Open":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300";
      case "In Progress":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
      case "Resolved":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  return (
    <div className="space-y-6 mb-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* New Ticket Form */}
        <Card className="dark:bg-slate-700">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              <CardTitle className="text-xl font-bold">
                Create New Ticket
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Payment">Payment</SelectItem>
                    <SelectItem value="Gateway setup">Gateway Setup</SelectItem>
                    <SelectItem value="Others">Others</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {category === "Payment" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="paymentMethod">Payment Method</Label>
                    <Select
                      value={paymentMethod}
                      onValueChange={setPaymentMethod}
                    >
                      <SelectTrigger id="paymentMethod">
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentMethods.map((method) => (
                          <SelectItem key={method} value={method}>
                            {method}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="transactionId">Transaction ID</Label>
                    <Input
                      id="transactionId"
                      placeholder="Enter transaction ID"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                    />
                  </div>
                </>
              )}

              {category === "Gateway setup" && (
                <div className="space-y-2">
                  <Label htmlFor="websiteLink">Website Link</Label>
                  <Input
                    id="websiteLink"
                    placeholder="Enter your website URL"
                    value={websiteLink}
                    onChange={(e) => setWebsiteLink(e.target.value)}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your issue in detail..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[150px]"
                />
              </div>

              <Button
                variant="primary"
                className="w-full"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Ticket"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tickets List */}
        <Card className="dark:bg-slate-700">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Ticket className="h-5 w-5" />
              <CardTitle className="text-xl font-bold">Your Tickets</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border dark:border-slate-600">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Priority</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-medium">
                        {ticket.subject}
                      </TableCell>
                      <TableCell>{ticket.category}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            ticket.status
                          )}`}
                        >
                          {ticket.status}
                        </span>
                      </TableCell>
                      <TableCell>{ticket.createdAt}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            ticket.priority === "High"
                              ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                              : ticket.priority === "Medium"
                              ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                              : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                          }`}
                        >
                          {ticket.priority}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
