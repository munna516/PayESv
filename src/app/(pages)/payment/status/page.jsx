"use client";

import { useSearchParams } from "next/navigation";
import React from "react";
import Successful from "../Successful/Successful";
import Cancle from "../Cancle/Cancle";

export default function Status() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  return (
    <div>
      {status === "success" && <Successful />}
      {status === "cancel" && <Cancle />}
    </div>
  );
}
