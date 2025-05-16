"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Wallet() {
  const [selectedMethod, setSelectedMethod] = useState(null);

  const paymentMethods = [
    // Row 1
    { id: 1, name: "Bkash", icon: "💳" },
    { id: 2, name: "Nagad", icon: "💳" },
    { id: 3, name: "Rocket", icon: "💳" },
    { id: 4, name: "Upay", icon: "💳" },
    { id: 5, name: "Celfin", icon: "💳" },
    // Row 2
    { id: 6, name: "Tap", icon: "🏦" },
    { id: 7, name: "Islamic Bank", icon: "🏦" },
    { id: 8, name: "City Bank", icon: "🏦" },
    { id: 9, name: "Sonali Bank", icon: "🏦" },
    { id: 10, name: "DBBL Bank", icon: "🏦" },
    // Row 3
    { id: 11, name: "Basic Bank", icon: "🏦" },
    { id: 12, name: "EBL Bank", icon: "🏦" },
    { id: 13, name: "Brac Bank", icon: "🏦" },
    { id: 14, name: "Bank Asia", icon: "🏦" },
    { id: 15, name: "Agrani Bank", icon: "🏦" },
    // Row 4
    { id: 16, name: "Jamuna Bank", icon: "🏦" },
    { id: 17, name: "IFIC Bank", icon: "🏦" },
    { id: 18, name: "Binance", icon: "💱" },
    { id: 19, name: "Payeer", icon: "💱" },
    { id: 20, name: "Ipay", icon: "💱" },
    // Row 5
    { id: 21, name: "Ok Wallet", icon: "💳" },
    { id: 22, name: "Sure Cash", icon: "💳" },
    { id: 23, name: "My Cash", icon: "💳" },
  ];

  return (
    <Card className="w-full dark:bg-slate-700">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center mb-5">
          Select Payment Method
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {paymentMethods.map((method) => (
            <Button
              key={method.id}
              variant={selectedMethod === method.id ? "dark" : "outline"}
              className={`h-20 flex items-center justify-center gap-2 p-2 ${
                selectedMethod === method.id
                  ? "border-2 border-green-500"
                  : "hover:border-green-500"
              }`}
              onClick={() => setSelectedMethod(method.id)}
            >
              <span className="text-2xl">{method.icon}</span>
              <span className="text-xl font-semibold">{method.name}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
