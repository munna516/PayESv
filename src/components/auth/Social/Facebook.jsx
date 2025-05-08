import { Button } from "@/components/ui/button";
import React from "react";
import { FaFacebook } from "react-icons/fa";

export default function Facebook() {
  return (
    <Button variant="outline" className="flex items-center justify-center">
      <FaFacebook className="w-5 h-5 mr-2 text-blue-600" />
      Facebook
    </Button>
  );
}
