import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import Link from "next/link";

export default function PlanTable({ data, renew, handleRenew }) {
  if (!data) {
    return (
      <Card className="dark:bg-slate-700">
        <CardHeader>
          <CardTitle className="text-xl font-bold ">
            Your Current Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 text-center text-red-500">
            No plan data found.
          </div>
        </CardContent>
      </Card>
    );
  }
  const { plan, status, created_at, expires_at, websitequantity } = data;
  return (
    <Card className="dark:bg-slate-700 ">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className="text-xl font-bold ">
            Your Current Plan
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border dark:border-slate-600">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Plan Type</TableHead>

                <TableHead>Website Quantity</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Expire At</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>1</TableCell>
                <TableCell className="font-medium">
                  {plan === "1"
                    ? "Personal Account Automation"
                    : "Ready Account Automation"}
                </TableCell>
                <TableCell>{websitequantity}</TableCell>
                <TableCell>
                  {format(new Date(created_at), "dd-MM-yyyy")}
                </TableCell>
                <TableCell>
                  {format(new Date(expires_at), "dd-MM-yyyy")}
                </TableCell>
                <TableCell className="flex items-center gap-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {status}
                  </span>
                  {new Date(expires_at) - new Date() <=
                    7 * 24 * 60 * 60 * 1000 &&
                    new Date(expires_at) > new Date() && (
                      <button
                        onClick={() => handleRenew()}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Renew
                      </button>
                    )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
