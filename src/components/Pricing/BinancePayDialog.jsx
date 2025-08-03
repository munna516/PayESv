"use client";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Copy, Check } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function BinancePayDialog({
  isOpen,
  onClose,
  amount,
  currency,
  plan,
  email,
  yearly,
  websiteQuantity,
}) {
  const [binanceOrderId, setBinanceOrderId] = useState("");
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Binance ID - you can replace this with your actual Binance ID
  const binanceId = process.env.NEXT_PUBLIC_BINANCE_ID;

  const router = useRouter();

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(binanceId);
      setCopied(true);
      toast.success("Binance ID copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy ID");
    }
  };

  const handleCopyAmount = async () => {
    try {
      await navigator.clipboard.writeText(amount);
      setCopied(true);
      toast.success("Amount copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy Amount");
    }
  };

  const handleVerifyPayment = async () => {
    if (!binanceOrderId.trim()) {
      toast.error("Please enter your Binance order ID");
      return;
    }

    setIsLoading(true);
    const response = await fetch("/api/binance/verify-payment", {
      method: "POST",
      body: JSON.stringify({
        orderId: binanceOrderId,
        amount,
        currency: "USDT",
        plan,
        email,
        yearly,
        websiteQuantity,
      }),
    });
    const data = await response.json();
    if (data.verified) {
      toast.success(data.message);
      router.push("/payment/status?status=success");
    } else {
      toast.error(data.message);
    }
    setIsLoading(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md dark:bg-slate-700">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-center">
            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <span className="text-xl font-bold">Binance Pay</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 ">
          {/* Amount Display */}
          <div className=" flex items-center justify-center text-center gap-8  rounded-lg">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Amount to Pay
            </span>
            <span className="text-2xl font-bold text-green-600 dark:text-green-400">
              ${amount} {currency.toUpperCase()}{" "}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopyAmount}
                className="px-3"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </span>
          </div>

          {/* Send to Binance ID */}
          <div className="space-y-2">
            <Label htmlFor="binance-id" className="text-sm font-medium">
              Send to Binance ID
            </Label>
            <div className="flex gap-2">
              <Input
                id="binance-id"
                value={binanceId}
                readOnly
                className="flex-1 bg-gray-50 dark:bg-slate-800"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopyId}
                className="px-3"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-2 bg-white dark:bg-slate-700 rounded-lg p-2">
            <Image
              src="https://storage.perfectcdn.com/maq95c/wdd6axizcg172z52.PNG"
              alt="Binance Pay"
              width={250}
              height={250}
              className="rounded-lg"
            />
            <p className="text-sm text-gray-900 dark:text-gray-400">
              1. Scan the QR using Binance App and send fund by Binance ID
            </p>
            <p className="text-sm text-gray-900 dark:text-gray-400">
              2. Enter your Binance Order ID and click on Verify Payment
            </p>
          </div>
          {/* Enter Binance Order ID */}
          <div className="space-y-2">
            <Label htmlFor="order-id" className="text-sm font-medium">
              Enter your Binance Order ID
            </Label>
            <Input
              id="order-id"
              placeholder="Enter your Binance order ID"
              value={binanceOrderId}
              onChange={(e) => setBinanceOrderId(e.target.value)}
            />
          </div>

          {/* Verify Payment Button */}
          <Button
            onClick={handleVerifyPayment}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
          >
            {isLoading ? "Verifying..." : "Verify Payment"}
          </Button>

          <p className="text-sm text-gray-600 dark:text-gray-400 text-center font-semibold">
            Note: OrderID is valid for 15 minutes after successful payment.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
