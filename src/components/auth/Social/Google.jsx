"use client";
import { Button } from "@/components/ui/button";
import React, { useEffect } from "react";
import { FaGoogle } from "react-icons/fa";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Google() {
  const { data: session, status } = useSession();
  const router = useRouter();
  console.log(session);
  const handleGoogleSignIn = () => {
    signIn("google");
  };

  useEffect(() => {
    if (status === "authenticated") {
      const provider = session?.provider;
      if (provider === "local") {
        toast.success("Login Successful!");
        router.push(`/${session?.role}/dashboard`);
      } else if (provider === "google") {
        toast.success("Google Login Successful!");
        router.push(`/${session?.role}/dashboard`);
      }
    } else if (status === "unauthenticated") {
    }
  }, [status, session, router]);

  if (status === "loading") return <div>Loading...</div>;
  console.log(session);
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
