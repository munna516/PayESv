import { Button } from "@/components/ui/button";
import React from "react";
import { FaGoogle } from "react-icons/fa";

export default function Google() {
  return (
    <Button variant="outline" className="flex items-center justify-center">
      <FaGoogle className="w-5 h-5 mr-2 text-red-600" />
      Google
    </Button>
  );
}
