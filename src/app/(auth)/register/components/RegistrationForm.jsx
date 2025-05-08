"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function RegistrationForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    setError("");
    e.preventDefault();
    const form = e.target;
    const name = form.fullName.value;
    const email = form.email.value;
    const websiteUrl = form.websiteUrl.value;
    const phone = form.phone.value;
    const streetAddress = form.streetAddress.value;
    const city = form.city.value;
    const postalCode = form.postalCode.value;
    const country = form.country.value;
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;
    if (password !== confirmPassword) {
      setError("Password and confirm password do not match");
      return;
    }
    const userData = {
      name,
      email,
      websiteUrl,
      phone,
      streetAddress,
      city,
      postalCode,
      country,
      password,
      confirmPassword,
    };
    // try {
    //   setLoading(true);
    //   const res = await fetch("/api/register", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(userData),
    //   });
    //   const data = await res.json();
    //   console.log(data);
    // } catch (error) {
    //   setError(error.message);
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name </Label>
          <Input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="John Doe"
            required
            className="  border-gray-300"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="your@email.com"
            required
            className=" border-gray-300"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="websiteUrl">Website URL</Label>
          <Input
            id="websiteUrl"
            name="websiteUrl"
            type="url"
            placeholder="https://yourwebsite.com"
            className=" border-gray-300"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <div className="flex">
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="123-456-7890"
              className=" border-gray-300"
            />
          </div>
        </div>
      </div>

      {/* Billing Address */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 text-gray-500 bg-white dark:bg-slate-700 dark:text-gray-400">
            Billing Address
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="streetAddress">Street Address</Label>
          <Input
            id="streetAddress"
            name="streetAddress"
            type="text"
            placeholder="123 Main St"
            required
            className=" border-gray-300"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            name="city"
            type="text"
            placeholder="New York"
            required
            className=" border-gray-300"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="postalCode">Postal Code</Label>
          <Input
            id="postalCode"
            name="postalCode"
            type="text"
            placeholder="10001"
            required
            className=" border-gray-300"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="postalCode">Country</Label>
          <Input
            id="country"
            name="country"
            type="text"
            placeholder="United States"
            required
            className=" border-gray-300"
          />
        </div>
      </div>

      {/* Password */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              required
              className="border-gray-300   pr-10"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-200"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <FaEyeSlash className="h-5 w-5" />
              ) : (
                <FaEye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              required
              className="border-gray-300   pr-10"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-200"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <FaEyeSlash className="h-5 w-5" />
              ) : (
                <FaEye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>
      {error && <p className="text-red-500">{error}</p>}

      <Button type="submit" className="w-full" variant="primary">
        Sign Up
      </Button>
    </form>
  );
}
