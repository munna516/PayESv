"use client";

import { useSearchParams } from "next/navigation";
import React from "react";
import Successful from "../Successful/Successful";
import Failure from "../Failure/Failure";
import Cancle from "../Cancle/Cancle";

export default function Status() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  return (
    <div>
      {status === "success" && <Successful />}
      {status === "failure" && <Failure />}
      {status === "cancel" && <Cancle />}
    </div>
  );
}
