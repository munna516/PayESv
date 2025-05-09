"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import { FaGoogle } from "react-icons/fa";
import { signIn } from "next-auth/react";
export default function Google() {
  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };
  return (
    <span onClick={handleGoogleSignIn}>
      <Button
        variant="outline"
        className="flex items-center justify-center w-full"
      >
        <FaGoogle className="w-5 h-5 mr-2 text-red-600" />
        Google
      </Button>
    </span>
  );
}
