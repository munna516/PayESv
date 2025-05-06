"use client";

import { Card, CardContent } from "@/components/ui/card";
import { FaRegSmile } from "react-icons/fa";
import { GiSpeedometer } from "react-icons/gi";
import { MdPublic, MdSupportAgent } from "react-icons/md";

const features = [
  {
    icon: <GiSpeedometer className="text-blue-500 text-4xl" />,
    title: "Rapidly Growing Platform",
    description:
      "Recognized as one of the fastest-growing payment gateways, trusted by thousands across the industry.",
  },
  {
    icon: <MdPublic className="text-teal-500 text-4xl" />,
    title: "Seamless Global Reach",
    description:
      "Expand your business worldwide effortlessly with our international gateway—no extra integration costs required.",
  },
  {
    icon: <FaRegSmile className="text-pink-500 text-4xl" />,
    title: "SME-Friendly Solutions",
    description:
      "Our pricing and gateway plans are thoughtfully crafted to support the unique needs of small and medium-sized businesses.",
  },

  {
    icon: <MdSupportAgent className="text-red-500 text-4xl" />,
    title: "24/7 Dedicated Support",
    description:
      "Reach us anytime via email, chat, or phone—we're always here to assist you with responsive and reliable support.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className=" mt-14 md:mt-20">
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl lg:text-4xl dark:text-white font-bold mb-4">
          Why Choose PayESv
        </h2>
        <p className="text-muted-foreground  mb-6 ">
          Our pricing is tailored to fit your business needs competitively.
          Contact us today, and we’ll get back to you with a personalized quote.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {features.map((feature, idx) => (
          <Card
            key={idx}
            className="flex gap-10 bg-green-50 dark:bg-slate-700 items-center p-6 shadow-md"
          >
            <div className="text-3xl">{feature.icon}</div>
            <CardContent className="p-0">
              <h3 className="text-xl font-semibold  mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
