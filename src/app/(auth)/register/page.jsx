"use client";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FaGoogle, FaFacebook, FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="flex items-center justify-center min-h-screen py-10 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="border-2 p-8 space-y-6 rounded-xl shadow-xl dark:bg-slate-700 w-full ">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Sign Up
          </h2>
        </div>

        {/* Social Sign Up */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <Button
            variant="outline"
            className="flex items-center justify-center"
          >
            <FaGoogle className="w-5 h-5 mr-2 text-red-600" />
            Google
          </Button>

          <Button
            variant="outline"
            className="flex items-center justify-center"
          >
            <FaFacebook className="w-5 h-5 mr-2 text-blue-600" />
            Facebook
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 text-gray-500 bg-white dark:bg-slate-700 dark:text-gray-400">
              Personal Information
            </span>
          </div>
        </div>

        <form className="space-y-6">
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
                  onClick={togglePasswordVisibility}
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
                  onClick={toggleConfirmPasswordVisibility}
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

          <Button type="submit" className="w-full" variant="primary">
            Sign Up
          </Button>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{"   "}
            <Link
              href="/login"
              className="font-semibold text-lg text-green-600 hover:text-green-500 dark:text-green-400"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
