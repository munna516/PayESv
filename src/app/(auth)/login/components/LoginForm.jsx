import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <form className="mt-8 space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="block text-sm font-medium">
            Email address
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="your@email.com"
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="block text-sm font-medium">
              Password
            </Label>
            <div className="text-sm">
              <Link
                href="/forgot-password"
                className="font-medium text-green-600 hover:text-green-500 dark:text-green-400"
              >
                Forgot your password?
              </Link>
            </div>
          </div>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              placeholder="your password"
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 pr-10"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-200"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <FaEyeSlash className="h-5 w-5" />
              ) : (
                <FaEye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div>
        <Button type="submit" className="w-full" variant="primary">
          Sign in
        </Button>
      </div>
    </form>
  );
}
