"use client";
import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import aboutImg from "@/../public/assets/images/aboutImg.jpg";
import { motion } from "framer-motion";

export default function About() {
  return (
    <section className="grid lg:grid-cols-2 items-center gap-7 lg:gap-10 mt-10 ">
      <motion.div
        animate={{ y: [0, 50, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="w-full order-2 lg:order-1"
      >
        <Image
          src={aboutImg}
          alt="About Es Variation"
          width={500}
          height={400}
          className="w-full  order-2 lg:order-1 rounded-xl"
        />
      </motion.div>

      <div className="order-1 lg:order-2">
        <h2 className="text-2xl md:text-3xl lg:text-4xl dark:text-white font-bold mb-4">
          About PayESV
        </h2>
        <p className="text-muted-foreground  mb-6 ">
          PayESv is an advanced payment automation platform designed to help
          businesses optimize and streamline their financial operations. Our
          solution comes packed with powerful features like invoice generation,
          billing oversight and seamless payment handling, along with
          ready-to-use API integrations. <br />
          <br /> At PayESv our mission is to empower businesses to take full
          control of their financial workflows—eliminating the hassle of manual
          transactions. Our self-hosted platform delivers a secure, scalable and
          dependable system suitable for startups, SMEs and large enterprises
          alike.
          <br />
          <br /> By using PayESv, organizations can automate their payment
          systems, minimize human error and save time and effort. The platform
          is user-friendly and easily integrates with any development
          environment or tech stack—including PHP, JavaScript, Python, Java,
          Laravel, Node.js, WooCommerce and more.
          <br />
          <br /> We’re committed to delivering outstanding service to our users.
          Our expert support team is always available to assist with questions
          or technical concerns, ensuring your experience with PayESv is smooth
          and worry-free.
        </p>
        <Button variant="primary">Get Demo</Button>
      </div>
    </section>
  );
}
