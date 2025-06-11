import React from "react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="relative">
        {/* Outer spinning circle */}
        <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>

        {/* Inner pulsing circle */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-8 h-8 bg-green-500 rounded-full animate-pulse"></div>
        </div>

        {/* Loading text */}
        <div className="mt-4 text-center">
          <p className="text-green-500 font-bold text-xl animate-pulse">
            Loading...
          </p>
        </div>
      </div>
    </div>
  );
}
