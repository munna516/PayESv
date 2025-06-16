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
import Link from "next/link";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ReadyPriceCard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const calculateTotal = () => {
    return 20;
  };
  const [currency, setCurrency] = useState("bdt");
  const handleBuyNow = () => {
    // if (status === "authenticated") {
    //   router.push("/pay");
    // } else {
    //   toast.error("Please login first!");
    //   router.push(`/login?callbackUrl=${encodeURIComponent("/pay")}`);
    // }
    console.log("Buy Now", currency, calculateTotal() * 120);
  };
  return (
    <div>
      <Card className="bg-green-50 dark:bg-slate-700 w-[370px] md:w-[400px] h-full shadow-md rounded-2xl">
        <CardContent className="p-6 flex flex-col gap-8">
          <h2 className="text-center text-xl md:text-2xl font-bold text-green-500 dark:text-white">
            Ready Payment Gateway
          </h2>
          <div className="flex flex-grow items-center justify-evenly text-center text-3xl font-bold">
            <div>
              {currency === "bdt" ? "৳" : "$"}{" "}
              {calculateTotal
                ? currency === "bdt"
                  ? calculateTotal() * 120
                  : calculateTotal()
                : 20}
              <span className="text-sm font-normal ml-1"></span>
            </div>
            <Select
              defaultValue="bdt"
              onValueChange={(value) => setCurrency(value)}
              className="inline-block ml-2"
            >
              <SelectTrigger className="w-20">
                <SelectValue placeholder="Currency" />
              </SelectTrigger>
              <SelectContent position="popper" className="dark:bg-slate-700">
                {/* <SelectItem value="usd">USD</SelectItem> */}
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

          <div onClick={handleBuyNow}>
            <Button variant="primary" className="w-full ">
              Buy Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
