"use client";

import { usePathname } from "next/navigation";

export default function Main({ children }) {
  const pathname = usePathname();
  return (
    <div
      className={`${
        pathname.includes("/admin") || pathname.includes("/user")
          ? ""
          : "flex-grow max-w-[1400px] mx-auto"
      }`}
    >
      {children}
    </div>
  );
}
