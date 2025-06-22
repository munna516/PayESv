import React from "react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function Successful() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center  px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center max-w-md w-full">
        <CheckCircleIcon className="h-20 w-20 text-green-500 mb-4" />
        <h1 className="text-3xl font-bold text-green-700 mb-2 text-center">
          Payment Successful!
        </h1>
        <p className="text-gray-600 mb-6 text-center">
          Thank you for your payment. Your transaction has been completed
          successfully.
        </p>
        <Link href="/user/dashboard">
          <span className="inline-block bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200">
            Go to Dashboard
          </span>
        </Link>
      </div>
    </div>
  );
}
