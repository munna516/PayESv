"use client";

import { useSearchParams } from "next/navigation";
import React from "react";

export default function Status() {
  // const searchParams = useSearchParams();
  // const paymentID = searchParams.get("paymentID");

  // const paymentStatus = async () => {
  //   const response = await fetch(
  //     `https://tokenized.sandbox.bka.sh/v1.2.0-beta/tokenized/checkout/execute/${paymentID}`,
  //     {
  //       method: "POST",
  //       headers: {
  //         authorization: `${id}`,
  //         "x-app-key": BKASH_APP_KEY,
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         paymentID: paymentID,
  //       }),
  //     }
  //   );
  //   const data = await response.json();
  //   console.log("This is data", data);
  // };
  // paymentStatus();

  return <div>Status</div>;
}
