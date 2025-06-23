"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function Transactions() {
  const transactions = [
    {
      id: 1,
      address: "123 Main St, Anytown, USA",
      message: "Hello, world!",
      status: "Active",
      createdAt: "2024-03-20",
      action: "Edit",
    },
    {
      id: 2,
      address: "456 Elm St, Anytown, USA",
      message: "Hello, world!",
      status: "Deactive",
      createdAt: "2024-03-20",
      action: "Edit",
    },
    {
      id: 3,
      address: "789 Oak St, Anytown, USA",
      message: "Hello, world!",
      status: "Deactive",
      createdAt: "2024-03-19",
      action: "Edit",
    },
  ];
  return (
    <Card className="w-full dark:bg-slate-700">
      <CardHeader className="flex flex-row items-center justify-between mb-3">
        <CardTitle className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold">
          Stored Data
        </CardTitle>
        <Dialog>
          <DialogTrigger className="text-green-500 border-2 font-bold border-green-500 hover:bg-green-500 hover:text-white px-2 py-1 rounded-md">
            Add Data
          </DialogTrigger>

          <DialogContent className="max-2[300px] sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center">
                Add Transaction Message
              </DialogTitle>
            </DialogHeader>
            <form className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="messageAddress" className="font-semibold">
                  Message Address
                </Label>
                <Select>
                  <SelectTrigger id="messageAddress">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bkash">Bkash</SelectItem>
                    <SelectItem value="nogod">Nogod</SelectItem>
                    <SelectItem value="rocket">Rocket</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="font-semibold">
                  Status
                </Label>
                <Select>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="deactive">Deactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="font-semibold">
                  Message
                </Label>
                <Textarea
                  id="message"
                  placeholder="Enter your message"
                  className="min-h-[100px]"
                />
              </div>

              <Button type="submit" variant="primary" className="w-full">
                Save
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="rounded-md">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-200 dark:bg-slate-700">
                <TableHead>#</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="">{transaction.id}</TableCell>
                  <TableCell className="">{transaction.address}</TableCell>

                  <TableCell>{transaction.createdAt}</TableCell>
                  <TableCell>{transaction.message}</TableCell>
                  <TableCell
                    className={`${
                      transaction.status == "Deactive"
                        ? "text-red-500 font-bold"
                        : "text-green-500 font-bold"
                    }`}
                  >
                    {transaction.status}
                  </TableCell>

                  <TableCell className="">{transaction.action}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
