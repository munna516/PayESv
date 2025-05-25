"use client";

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  Ticket,
  LayoutDashboard,
  CreditCard,
  Banknote,
  FileText,
  Building,
  Smartphone,
  Wallet,
  Users,
  Gift,
  Home,
  Menu,
  UserRound,
  Code,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import toast from "react-hot-toast";
import { FaQuestion, FaTag } from "react-icons/fa";
import dummyProfile from "../../../../../../public/assets/images/dummyProfile.png";
import Image from "next/image";

const navMain = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
  { label: "Transactions", icon: CreditCard, href: "/admin/transactions" },

  {
    label: "Users",
    icon: Users,
    href: "/admin/users",
  },
  {
    label: "User Plans",
    icon: Gift,
    href: "/admin/user-plans",
  },
  {
    label: "Staff",
    icon: UserRound,
    href: "/admin/staff",
  },
  { label: "Brand", icon: Building, href: "/admin/brand" },
  { label: "Device", icon: Smartphone, href: "/admin/device" },
  {
    label: "Blogs",
    icon: FileText,
    href: "/admin/blogs",
  },
  {
    label: "FAQ",
    icon: FaQuestion,
    href: "/admin/faq",
  },
  {
    label: "Plans",
    icon: Gift,
    href: "/admin/plans",
  },
  {
    label: "Coupons",
    icon: FaTag,
    href: "/admin/coupons",
  },
];

const navOthers = [
  {
    label: "Payment Methods",
    icon: CreditCard,
    href: "/admin/payment-methods",
  },
  {
    label: "Tickets",
    icon: Ticket,
    href: "/admin/tickets",
  },
  {
    label: "Developer Tools",
    icon: Code,
    href: "/resources",
  },
  {
    label: "Home",
    icon: Home,
    href: "/",
  },
];

export default function AdminSidebar({
  isSidebarOpen,
  mobileSidebar,
  setMobileSidebar,
}) {
  const { data: session } = useSession();
  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
    toast.success("Signed out successfully");
  };
  
  const SidebarContent = (
    <div className="flex flex-col ">
      {/* Logo */}
      <div className="flex justify-center  items-center mt-5 mb-3">
        <span className="text-xl font-extrabold tracking-wide text-green-600 dark:text-green-500 lg:flex hidden">
          PAY ESV
        </span>
      </div>
      {/* Profile */}
      <div className="flex flex-col items-center py-4">
        <Image
          src={session?.user?.image || dummyProfile}
          alt="Profile"
          width={100}
          height={100}
          className="h-12 w-12 lg:w-14 lg:h-14 rounded-full border-4 border-green-100 shadow mb-2"
        />
        {(isSidebarOpen || mobileSidebar) && (
          <div className="font-semibold">{session?.user?.name}</div>
        )}
        <div className="text-sm text-green-500 mt-2 font-bold uppercase ">
          {session?.role}
        </div>
      </div>
      {/* Main Navigation */}
      <div className="px-6 mt-4">
        <div className="text-xs text-gray-400 font-semibold mb-3">MAIN</div>
        <nav className="flex flex-col gap-1">
          {navMain.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 dark:text-white hover:bg-green-100 hover:text-green-700   dark:hover:text-black transition"
            >
              <item.icon className="w-5 h-5 lg:w-7 lg:h-7 font-semibold " />
              {(isSidebarOpen || mobileSidebar) && (
                <span className="text-sm lg:text-base font-semibold">
                  {item.label}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </div>
      {/* Others Navigation */}
      <div className="px-6 mt-6">
        <div className="text-xs text-gray-400 font-semibold mb-3 ">OTHERS</div>
        <nav className="flex flex-col gap-1 mb-10">
          {navOthers.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 dark:text-white hover:bg-green-100 hover:text-green-700   dark:hover:text-black transition"
            >
              <item.icon className="w-5 h-5 lg:w-7 lg:h-7 font-semibold" />
              {(isSidebarOpen || mobileSidebar) && (
                <span className="text-sm lg:text-base font-semibold">
                  {item.label}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`hidden md:flex  justify-center  w-full`}>
        {SidebarContent}
      </div>

      {/* Mobile Sidebar */}
      <div className="flex md:hidden ">
        <Sheet open={mobileSidebar} onOpenChange={setMobileSidebar}>
          <SheetTrigger asChild>
            <button className="p-2 m-2 rounded-md border border-gray-200 bg-green-500 shadow">
              <Menu />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <VisuallyHidden>
              <SheetTitle>Pay ESV</SheetTitle>
            </VisuallyHidden>
            <div className="h-full overflow-y-auto hide-scrollbar">
              {SidebarContent}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
