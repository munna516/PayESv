"use client";
import HeroImage from "./HeroImage";
import { Button } from "../ui/button";
import { Typewriter } from "react-simple-typewriter";

export default function Hero() {

  return (
    <section id="home" className="flex flex-col md:flex-row items-center justify-between mt-24 md:mt-24 lg:mt-10">
      {/* Left Side: Text Content */}
      <div className="md:w-1/2 mb-10 md:mb-0">
        <h1 className="text-2xl md:text-3xl lg:text-4xl dark:text-white font-bold mb-4">
          Make Your Payment
          <span className="ml-3 text-green-500 dark:text-green-400 font-bold">
            <Typewriter
              words={[
                "Faster",
                "Easier",
                "Secure",
                "Reliable",
                "Simple",
                " Smarter",
              ]}
              loop={50}
              cursor
              cursorStyle="_"
              typeSpeed={70}
              deleteSpeed={50}
              delaySpeed={1000}
            />
          </span>
        </h1>
        <p className="text-muted-foreground  mb-6 ">
          Payesv is a secure, fast and scalable payment gateway designed to
          simplify online transactions for businesses of all sizes. With easy
          integration, low fees and full compliance, Payesv helps you accept
          payments seamlessly — whether you're running an e-commerce store,
          subscription service or digital platform.Lets Empower your business
          with Payesv.
        </p>
        <Button
         variant="primary"
          size="xl"
        >
          Start For Free demo
        </Button>
      </div>

      {/* Right Side: Image */}
      <HeroImage />
    </section>
  );
}
