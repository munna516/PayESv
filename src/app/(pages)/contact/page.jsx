"use client";

import ContactForm from "./component/ContactForm";
import ContactInfo from "./component/ContactInfo";

export default function Contact() {
  return (
    <div className="mt-32 px-4 lg:px-3">
      <div className="">
        <h1 className="text-2xl md:text-3xl lg:text-4xl dark:text-white font-bold mb-4">
          How Can We Help ?
        </h1>
        <p className="text-muted-foreground  mb-6 ">
          Talk to one of our consultants today and learn how to start leveraging
          your business.
        </p>
      </div>
      <ContactInfo />

      <div className="mt-10">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 text-center">
          Let's Talk?
        </h1>
        <p className="text-gray-500 mb-8 text-center">
          Talk to one of our consultants today and learn how to start leveraging
          your business.
        </p>
      </div>
      <ContactForm />
    </div>
  );
}
