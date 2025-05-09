"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      const provider = session?.provider;
      toast.success(
        `${
          provider?.charAt(0).toUpperCase() + provider?.slice(1) || ""
        } Login Successful!`
      );
      
    }
  }, [status, session]);

  if (status === "loading") return <div>Loading...</div>;

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  return (
    <div className="mt-28">
      <h1>Dashboard</h1>
      <p>Welcome, {session?.user?.name}</p>
      <p>Role: {session?.role || "Not assigned"}</p>
    </div>
  );
}
