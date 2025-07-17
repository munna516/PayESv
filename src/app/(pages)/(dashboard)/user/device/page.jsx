"use client";

import React, { useEffect, useState } from "react";
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
import { Smartphone, Search, Trash2, Edit2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useDeviceInfo } from "./useDeviceInfo";
import Loading from "@/components/Loading/Loading";

export default function Devices() {
  const { data: session } = useSession();
  const deviceInfo = useDeviceInfo();
  const [devices, setDevices] = useState([]);

  const getDevices = async () => {
    if (!deviceInfo) return; // Wait until deviceInfo is available

    fetch("/api/user/device", {
      method: "POST",
      body: JSON.stringify({
        email: session.user.email,
        deviceInfo,
      }),
    });

    const res = await fetch(`/api/user/device?email=${session.user.email}`, {
      method: "GET",
    });
    const data = await res.json();
   
    setDevices(data?.rows);
  };

  useEffect(() => {
    if (session && deviceInfo) {
      getDevices();
    }
  }, [session, deviceInfo]);

  // Show loading state while deviceInfo is being fetched
  if (!deviceInfo) {
    return <Loading />;
  }

  return (
    <div className="space-y-6 mb-20">
      <Card className="w-full dark:bg-slate-700">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <CardTitle className="text-2xl font-bold">Devices</CardTitle>
          </div>
        </CardHeader>
        {devices.length > 0 ? (
          <CardContent>
            <div className="rounded-md border dark:border-slate-600">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Device Type</TableHead>
                    <TableHead>OS</TableHead>
                    <TableHead>Browser</TableHead>

                    <TableHead>Cookies Enabled</TableHead>
                    <TableHead>Time Zone</TableHead>
                    <TableHead>IP Address</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {devices.map((device) => (
                    <TableRow key={device.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Smartphone className="h-4 w-4 text-green-500" />
                          {device.device_type.charAt(0).toUpperCase() +
                            device.device_type.slice(1)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {device.os.charAt(0).toUpperCase() + device.os.slice(1)}
                      </TableCell>
                      <TableCell>
                        {device.browser.charAt(0).toUpperCase() +
                          device.browser.slice(1)}
                      </TableCell>
                      <TableCell>
                        {device.cookies_enabled ? "Yes" : "No"}
                      </TableCell>

                      <TableCell>{device.time_zone}</TableCell>
                      <TableCell>{device.ip_address}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        ) : (
          <CardContent>
            <h1>No devices found</h1>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
