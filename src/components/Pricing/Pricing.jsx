import React from "react";
import { Card, CardContent } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import PersonalPriceCard from "./PersonalPriceCard";

export default function Pricing() {
  return (
    <section className=" mt-14 md:mt-20">
      <div className="text-center mb-12">
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

     <PersonalPriceCard />
    </section>
  );
}
