"use client";
import dummyProfile from "../../../../../../public/assets/images/dummyProfile.png";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  UserCircle,
  Ticket,
  LogOut,
  LayoutDashboard,
  CreditCard,
  Banknote,
  FileText,
  PlusSquare,
  Database,
  Building,
  Smartphone,
  Wallet,
  Users,
  Gift,
  Package,
  Home,
  Menu,
  ArrowUpRight,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";

const navMain = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/user/dashboard" },
  { label: "Transactions", icon: CreditCard, href: "/user/transactions" },
  { label: "Withdraw", icon: ArrowUpRight, href: "/user/withdraw", plan: 1 },
  {
    label: "Bank Transactions",
    icon: Banknote,
    href: "/user/bank-transactions",
  },
  { label: "Invoices", icon: FileText, href: "/user/invoice" },
  { label: "Add Invoice", icon: PlusSquare, href: "/user/add-invoice" },
  { label: "Stored Data", icon: Database, href: "/user/stored-data" },
  { label: "Brand", icon: Building, href: "/user/brand" },
  { label: "Device", icon: Smartphone, href: "/user/device" },
  { label: "Wallet", icon: Wallet, href: "/user/wallet" },
];

const navOthers = [
  { label: "Affiliates", icon: Users, href: "/user/affiliates" },
  { label: "Plans", icon: Gift, href: "/user/plans" },
  { label: "Android App", icon: Smartphone, href: "/user/android-app" },
  { label: "Developer Tools", icon: Package, href: "/resources" },
  { label: "Home", icon: Home, href: "/" },
];

export default function Sidebar({
  isSidebarOpen,
  mobileSidebar,
  setMobileSidebar,
}) {
  const { data: session } = useSession();

  
  const pathname = usePathname();

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
    toast.success("Signed out successfully");
  };

  const isActive = (href) => {
    return pathname === href;
  };

  const SidebarContent = (
    <div className="flex flex-col ">
      {/* Logo */}
      <div className="flex justify-center  items-center mt-5 mb-3">
        {/* <img src="/logo.png" alt="PayESV Logo" className="h-12 w-12 mb-2" /> */}
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
        {(isSidebarOpen || mobileSidebar) && (
          <div className="flex items-center justify-between  mt-5 w-[70%]">
            <Link href="/user/profile">
              <UserCircle className="w-5 h-5 text-green-600 cursor-pointer" />
            </Link>
            <Link href="/user/tickets">
              <Ticket className="w-5 h-5 text-purple-500 hover:text-green-700 cursor-pointer" />
            </Link>
            <LogOut
              onClick={() => handleSignOut()}
              className="w-5 h-5 text-red-500 hover:text-red-700 cursor-pointer"
            />
          </div>
        )}
      </div>
      {/* Main Navigation */}
      <div className="px-6 mt-4">
        <div className="text-xs text-gray-400 font-semibold mb-3">MAIN</div>
        <nav className="flex flex-col gap-1">
          {navMain.map((item) => {
            // Only show Withdraw if session?.plan === "2"
            if (item.label === "Withdraw" && session?.plan !== "2") {
              return null;
            }
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition ${
                  isActive(item.href)
                    ? " text-green-600 bg-green-100 dark:bg-white dark:text-green-600"
                    : "text-gray-700 dark:text-white  hover:text-green-500 dark:hover:text-green-500"
                }`}
              >
                <item.icon
                  className={`w-5 h-5 lg:w-7 lg:h-7 font-semibold ${
                    isActive(item.href) ? "" : ""
                  }`}
                />
                {(isSidebarOpen || mobileSidebar) && (
                  <span className="text-sm lg:text-base font-semibold">
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
          
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
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition ${
                isActive(item.href)
                  ? "text-green-600 bg-green-100 dark:bg-white dark:text-green-600"
                  : "text-gray-700 dark:text-white  hover:text-green-500 dark:hover:text-green-500"
              }`}
            >
              <item.icon
                className={`w-5 h-5 lg:w-7 lg:h-7 font-semibold ${
                  isActive(item.href)
                    ? "text-green-600 dark:text-green-500"
                    : ""
                }`}
              />
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
