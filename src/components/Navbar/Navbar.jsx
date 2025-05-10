"use client";

import Link from "next/link";
import { Moon, Sun } from "lucide-react";
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
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

// Then use <ThemeToggle /> instead of your current implementation
export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const navItems = [
    { name: "HOME", href: "/#home" },
    { name: "ABOUT US", href: "/#about" },
    {
      name: "FEATURES",
      href: "/#features",
    },

    { name: "PRICING", href: "/#pricing" },
    {
      name: "CONTACT",
      href: "/contact",
    },
    {
      name: "RESOURCES",
      href: "#",
    },
  ];

  return pathname.includes("/user") || pathname.includes("/admin") ? (
    ""
  ) : (
    <div className="bg-white/50  dark:bg-gray-800 dark:text-white backdrop-blur-lg  border-b-2 dark:border-b-0 px-4 py-4 fixed top-0 left-0 z-50 w-full scroll-mt-24">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-green-600 dark:text-green-400"
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
          {mounted && (
            <Button
              variant="primary"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="hidden md:flex"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          )}

          {session ? (
            <Link href={`/${session?.role}/dashboard`}>
              <Button variant="primary" className="hidden md:flex">
                Dashboard
              </Button>
            </Link>
          ) : (
            <Link href={"/login"}>
              <Button variant="primary" size="lg" className="hidden md:flex">
                Login
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}

        <div className="flex items-center gap-4 md:hidden">
          {mounted && (
            <Button
              variant="primary"
              size="icon"
              className="flex md:hidden"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          )}

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="primary">☰</Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-60 bg-white dark:bg-gray-800"
            >
              <SheetHeader>
                <SheetTitle className="text-center text-green-500 font-bold">
                  PayESV
                </SheetTitle>
              </SheetHeader>

              <ul className="space-y-4 p-4">
                <li>
                  <Link
                    href="/#home"
                    className="block text-green-400  hover:underline"
                  >
                    Home
                  </Link>
                </li>

                <li>
                  <Link
                    href="/#about"
                    className="block text-green-400 hover:underline"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#features"
                    className="block text-green-400 hover:underline"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#pricing"
                    className="block text-green-400 hover:underline"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="block text-green-400 hover:underline"
                  >
                    Contact
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
                  {session ? (
                    <Link href={`/${session?.role}/dashboard`}>
                      <Button variant="primary">Dashboard</Button>
                    </Link>
                  ) : (
                    <>
                      <Link href={"/login"}>
                        <Button variant="primary">Login</Button>
                      </Link>
                      <Link href={"/register"}>
                        <Button variant="primary">Register</Button>
                      </Link>
                    </>
                  )}
                </div>
              </ul>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}
