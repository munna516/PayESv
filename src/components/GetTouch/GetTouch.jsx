"use client";
import { Button } from "../ui/button";

export default function GetTouch() {

  return (
    <div className="mt-10 md:mt-20 text-center">
      <h1 className="text-2xl md:text-3xl lg:text-4xl dark:text-white font-bold mb-4">
        Have Question ? Get in touch!
      </h1>
      <p className="text-muted-foreground  mb-6 ">
        Start working with PayESV that can provide you with secure and efficient
        payment tools to streamline your financial operations.
      </p>
      <Button  variant="primary">Contact Us</Button>
    </div>
  );
}
