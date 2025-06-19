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
import {
  Mail,
  MessageCircle,
  Link as LinkIcon,
  HelpCircle,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { AuthContext } from "@/provider/AuthProvider";
import { useRouter } from "next/navigation";

// Payment card data with logos
const paymentCards = [
  {
    id: 1,
    name: "DBBL",
    logo: "https://play-lh.googleusercontent.com/xodZSlJ7hqm7i8Txsgyy8fQtTtSNtb9kywyVB2S8CqSUGUvRyB9brq0ExXsSbEWKFkw=w600-h300-pc0xffffff-pd",
  },
  {
    id: 2,
    name: "Visa",
    logo: "https://logos-world.net/wp-content/uploads/2020/06/Visa-Logo-2006.png",
  },
  {
    id: 3,
    name: "MasterCard",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Mastercard_2019_logo.svg/1200px-Mastercard_2019_logo.svg.png",
  },
  {
    id: 4,
    name: "Amex ",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3PDXjS8cxZpIsNmUPIHM0dQO73rq2PLojyZG3sbkj3xSkB9jW3SZJeM9jx6XyQ4cAzWc&usqp=CAU",
  },
];

// Mobile payment options with logos
const mobilePayments = [
  {
    id: 1,
    name: "Bkash",
    logo: "https://logos-download.com/wp-content/uploads/2022/01/BKash_Logo_icon-700x662.png",
  },
  {
    id: 2,
    name: "Nagad",
    logo: "https://www.logo.wine/a/logo/Nagad/Nagad-Vertical-Logo.wine.svg",
  },
  {
    id: 3,
    name: "Rocket",
    logo: "https://images.seeklogo.com/logo-png/31/1/dutch-bangla-rocket-logo-png_seeklogo-317692.png",
  },
  {
    id: 4,
    name: "Upay",
    logo: "https://channelreport.upaybd.com/static/media/logo.png",
  },
  {
    id: 5,
    name: "Ok Walltet",
    logo: "https://okwallet.com.bd/images/bs-img.png",
  },
];

// Net banking options with logos
const netBanking = [
  {
    id: 1,
    name: "Binance",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Binance_Logo.svg/640px-Binance_Logo.svg.png",
  },
  {
    id: 2,
    name: "Stripe",
    logo: "https://memberpress.com/wp-content/uploads/2017/09/Integrations-Stripe-1724x970-1.svg",
  },
  {
    id: 3,
    name: "PayPal",
    logo: "https://downloadr2.apkmirror.com/wp-content/uploads/2018/08/5b6b880550789.png",
  },
  {
    id: 4,
    name: "Payoneer",
    logo: "https://clemta.com/wp-content/uploads/2023/05/Payoneer.png",
  },
];

export default function Checkout() {
  const router = useRouter();
  const { paymentInfo } = useContext(AuthContext);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [activeTab, setActiveTab] = useState("card");
  const [affiliateLink, setAffiliateLink] = useState(
    "https://smmxz.com/ref/user123"
  ); // Replace with actual user's affiliate link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(affiliateLink);
    // You can add a toast notification here
  };

  const handlePayNow = () => {
    router.push(paymentInfo?.bkashURL);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 ">
      <div className="max-w-3xl mx-auto">
        {/* Main Card */}
        <Card className="w-full shadow-lg">
          <CardHeader>
            <CardTitle className=" text-center flex items-center justify-center gap-5 mb-3">
              <img
                className="h-10 w-10 rounded-lg"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQa9KAOGV7c9MnH37PVl4I9hDNsE9IPLrLrrw&s"
                alt=""
              />
              <h1 className="text-green-500 text-3xl font-bold">SMMXZ</h1>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs
              defaultValue="card"
              className="w-full"
              onValueChange={(value) => setActiveTab(value)}
            >
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger
                  value="card"
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
              <TabsContent value="card">
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
              </TabsContent>

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
                        <img
                          src={payment.logo}
                          alt={payment.name}
                          className="object-contain"
                        />
                      </div>
                      <div className="font-medium">{payment.name}</div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* Net Banking Tab */}
              <TabsContent value="netbanking">
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
              </TabsContent>
            </Tabs>

            {/* Pay Button */}
            <div className="mt-8">
              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white py-4 "
                disabled={!selectedPaymentMethod}
                onClick={handlePayNow}
              >
                Pay Now
              </Button>
            </div>

            {/* Support and Affiliate Section */}
            <div className="mt-2 space-y-4 flex items-center justify-center">
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

              {/* Affiliate Link Section */}
              <div className=" w-1/2border rounded-lg p-4">
                <Link
                  href="https://smmxz.com/ref/user123"
                  className="flex items-center gap-2 mb-2"
                >
                  <LinkIcon className="h-4 w-4 text-green-600" />
                  <Label className="text-sm font-medium">
                    Try This Gateway
                  </Label>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
