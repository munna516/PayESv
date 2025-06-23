"use client";
import React, { useContext, useState } from "react";
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
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import BinancePayDialog from "./BinancePayDialog";
import BkashPayDialog from "./BkashPayDialog";

export default function PersonalPriceCard({ yearly }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [quantity, setQuantity] = useState("1");
  const [showBinanceDialog, setShowBinanceDialog] = useState(false);
  const [showBkashDialog, setShowBkashDialog] = useState(false);
  const basePrice = 1;
  const calculateTotal = () => {
    return quantity ? basePrice * Number(quantity) : basePrice;
  };
  const [currency, setCurrency] = useState("bdt");

  const handleBuyNow = async () => {
    if (status === "authenticated") {
      if (currency === "bdt") {
        setShowBkashDialog(true);
      } else {
        // Open Binance Pay dialog
        setShowBinanceDialog(true);
      }
    } else {
      toast.error("Please login first!");
      router.push(`/login?callbackUrl=${encodeURIComponent("/user/plans")}`);
    }
  };

  return (
    <div>
      <Card className="bg-green-50 dark:bg-slate-700 w-[370px] md:w-[400px] h-full shadow-md rounded-2xl">
        <CardContent className="p-6 flex flex-col gap-6">
          <h2 className="text-center text-xl md:text-2xl font-bold text-green-500 dark:text-white">
            Personal Acoount Automation
          </h2>
          <div className="flex flex-grow items-center justify-evenly text-center text-3xl font-bold">
            <div>
              {currency === "bdt" ? "৳" : "$"}{" "}
              {calculateTotal
                ? currency === "bdt"
                  ? calculateTotal() * 120 * (yearly ? 10 : 1)
                  : calculateTotal() * (yearly ? 10 : 1)
                : basePrice}
              <span className="text-sm font-normal ml-1">
                {yearly ? "/year" : "/month"}
              </span>
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
                <SelectItem value="usd">USD</SelectItem>
                <SelectItem value="bdt">BDT</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <ul className="text-base text-muted-foreground space-y-2">
            <li>✔ Unlimited Transactions</li>
            <li>✔ Payment Link Management</li>
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

          <div>
            <Button variant="primary" className="w-full" onClick={handleBuyNow}>
              Buy Now
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Binance Pay Dialog */}
      <BinancePayDialog
        isOpen={showBinanceDialog}
        onClose={() => setShowBinanceDialog(false)}
        amount={calculateTotal() * (yearly ? 10 : 1)}
        currency={currency}
        plan={1}
        email={session?.user?.email}
        yearly={yearly}
        websiteQuantity={
          quantity === "1"
            ? 1
            : quantity === "1.5"
            ? 2
            : quantity === "2"
            ? 3
            : quantity === "3"
            ? 5
            : quantity === "5"
            ? 10
            : 0
        }
      />

      <BkashPayDialog
        isOpen={showBkashDialog}
        onClose={() => setShowBkashDialog(false)}
        amount={calculateTotal() * 120 * (yearly ? 10 : 1)}
        currency={currency}
        yearly={yearly}
        plan={1}
        email={session?.user?.email}
        websiteQuantity={
          quantity === "1"
            ? 1
            : quantity === "1.5"
            ? 2
            : quantity === "2"
            ? 3
            : quantity === "3"
            ? 5
            : quantity === "5"
            ? 10
            : 0
        }
      />
    </div>
  );
}
