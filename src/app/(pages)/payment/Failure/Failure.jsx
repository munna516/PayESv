import React from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function Failure() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center  px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center max-w-md w-full">
        <ExclamationTriangleIcon className="h-20 w-20 text-red-400 mb-4" />
        <h1 className="text-3xl font-bold text-red-700 mb-2 text-center">
          Payment Failed
        </h1>
        <p className="text-gray-600 mb-6 text-center">
          Unfortunately, your transaction could not be completed. Please try
          again or contact support if the issue persists.
        </p>
        <Link href="/user/dashboard">
          <span className="inline-block bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200">
            Go to Home
          </span>
        </Link>
      </div>
    </div>
  );
}
