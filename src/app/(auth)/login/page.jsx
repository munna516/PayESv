"use client";
import Link from "next/link";
import Google from "@/components/auth/Social/Google";
import LoginForm from "./components/LoginForm";

export default function Login() {

  return (
    <div className="flex items-center justify-center min-h-screen  mt-16 py-10 px-4  sm:px-6 lg:px-8">
      <div className="border-2 p-8 space-y-8  rounded-xl shadow-xl dark:bg-slate-700">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            Login to your account
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your credentials to access your account
          </p>
        </div>

       <LoginForm />

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 text-gray-500 bg-white dark:bg-slate-700 dark:text-gray-400">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-5">
            <Google />
           
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Not have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-lg text-green-600 hover:text-green-500 dark:text-green-400"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
