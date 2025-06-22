"use client";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

export default function BkashPayDialog({
  isOpen,
  onClose,
  amount,
  currency,
  yearly,
  plan,
  email,
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const handlePayNow = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/payment/create", {
        method: "POST",
        body: JSON.stringify({
          email,
          amount,
          currency,
          plan,
          yearly,
        }),
      });
      const data = await response.json();
      setIsLoading(false);
      onClose();
      router.push(data?.data?.bkashURL);
    } catch (error) {
      console.error("Payment creation error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 justify-center">
            <span className="text-xl font-bold text-pink-600">
              bKash Payment
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-8 py-6">
          {/* Amount Display */}
          <div className="text-center p-6 bg-pink-50 dark:bg-slate-800 rounded-xl border-2 border-pink-200 dark:border-slate-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Amount to Pay
            </p>
            <p className="text-3xl font-bold text-pink-600 dark:text-pink-400">
              ৳{amount}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">BDT</p>
          </div>

          {/* Payment Details */}
          <div className="space-y-3 text-center">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p>
                Plan:{" "}
                {plan === 1
                  ? "Personal Account Automation"
                  : "Ready Payment Gateway"}
              </p>
              {plan === 1 && <p>Duration: {yearly ? "1 Year" : "1 Month"}</p>}
            </div>
          </div>

          {/* Pay Button */}
          <Button
            onClick={handlePayNow}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {isLoading ? "Processing..." : "Pay Now with bKash"}
          </Button>

          {/* Additional Info */}
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              You will be redirected to bKash payment gateway
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
