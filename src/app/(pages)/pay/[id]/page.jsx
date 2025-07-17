"use client";

import React, { useContext, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CreditCard, Smartphone, Building2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Mail, MessageCircle, HelpCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/components/Loading/Loading";
import Image from "next/image";
import react from "@heroicons/react";

export default function Checkout() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [activeTab, setActiveTab] = useState("mobile");

  const handlePayNow = async () => {
    // router.push(paymentInfo?.bkashURL);

    try {
      setLoading(true);
      const response = await fetch(`/api/user/bkash/payment-create`, {
        method: "POST",
        body: JSON.stringify({
          email: info?.customer_email,
          amount: info?.amount,
          currency: info?.currency,
          apiKey: walletInfo?.api_key,
          apiSecret: walletInfo?.api_secret,
          username: walletInfo?.username,
          password: walletInfo?.password,
          environment: walletInfo?.environment,
          marchant_number: walletInfo?.merchant_number,
          p_id: params?.id,
        }),
      });
      if (response.ok) {
        const url = await response.json();
        setLoading(false);
        router.push(url);
      } else {
        toast.error("Payment failed");
      }
    } catch (error) {
      toast.error("Payment failed");
    } 
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["paymentInfo", params?.id],
    queryFn: () =>
      fetch(`/api/user/paymentpage?Id=${params?.id}`).then((res) =>
        res.json()
      ),
    enabled: !!params?.id,
  });

  if (isLoading) return <Loading />;

  if (data?.error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 ">
        <div className="max-w-3xl mx-auto">
          <div className="text-red-500 text-center text-3xl font-bold">
            {data?.error}
          </div>
        </div>
      </div>
    );
  }
  const { brand: paymentInfo, info, paymentMethods, walletInfo } = data || {};

  const mobilePayments = paymentMethods.map((method) => ({
    id: method.id,
    name: method.method_name,
    logo: method.method_logo,
  }));

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 ">
      <div className="max-w-3xl mx-auto">
        {/* Main Card */}
        <Card className="w-full shadow-lg">
          <CardHeader>
            <CardTitle className=" text-center flex items-center justify-center gap-5 mb-3">
              <Image
                className="h-10 w-10 rounded-lg"
                src={paymentInfo?.brand_logo}
                alt={paymentInfo?.brand_name}
                width={40}
                height={40}
              />
              <h1 className="text-green-500 text-3xl font-bold">
                {paymentInfo?.brand_name}
              </h1>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs
              className="w-full"
              defaultValue="mobile"
              onValueChange={(value) => setActiveTab(value)}
            >
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger
                  value="card"
                  disabled
                  className={`flex items-center gap-2 ${
                    activeTab === "card" ? "bg-green-500 text-white" : ""
                  }`}
                >
                  <CreditCard className="h-4 w-4" />
                  Card
                </TabsTrigger>
                <TabsTrigger
                  value="mobile"
                  className={`flex items-center gap-2 ${
                    activeTab === "mobile" ? "bg-green-500 text-white" : ""
                  }`}
                >
                  <Smartphone className="h-4 w-4" />
                  Mobile
                </TabsTrigger>
                <TabsTrigger
                  value="netbanking"
                  disabled
                  className={`flex items-center gap-2 ${
                    activeTab === "netbanking"
                      ? "bg-green-500 text-red-500"
                      : ""
                  }`}
                >
                  <Building2 className="h-4 w-4" />
                  Net Banking
                </TabsTrigger>
              </TabsList>

              {/* Card Payment Tab */}
              {/* <TabsContent value="card">
                <div className="grid grid-cols-3 gap-4">
                  {paymentCards.map((card) => (
                    <div
                      key={card.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all flex items-center gap-3 ${
                        selectedPaymentMethod === `card-${card.id}`
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 hover:border-green-300"
                      }`}
                      onClick={() =>
                        setSelectedPaymentMethod(`card-${card.id}`)
                      }
                    >
                      <div className="w-12 h-12 flex items-center justify-center">
                        <img
                          src={card.logo}
                          alt={card.name}
                          className="object-contain"
                        />
                      </div>
                      <div className="font-medium">{card.name}</div>
                    </div>
                  ))}
                </div>
              </TabsContent> */}

              {/* Mobile Payment Tab */}
              <TabsContent value="mobile">
                <div className="grid grid-cols-3 gap-4">
                  {mobilePayments.map((payment) => (
                    <div
                      key={payment.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all flex items-center gap-3 ${
                        selectedPaymentMethod === `mobile-${payment.id}`
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 hover:border-green-300"
                      }`}
                      onClick={() =>
                        setSelectedPaymentMethod(`mobile-${payment.id}`)
                      }
                    >
                      <div className="w-12 h-12 flex items-center justify-center">
                        <Image
                          src={payment.logo}
                          alt={payment.name}
                          height={40}
                          width={40}
                          className="object-contain"
                        />
                      </div>
                      <div className="font-medium">{payment.name}</div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* Net Banking Tab */}
              {/* <TabsContent value="netbanking">
                <div className="grid grid-cols-3 gap-4">
                  {netBanking.map((bank) => (
                    <div
                      key={bank.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all flex items-center gap-3 ${
                        selectedPaymentMethod === `bank-${bank.id}`
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 hover:border-green-300"
                      }`}
                      onClick={() =>
                        setSelectedPaymentMethod(`bank-${bank.id}`)
                      }
                    >
                      <div className="w-12 h-12 flex items-center justify-center">
                        <img
                          src={bank.logo}
                          alt={bank.name}
                          className="object-contain"
                        />
                      </div>
                      <div className="font-medium">{bank.name}</div>
                    </div>
                  ))}
                </div>
              </TabsContent> */}
            </Tabs>

            {/* Pay Button */}
            <div className="mt-8">
              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white py-4 "
                disabled={!selectedPaymentMethod}
                onClick={handlePayNow}
              >
                {loading ? "Processing..." : "Pay Now"}
              </Button>
            </div>

            {/* Support and Affiliate Section */}
            <div className="mt-5 space-y-4 flex items-center justify-center">
              {/* Support Dialog */}
              <Dialog className="w-1/2">
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className=" flex items-center justify-center gap-2"
                  >
                    <HelpCircle className="h-4 w-4" />
                    Need Help? Contact Support
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Contact Support</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Button className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700">
                      <MessageCircle className="h-4 w-4" />
                      WhatsApp Support
                    </Button>
                    <Button className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700">
                      <Mail className="h-4 w-4" />
                      Email Support
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
