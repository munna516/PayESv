"use client";
import React, { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { useTheme } from "next-themes";

export default function ReadyPriceCard() {
  const { theme, setTheme } = useTheme();
  const calculateTotal = () => {
    return 20;
  };
  const [currency, setCurrency] = useState("usd");

  return (
    <div>
      <Card className="bg-green-50 dark:bg-slate-700 w-[400px] h-full shadow-md rounded-2xl">
        <CardContent className="p-6 flex flex-col gap-8">
          <h2 className="text-center text-2xl font-bold text-green-500 dark:text-white">
            Ready Payment Gateway
          </h2>
          <div className="flex flex-grow items-center justify-evenly text-center text-3xl font-bold">
            <div>
              {currency === "bdt" ? "৳" : "$"}{" "}
              {calculateTotal
                ? currency === "bdt"
                  ? calculateTotal() * 120
                  : calculateTotal()
                : basePrice}
              <span className="text-sm font-normal ml-1"></span>
            </div>
            <Select
              defaultValue="usd"
              onValueChange={(value) => setCurrency(value)}
              className="inline-block ml-2"
            >
              <SelectTrigger className="w-20">
                <SelectValue placeholder="Currency" />
              </SelectTrigger>
              <SelectContent position="popper" className="dark:bg-slate-700">
                <SelectItem value="usd">USD</SelectItem>
                <SelectItem value="bdt">BDT</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <ul className="text-base text-muted-foreground space-y-2">
            <li>✔ No Monthly fee</li>
            <li>✔ Unlimited websites</li>
            <li>✔ QR Payment</li>
            <li>✔ Unlimited Transactions</li>
            <li>✔ Payment link management</li>
            <li>✔ Minimum 1.99% Withdrawal fee</li>
            <li>✔ All Payments Method By Default</li>
            <li>✔ And many more</li>
          </ul>

          <Button
            variant={`${theme == "dark" ? "dark_btn" : "primary"}`}
            className="w-full "
          >
            Buy Now
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
