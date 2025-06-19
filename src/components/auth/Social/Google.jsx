"use client";
import { Button } from "@/components/ui/button";
import React, { useEffect } from "react";
import { FaGoogle } from "react-icons/fa";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import Loading from "@/components/Loading/Loading";

export default function Google() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin/dashboard";

  console.log(callbackUrl);

  const handleGoogleSignIn = () => {
    signIn("google");
  };

  useEffect(() => {
    if (status === "authenticated") {
      toast.success("Login Successful!");
      router.push(callbackUrl);
    }
  }, [status, session, router, callbackUrl]);

  if (status === "loading") return <Loading />;

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
