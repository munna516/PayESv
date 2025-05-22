"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Users, UserCircle, ChevronDown, ChevronUp } from "lucide-react";
import toast from "react-hot-toast";

export default function Affiliates() {
  const [isTreeExpanded, setIsTreeExpanded] = useState(false);

  // Mock data - replace with actual data from your backend
  const referralLink = "https://payesv.com/ref/abc123";
  const parentUser = {
    name: "John Doe",
    email: "john@example.com",
    joinedDate: "2024-01-15",
  };

  const affiliateTree = {
    level1: [
      {
        name: "Alice Smith",
        email: "alice@example.com",
        joinedDate: "2024-02-01",
      },
      {
        name: "Bob Johnson",
        email: "bob@example.com",
        joinedDate: "2024-02-15",
      },
    ],
    level2: [
      {
        name: "Charlie Brown",
        email: "charlie@example.com",
        joinedDate: "2024-03-01",
      },
      {
        name: "Diana Ross",
        email: "diana@example.com",
        joinedDate: "2024-03-15",
      },
    ],
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success("Referral link copied to clipboard!");
  };

  return (
    <div className="space-y-6 mb-20">
      {/* Referral Link Section */}
      <Card className="w-full dark:bg-slate-700">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center mb-5">
            Your Referral Link
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 w-full">
              <Input value={referralLink} readOnly className="w-full" />
            </div>
            <Button
              onClick={copyToClipboard}
              variant="primary"
              className="w-full md:w-auto"
            >
              <Copy className="h-4 w-4" />
              Copy Link
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Parent User Section */}
      <Card className="w-full dark:bg-slate-700">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center mb-5">
            Your Parent User
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 p-4 bg-green-50 dark:bg-slate-600 rounded-lg">
            <UserCircle className="h-12 w-12 text-green-500" />
            <div>
              <h3 className="font-semibold text-lg">{parentUser.name}</h3>
              <p className="text-muted-foreground">{parentUser.email}</p>
              <p className="text-sm text-muted-foreground">
                Joined: {parentUser.joinedDate}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Affiliate Tree Section */}
      <Card className="w-full dark:bg-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">
              Your Affiliate Tree
            </CardTitle>
            <Button
              variant="ghost"
              onClick={() => setIsTreeExpanded(!isTreeExpanded)}
            >
              {isTreeExpanded ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isTreeExpanded && (
            <div className="space-y-6">
              {/* Level 1 Affiliates */}
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Level 1 Affiliates
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {affiliateTree.level1.map((affiliate, index) => (
                    <div
                      key={index}
                      className="p-4 bg-green-50 dark:bg-slate-600 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Users className="h-8 w-8 text-green-500" />
                        <div>
                          <h4 className="font-semibold">{affiliate.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {affiliate.email}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Joined: {affiliate.joinedDate}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Level 2 Affiliates */}
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Level 2 Affiliates
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {affiliateTree.level2.map((affiliate, index) => (
                    <div
                      key={index}
                      className="p-4 bg-green-50 dark:bg-slate-600 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Users className="h-8 w-8 text-green-500" />
                        <div>
                          <h4 className="font-semibold">{affiliate.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {affiliate.email}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Joined: {affiliate.joinedDate}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
