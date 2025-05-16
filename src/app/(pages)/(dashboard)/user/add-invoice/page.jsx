"use client";

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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AddInvoice() {
  return (
    <Card className="w-full dark:bg-slate-700">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center mb-5">
          Add Invoice
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-6">
          {/* Row 1: Amount and User Brand */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="font-semibold">
                Amount
              </Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                placeholder="Enter amount"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userBrand" className="font-semibold">
                User Brand
              </Label>
              <Input
                id="userBrand"
                name="userBrand"
                type="text"
                placeholder="Enter user brand"
                className="w-full"
              />
            </div>
          </div>

          {/* Row 2: Category and Payment Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category" className="font-semibold">
                Status
              </Label>
              <Select>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="service">Active</SelectItem>
                  <SelectItem value="product">Deactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentStatus" className="font-semibold">
                Payment Status
              </Label>
              <Select>
                <SelectTrigger id="paymentStatus">
                  <SelectValue placeholder="Select payment status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 3: Customer Name and Contact Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customerName" className="font-semibold">
                Customer Name
              </Label>
              <Input
                id="customerName"
                name="customerName"
                type="text"
                placeholder="Enter customer name"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactNumber" className="font-semibold">
                Contact Number
              </Label>
              <Input
                id="contactNumber"
                name="contactNumber"
                type="tel"
                placeholder="Enter contact number"
                className="w-full"
              />
            </div>
          </div>

          {/* Row 4: Email and Customer Address */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-semibold">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter email"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address" className="font-semibold">
                Customer Address
              </Label>
              <Input
                id="address"
                name="address"
                type="text"
                placeholder="Enter customer address"
                className="w-full"
              />
            </div>
          </div>

          {/* Row 5: Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="font-semibold">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Enter description"
              className="w-full min-h-[100px]"
            />
          </div>

          <Button type="submit" variant="primary" className="w-full">
            Create Invoice
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
