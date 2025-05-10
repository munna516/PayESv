"use client";
import { usePathname } from "next/navigation";

const Footer = () => {
  const pathname = usePathname();
  return pathname.includes("/user") || pathname.includes("/admin") ? (
    ""
  ) : (
    <footer className="bg-green-500 dark:bg-gray-800 text-white py-12 px-4 sm:px-6 mt-10">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="md:col-span-1 lg:col-span-1">
            <h2 className="text-2xl font-bold mb-4">PayESV</h2>
            <p className="text-white text-base">
              PayESv is a reliable and secure online payment gateway that
              simplifies digital transactions for businesses and individuals. We
              provide easy integration, fast settlements, developer-friendly
              APIs and 24/7 support to help you accept payments effortlessly and
              grow your business.
            </p>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Products</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-white  text-base">
                  Payment Gateway
                </a>
              </li>
              <li>
                <a href="#" className="text-white  text-base">
                  Invoice via App
                </a>
              </li>
              <li>
                <a href="#" className="text-white  text-base">
                  PayESv App
                </a>
              </li>
              <li>
                <a href="#" className="text-white  text-base">
                  Social Commerce
                </a>
              </li>
              <li>
                <a href="#" className="text-white  text-base">
                  Payment Links
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-white  text-base">
                  News
                </a>
              </li>
              <li>
                <a href="#" className="text-white  text-base">
                  Help & Support
                </a>
              </li>
              <li>
                <a href="#" className="text-white  text-base">
                  Developer
                </a>
              </li>
              <li>
                <a href="#" className="text-white  text-base">
                  Integration
                </a>
              </li>
              <li>
                <a href="#" className="text-white  text-base">
                  Documentations
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-white  text-base">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-white  text-base">
                  Legal Status
                </a>
              </li>
              <li>
                <a href="#" className="text-white  text-base">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-white  text-base">
                  Terms and Conditions
                </a>
              </li>
              <li>
                <a href="#" className="text-white  text-base">
                  Return and Retired Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white mt-12 pt-8 text-center text-white text-base">
          <p>
            Copyright © 2015 - {new Date().getFullYear()} | All Rights Reserved,
            PayESv
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
