"use client";

import { useParams } from "next/navigation";

export default function TicketDetails() {
  const { id } = useParams();
  return <div>TicketDetails {id}</div>;
}
