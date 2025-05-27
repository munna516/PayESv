"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { HelpCircle, MessageSquare, Info } from "lucide-react";

// Placeholder logos (replace src with your own or static files as needed)
const cardLogos = [
  { name: "DBBL NEXUS", src: "https://hostmight.com/assets/images/dbbl.png" },
  {
    name: "Visa",
    src: "https://images.seeklogo.com/logo-png/14/2/visa-logo-png_seeklogo-149684.png",
  },
  {
    name: "MasterCard",
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Mastercard_2019_logo.svg/1200px-Mastercard_2019_logo.svg.png",
  },
  {
    name: "American Express",
    src: "https://seeklogo.com/images/A/amex-card-logo-6D352AA0A4-seeklogo.com.png",
  },
];

const mobileBankingLogos = [
  {
    name: "bKash",
    src: "https://www.logo.wine/a/logo/BKash/BKash-Icon-Logo.wine.svg",
  },
  {
    name: "Nagad",
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfiVftg5hdy5yGYpMFCdAF3qH2ujMn0EMVaA&s",
  },
  {
    name: "Rocket",
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIESQSR9WwZyC2lDP81J1jiKiikvoF1E_DtA&s",
  },
  {
    name: "Upay",
    src: "https://channelreport.upaybd.com/static/media/logo.png",
  },
];

export default function Checkout() {
  const [tab, setTab] = useState("cards");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-5">
      <Card className="md:w-[450px] h-full  shadow-xl dark:bg-slate-700">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-green-600 mb-3">
            PayEsv
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center gap-8 mb-6">
            <div className="flex flex-col items-center text-xs text-muted-foreground">
              <HelpCircle className="h-6 w-6 mb-1 text-blue-500" />
              Support
            </div>
            <div className="flex flex-col items-center text-xs text-muted-foreground">
              <MessageSquare className="h-6 w-6 mb-1 text-yellow-500" />
              FAQ
            </div>
            <div className="flex flex-col items-center text-xs text-muted-foreground">
              <Info className="h-6 w-6 mb-1 text-green-500" />
              Details
            </div>
          </div>
          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-6 bg-green-100 ">
              <TabsTrigger
                value="cards"
                className="data-[state=active]:bg-green-400 data-[state=active]:text-white rounded-l-lg"
              >
                Cards
              </TabsTrigger>
              <TabsTrigger
                value="mobile"
                className="data-[state=active]:bg-green-400 data-[state=active]:text-white rounded-r-lg"
              >
                Mobile Banking
              </TabsTrigger>
            </TabsList>
            <TabsContent value="cards">
              <div className="grid grid-cols-3 gap-4 mb-6">
                {cardLogos.map((logo) => (
                  <div
                    key={logo.name}
                    className="flex flex-col items-center  hover:scale-125 transition-all duration-300 cursor-pointer"
                  >
                    <div className="bg-white dark:bg-gray-800 rounded-lg h-16  flex items-center justify-center w-20 p-2 shadow cursor-pointer">
                      <img
                        src={logo.src}
                        alt={logo.name}
                        className="h-28 object-contain"
                      />
                    </div>
                    <span className="mt-2 text-xs font-semibold text-center"></span>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="mobile" className="w-full">
              <div className="grid grid-cols-3 gap-4 mb-6 ">
                {mobileBankingLogos.map((logo) => (
                  <div
                    key={logo.name}
                    className="flex flex-col items-center  hover:scale-125 transition-all duration-300 cursor-pointer"
                  >
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-2 flex items-center justify-center h-16 w-20 shadow">
                      <img
                        src={logo.src}
                        alt={logo.name}
                        className="h-28 object-contain"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
          <Button className="w-full bg-green-600 hover:bg-green-700 text-lg font-bold mt-4">
            <span className="mr-2">💳</span> Pay BDT 10.00
          </Button>
        </CardContent>
      </Card>
      <div className="flex flex-col items-center">
        <span className="text-lg font-bold text-gray-400 flex items-center gap-2">
          <span className="text-2xl">★</span> PayEsv
        </span>
        <span className="text-xs text-gray-400 mt-1">
          © Copyright 2023 PayEsv. All Rights Reserved
        </span>
      </div>
    </div>
  );
}
