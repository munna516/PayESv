"use client";

import { usePathname } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();

export default function Main({ children }) {
  const pathname = usePathname();

  return (
    <QueryClientProvider client={queryClient}>
      <div
        className={`${
          pathname.includes("/admin") || pathname.includes("/user")
            ? ""
            : "flex-grow max-w-[1400px] mx-auto"
        }`}
      >
        {children}
      </div>
    </QueryClientProvider>
  );
}
