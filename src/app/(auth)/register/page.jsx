import Link from "next/link";
import Google from "@/components/auth/Social/Google";
import Facebook from "@/components/auth/Social/Facebook";
import RegistrationForm from "./components/RegistrationForm";

export default function Register() {
  return (
    <div className="flex items-center justify-center min-h-screen  py-10 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="border-2 p-8 space-y-6 rounded-xl shadow-xl dark:bg-slate-700 w-full ">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Sign Up
          </h2>
        </div>

        {/* Social Sign Up */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <Google />

          <Facebook />
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 text-gray-500 bg-white dark:bg-slate-700 dark:text-gray-400">
              Personal Information
            </span>
          </div>
        </div>

        <RegistrationForm />

        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{"   "}
            <Link
              href="/login"
              className="font-semibold text-lg text-green-600 hover:text-green-500 dark:text-green-400"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
