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

export default function PersonalPriceCard() {
  const [quantity, setQuantity] = useState("");
  const basePrice = 1;
  const calculateTotal = () => {
    return quantity ? basePrice * Number(quantity) : basePrice;
  };
  const [currency, setCurrency] = useState("usd");

  return (
    <div>
      <Card className="bg-green-50 dark:bg-slate-700 w-80 shadow-md rounded-2xl">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-center text-2xl font-bold text-green-500">
            PayESv
          </h2>
          <div className="flex items-center justify-evenly text-center text-3xl font-bold">
            <div>
              {currency === "bdt" ? "৳" : "$"}{" "}
              {calculateTotal
                ? currency === "bdt"
                  ? calculateTotal() * 120
                  : calculateTotal()
                : basePrice}
              <span className="text-sm font-normal ml-1">/month</span>
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
            <li>✔ Unlimited transection </li>
            <li>✔ Payment link Management</li>
            <li>✔ Unlimited Transactions</li>
            <li>✔ Free Updates</li>
            <li>✔ Free Support</li>
            <li>✔ And many more</li>
          </ul>

          <div>
            <Label htmlFor="category" className="text-sm mb-2 block">
              Select Website Quantity
            </Label>
            <Select value={quantity} onValueChange={setQuantity}>
              <SelectTrigger id="category" className="w-full ">
                <SelectValue placeholder="Choose a category" />
              </SelectTrigger>
              <SelectContent position="popper" className="dark:bg-slate-700">
                <SelectItem value="1">1 Website</SelectItem>
                <SelectItem value="1.5">2 Websites</SelectItem>
                <SelectItem value="2">3 Websites</SelectItem>
                <SelectItem value="3">5 Websites</SelectItem>
                <SelectItem value="5">10 Websites</SelectItem>
                <SelectItem value="0" disabled>
                  For More Contact
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button variant="primary" className="w-full mt-5">
            Buy Now
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
