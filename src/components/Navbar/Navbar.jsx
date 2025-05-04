"use client";

import Link from "next/link";
import { Moon } from "lucide-react";
import { Button } from "../ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

export default function Navbar() {
  const navItems = [
    { name: "HOME", href: "/" },
    { name: "ABOUT US", href: "/" },
    { name: "PRICING", href: "/" },
    {
      name: "RESOURCES",
      href: "/",
    },
  ];

  return (
    <div className="bg-white/50 backdrop-blur-lg border-b-2 px-4 py-4 fixed top-0 left-0 z-50 w-full">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-green-600"
          >
            PayESv
          </Link>
        </div>
        <div className="hidden md:flex">
          <NavigationMenu>
            <NavigationMenuList>
              {navItems.map((item) => (
                <NavigationMenuItem key={item.name}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={item.href}
                      className={navigationMenuTriggerStyle()}
                    >
                      {item.name}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="circle"
            size="icon"
            // onClick={() => setTheme("dark")}
            className="hidden md:flex"
          >
            <Moon className="h-4 w-4" />
          </Button>
          <Button variant="green" size="lg" className="hidden md:flex">
            Login
          </Button>
        </div>

        {/* Mobile Menu Button */}

        <div className="flex items-center gap-4 md:hidden">
          <Button
            variant="circle"
            size="icon"
            // onClick={() => setTheme("dark")}
            className="flex md:hidden"
          >
            <Moon className="h-4 w-4" />
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button className="md:hidden  text-green-500 bg-white border border-green-500 hover:bg-green-500 hover:text-white transition-colors duration-300 ease-in-out  p-3">
                ☰
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-60 bg-white">
              <SheetHeader>
                <SheetTitle className="text-center text-green-500 font-bold">
                  PayESV
                </SheetTitle>
              </SheetHeader>

              <ul className="space-y-4 p-4">
                <li>
                  <Link
                    href="/"
                    className="block text-green-400  hover:underline"
                  >
                    Home
                  </Link>
                </li>

                <li>
                  <Link
                    href="/"
                    className="block text-green-400 hover:underline"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/"
                    className="block text-green-400 hover:underline"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/"
                    className="block text-green-400 hover:underline"
                  >
                    Resources
                  </Link>
                </li>

                <div className="flex items-center gap-4">
                  <Link href={"/"}>
                    <Button variant="green">Login</Button>
                  </Link>
                  <Link href={"/"}>
                    <Button variant="green">Register</Button>
                  </Link>
                </div>
              </ul>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}
