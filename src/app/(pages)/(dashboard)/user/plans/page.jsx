"use client";
import PersonalPriceCard from "@/components/Pricing/PersonalPriceCard";

import ReadyPriceCard from "@/components/Pricing/ReadyPriceCard";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import React, { useState } from "react";

export default function Plans() {
  const [option, setOption] = useState("yearly");
  return (
    <div className="mb-20">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl lg:text-4xl dark:text-white font-bold mb-4">
          Check Our Pricing
        </h2>
        <p className="text-muted-foreground  mb-6 md:w-1/2 w-full mx-auto">
          Honest pricing, no hidden fees. Payesv offers transparent and
          competitive rates to help you grow your business without breaking the
          bank. Our pricing is tailored to fit your business needs
          competitively.
        </p>
      </div>
      <div className="flex flex-col items-center space-y-4 ">
        <ToggleGroup
          type="single"
          value={option}
          onValueChange={(val) => setOption(val || option)}
          className={`rounded-full p-1 gap-3 border-2  mb-3`}
        >
          <ToggleGroupItem
            value="monthly"
            className={`px-6 py-3 rounded-full ${
              option == "monthly" ? "bg-green-500 text-white font-bold" : ""
            }`}
          >
            Monthly
          </ToggleGroupItem>
          <ToggleGroupItem
            value="yearly"
            className={`px-6 py-3 rounded-full ${
              option == "yearly" ? "bg-green-500 text-white font-bold" : ""
            }`}
          >
            Yearly
          </ToggleGroupItem>
        </ToggleGroup>

        <div className="md:flex items-stretch justify-center gap-8 space-y-6 md:space-y-0">
          {option === "monthly" && (
            <>
              <PersonalPriceCard yearly={0} />
              <ReadyPriceCard />
            </>
          )}
          {option === "yearly" && (
            <>
              <PersonalPriceCard yearly={1} />
              <ReadyPriceCard />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
