"use client";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import toast from "react-hot-toast";

export default function Dashboard() {
  const { data: session } = useSession();
  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
    toast.success("Signed out successfully");
  };
  return (
    <div className="mt-28">
      <h1>Dashboard</h1>
      <p>Name is {session?.user?.name}</p>
      <p>Role is {session?.role}</p>
      <Button
        className="mt-10"
        variant="primary"
        onClick={() => handleSignOut()}
      >
        Sign Out
      </Button>
    </div>
  );
}
