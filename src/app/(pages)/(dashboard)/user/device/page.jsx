"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Smartphone, Plus, Search, Trash2, Edit2 } from "lucide-react";
import toast from "react-hot-toast";

export default function Devices() {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data - replace with actual data from your backend
  const devices = [
    {
      id: 1,
      deviceName: "iPhone 13 Pro",
      deviceId: "DEV-123456",
      merchantName: "John's Store",
      status: "Active",
      lastActive: "2024-03-20 14:30",
      location: "New York, USA",
      ipAddress: "192.168.1.1",
    },
    {
      id: 2,
      deviceName: "Samsung Galaxy S21",
      deviceId: "DEV-789012",
      merchantName: "Sarah's Shop",
      status: "Inactive",
      lastActive: "2024-03-19 09:15",
      location: "Los Angeles, USA",
      ipAddress: "192.168.1.2",
    },
    {
      id: 3,
      deviceName: "iPad Pro",
      deviceId: "DEV-345678",
      merchantName: "Mike's Cafe",
      status: "Active",
      lastActive: "2024-03-20 16:45",
      location: "Chicago, USA",
      ipAddress: "192.168.1.3",
    },
  ];

  const filteredDevices = devices.filter(
    (device) =>
      device.deviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.merchantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.deviceId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteDevice = (deviceId) => {
    // Implement delete functionality
    toast.success("Device deleted successfully!");
  };

  const handleEditDevice = (deviceId) => {
    // Implement edit functionality
    toast.success("Device updated successfully!");
  };

  return (
    <div className="space-y-6 mb-20">
      <Card className="w-full dark:bg-slate-700">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <CardTitle className="text-2xl font-bold">
              Devices
            </CardTitle>
            <div className="flex gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:flex-none">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search devices..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full md:w-[300px]"
                />
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="primary" className="whitespace-nowrap">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Device
                  </Button>
                </DialogTrigger>
                <DialogContent className="dark:bg-slate-700">
                  <DialogHeader>
                    <DialogTitle>Add New Device</DialogTitle>
                    <DialogDescription>
                      Register a new merchant device to your account.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="deviceName">Device Name</Label>
                      <Input id="deviceName" placeholder="Enter device name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="merchantName">Merchant Name</Label>
                      <Input
                        id="merchantName"
                        placeholder="Enter merchant name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        placeholder="Enter device location"
                      />
                    </div>
                    <Button variant="primary" className="w-full">
                      Register Device
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border dark:border-slate-600">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Device Name</TableHead>
                  <TableHead>Device ID</TableHead>
                  <TableHead>Merchant</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDevices.map((device) => (
                  <TableRow key={device.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4 text-green-500" />
                        {device.deviceName}
                      </div>
                    </TableCell>
                    <TableCell>{device.deviceId}</TableCell>
                    <TableCell>{device.merchantName}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          device.status === "Active"
                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                            : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                        }`}
                      >
                        {device.status}
                      </span>
                    </TableCell>
                    <TableCell>{device.lastActive}</TableCell>
                    <TableCell>{device.location}</TableCell>
                    <TableCell>{device.ipAddress}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditDevice(device.id)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteDevice(device.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
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
