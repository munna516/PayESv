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

// Mock data - replace with actual data from your API
const mockDevices = [
  {
    id: 1,
    email: "user1@example.com",
    deviceName: "Device 1",
    deviceKey: "KEY123",
    deviceIp: "192.168.1.1",
  },
  {
    id: 2,
    email: "user2@example.com",
    deviceName: "Device 2",
    deviceKey: "KEY456",
    deviceIp: "192.168.1.2",
  },
  {
    id: 3,
    email: "user3@example.com",
    deviceName: "Device 3",
    deviceKey: "KEY789",
    deviceIp: "192.168.1.3",
  },
  {
    id: 4,
    email: "user4@example.com",
    deviceName: "Device 4",
    deviceKey: "KEY101",
    deviceIp: "192.168.1.4",
  },
  // Add more mock data as needed
];

export default function Device() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDevices = mockDevices.filter((device) =>
    Object.values(device).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleDelete = (id) => {
    // Implement delete functionality
  
  };

  return (
    <div className="">
      <Card className="dark:bg-slate-700">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ">
          <CardTitle>Devices</CardTitle>
          <div className="relative w-full sm:w-[300px]">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search devices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardHeader>
        <CardContent className="">
          <div className="rounded-md border ">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Device Name</TableHead>
                  <TableHead>Device Key</TableHead>
                  <TableHead>Device IP</TableHead>
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDevices.map((device, index) => (
                  <TableRow key={device.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{device.email}</TableCell>
                    <TableCell>{device.deviceName}</TableCell>
                    <TableCell>{device.deviceKey}</TableCell>
                    <TableCell>{device.deviceIp}</TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(device.id)}
                        className="h-8 w-8 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 dark:text-white" />
                      </Button>
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
