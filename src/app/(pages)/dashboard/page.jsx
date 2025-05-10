"use client";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";

export default function Dashboard() {
  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
    toast.success("Signed out successfully");
  };
  return (
    <div className="mt-28">
      <h1>Dashboard</h1>
      <Button variant="primary" onClick={() => handleSignOut()}>Sign Out</Button>
    </div>
  );
}
