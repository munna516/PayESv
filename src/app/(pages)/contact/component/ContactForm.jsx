"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TbFidgetSpinner } from "react-icons/tb";
import { useState } from "react";
import toast from "react-hot-toast";

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};
export default function ContactForm() {
  const [loading, setloading] = useState(false);
  const [error, setError] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const phone = form.phone.value;
    const subject = form.subject.value;
    const message = form.message.value;
    // Enhanced validation
    if (name.length < 2) {
      setError("Name must be at least 2 characters long");
      return;
    }
    if (phone.length < 7) {
      setError("Phone number must be at least 10 digits long");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (subject.length < 3) {
      setError("Subject must be at least 3 characters long");
      return;
    }

    if (message.length < 20) {
      setError("Message must be at least 20 characters long");
      return;
    }
    setloading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, subject, message }),
      });

      const data = await res.json();
      if (data?.message) {
        toast.success(`${data.message}`);
        form.reset();
      } else {
        toast.error("Failed to Send Mail");
      }
      setloading(false);
    } catch (error) {
      toast.error("Submission error:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 md:grid-cols-2 gap-4  "
    >
      <Input
        name="name"
        placeholder="Name"
        className="bg-green-50 dark:bg-slate-700 "
      />
      <Input
        name="email"
        type="email"
        placeholder="Email"
        className="bg-green-50 dark:bg-slate-700 "
      />
      <Input
        name="phone"
        placeholder="Phone"
        className="bg-green-50  dark:bg-slate-700"
      />
      <Input
        name="subject"
        placeholder="Subject"
        className="bg-green-50 dark:bg-slate-700"
      />
      <div className="col-span-1 md:col-span-2">
        <Textarea
          name="message"
          placeholder="Message"
          className="bg-green-50 dark:bg-slate-700 min-h-[150px]"
        />
      </div>
      {error && <p className="text-red-500 text-sm col-span-2">{error}</p>}
      <div className="col-span-1 md:col-span-2 text-center">
        <Button type="submit" variant="primary">
          {loading ? (
            <TbFidgetSpinner className="animate-spin m-auto" />
          ) : (
            "Send Message"
          )}
        </Button>
      </div>
    </form>
  );
}
